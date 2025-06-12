<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '@/utils/api';
import { useRoute, useRouter } from 'vue-router';

type Major= {
  majorName: string;
  majorQuota: number;
  majorApplicants: number;
}

const route= useRoute();
const isLoading= ref(false);
const isError= ref(false);
const majorList= ref<Major[]>([]);
const univName= computed(() => route.query.name as string);
const currentPage = ref(1);
const itemsPerPage = 20;
const sortKey = ref<'majorQuota' | 'majorApplicants' | null>(null);
const sortOrder = ref<'asc' | 'desc'>('asc');



const fetchJurusan= async () => {
  const univId= route.params.id as string;
  if (!univId) {
    console.error('University ID is not provided');
    return;
  }
  try {
    isLoading.value= true;
    isError.value= false;
    const res= await api.get('/scrape/majors/' + univId);
    majorList.value= res.data.payload.map((major: any) => ({
      majorName: major.name,
      majorQuota: major.quota,
      majorApplicants: major.applicants
    }));
  } catch(err) {
    console.error('Error fetching data:', err);
    isError.value= true;
  }finally {
    isLoading.value= false;
  }
}

const totalPages = computed(() =>
  Math.ceil(majorList.value.length / itemsPerPage)
);

const sortedMajors = computed(() => {
  if (!sortKey.value) return majorList.value;

  return [...majorList.value].sort((a, b) => {
    const aValue = a[sortKey.value!];
    const bValue = b[sortKey.value!];
    if (sortOrder.value === 'asc') return aValue - bValue;
    return bValue - aValue;
  });
});

const paginatedMajors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedMajors.value.slice(start, start + itemsPerPage);
});


const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const sortBy = (key: 'majorQuota' | 'majorApplicants') => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};



onMounted(fetchJurusan);
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold p-4">{{ univName }}</h1>

    <div v-if="isLoading" class="text-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading jurusan...</p>
    </div>

    <div v-else-if="isError" class="text-red-500 text-center py-10">
      <p class="mb-4">Terjadi kesalahan saat memuat data jurusan. Silakan coba lagi nanti.</p>
      <button 
        @click="fetchJurusan"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Coba Lagi
      </button>
    </div>

    <div v-else class=" bg-white shadow rounded mb-4 overflow-x-auto">
      <table class="table-auto w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 border">Nama Jurusan</th>
            <th class="px-4 py-2 border cursor-pointer" @click="sortBy('majorQuota')">
              Kuota
              <span v-if="sortKey === 'majorQuota'">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th class="px-4 py-2 border cursor-pointer" @click="sortBy('majorApplicants')">
              Jumlah Pendaftar
              <span v-if="sortKey === 'majorApplicants'">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(major, index) in paginatedMajors"
            :key="index" 
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2 border">{{ major.majorName }}</td>
            <td class="px-4 py-2 border">{{ major.majorQuota }}</td>
            <td class="px-4 py-2 border">{{ major.majorApplicants }}</td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-between items-center p-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sebelumnya
        </button>
        
        <span class="text-gray-700">
          Halaman {{ currentPage }} dari {{ totalPages }}
        </span>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Berikutnya
        </button>
      </div>
    </div>
  </div>
</template>
