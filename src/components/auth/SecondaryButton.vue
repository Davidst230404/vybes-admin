<script setup>
defineProps({
  id: {
    type: String,
    default: undefined,
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>

<template>
  <button
    :id="id"
    :type="type"
    :disabled="disabled"
    class="auth-secondary-btn"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.auth-secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 46px;
  padding: 0 16px;
  font-family: var(--font-family);
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  color: var(--color-text-primary, #111111);
  background-color: transparent;
  border: 1px solid var(--color-border, #dddad3);
  border-radius: var(--radius-md, 6px);
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
  user-select: none;
  transition:
    background-color var(--transition-fast, 120ms ease),
    border-color var(--transition-fast, 120ms ease),
    color var(--transition-fast, 120ms ease);
}

.auth-secondary-btn:hover:not(:disabled) {
  background-color: #f2efe9;
  border-color: #c4c1ba;
}

.auth-secondary-btn:focus-visible {
  outline: 2px solid var(--color-primary, #e87c3e);
  outline-offset: 2px;
}

.auth-secondary-btn:disabled {
  color: var(--color-text-disabled, #c4c1ba);
  border-color: #eae8e3;
  cursor: not-allowed;
}
</style>
