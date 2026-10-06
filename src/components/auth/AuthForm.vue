<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})

defineEmits(['submit'])
</script>

<template>
  <div class="auth-form-wrapper">
    <!-- Header -->
    <header class="auth-form__header">
      <span v-if="eyebrow" class="auth-form__eyebrow">{{ eyebrow }}</span>
      <h2 class="auth-form__title">{{ title }}</h2>
      <p v-if="description" class="auth-form__description">{{ description }}</p>
    </header>

    <!-- Form Content -->
    <form class="auth-form" @submit.prevent="$emit('submit', $event)" novalidate>
      <slot />
    </form>
  </div>
</template>

<style scoped>
.auth-form-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.auth-form__header {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-form__eyebrow {
  font-family: var(--font-family, 'DM Sans', sans-serif);
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--color-text-secondary, #77736c);
}

.auth-form__title {
  margin: 0;
  font-family: var(--font-family, 'DM Sans', sans-serif);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--color-text-primary, #111111);
  letter-spacing: -0.01em;
}

.auth-form__description {
  margin: 0;
  font-family: var(--font-family, 'DM Sans', sans-serif);
  font-size: 12.5px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-secondary, #77736c);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
</style>
