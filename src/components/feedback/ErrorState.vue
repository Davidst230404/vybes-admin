<template>
  <div class="p-6 text-center bg-red-50/50 border border-red-200/80 rounded-lg">
    <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-3">
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 class="text-sm font-semibold text-neutral-900 mb-1">
      {{ title }}
    </h3>
    <p class="text-xs text-neutral-600 max-w-md mx-auto mb-4">
      {{ message }}
    </p>
    <button
      v-if="retryable"
      @click="$emit('retry')"
      type="button"
      class="inline-flex items-center px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-md transition-colors"
    >
      <svg class="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Try Again
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Failed to load data',
  },
  message: {
    type: String,
    default: 'An unexpected error occurred while communicating with the backend API.',
  },
  retryable: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['retry'])
</script>
