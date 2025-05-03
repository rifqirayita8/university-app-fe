<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from './BaseInput.vue';

defineProps<{
  modelValue: boolean;
  emailError?: string;
  passwordError?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'login', payload: { email: string; password: string }): void;
  (e: 'open-register'): void;
  (e: 'close'): void;
}>();

const email = ref('');
const password = ref('');
</script>


<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
    @click="emit('close')"
  >
    <div class="bg-white p-8 rounded-lg w-96 shadow-lg" @click.stop>
      <h2 class="text-2xl font-semibold mb-4">Login</h2>
      <form @submit.prevent="emit('login', { email: email, password: password })">
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
        <button class="text-blue-500 text-sm ml-2" @click="emit('open-register')">
          Daftar
        </button>
      </div>
    </div>
  </div>
</template>
