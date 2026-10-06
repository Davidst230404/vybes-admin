<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  autocomplete: { type: String, default: '' },
  required: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="base-input" :class="{ 'base-input--error': error, 'base-input--disabled': disabled }">
    <label
      v-if="label"
      :for="id"
      class="base-input__label"
    >
      {{ label }}
    </label>
    <div class="base-input__wrapper">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :required="required"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        class="base-input__field"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <slot name="append" />
    </div>
    <p
      v-if="error"
      :id="`${id}-error`"
      class="base-input__error"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.base-input__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.4;
  user-select: none;
}

.base-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input__field {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  font-family: var(--font-family);
  font-size: 14px;
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.base-input__wrapper:has(button) .base-input__field {
  padding-right: 44px;
}

.base-input__field::placeholder {
  color: var(--color-text-tertiary);
}

.base-input__field:focus {
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 2px rgba(232, 124, 62, 0.12);
}

.base-input__field:disabled {
  background: var(--color-bg-page);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
}

.base-input--error .base-input__field {
  border-color: var(--color-text-error);
}

.base-input--error .base-input__field:focus {
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1);
}

.base-input__error {
  font-size: 12px;
  color: var(--color-text-error);
  line-height: 1.4;
  margin: 0;
}
</style>
