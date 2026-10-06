<script setup>
defineProps({
  id: { type: String, required: true },
  variant: {
    type: String,
    default: 'error',
    validator: (v) => ['error', 'info', 'warning'].includes(v),
  },
  message: { type: String, required: true },
  dismissible: { type: Boolean, default: false },
})

defineEmits(['dismiss', 'action'])

const slots = defineSlots()
</script>

<template>
  <div
    :id="id"
    class="base-alert"
    :class="`base-alert--${variant}`"
    role="alert"
  >
    <p class="base-alert__message">{{ message }}</p>
    <div v-if="slots.action" class="base-alert__actions">
      <slot name="action" />
    </div>
    <button
      v-if="dismissible"
      class="base-alert__dismiss"
      aria-label="Dismiss"
      type="button"
      @click="$emit('dismiss')"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.base-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border: 1px solid;
  border-radius: var(--radius-sm);
  font-size: 13px;
  line-height: 1.5;
}

.base-alert--error {
  background: var(--color-bg-error);
  border-color: var(--color-border-error);
  color: var(--color-text-error);
}

.base-alert--info {
  background: var(--color-bg-info);
  border-color: #bfdbfe;
  color: var(--color-text-info);
}

.base-alert--warning {
  background: var(--color-bg-warning);
  border-color: #fde68a;
  color: #92400e;
}

.base-alert__message {
  flex: 1;
  margin: 0;
}

.base-alert__actions {
  flex-shrink: 0;
}

.base-alert__dismiss {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  color: currentColor;
  opacity: 0.6;
  cursor: pointer;
  border-radius: 2px;
  transition: opacity var(--transition-fast);
}

.base-alert__dismiss:hover {
  opacity: 1;
}

.base-alert__dismiss:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 1px;
}
</style>
