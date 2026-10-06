<script setup>
defineProps({
  id: { type: String, required: true },
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <button
    :id="id"
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'base-button',
      `base-button--${variant}`,
      { 'base-button--loading': loading },
    ]"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="base-button__spinner" aria-hidden="true"></span>
    <span :class="{ 'base-button__label--loading': loading }">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  height: 46px;
  padding: 0 var(--space-4);
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  outline: none;
  transition:
    background-color var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
  user-select: none;
}

.base-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Primary */
.base-button--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.base-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.base-button--primary:active:not(:disabled) {
  background-color: var(--color-primary-active);
  transform: translateY(1px);
}

.base-button--primary:disabled {
  background-color: var(--color-primary-disabled);
  color: rgba(255, 255, 255, 0.7);
  cursor: not-allowed;
}

/* Ghost variant for retry actions */
.base-button--ghost {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-border);
  height: 32px;
  width: auto;
  font-size: 12px;
}

.base-button--ghost:hover:not(:disabled) {
  background: rgba(232, 124, 62, 0.06);
  border-color: var(--color-primary);
}

/* Spinner */
.base-button__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.base-button__label--loading {
  opacity: 0.85;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
