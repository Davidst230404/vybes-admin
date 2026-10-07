<template>
  <div class="space-y-3 py-2 animate-pulse">
    <div
      v-for="i in rows"
      :key="i"
      class="h-10 bg-neutral-100 rounded-md w-full"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  rows: {
    type: Number,
    default: 5,
  },
})
</script>
