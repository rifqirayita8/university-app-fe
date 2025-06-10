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
const majorList= ref<Major[]>([]);
const univName= computed(() => route.query.name as string);


onMounted(async () => {
  const univId= route.params.id as string;
  if (!univId) {
    console.error('University ID is not provided');
    return;
  }
  try {
    const res= await api.get('/scrape/majors/' + univId);
    majorList.value= res.data.payload.map((major: any) => ({
      majorName: major.name,
      majorQuota: major.quota,
      majorApplicants: major.applicants
    }));
  } catch(err) {
    console.error('Error fetching data:', err);
  }
console.log('Univ name:', univName.value);

})
</script>

<template>
  <h1 class="text-2xl font-bold p-4">{{ univName }}</h1>
  <div class="p-4 bg-white shadow rounded mb-4 overflow-x-auto">
    <table class="table-auto w-full text-left border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2 border">Nama Jurusan</th>
          <th class="px-4 py-2 border">Kuota</th>
          <th class="px-4 py-2 border">Jumlah Pendaftar</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(major, index) in majorList"
          :key="index" 
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border">{{ major.majorName }}</td>
          <td class="px-4 py-2 border">{{ major.majorQuota }}</td>
          <td class="px-4 py-2 border">{{ major.majorApplicants }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
