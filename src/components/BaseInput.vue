<script setup lang="ts">
defineProps<{
  label:string;
  type?:string;
  placeholder?:string;
  modelValue:string;
  error?:string;
}>()
const emit= defineEmits<{
  (e: 'update:modelValue', value: string):void;
}>();
</script>

<template>
  <div class="mb-4">
    <label class="block text-gray-700 mb-1">{{ label }}</label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
    />
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>