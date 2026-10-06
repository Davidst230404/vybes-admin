<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label
    :for="id"
    class="auth-checkbox"
    :class="{
      'auth-checkbox--checked': modelValue,
      'auth-checkbox--disabled': disabled,
    }"
  >
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="auth-checkbox__native"
      @change="$emit('update:modelValue', $event.target.checked)"
    />

    <span class="auth-checkbox__box" aria-hidden="true">
      <svg
        v-if="modelValue"
        class="auth-checkbox__icon"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.5 6.2L4.8 8.5L9.5 3.5"
          stroke="#ffffff"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>

    <span v-if="label" class="auth-checkbox__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.auth-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-family: var(--font-family);
  font-size: 12px;
  color: var(--color-text-secondary, #77736c);
}

.auth-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.auth-checkbox__native {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.auth-checkbox__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border: 1px solid #dcd8d0;
  border-radius: 3px;
  background-color: #ffffff;
  transition:
    background-color var(--transition-fast, 120ms ease),
    border-color var(--transition-fast, 120ms ease);
  flex-shrink: 0;
}

.auth-checkbox__native:focus-visible + .auth-checkbox__box {
  outline: 2px solid var(--color-primary, #e87c3e);
  outline-offset: 2px;
}

.auth-checkbox--checked .auth-checkbox__box {
  background-color: var(--color-primary, #e87c3e);
  border-color: var(--color-primary, #e87c3e);
}

.auth-checkbox__icon {
  width: 10px;
  height: 10px;
}

.auth-checkbox__label {
  line-height: 1.2;
}
</style>
