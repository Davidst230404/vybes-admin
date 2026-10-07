<template>
  <BaseModal :is-open="isOpen" :title="title" @close="handleCancel">
    <div class="space-y-3">
      <p class="text-xs text-neutral-600 leading-relaxed">
        {{ message }}
      </p>
      <slot />
    </div>

    <template #footer>
      <button
        @click="handleCancel"
        :disabled="isLoading"
        type="button"
        class="px-3.5 py-1.5 border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 text-neutral-700 text-xs font-medium rounded-md transition-colors"
      >
        Cancel
      </button>

      <button
        @click="$emit('confirm')"
        :disabled="isLoading"
        type="button"
        class="px-3.5 py-1.5 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 flex items-center space-x-1.5"
        :class="variantClasses"
      >
        <span v-if="isLoading" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        <span>{{ confirmText }}</span>
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Confirm Action',
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed with this action?',
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  variant: {
    type: String,
    default: 'primary', // 'primary' | 'danger' | 'warning'
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'cancel', 'update:isOpen'])

function handleCancel() {
  if (props.isLoading) return
  emit('cancel')
}

const variantClasses = computed(() => {
  if (props.variant === 'danger') {
    return 'bg-red-600 hover:bg-red-700'
  }
  if (props.variant === 'warning') {
    return 'bg-amber-600 hover:bg-amber-700'
  }
  return 'bg-[#f25c05] hover:bg-[#dc5202]'
})
</script>
