<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '@/utils/api';
import AlertBox from '@/components/AlertBox.vue';

const criteriaPairs= [
  ["akreditasi", "biaya"],
  ["akreditasi", "passRate"],
  ["akreditasi", "jarak"],
  ["akreditasi", "jumlahJurusan"],
  ["biaya", "passRate"],
  ["biaya", "jarak"],
  ["biaya", "jumlahJurusan"],
  ["passRate", "jarak"],
  ["passRate", "jumlahJurusan"],
  ["jarak", "jumlahJurusan"]
];

const ahpScale = [
  { value: 1, label: 'Sama penting (1)' },
  { value: 2, label: 'Antara 1 dan 3 (2)' },
  { value: 3, label: 'Sedikit lebih penting (3)' },
  { value: 4, label: 'Antara 3 dan 5 (4)' },
  { value: 5, label: 'Lebih penting (5)' },
  { value: 6, label: 'Antara 5 dan 7 (6)' },
  { value: 7, label: 'Jauh lebih penting (7)' },
  { value: 8, label: 'Antara 7 dan 9 (8)' },
  { value: 9, label: 'Ekstrem penting (9)' }
];

const criteriaWeights= ref<number[]>(Array(criteriaPairs.length).fill(1));
const userLat= ref<number | null>(null);
const userLong= ref<number | null>(null);
const locationError= ref(false);
const formError= ref(false);

const manualLat= ref<string>('');
const manualLong= ref<string>('');

const isLoading= ref(false);
const resultData= ref<{namaUniversitas: string, skor: number}[]>([]);

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

onMounted(() => getLocation());

const canSubmit= computed(() => {
  const lat= userLat.value || parseFloat(manualLat.value);
  const long= userLong.value || parseFloat(manualLong.value);
  return !!lat && !!long;
})

const submitAHP = async() => {

  const isAllFilled= criteriaWeights.value.every((w) => !!w);

  if (!isAllFilled) {
    formError.value= true;
    return;
  }
  
  const formattedWeights= criteriaPairs.map(([a, b], i) => [a, b, criteriaWeights.value[i]]);
  const payload= {
    criteriaWeights: formattedWeights,
    userLat: userLat.value || parseFloat(manualLat.value),
    userLong: userLong.value || parseFloat(manualLong.value),
  };

  isLoading.value= true;
  resultData.value= [];

  try {
    const res= await api.post('/ahp/rank', payload);
    console.log('Response from AHP:', res.data);

    const rankedMap= res.data.result.rankedScoreMap;
    resultData.value= Object.entries(rankedMap).map(([namaUniversitas, skor]) => ({
      namaUniversitas,
      skor: typeof skor === 'number' ? skor : parseFloat(String(skor)) || 0,
    })).sort((a,b) => b.skor - a.skor);
  } catch(err) {
    console.error('Error submitting AHP:', err);
    alert('Terjadi kesalahan saat mengirim data!');
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
      text="Masih ada perbandingan yang belum diisi!"
      type="error"
      closable
    />

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