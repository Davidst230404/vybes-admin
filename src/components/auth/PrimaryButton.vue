<script setup>
defineProps({
  id: {
    type: String,
    default: undefined,
  },
  type: {
    type: String,
    default: 'submit',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: '',
  },
})

defineEmits(['click'])
</script>

<template>
  <button
    :id="id"
    :type="type"
    :disabled="disabled || loading"
    class="auth-primary-btn"
    :class="{
      'auth-primary-btn--loading': loading,
      'auth-primary-btn--disabled': disabled && !loading,
    }"
    @click="$emit('click', $event)"
  >
    <!-- Loading spinner -->
    <span v-if="loading" class="auth-primary-btn__spinner" aria-hidden="true"></span>

    <!-- Label -->
    <span class="auth-primary-btn__label">
      <slot v-if="!loading || !loadingText" />
      <template v-else>{{ loadingText }}</template>
    </span>
  </button>
</template>

<style scoped>
.auth-primary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  padding: 0 16px;
  font-family: var(--font-family);
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  color: #ffffff;
  background-color: var(--color-primary, #d85d38);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
  user-select: none;
  transition:
    background-color var(--transition-fast, 120ms ease),
    transform var(--transition-fast, 120ms ease),
    box-shadow var(--transition-fast, 120ms ease);
}

/* Hover */
.auth-primary-btn:hover:not(:disabled) {
  background-color: var(--color-primary-hover, #d46a2e);
}

/* Pressed / Active */
.auth-primary-btn:active:not(:disabled) {
  background-color: var(--color-primary-active, #c05e28);
  transform: translateY(1px);
}

/* Focus Visible */
.auth-primary-btn:focus-visible {
  outline: 2px solid var(--color-primary, #e87c3e);
  outline-offset: 2px;
}

/* Disabled */
.auth-primary-btn--disabled,
.auth-primary-btn:disabled:not(.auth-primary-btn--loading) {
  background-color: var(--color-primary-disabled, #f0c4a6);
  color: rgba(255, 255, 255, 0.8);
  cursor: not-allowed;
  transform: none;
}

/* Loading */
.auth-primary-btn--loading {
  background-color: var(--color-primary-disabled, #f0c4a6);
  color: rgba(255, 255, 255, 0.9);
  cursor: not-allowed;
}

.auth-primary-btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}

.auth-primary-btn__label {
  display: inline-flex;
  align-items: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
