<script setup lang="ts">
import { useRouter } from 'vue-router';

const router= useRouter();
const goToRecommendation= () => {
  router.push('/recommendation');
}
</script>

<template>
  <div class="font-poppins font-bold relative h-screen flex flex-col items-center justify-center text-center px-4">
    <img 
      src="@/assets/images/background.png" 
      class="absolute top-0 left-0 w-full h-full object-cover -z-10"
      alt="Background"
    />
    <h1 class="text-white text-4xl md:text-5xl font-black space-y-4 flex flex-col items-center">
      <span>Everything you</span>
      <span>need to know about</span>
      <span>universities</span>
    </h1>


    <div class="mt-4 w-32 h-1 bg-white/70 rounded-full"></div>

    <div class="mt-4 text-white text-base md:text-lg flex flex-col items-center space-y-1">
      <span>Jelajahi PTN dan jurusan impianmu!</span>
      <span>Bingung? Coba fitur</span>
      <span>rekomendasi PTN kami</span>
    </div>


    <button
      @click="goToRecommendation"
      class="mt-6 px-6 py-2 bg-[#FFD84E] text-gray-800 rounded-full font-semibold shadow-md hover:bg-gray-100 transition"
    >
      Rekomendasi
    </button>
  </div>
</template>