<template>
  <div class="py-12 px-4 text-center">
    <div class="w-10 h-10 rounded-full bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center mb-3">
      <slot name="icon">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </slot>
    </div>
    <h3 class="text-sm font-semibold text-neutral-900 mb-1">
      {{ title }}
    </h3>
    <p v-if="description" class="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
      {{ description }}
    </p>
    <slot name="action" />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'No records found',
  },
  description: {
    type: String,
    default: 'There are currently no items matching your criteria.',
  },
})
</script>
