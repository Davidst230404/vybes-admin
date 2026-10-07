<template>
  <div
    v-if="meta && meta.total > 0"
    class="flex items-center justify-between px-4 py-3 border-t border-[#e7e5e1] text-xs text-neutral-500 bg-white"
  >
    <!-- Entry Count Information -->
    <div>
      Showing
      <span class="font-medium text-neutral-800">{{ meta.from || 0 }}</span>
      to
      <span class="font-medium text-neutral-800">{{ meta.to || 0 }}</span>
      of
      <span class="font-medium text-neutral-800">{{ meta.total }}</span>
      results
    </div>

    <!-- Navigation Controls -->
    <div class="flex items-center space-x-1.5">
      <button
        @click="$emit('change-page', meta.current_page - 1)"
        :disabled="meta.current_page <= 1 || disabled"
        class="px-2.5 py-1 border border-neutral-200 rounded-md hover:bg-neutral-50 disabled:opacity-40 disabled:hover:bg-white text-neutral-700 transition-colors font-medium flex items-center space-x-1"
        type="button"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Previous</span>
      </button>

      <div class="px-2 font-medium text-neutral-700">
        Page {{ meta.current_page }} of {{ meta.last_page }}
      </div>

      <button
        @click="$emit('change-page', meta.current_page + 1)"
        :disabled="meta.current_page >= meta.last_page || disabled"
        class="px-2.5 py-1 border border-neutral-200 rounded-md hover:bg-neutral-50 disabled:opacity-40 disabled:hover:bg-white text-neutral-700 transition-colors font-medium flex items-center space-x-1"
        type="button"
      >
        <span>Next</span>
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  meta: {
    type: Object,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['change-page'])
</script>
