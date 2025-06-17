<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import api from '@/utils/api';
import AlertBox from '@/components/AlertBox.vue';
import L from 'leaflet';
import { criteria, ahpStats, type Criterion, criteriaPairs} from '@/constants/ahp';
import '@/assets/animations.css';
import draggable from 'vuedraggable';



const ranked= ref<Criterion[]>([...criteria]);

const criteriaResult= ref<[string, string, number][]>([]);

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
const showAllResults = ref(false);
const displayedResults = computed(() => {
  return showAllResults.value ? resultData.value : resultData.value.slice(0, 10);
});



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
  
  showAllResults.value = false;
  const priorityValues= ranked.value.map((c) => c.value)
  criteriaResult.value= generatePairwiseAHPFromRankedList(priorityValues);

  const formattedWeights= criteriaPairs.map(([a, b], i) => [a, b, criteriaWeights.value[i]]);  

  const payload= {
    criteriaWeights: criteriaResult.value,
    userLat: userLat.value,
    userLong: userLong.value,
  };

  console.log('Payload:', payload);

  isLoading.value= true;
  resultData.value= [];

  console.log("Ranked by user:", ranked.value.map(r => r.label));
  console.log("Slider Weights:", criteriaWeights.value);
  console.log("Kriteria dikirim ke backend:", JSON.stringify(criteriaResult.value, null, 2));


  try {
    const [ahpRank, university] = await Promise.all([
      api.post('/ahp/rank', payload),
      api.get('/datamaster/universitas')
    ]);
    console.log("Hasil dari Backend:", ahpRank.data.result.rankedScoreMap);

    const criteriaRank = ahpRank.data.result.criteriaRankMetaMap;
    ahpStats.value= {
      consistencyRatio: criteriaRank.cr,
    }

    if(ahpStats.value.consistencyRatio > 0.1) {
      crError.value= true;
    } else {
      crError.value= false;
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

    formError.value= false;

  } catch(err) {
    console.error('Error submitting AHP:', err);
    formError.value= true;

  } finally {
    isLoading.value= false;
  }
}

function generatePairwiseAHPFromRankedList(ranked: string[]): [string, string, number][] {
  const n= ranked.length;
  const result: [string, string, number][] = [];

  for (let i=0; i < n; i++) {
    for (let j=i + 1; j < n; j++) {
      const a= ranked[i]
      const b= ranked[j];
      const diff= j-i
      const weight= Math.min(9, diff * 2 + 1)
      result.push([a, b, weight]);
    }
  }
  console.log('Pairwise AHP:', result);
  return result;
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
      <!-- <p class="mb-2">Lokasi manual: {{ manualSelectedLatLng.lat.toFixed(6) }}, {{ manualSelectedLatLng.lng.toFixed(6) }}</p> -->
      <button ref="buttonRef" class="mb-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" @click="setManualLocation">
        Set Lokasi Manual ini
      </button>
    </div>

    <!-- desain baru-->
    <div class="max-w-xl py-4">
      <h2 class="text-lg font-semibold mb-8">Geser dan urutkan dari atas (paling penting) ke bawah (kurang penting).<br />
        <strong>Contoh:</strong> Akreditasi, Biaya, Jarak, dst.</h2>

        <div class="relative py-4">
          <div class="absolute -top-5 left-1/2 -translate-x-1/2 text-sm text-green-600 flex items-center gap-1">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 5l5 5H5l5-5z" />
            </svg>
            <span>Paling Penting</span>
          </div>
            <draggable
        v-model="ranked"
        item-key="id"
        class="space-y-2"
        ghost-class="ghost"
        chosen-class="chosen"
        drag-class="drag"
        animation="200"
      >
        <template #item="{ element }">
        <div
          class="bg-white shadow-md rounded-lg px-4 py-3 mb-2 flex items-center justify-between hover:scale-[1.01] cursor-move border border-gray-200"
        >
          <span class="font-medium text-gray-800">
            {{ element.label }}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 8h16M4 16h16" />
          </svg>
        </div>
      </template>
      </draggable>

      <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-sm text-red-600 flex items-center gap-1">
        <span>Paling Kurang Penting</span>
        <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 15l-5-5h10l-5 5z" />
        </svg>
      </div>
      </div>   
    </div>

    <!-- desain lama-->
    <!-- <div
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
    </div> -->

    <button
      @click="submitAHP"
      :disabled="!canSubmit"
      class="mt-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

    <!--new design-->
    <div v-if="resultData.length > 0" class="mt-10">
      <h2 class="text-xl font-bold mb-4">Hasil Rekomendasi Universitas:</h2>
      <ul class="space-y-3">
        <li 
        v-for="(item, index) in displayedResults" 
        :key="item.namaUniversitas" 
        class="p-4 bg-white rounded shadow border-l-4 border-blue-500 cursor-pointer" @click="toggleExpanded(index)">
          <div class="flex justify-between items-center">
            <span class="font-semibold">{{ resultData.indexOf(item) + 1 }}. {{ item.namaUniversitas }}</span>
            <span class="text-gray-600">Skor: {{ item.skor.toFixed(4) }}</span>
          </div>
          <transition name="expand">
            <div v-if="expandedIndex === index" class="mt-3 text-sm text-gray-700 space-y-1">
              <div><strong>Akreditasi:</strong> {{ item.detail.accreditation }}</div>
              <div><strong>Biaya Kuliah:</strong> {{ item.detail.tuition_fee }}</div>
              <div><strong>Persentase Keterimaan / Keketatan:</strong> {{ item.detail.acceptanceRate }}</div>
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
      <div v-if="!showAllResults && resultData.length > 10" class="mt-4 text-center">
        <button
          @click="showAllResults = true"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
        >
          Lihat Semua
        </button>
      </div>
    </div>

    <!--old design-->
        <!-- <div v-if="resultData.length > 0" class="mt-10">
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
    </div> -->
  </div>
</template>

<style scoped>
.ghost {
  opacity: 0.5;
}

.chosen {
  transform: scale(1.05);
  transition: transform 0.3s;
}

.drag {
  transition: transform 0.2s ease;
}
</style>
