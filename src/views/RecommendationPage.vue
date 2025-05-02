<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import api from '@/utils/api';
import AlertBox from '@/components/AlertBox.vue';
import L from 'leaflet';
import { criteriaPairs, ahpScale, ahpStats } from '@/constants/ahp';

const criteriaWeights= ref<number[]>(Array(criteriaPairs.length).fill(1));
const userLat= ref<number | null>(null);
const userLong= ref<number | null>(null);
const map= ref()
const mapContainer= ref()
const buttonRef= ref<HTMLElement | null>(null);
const locationError= ref(false);
const formError= ref(false);
const crError= ref(false);

const manualMarker= ref<L.Marker | null>(null);
const manualSelectedLatLng= ref<{lat:number, lng:number} | null>(null);

const isLoading= ref(false);
const resultData= ref<Array<{namaUniversitas: string, skor: number}>>([]);

onMounted(() => {
  getLocation();

  map.value= L.map(mapContainer.value).setView([51.505, -0.09], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map.value);
  
  map.value.on('click', (e:L.LeafletMouseEvent) => {
    const {lat, lng} = e.latlng;
    manualSelectedLatLng.value= {lat, lng};

    if (manualMarker.value) {
      map.value.removeLayer(manualMarker.value);
    }

    // nextTick(() => {
    //   if (buttonRef.value) {
    //     buttonRef.value.scrollIntoView({behavior: 'smooth'});
    //   }
    // })

    console.log('buttonRef', buttonRef.value);

    const marker= L.marker([lat, lng], {
      draggable: true,
    }).addTo(map.value);

    marker.on('dragend', () => {
      const pos= marker.getLatLng();
      manualSelectedLatLng.value= {lat:pos.lat, lng:pos.lng};
    });

    manualMarker.value= marker;
  })
})

const getLocation= () => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat.value= pos.coords.latitude;
      userLong.value= pos.coords.longitude;
    },
    (err) => {
      locationError.value= true;
      console.warn('Error getting location:', err);
    },
  )
};

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

  isLoading.value= true;
  resultData.value= [];

  try {
    const ahpRank= await api.post('/ahp/rank', payload);
    const university= await api.get('/datamaster/universitas');
    
    const criteriaRank= ahpRank.data.result.criteriaRankMetaMap
    ahpStats.value= {
      consistencyRatio: criteriaRank.cr,
    }

    if(ahpStats && ahpStats.value.consistencyRatio > 0.1) {
      crError.value= true;
    }
    const rankedMap= ahpRank.data.result.rankedScoreMap;
    resultData.value= Object.entries(rankedMap).map(([namaUniversitas, skor]) => ({
      namaUniversitas,
      skor: typeof skor === 'number' ? skor : parseFloat(String(skor)) || 0,
    })).sort((a,b) => b.skor - a.skor);
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
    
    <div ref="mapContainer" class="mt-6 h-96 w-96 bg-gray-200 rounded"></div>

    <div v-if="manualSelectedLatLng" class="mt-4">
      <p class="mb-2">Lokasi manual: {{ manualSelectedLatLng.lat.toFixed(6) }}, {{ manualSelectedLatLng.lng.toFixed(6) }}</p>
      <button ref="buttonRef" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" @click="setManualLocation">
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
      :text="`Perbandingan kriteria Anda kurang konsisten (CR: ${ ahpStats!.consistencyRatio.toFixed(4) }). Silakan periksa lagi nilai preferensinya.`"
      type="error"
      closable
    />

    <div v-if="resultData.length > 0" class="mt-10">
      <h2 class="text-xl font-bold mb-4">Hasil Rekomendasi Universitas:</h2>
      <ul class="space-y-3">
        <li v-for="(item, index) in resultData" :key="item.namaUniversitas" class="p-4 bg-white rounded shadow border-l-4 border-blue-500">
          <div class="flex justify-between">
            <span class="font-semibold">{{ index+1 }}. {{ item.namaUniversitas }}</span>
            <span class="text-gray-600">Skor: {{ item.skor.toFixed(4) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>