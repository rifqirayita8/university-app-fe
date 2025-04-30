<template>
  <div
    v-if="show"
    :class="[
      'p-4 rounded-md mb-4 relative border',
      type === 'error' ? 'bg-red-100 text-red-800 border-red-300' :
      type === 'success' ? 'bg-green-100 text-green-800 border-green-300' :
      'bg-blue-100 text-blue-800 border-blue-300'
    ]"
  >
    <span>{{ text }}</span>
    <button
      v-if="closable"
      @click="$emit('update:show', false)"
      class="absolute top-2 right-2 text-inherit hover:text-black"
    >
      ✖
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
  type?: 'error' | 'success' | 'info' | 'warning'
  show: boolean
  closable?: boolean
}>()
defineEmits(['update:show'])
</script>