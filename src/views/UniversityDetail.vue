<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '@/utils/api';
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';

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
const searchTerm= ref('');
const currentYear= new Date().getFullYear();
const jumpPage= ref(currentPage.value);

watch(searchTerm, () => {
  currentPage.value = 1;
});

watch(currentPage, (newPage) => {
  jumpPage.value= newPage;
});

const goToPage= (page: number | string) => {
  if (typeof page === 'number' && page !== currentPage.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 2; 

  const pages: (number | string)[] = [];
  const left = Math.max(1, current - delta);
  const right = Math.min(total, current + delta);

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (left > 1) pages.unshift(1);
  if (left > 2) pages.splice(1, 0, '...');
  if (right < total - 1) pages.push('...');
  if (right < total) pages.push(total);

  return pages;
});

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

const totalPages = computed(() => {
  const count= Math.ceil(filteredMajors.value.length / itemsPerPage)
  return count > 0 ? count : 1;
});

const sortedMajors = computed(() => {
  if (!sortKey.value) return majorList.value;

  return [...majorList.value].sort((a, b) => {
    const aValue = a[sortKey.value!];
    const bValue = b[sortKey.value!];
    if (sortOrder.value === 'asc') return aValue - bValue;
    return bValue - aValue;
  });
});

const filteredMajors= computed(() => {
  return sortedMajors.value.filter((major) =>
    major.majorName.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const paginatedMajors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredMajors.value.slice(start, start + itemsPerPage);
});


const nextPage = () => {
  if (currentPage.value < totalPages.value) 
  currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) 
  currentPage.value--;
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
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-semibold mb-6 text-center text-blue-700 border-b pb-2">
      Daftar Jurusan - {{ univName }}
    </h1>

    <div class="relative mb-4">
      <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Cari jurusan..."
        class="w-full pl-10 pr-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Error State -->
    <div v-if="isError" class="text-red-600 text-center py-10">
      <p class="mb-3">Ups! Terjadi kesalahan saat memuat data jurusan.</p>
      <button 
        @click="fetchJurusan"
        class="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Table -->
    <div v-else class="bg-white shadow rounded-xl overflow-hidden ring-1 ring-gray-200">
      <table class="min-w-full text-sm text-left">
        <thead class="bg-blue-50 text-blue-900 sticky top-0 z-10">
          <tr>
            <th class="px-6 py-4 font-semibold tracking-wide">Nama Jurusan</th>
            <th class="px-6 py-4 cursor-pointer hover:text-blue-700 transition" @click="sortBy('majorQuota')">
              Kuota {{ currentYear }}
              <span 
                v-if="sortKey === 'majorQuota'"
                class="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 transition duration-150 ease-in-out"
                :title="sortOrder === 'asc' ? 'Urutkan Naik' : 'Urutkan Turun'"
              >
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th class="px-6 py-4 cursor-pointer hover:text-blue-700 transition" @click="sortBy('majorApplicants')">
              Pendaftar {{ currentYear-1 }}
              <span 
                v-if="sortKey === 'majorApplicants'"
                class="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 transition duration-150 ease-in-out"
                :title="sortOrder === 'asc' ? 'Urutkan Naik' : 'Urutkan Turun'"
              >
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>

        <tbody v-if="isLoading">
          <tr v-for="i in 5" :key="i" class="animate-pulse">
            <td class="px-6 py-4">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </td>
            <td class="px-6 py-4">
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </td>
            <td class="px-6 py-4">
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            </td>
          </tr> 
        </tbody>


        <tbody v-else class="divide-y divide-gray-100 bg-white">
          <tr v-if="paginatedMajors.length === 0">
            <td colspan="3" class="text-center py-6 text-gray-500 italic">
              Tidak ditemukan jurusan dengan kata kunci tersebut.
            </td>
          </tr>
          <tr
            v-else 
            v-for="(major, index) in paginatedMajors" 
            :key="index"
            class="hover:bg-blue-100/50 transition-colors duration-150 ease-in-out"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
          >
            <td class="px-6 py-4">{{ major.majorName }}</td>
            <td class="px-6 py-4">{{ major.majorQuota }}</td>
            <td class="px-6 py-4">{{ major.majorApplicants }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex flex-wrap justify-center sm:justify-between items-center px-6 py-4 bg-gray-50 border-t gap-3">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Sebelumnya
        </button>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="(page, index) in visiblePages"
            :key="index"
            @click="goToPage(page)"
            :disabled="page === '...'"
            class="px-3 py-1 text-sm rounded-md border transition-all"
            :class="[
              page === currentPage ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-blue-100 border-gray-300',
              page === '...' ? 'cursor-default text-gray-400 border-transparent' : ''
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Berikutnya →
        </button>
      </div>
    </div>
  </div>
</template>

