<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="bg-white rounded-lg border border-[#e7e5e1] shadow-xl w-full max-w-lg overflow-hidden transform transition-all"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-[#e7e5e1] flex items-center justify-between">
          <h3 class="text-base font-bold text-neutral-900">
            {{ title }}
          </h3>
          <button
            @click="$emit('close')"
            type="button"
            class="text-neutral-400 hover:text-neutral-700 p-1 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-5 max-h-[75vh] overflow-y-auto">
          <slot />
        </div>

        <!-- Modal Footer -->
        <div v-if="$slots.footer" class="px-6 py-3.5 bg-neutral-50 border-t border-[#e7e5e1] flex justify-end space-x-2">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})

defineEmits(['close'])
</script>
