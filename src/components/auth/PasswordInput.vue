<script setup>
import { ref } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: 'Password',
  },
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Enter your password',
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
    default: 'current-password',
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const showPassword = ref(false)

const toggleVisibility = () => {
  if (props.disabled) return
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div
    class="auth-field"
    :class="{
      'auth-field--error': !!error,
      'auth-field--disabled': disabled,
      'auth-field--filled': modelValue !== '',
    }"
  >
    <label v-if="label" :for="id" class="auth-field__label">
      {{ label }}
    </label>

    <div class="auth-field__input-wrap">
      <input
        :id="id"
        :type="showPassword ? 'text' : 'password'"
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

      <button
        type="button"
        class="auth-field__toggle"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        :disabled="disabled"
        tabindex="-1"
        @click="toggleVisibility"
      >
        <!-- Eye Off Icon (visible when showPassword is true) -->
        <svg
          v-if="showPassword"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="auth-field__eye-icon"
          aria-hidden="true"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>

        <!-- Eye Icon (visible when password is hidden) -->
        <svg
          v-else
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="auth-field__eye-icon"
          aria-hidden="true"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
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
  padding: 0 40px 0 13px;
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

/* Subtle eye toggle button inside input */
.auth-field__toggle {
  position: absolute;
  right: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  background: transparent;
  border: none;
  color: var(--color-text-secondary, #77736c);
  cursor: pointer;
  border-radius: var(--radius-xs, 2px);
  transition: color var(--transition-fast, 120ms ease);
}

.auth-field__toggle:hover:not(:disabled) {
  color: var(--color-text-primary, #111111);
}

.auth-field__toggle:focus-visible {
  outline: 2px solid var(--color-primary, #e87c3e);
  outline-offset: 1px;
}

.auth-field__eye-icon {
  width: 16px;
  height: 16px;
  display: block;
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

.auth-field--disabled .auth-field__toggle {
  cursor: not-allowed;
  opacity: 0.4;
}
</style>
