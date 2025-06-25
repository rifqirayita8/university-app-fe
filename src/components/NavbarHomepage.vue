<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import IconAccount from './icons/IconAccount.vue';
import NavbarLogo from './icons/NavbarLogo.vue';
import LoginModal from './LoginModal.vue';
import RegisterModal from './RegisterModal.vue';
import api from '@/utils/api';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'vue-router';

const navItems= [
  { label: 'Rekomendasi', path: '/recommendation' },
  { label: 'Jurusan', path: '/university' },
  { label: 'Home', path: '/' }
]

const isOpen= ref(false);
const isAccountOpen= ref(false);
const isLoggedIn= ref(false);
const isLoginModalOpen= ref(false);
const isRegisterModalOpen= ref(false);
const emailLogin= ref('');
const emailLoginError= ref('');
const passwordLogin = ref('');
const passwordLoginError = ref('');
const name = ref('');
const nameError = ref('');
const emailRegister = ref('');
const emailRegisterError = ref('');
const passwordRegister = ref('');
const passwordRegisterError = ref('');
const cpassword = ref('');
const cpasswordError = ref('');
const router= useRouter();

onMounted(() => {
  isLoggedIn.value= localStorage.getItem('token') !== null;
});

console.log('isLoggedIn:', isLoggedIn.value);
console.log('token:', localStorage.getItem('token'));

watch(emailLogin, () => {
  emailLoginError.value = '';
});

watch(passwordLogin, () => {
  passwordLoginError.value = '';
});


const toggleAccount= () => {
  isAccountOpen.value= !isAccountOpen.value;
}

const loginUser = async ({ email: inputEmail, password: inputPassword }: { email: string; password: string }) => {
  emailLogin.value = inputEmail;
  passwordLogin.value = inputPassword;

  try {
    const response = await api.post('/auth/login', {
      email: inputEmail,
      password: inputPassword,
    });

    console.log('Login success:', response.data);

    localStorage.setItem('token', response.data.token);
    emailLogin.value = '';
    passwordLogin.value = '';
    emailLoginError.value = '';
    inputEmail = '';
    inputPassword = '';
    isLoggedIn.value = true;
    isLoginModalOpen.value = false;
    isAccountOpen.value = false;
  } catch (err: any) {
    console.error('Login failed:', err);
    
    if (err.response) {
      const { message } = err.response.data;
      emailLoginError.value = message.includes('email') ? message : '';
      passwordLoginError.value = message.includes('password') ? message : '';
    } else {
      emailLoginError.value = 'Terjadi kesalahan. Coba lagi nanti.';
    }
  }
};

const logoutUser= () => {
  isAccountOpen.value= false;
  isLoggedIn.value= false;
  emailLogin.value = '';
  localStorage.removeItem('token');
}

const registerUser = async ({
  name: inputName, 
  emailRegister: inputEmailRegister,
  passwordRegister: inputPasswordRegister,
  cpassword: inputCpassword,
}: {name: string; emailRegister: string, passwordRegister:string, cpassword: string}) => {
  name.value = inputName;
  emailRegister.value = inputEmailRegister;
  passwordRegister.value = inputPasswordRegister;
  cpassword.value = inputCpassword;
  try {
    console.log('Data yang dikirim:', {
      name: inputName,
      emailRegister: inputEmailRegister,
      passwordRegister: inputPasswordRegister,
      cpassword: inputCpassword,
    });

    const response = await api.post('/auth/register', {
      username: inputName,
      email: inputEmailRegister,
      password: inputPasswordRegister,
      confirmPassword: inputCpassword,
    });

    console.log('Register success:', response.data);

    name.value = '';
    emailLogin.value = '';
    passwordLogin.value = '';
    cpassword.value = '';

    isRegisterModalOpen.value = false;
    isLoggedIn.value = true;
  } catch (err: any) {
      console.error('Register failed:', err);

    if (err.response) {
      console.log('Detail error:', err.response.data); // 🕵️‍♂️ ini penting
      const { message } = err.response.data;
      if (message.includes('name')) nameError.value = message;
      if (message.includes('email')) emailLoginError.value = message;
      if (message.includes('password')) passwordLoginError.value = message;
    } else {
      emailLoginError.value = 'Terjadi kesalahan. Coba lagi nanti.';
    }
  }
};

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

const goHome= () => {
  router.push('/');
  isOpen.value = false;
  isAccountOpen.value = false;
  isLoginModalOpen.value = false;
  isRegisterModalOpen.value = false;  
}

</script>

<template>
  <div class="bg-[#60A3AB] px-6 py-4 flex items-center justify-between h-16 shadow-lg">
    <div class="flex items-center gap-x-4">
      <div class="lg:hidden text-white text-3xl cursor-pointer items-center" @click="isOpen= !isOpen">
        ☰
      </div>
      <button @click="goHome" class="cursor-pointer bg-transparent border-none p-0">
        <NavbarLogo class="lg:flex items-center" />
      </button>

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
            @click="logoutUser"
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
          @click="logoutUser"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer leading"
        >
          Logout
        </div>
      </div>
    </div>
  </div>

  <LoginModal
    v-model="isLoginModalOpen"
    :key="isLoginModalOpen ? 'open' : 'closed'"
    :email-error="emailLoginError"
    :password-error="passwordLoginError"
    @login="loginUser"
    @close="closeLoginModal"
    @open-register="openRegisterModal"
  />

  <RegisterModal
  v-model="isRegisterModalOpen"
  :email-error="emailRegisterError"
  :password-error="passwordRegisterError"
  :name-error="nameError"
  :cpassword-error="cpasswordError"
  @register="registerUser"
  @close="closeRegisterModal"
  @open-login="openLoginModal"
/>

</template>