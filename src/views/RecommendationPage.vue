<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import api from '@/utils/api';
import AlertBox from '@/components/AlertBox.vue';
import L from 'leaflet';
import { criteriaPairs, ahpScale, ahpStats } from '@/constants/ahp';
import '@/assets/animations.css';

const criteriaWeights= ref<number[]>(Array(criteriaPairs.length).fill(1));
const userLat= ref<number | null>(null);
const userLong= ref<number | null>(null);
const map= ref()
const mapContainer= ref()
const buttonRef= ref<HTMLElement | null>(null);
const locationError= ref(false);
const formError= ref(false);
const crError= ref(false);
const expandedIndex= ref(null);
    // nextTick(() => {
    //   if (buttonRef.value) {
    //     buttonRef.value.scrollIntoView({behavior: 'smooth'});
    //   }
    // })
const manualMarker= ref<L.Marker | null>(null);
const manualSelectedLatLng= ref<{lat:number, lng:number} | null>(null);

const isLoading= ref(false);
const resultData= ref<Array<{namaUniversitas: string, skor: number, detail:any}>>([]);

onMounted(() => {
  getLocationAndInitMap();
});

const getLocationAndInitMap = () => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat.value = pos.coords.latitude;
      userLong.value = pos.coords.longitude;

      console.log('userLat', userLat.value);
      console.log('userLong', userLong.value);

      initMap();
    },
    (err) => {
      locationError.value = true;
      console.warn('Error getting location:', err);

      userLat.value = 51.505;
      userLong.value = -0.09;

      initMap();
    },
  );
};

const initMap = () => {
  map.value = L.map(mapContainer.value).setView([userLat.value!, userLong.value!], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    zIndex: 1,
  }).addTo(map.value);

  map.value.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    manualSelectedLatLng.value = { lat, lng };

    if (manualMarker.value) {
      map.value.removeLayer(manualMarker.value);
    }

    const marker = L.marker([lat, lng], {
      draggable: true,
    }).addTo(map.value);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      manualSelectedLatLng.value = { lat: pos.lat, lng: pos.lng };
    });

    manualMarker.value = marker;
  });
};

function toggleExpanded(index:any) {
  expandedIndex.value = expandedIndex.value === index ? null : index
}

const setManualLocation= () => {
  if (manualSelectedLatLng.value) {
    userLat.value = manualSelectedLatLng.value.lat;
    userLong.value = manualSelectedLatLng.value.lng;
    alert('Lokasi berhasil disimpan!');
  } else {
    alert('Silakan pilih lokasi manual terlebih dahulu!');
  }
}

const canSubmit = computed(() => {
  const lat = userLat.value 
  const long = userLong.value
  return !isNaN(lat!) && !isNaN(long!);
});

const submitAHP = async() => {
  
  const formattedWeights= criteriaPairs.map(([a, b], i) => [a, b, criteriaWeights.value[i]]);
  const payload= {
    criteriaWeights: formattedWeights,
    userLat: userLat.value,
    userLong: userLong.value,
  };

  console.log('Payload:', payload);

  isLoading.value= true;
  resultData.value= [];

  try {
    const [ahpRank, university] = await Promise.all([
      api.post('/ahp/rank', payload),
      api.get('/datamaster/universitas')
    ]);
    
    const criteriaRank= ahpRank.data.result.criteriaRankMetaMap
    ahpStats.value= {
      consistencyRatio: criteriaRank.cr,
    }

    if(ahpStats.value.consistencyRatio > 0.1) {
      crError.value= true;
    }

    const rankedMap= ahpRank.data.result.rankedScoreMap;
    const allUniv= university.data.data

    resultData.value= Object.entries(rankedMap).map(([namaUniversitas, skor]) => {
      const detailRaw= allUniv.find((u: any) => u.name === namaUniversitas);
      const { latitude, longitude, ...detail } = detailRaw || {};

      return {
        namaUniversitas,
        skor: typeof skor === 'number' ? skor : parseFloat(String(skor)) || 0,
        detail,
      };
    }).sort((a, b) => b.skor - a.skor);

  } catch(err) {
    console.error('Error submitting AHP:', err);
    formError.value= true;

  } finally {
    isLoading.value= false;
  }
}
</script>


<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Masukkan preferensi AHP</h1>

    <AlertBox 
      v-model:show="locationError"
      text="Lokasi tidak ditemukan. Silakan masukkan lokasi secara manual."
      type="error"
      closable
    />

    <AlertBox
      v-model:show="formError"
      text="Terjadi Error pada Sistem. Silakan coba lagi."
      type="error"
      closable
    />

    <h2 class="text-lg font-semibold mb-4">Pilih Lokasi Manual:</h2>
    <div ref="mapContainer" class="mt-6 mb-2 h-96 w-96 bg-gray-200 rounded"></div>

    <div v-if="manualSelectedLatLng" class="mt-4">
      <p class="mb-2">Lokasi manual: {{ manualSelectedLatLng.lat.toFixed(6) }}, {{ manualSelectedLatLng.lng.toFixed(6) }}</p>
      <button ref="buttonRef" class="mb-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" @click="setManualLocation">
        Set Lokasi Manual ini
      </button>
    </div>

    <div
      v-for="(pair, index) in criteriaPairs"
      :key="index"
      class="mb-4"
    >
      <label class="block font-semibold mb-2">
         Seberapa penting <span class="text-blue-600">{{ pair[0] }}</span> dibanding <span class="text-green-600">{{  pair[1] }}</span>?
      </label>
      <select
        v-model.number="criteriaWeights[index]"
        class="border border-gray-300 p-2 rounded w-full"
      >
        <option v-for="option in ahpScale" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    <button
      @click="submitAHP"
      :disabled="!canSubmit"
      class="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Kirim Data AHP
    </button>

    <div v-if="isLoading" class="mt-4 text-center text-blue-600 font-semibold">
      Menghitung hasil, mohon tunggu...
    </div>

    <AlertBox
      v-model:show="crError"
      :text="`Perbandingan kriteria Anda kurang konsisten (CR: ${ ahpStats?.consistencyRatio.toFixed(4) }). Silakan periksa lagi nilai preferensinya.`"
      type="error"
      closable
    />

    <div v-if="resultData.length > 0" class="mt-10">
      <h2 class="text-xl font-bold mb-4">Hasil Rekomendasi Universitas:</h2>
      <ul class="space-y-3">
        <li 
        v-for="(item, index) in resultData" 
        :key="item.namaUniversitas" 
        class="p-4 bg-white rounded shadow border-l-4 border-blue-500 cursor-pointer" @click="toggleExpanded(index)">
          <div class="flex justify-between items-center">
            <span class="font-semibold">{{ index+1 }}. {{ item.namaUniversitas }}</span>
            <span class="text-gray-600">Skor: {{ item.skor.toFixed(4) }}</span>
          </div>
          <transition name="expand">
            <div v-if="expandedIndex === index" class="mt-3 text-sm text-gray-700 space-y-1">
              <div><strong>Akreditasi:</strong> {{ item.detail.accreditation }}</div>
              <div><strong>Biaya Kuliah:</strong> {{ item.detail.tuition_fee }}</div>
              <div><strong>Persentase Lulus:</strong> {{ item.detail.pass_percentage }}</div>
              <div><strong>Jumlah Prodi:</strong> {{ item.detail.major_count }}</div>
              <button
              @click.stop=""
              class="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mt-2">
              <span>Bookmark</span>
            </button>
            </div>
          </transition>
        </li>
      </ul>
    </div>
  </div>
</template>
