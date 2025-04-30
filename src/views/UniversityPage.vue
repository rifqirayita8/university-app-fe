<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/utils/api';

type Kampus= {
  name: string;
  tuition_fee: string;
  accreditation: string;
  pass_percentage: string;
  latitude: number;
  longitude: number;
  major_count: string;
}

const kampusList= ref<Kampus[]>([]);

onMounted(async () => {
  try {
    const res= await api.get('/datamaster/universitas');
    kampusList.value= res.data.data;
  } catch(err) {
    console.error('Error fetching data:', err);
  }
})

</script>

<template>
  <div class="recommendation-page p-4">
    <h1 class="text-2xl font-bold mb-4">Recommendation Page</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="kampus in kampusList" :key="kampus.name" class="bg-white p-4 shadow rounded">
        <h2 class="text-xl font-semibold">{{ kampus.name }}</h2>
        <p><strong>Tuition Fee:</strong> {{ kampus.tuition_fee }}</p>
        <p><strong>Accreditation:</strong> {{ kampus.accreditation }}</p>
        <p><strong>Pass Percentage:</strong> {{ kampus.pass_percentage }}</p>
        <p>Lokasi: ({{ kampus.latitude }}, {{ kampus.longitude }})</p>
        <p><strong>Major Count:</strong> {{ kampus.major_count }}</p>
      </div>
    </div>
  </div>
</template>