<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  to: {
    type: [String, Object],
    default: null,
  },
  href: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'secondary', // 'primary' | 'secondary' | 'muted'
  },
})

defineEmits(['click'])

const isRouterLink = computed(() => !!props.to)
</script>

<template>
  <component
    :is="isRouterLink ? RouterLink : 'a'"
    :to="to"
    :href="href || (disabled ? undefined : '#')"
    class="auth-link"
    :class="[
      `auth-link--${variant}`,
      { 'auth-link--disabled': disabled },
    ]"
    :tabindex="disabled ? -1 : undefined"
    @click="$emit('click', $event)"
  >
    <slot />
  </component>
</template>

<style scoped>
.auth-link {
  font-family: var(--font-family);
  font-size: 13px;
  line-height: 1.4;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  transition:
    color var(--transition-fast, 120ms ease),
    text-decoration-color var(--transition-fast, 120ms ease);
}

.auth-link--secondary {
  color: var(--color-text-secondary, #77736c);
}

.auth-link--secondary:hover:not(.auth-link--disabled) {
  color: var(--color-text-primary, #111111);
  text-decoration: underline;
}

.auth-link--primary {
  color: var(--color-primary, #e87c3e);
  font-weight: 500;
}

.auth-link--primary:hover:not(.auth-link--disabled) {
  color: var(--color-primary-hover, #d46a2e);
  text-decoration: underline;
}

.auth-link--muted {
  font-size: 12px;
  color: var(--color-text-tertiary, #9ca3af);
}

.auth-link--muted:hover:not(.auth-link--disabled) {
  color: var(--color-text-secondary, #77736c);
  text-decoration: underline;
}

.auth-link:focus-visible {
  outline: 2px solid var(--color-primary, #e87c3e);
  outline-offset: 2px;
  border-radius: var(--radius-xs, 2px);
}

.auth-link--disabled {
  color: var(--color-text-disabled, #c4c1ba);
  cursor: not-allowed;
  pointer-events: none;
}
</style>
