<script setup>
defineProps({
  title: {
    type: String,
    default: 'Unable to connect to the server.',
  },
  description: {
    type: String,
    default: 'Check your internet connection and try again.',
  },
  actionText: {
    type: String,
    default: 'Try again',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['retry'])
</script>

<template>
  <div class="auth-network-error" role="alert">
    <!-- Network alert icon -->
    <div class="auth-network-error__icon-wrap" aria-hidden="true">
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" stroke-width="2.5" />
      </svg>
    </div>

    <div class="auth-network-error__content">
      <p class="auth-network-error__title">{{ title }}</p>
      <p class="auth-network-error__desc">{{ description }}</p>
    </div>

    <button
      type="button"
      class="auth-network-error__action"
      :disabled="loading"
      @click="$emit('retry')"
    >
      <span v-if="loading" class="auth-network-error__spinner" aria-hidden="true"></span>
      <span>{{ actionText }}</span>
    </button>
  </div>
</template>

<style scoped>
.auth-network-error {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background-color: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: var(--radius-sm, 4px);
  color: #92400e;
  font-family: var(--font-family);
  box-sizing: border-box;
}

.auth-network-error__icon-wrap {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d97706;
}

.auth-network-error__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.auth-network-error__title {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.35;
  color: #92400e;
}

.auth-network-error__desc {
  margin: 0;
  font-size: 11px;
  line-height: 1.35;
  color: #b45309;
}

.auth-network-error__action {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background-color: #ffffff;
  border: 1px solid #fcd34d;
  border-radius: 4px;
  color: #b45309;
  font-family: var(--font-family);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition:
    background-color var(--transition-fast, 120ms ease),
    border-color var(--transition-fast, 120ms ease);
}

.auth-network-error__action:hover:not(:disabled) {
  background-color: #fef3c7;
  border-color: #d97706;
}

.auth-network-error__action:focus-visible {
  outline: 2px solid #d97706;
  outline-offset: 1px;
}

.auth-network-error__action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-network-error__spinner {
  width: 10px;
  height: 10px;
  border: 1.5px solid #fde68a;
  border-top-color: #b45309;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
