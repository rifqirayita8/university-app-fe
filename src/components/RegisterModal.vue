<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from './BaseInput.vue';

defineProps<{
  modelValue: boolean;
  nameError?: string;
  emailError?: string;
  passwordError?: string;
  cpasswordError?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'register', payload: {
    name: string;
    emailRegister: string;
    passwordRegister: string;
    cpassword: string;
  }): void;
  (e: 'open-login'): void;
  (e: 'close'): void;
}>();

const name = ref('');
const emailRegister = ref('');
const passwordRegister = ref('');
const cpassword = ref('');
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
    @click="emit('close')"
  >
    <div class="bg-white p-8 rounded-lg w-96 shadow-lg" @click.stop>
      <h2 class="text-2xl font-semibold mb-4">Daftar</h2>
      <form
        @submit.prevent="emit('register', {
          name: name,
          emailRegister: emailRegister,
          passwordRegister: passwordRegister,
          cpassword: cpassword
        })"
      >
        <BaseInput
          label="Nama"
          v-model="name"
          placeholder="Nama lengkap"
          :error="nameError"
        />
        <BaseInput
          label="Email"
          type="email"
          v-model="emailRegister"
          placeholder="Email"
          :error="emailError"
        />
        <BaseInput
          label="Password"
          type="password"
          v-model="passwordRegister"
          placeholder="Password"
          :error="passwordError"
        />
        <BaseInput
          label="Konfirmasi Password"
          type="password"
          v-model="cpassword"
          placeholder="Konfirmasi"
          :error="cpasswordError"
        />
        <button
          type="submit"
          class="w-full py-2 mt-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
        >
          Daftar
        </button>
      </form>
      <div class="mt-4 text-center">
        <span class="text-sm">Sudah punya akun?</span>
        <button class="text-blue-500 text-sm ml-2" @click="emit('open-login')">
          Login
        </button>
      </div>
    </div>
  </div>
</template>
