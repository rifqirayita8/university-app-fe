<script setup lang="ts">
import { ref } from 'vue';
import IconAccount from './icons/IconAccount.vue';
import NavbarLogo from './icons/NavbarLogo.vue';
import NavbarLogoLeft from './icons/NavbarLogoLeft.vue';
import NavbarLogoRight from './icons/NavbarLogoRight.vue';

const navItems= [
  { label: 'Tanggal Penting', path: '/tanggal' },
  { label: 'Rekomendasi', path: '/recommendation' },
  { label: 'Jurusan', path: '/university' },
  { label: 'Home', path: '/' }
]

const isOpen= ref(false);

</script>

<template>
  <div class="bg-[#60A3AB] px-6 py-4 flex items-center justify-between h-16">
    <div class="flex items-center gap-x-4">
      <div class="lg:hidden text-white text-3xl cursor-pointer items-center" @click="isOpen= !isOpen">
        ☰
      </div>
      <NavbarLogo alt="logo" class="lg:flex items-center" />
    </div>

    <nav class="hidden lg:flex gap-x-4 items-center">
      <RouterLink
        v-for="item in navItems"
        :key="item.label"
        :to="item.path"
        class="text-white text-lg cursor-pointer hover:text-gray-300 hover:px-3 rounded-md transition duration-300 ease-in-out"
        active-class="text-gray-300"
      >
        {{ item.label }}
      </RouterLink>

      <IconAccount class="h-8 w-8 cursor-pointer mt-2 lg:mt-0" />
    </nav>
  </div>

  <div v-if="isOpen" class="lg:hidden bg-[#60A3AB] px-6 py-4 flex flex-col gap-y-4">
    <RouterLink
      v-for="item in navItems"
      :key="item.label"
      :to="item.path"
      class="text-white text-lg cursor-pointer hover:text-gray-300 hover:px-3 rounded-md transition duration-300 ease-in-out"
      active-class="text-gray-300"
    >
      {{ item.label }}
    </RouterLink>
    <IconAccount class="h-8 w-8 cursor-pointer mt-2 lg:mt-0" />
  </div>
</template>