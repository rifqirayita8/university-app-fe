<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/utils/api';
import { useRouter } from 'vue-router';

type University= {
  universityId: string;
  universityName: string;
}

const router= useRouter();
const isLoading= ref(false);
const isError= ref(false);
const goToDetail= (id: string, name:string) => {
  router.push({ name: 'university-detail', params: { id }, query: { name } });
  console.log('Navigating to detail for university:', id, name);
}

const universitiesList= ref<University[]>([]);

const fetchUniversitas= async () => {
  try {
    isLoading.value= true;
    isError.value= false;
    const res= await api.get('/scrape/universities')
    universitiesList.value= res.data.payload.map((university: any) => ({
      universityId: university.id,
      universityName: university.universityName
    }));
  } catch(err) {
    console.error('Error fetching data:', err);
    isError.value= true;
  } finally {
    isLoading.value= false;
  }
}

onMounted(fetchUniversitas);

</script>

<template>
  <div class="recommendation-page p-4">
    <h1 class="text-3xl font-semibold text-center text-blue-700 mb-6 border-b pb-2">
      📚 Daftar Universitas
    </h1>


    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="bg-white p-4 shadow rounded animate-pulse space-y-4">
        <div class="h-6 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <div v-else-if="isError" class="text-red-500 text-center py-10">
      <p class="mb-4">Terjadi kesalahan saat memuat data universitas. Silakan coba lagi nanti.</p>
      <button 
        @click="fetchUniversitas"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Coba Lagi
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="university in universitiesList" 
        :key="university.universityId" 
        class="bg-white p-6 shadow-sm rounded-xl cursor-pointer hover:shadow-md transition border hover:border-blue-400"
        @click="goToDetail(university.universityId, university.universityName)"
      >
        <h2 class="text-lg font-semibold text-gray-800 mb-1">{{ university.universityName }}</h2>
        <p class="text-sm text-gray-500">Klik untuk lihat detail jurusan</p>
      </div>

    </div>
  </div>
</template>