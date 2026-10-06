<script setup>
import PrimaryButton from './PrimaryButton.vue'

defineProps({
  id: {
    type: String,
    default: undefined,
  },
  type: {
    type: String,
    default: 'submit',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: 'Processing...',
  },
})

defineEmits(['click'])
</script>

<template>
  <PrimaryButton
    :id="id"
    :type="type"
    :loading="loading"
    :disabled="disabled"
    :loading-text="loadingText"
    @click="$emit('click', $event)"
  >
    <slot />
  </PrimaryButton>
</template>
