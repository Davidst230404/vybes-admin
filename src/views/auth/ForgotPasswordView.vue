<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AuthShell,
  AuthForm,
  TextInput,
  PrimaryButton,
  AuthLink,
} from '../../components/auth'
import StateSwitcher from '../../components/auth/StateSwitcher.vue'

const route = useRoute()
const router = useRouter()

const isSubmitted = ref(route.query.state === '11-forgot-password-submitted')
const email = ref('')
const emailError = ref('')
const isLoading = ref(false)
const resendNotice = ref('')

watch(
  () => route.query.state,
  (newState) => {
    if (newState === '11-forgot-password-submitted') {
      isSubmitted.value = true
    } else {
      isSubmitted.value = false
    }
  }
)

const validateEmail = (val) => {
  if (!val || !val.trim()) {
    return 'Email address is required.'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(val.trim())) {
    return 'Please enter a valid email address.'
  }
  return ''
}

const handleSubmit = () => {
  emailError.value = validateEmail(email.value)
  if (emailError.value) return

  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    isSubmitted.value = true
    router.replace({ query: { ...route.query, state: '11-forgot-password-submitted' } })
  }, 700)
}

const handleResend = () => {
  resendNotice.value = 'A new reset link has been dispatched.'
  setTimeout(() => {
    resendNotice.value = ''
  }, 4000)
}
</script>

<template>
  <AuthShell>
    <!-- SCREEN 11: FORGOT PASSWORD / SUBMITTED -->
    <template v-if="isSubmitted">
      <AuthForm
        title="Check your email"
        description="If an account exists for this email address, we've sent instructions to reset your password."
      >
        <div class="forgot-submitted__actions">
          <p v-if="resendNotice" class="forgot-submitted__notice" role="status">
            {{ resendNotice }}
          </p>

          <PrimaryButton
            id="forgot-back-btn"
            type="button"
            @click="router.push('/login')"
          >
            Back to sign in
          </PrimaryButton>

          <div class="forgot-submitted__secondary">
            <span class="forgot-submitted__text">Didn't receive the email?</span>
            <button
              type="button"
              class="forgot-submitted__resend-btn"
              @click="handleResend"
            >
              Resend
            </button>
          </div>
        </div>
      </AuthForm>

      <StateSwitcher current="11-forgot-password-submitted" />
    </template>

    <!-- SCREEN 10: FORGOT PASSWORD / FORM -->
    <template v-else>
      <AuthForm
        title="Reset your password"
        description="Enter your email address and we'll send you a link to reset your password."
        @submit="handleSubmit"
      >
        <TextInput
          id="forgot-email"
          label="Email address"
          type="email"
          v-model="email"
          placeholder="Enter your email address"
          :error="emailError"
          :disabled="isLoading"
          autocomplete="email"
          required
        />

        <div class="forgot-form__actions">
          <PrimaryButton
            id="forgot-submit-btn"
            type="submit"
            :loading="isLoading"
            loading-text="Sending..."
          >
            Send reset link
          </PrimaryButton>

          <div class="forgot-form__back">
            <AuthLink to="/login" variant="secondary">
              Back to sign in
            </AuthLink>
          </div>
        </div>
      </AuthForm>

      <StateSwitcher current="10-forgot-password" />
    </template>
  </AuthShell>
</template>

<style scoped>
.forgot-form__actions,
.forgot-submitted__actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.forgot-form__back {
  display: flex;
  justify-content: center;
  text-align: center;
}

.forgot-submitted__secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: var(--font-family);
  font-size: 13px;
  color: var(--color-text-secondary, #77736c);
}

.forgot-submitted__text {
  color: var(--color-text-secondary, #77736c);
}

.forgot-submitted__resend-btn {
  background: none;
  border: none;
  padding: 0;
  font-family: var(--font-family);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary, #e87c3e);
  cursor: pointer;
  text-decoration: none;
  transition: color var(--transition-fast, 120ms ease);
}

.forgot-submitted__resend-btn:hover {
  color: var(--color-primary-hover, #d46a2e);
  text-decoration: underline;
}

.forgot-submitted__notice {
  margin: 0;
  padding: 8px 12px;
  background-color: var(--color-bg-success, #f0fdf4);
  border: 1px solid var(--color-border-success, #86efac);
  border-radius: var(--radius-sm, 4px);
  color: var(--color-text-success, #16a34a);
  font-size: 12px;
  text-align: center;
}
</style>
