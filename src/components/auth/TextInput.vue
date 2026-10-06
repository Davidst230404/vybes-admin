<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
})

defineEmits(['update:modelValue', 'blur', 'focus'])
</script>

<template>
  <div
    class="auth-field"
    :class="{
      'auth-field--error': !!error,
      'auth-field--disabled': disabled,
      'auth-field--filled': modelValue !== '' && modelValue !== null && modelValue !== undefined,
    }"
  >
    <label v-if="label" :for="id" class="auth-field__label">
      {{ label }}
    </label>

    <div class="auth-field__input-wrap">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        class="auth-field__input"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      <slot name="trailing" />
    </div>

    <!-- Error message inline directly below input -->
    <p v-if="error" :id="`${id}-error`" class="auth-field__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  text-align: left;
}

.auth-field__label {
  font-family: var(--font-family);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary, #111111);
  line-height: 1.4;
  user-select: none;
}

.auth-field__input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.auth-field__input {
  width: 100%;
  height: 44px;
  padding: 0 13px;
  font-family: var(--font-family);
  font-size: 12.5px;
  color: var(--color-text-primary, #111111);
  background-color: #ffffff;
  border: 1px solid #dcd8d0;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  transition:
    border-color var(--transition-fast, 120ms ease),
    box-shadow var(--transition-fast, 120ms ease),
    background-color var(--transition-fast, 120ms ease);
}

.auth-field__input::placeholder {
  color: #a3a099;
  font-size: 12.5px;
}

/* Focus State */
.auth-field__input:focus {
  border-color: var(--color-primary, #d85d38);
  box-shadow: 0 0 0 2px rgba(216, 93, 56, 0.12);
}

/* Error State */
.auth-field--error .auth-field__input {
  border-color: var(--color-border-error, #fca5a5);
}

.auth-field--error .auth-field__input:focus {
  border-color: var(--color-text-error, #dc2626);
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.12);
}

.auth-field__error {
  margin: 0;
  font-family: var(--font-family);
  font-size: 12px;
  line-height: 1.35;
  color: var(--color-text-error, #dc2626);
}

/* Disabled State */
.auth-field--disabled .auth-field__label {
  color: var(--color-text-tertiary, #9ca3af);
}

.auth-field--disabled .auth-field__input {
  background-color: #f2efe9;
  border-color: #e5e2dc;
  color: var(--color-text-disabled, #c4c1ba);
  cursor: not-allowed;
}
</style>
