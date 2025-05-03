<script setup lang="ts">
import { ref, watch } from 'vue';
import IconAccount from './icons/IconAccount.vue';
import NavbarLogo from './icons/NavbarLogo.vue';
import BaseInput from './BaseInput.vue';

const navItems= [
  { label: 'Tanggal Penting', path: '/tanggal' },
  { label: 'Rekomendasi', path: '/recommendation' },
  { label: 'Jurusan', path: '/university' },
  { label: 'Home', path: '/' }
]

const isOpen= ref(false);
const isAccountOpen= ref(false);
const isLoggedIn= ref(false);
const isLoginModalOpen= ref(false);
const isRegisterModalOpen= ref(false);
const email= ref('');
const emailError= ref('');
const password = ref('');
const passwordError = ref('');


watch(email, () => {
  emailError.value = '';
});

watch(password, () => {
  passwordError.value = '';
});

const validateEmail = () => {
  if (!email.value.includes('@')) {
    emailError.value = 'Email tidak valid';
    return false;
  }
  return true;
};

const validatePassword = () => {
  if (password.value.length < 6) {
    passwordError.value = 'Password minimal 6 karakter';
    return false;
  }
  return true;
};


const toggleAccount= () => {
  isAccountOpen.value= !isAccountOpen.value;
}

const login= () => {
  // const isEmailValid = validateEmail();
  // const isPasswordValid = validatePassword();

  // if (!isEmailValid || !isPasswordValid) return;
  // isLoginModalOpen.value= true;
  // console.log('Login clicked');
}

const logout= () => {
  isLoggedIn.value= false;
  isAccountOpen.value= false;
  console.log('Logout clicked');
}

const openLoginModal= () => {
  isLoginModalOpen.value= true;
}

const closeLoginModal= () => {
  isLoginModalOpen.value= false;
}

const openRegisterModal= () => {
  isRegisterModalOpen.value= true;
  closeLoginModal();
}

const closeRegisterModal= () => {
  isRegisterModalOpen.value= false;
}

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

      <div class="relative">
        <IconAccount class="h-8 w-8 cursor-pointer mt-2 lg:mt-0" @click="toggleAccount" />

        <div
          v-if="isAccountOpen"
          class="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50"
        >
          <div 
            v-if="!isLoggedIn"
            @click="openLoginModal"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Login  
          </div>
          <div
            v-else
            @click="logout"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Logout
          </div>
        </div>
      </div>  
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

    <div class="relative self-start">
      <IconAccount class="h-8 w-8 cursor-pointer mt-2" @click="toggleAccount" />

      <div
        v-if="isAccountOpen"
        class="absolute left-0-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50"
      >
        <div 
          v-if="!isLoggedIn"
          @click="openLoginModal"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          Login  
        </div>
        <div
          v-else
          @click="logout"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          Logout
        </div>
      </div>
    </div>
  </div>


  <div
    v-if="isLoginModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
    @click="closeLoginModal"
  >
    <div
      class="bg-white p-8 rounded-lg w-96 shadow-lg"
      @click.stop
    >
      <h2 class="text-2xl font-semibold mb-4">Login</h2>
      <form @submit.prevent="login">
        <BaseInput
          label="Email"
          type="email"
          v-model="email"
          placeholder="Enter your email"
          :error="emailError"
        />
        <BaseInput
          label="Password"
          type="password"
          v-model="password"
          placeholder="Enter your password"
          :error="passwordError"
        />
        <button
          type="submit"
          class="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </form>
      <div class="mt-4 text-center">
        <span class="text-sm">Belum punya akun?</span>
        <button
          class="text-blue-500 text-sm ml-2"
          @click="openRegisterModal"
        >
          Daftar
        </button>
      </div>
    </div>
  </div>
</template>