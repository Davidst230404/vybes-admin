<script setup>
defineProps({
  id: {
    type: String,
    default: undefined,
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
    default: 'Connecting to Google...',
  },
})

defineEmits(['click'])
</script>

<template>
  <button
    :id="id"
    type="button"
    :disabled="disabled || loading"
    class="auth-google-btn"
    :class="{
      'auth-google-btn--loading': loading,
      'auth-google-btn--disabled': disabled && !loading,
    }"
    @click="$emit('click', $event)"
  >
    <!-- Spinner if loading -->
    <span v-if="loading" class="auth-google-btn__spinner" aria-hidden="true"></span>

    <!-- Google G Logo if not loading -->
    <svg
      v-else
      class="auth-google-btn__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>

    <span class="auth-google-btn__label">
      <template v-if="loading">{{ loadingText }}</template>
      <template v-else><slot>Continue with Google</slot></template>
    </span>
  </button>
</template>

<style scoped>
.auth-google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 44px;
  padding: 0 16px;
  font-family: var(--font-family);
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1;
  color: var(--color-text-primary, #111111);
  background-color: #ffffff;
  border: 1px solid #dcd8d0;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
  user-select: none;
  transition:
    background-color var(--transition-fast, 120ms ease),
    border-color var(--transition-fast, 120ms ease),
    box-shadow var(--transition-fast, 120ms ease);
}

.auth-google-btn:hover:not(:disabled) {
  background-color: #faf9f6;
  border-color: #c4c1ba;
}

.auth-google-btn:active:not(:disabled) {
  background-color: #f2efe9;
}

.auth-google-btn:focus-visible {
  outline: 2px solid var(--color-primary, #e87c3e);
  outline-offset: 2px;
}

.auth-google-btn--disabled,
.auth-google-btn:disabled:not(.auth-google-btn--loading) {
  background-color: #f7f5f0;
  border-color: #eae8e3;
  color: var(--color-text-disabled, #c4c1ba);
  cursor: not-allowed;
}

.auth-google-btn--loading {
  background-color: #faf9f6;
  border-color: var(--color-border, #dddad3);
  color: var(--color-text-secondary, #77736c);
  cursor: not-allowed;
}

.auth-google-btn__icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.auth-google-btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #dddad3;
  border-top-color: var(--color-primary, #e87c3e);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
