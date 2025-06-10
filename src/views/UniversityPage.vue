<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/utils/api';
import { useRouter } from 'vue-router';

type University= {
  universityId: string;
  universityName: string;
}

const router= useRouter();
const goToDetail= (id: string, name:string) => {
  router.push({ name: 'university-detail', params: { id }, query: { name } });
  console.log('Navigating to detail for university:', id, name);
}

const universitiesList= ref<University[]>([]);

onMounted(async () => {
  try {
    const res= await api.get('/scrape/universities')
    universitiesList.value= res.data.payload.map((university: any) => ({
      universityId: university.id,
      universityName: university.universityName
    }));
  } catch(err) {
    console.error('Error fetching data:', err);
  }
})

</script>

<template>
  <div class="recommendation-page p-4">
    <h1 class="text-2xl font-bold mb-4">Recommendation Page</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="university in universitiesList" 
        :key="university.universityId" 
        class="bg-white p-4 shadow rounded cursor-pointer hover:shadow-lg transition"
        @click="goToDetail(university.universityId, university.universityName)"
      >
        <h2>{{ university.universityName }}</h2>
      </div>
    </div>
  </div>
</template>