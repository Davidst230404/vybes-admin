<script setup>
defineProps({
  id: { type: String, required: true },
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label
    :for="id"
    class="base-checkbox"
    :class="{ 'base-checkbox--disabled': disabled }"
  >
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="base-checkbox__input"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="base-checkbox__control" aria-hidden="true">
      <svg
        v-if="modelValue"
        class="base-checkbox__check"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.5 6L5 8.5L9.5 3.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span v-if="label" class="base-checkbox__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.base-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  user-select: none;
}

.base-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.base-checkbox__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.base-checkbox__control {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid var(--color-border);
  border-radius: 3px;
  background: var(--color-bg-surface);
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast);
  flex-shrink: 0;
}

.base-checkbox__input:checked + .base-checkbox__control {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.base-checkbox__input:focus-visible + .base-checkbox__control {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.base-checkbox__check {
  width: 10px;
  height: 10px;
}

.base-checkbox__label {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1;
}
</style>
