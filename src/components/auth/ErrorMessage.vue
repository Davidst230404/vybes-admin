<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div v-if="message" class="auth-error-msg" role="alert">
    <!-- Subtle warning/error icon -->
    <svg
      class="auth-error-msg__icon"
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.4" />
      <line x1="8" y1="4.5" x2="8" y2="8.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
      <circle cx="8" cy="11.25" r="0.75" fill="currentColor" />
    </svg>

    <span class="auth-error-msg__text">{{ message }}</span>
  </div>
</template>

<style scoped>
.auth-error-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: var(--color-bg-error, #fef2f2);
  border: 1px solid var(--color-border-error, #fca5a5);
  border-radius: var(--radius-sm, 4px);
  color: var(--color-text-error, #dc2626);
  font-family: var(--font-family);
  font-size: 12px;
  line-height: 1.4;
  box-sizing: border-box;
}

.auth-error-msg__icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

.auth-error-msg__text {
  flex: 1;
}
</style>
