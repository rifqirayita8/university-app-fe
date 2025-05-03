<script setup lang="ts">
import { ref, watch } from 'vue';
import IconAccount from './icons/IconAccount.vue';
import NavbarLogo from './icons/NavbarLogo.vue';
import LoginModal from './LoginModal.vue';
import RegisterModal from './RegisterModal.vue';

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
const name = ref('');
const cpassword = ref('');
const nameError = ref('');
const cpasswordError = ref('');

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

const login = ({ email: inputEmail, password: inputPassword }: { email: string; password: string }) => {
  email.value = inputEmail;
  password.value = inputPassword;

  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (!isEmailValid || !isPasswordValid) return;

  isLoggedIn.value = true;
  isLoginModalOpen.value = false;
  isAccountOpen.value = false;

  console.log('Login success:', inputEmail);
};

const register = () => {
  // Reset error
  nameError.value = '';
  emailError.value = '';
  passwordError.value = '';
  cpasswordError.value = '';

  let valid = true;

  if (!name.value.trim()) {
    nameError.value = 'Nama tidak boleh kosong';
    valid = false;
  }

  if (!validateEmail()) valid = false;
  if (!validatePassword()) valid = false;

  if (cpassword.value !== password.value) {
    cpasswordError.value = 'Konfirmasi password tidak cocok';
    valid = false;
  }

  if (!valid) return;

  // Simulasikan pendaftaran berhasil
  console.log('Register berhasil:', name.value, email.value);
  isRegisterModalOpen.value = false;
  isLoggedIn.value = true;
};

const logout= () => {
  isLoggedIn.value= false;
  isAccountOpen.value= false;
  console.log('Logout clicked');
}

const openLoginModal= () => {
  isLoginModalOpen.value= true;
  closeRegisterModal();
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

  <LoginModal
    v-model="isLoginModalOpen"
    :email-error="emailError"
    :password-error="passwordError"
    @login="login"
    @close="closeLoginModal"
    @open-register="openRegisterModal"
  />

  <RegisterModal
  v-model="isRegisterModalOpen"
  :email-error="emailError"
  :password-error="passwordError"
  :name-error="nameError"
  :cpassword-error="cpasswordError"
  @register="register"
  @close="closeRegisterModal"
  @open-login="openLoginModal"
/>

</template>