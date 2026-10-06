<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AuthShell,
  AuthForm,
  TextInput,
  PasswordInput,
  Checkbox,
  PrimaryButton,
  GoogleButton,
  ErrorMessage,
  NetworkError,
  AuthLink,
} from '../../components/auth'
import StateSwitcher from '../../components/auth/StateSwitcher.vue'

const route = useRoute()
const router = useRouter()

// Form reactive state
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

// Errors
const emailError = ref('')
const passwordError = ref('')
const authError = ref('')
const networkErrorVisible = ref(false)
const networkErrorRetrying = ref(false)

// Loading flags
const isSubmitting = ref(false)
const isGoogleLoading = ref(false)
const forgotEmail = ref('')
const forgotEmailError = ref('')
const resendNotice = ref('')

// Read ?state= from URL to sync with Figma test states
const currentState = computed(() => {
  return (route.query.state || '01-default').toString()
})

// Apply preset states based on query parameter
const applyStatePreset = (stateName) => {
  // Clear previous transient states
  emailError.value = ''
  passwordError.value = ''
  authError.value = ''
  networkErrorVisible.value = false
  isSubmitting.value = false
  isGoogleLoading.value = false
  resendNotice.value = ''
  forgotEmailError.value = ''

  switch (stateName) {
    case '01-default':
      email.value = ''
      password.value = ''
      rememberMe.value = false
      break

    case '02-filled':
      email.value = 'admin@vybes.com'
      password.value = 'VybesSecure2026!'
      rememberMe.value = true
      break

    case '03-validation-error':
      email.value = 'admin@vybes'
      password.value = ''
      emailError.value = 'Please enter a valid email address.'
      passwordError.value = 'Password is required.'
      rememberMe.value = false
      break

    case '04-invalid-credentials':
      email.value = 'admin@vybes.com'
      password.value = 'WrongPassword999'
      rememberMe.value = true
      authError.value = 'Invalid email or password.'
      break

    case '05-loading':
      email.value = 'admin@vybes.com'
      password.value = 'VybesSecure2026!'
      rememberMe.value = true
      isSubmitting.value = true
      break

    case '06-google-loading':
      email.value = ''
      password.value = ''
      rememberMe.value = false
      isGoogleLoading.value = true
      break

    case '07-network-error':
      email.value = 'admin@vybes.com'
      password.value = 'VybesSecure2026!'
      rememberMe.value = true
      networkErrorVisible.value = true
      break

    case '08-access-denied':
      break

    case '09-session-expired':
      email.value = 'admin@vybes.com'
      password.value = ''
      break

    case '10-forgot-password':
      forgotEmail.value = ''
      break

    case '11-forgot-password-submitted':
      forgotEmail.value = 'admin@vybes.com'
      break

    default:
      email.value = ''
      password.value = ''
      rememberMe.value = false
      break
  }
}

onMounted(() => {
  applyStatePreset(currentState.value)
})

watch(
  () => route.query.state,
  (newVal) => {
    applyStatePreset(newVal || '01-default')
  }
)

// Validation helpers
const validateEmailFormat = (val) => {
  if (!val || !val.trim()) {
    return 'Please enter a valid email address.'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(val.trim())) {
    return 'Please enter a valid email address.'
  }
  return ''
}

// User Submission Handler (Interactive Login)
const handleSubmit = () => {
  authError.value = ''
  networkErrorVisible.value = false

  emailError.value = validateEmailFormat(email.value)
  if (!password.value) {
    passwordError.value = 'Password is required.'
  } else {
    passwordError.value = ''
  }

  if (emailError.value || passwordError.value) {
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false

    if (email.value.trim().toLowerCase() === 'admin@vybes.com' && password.value === 'admin123') {
      router.push('/')
    } else if (password.value === 'wrong') {
      authError.value = 'Invalid email or password.'
    } else if (password.value === 'network') {
      networkErrorVisible.value = true
    } else {
      authError.value = 'Invalid email or password.'
    }
  }, 900)
}

// Google Sign-In Handler
const handleGoogleSignIn = () => {
  if (isSubmitting.value || isGoogleLoading.value) return
  isGoogleLoading.value = true
  setTimeout(() => {
    isGoogleLoading.value = false
  }, 1400)
}

// Network retry handler
const handleNetworkRetry = () => {
  networkErrorRetrying.value = true
  setTimeout(() => {
    networkErrorRetrying.value = false
    networkErrorVisible.value = false
  }, 1000)
}

// Reset password submit handler
const handleForgotSubmit = () => {
  forgotEmailError.value = validateEmailFormat(forgotEmail.value)
  if (forgotEmailError.value) return

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    router.push({ query: { state: '11-forgot-password-submitted' } })
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
    <!-- SCREEN 08: ACCESS DENIED -->
    <template v-if="currentState === '08-access-denied'">
      <AuthForm
        eyebrow="SECURITY"
        title="Access denied"
        description="You don't have permission to access VYBES Admin."
      >
        <div class="auth-stack">
          <PrimaryButton
            id="access-denied-back-btn"
            type="button"
            @click="router.push({ query: { state: '01-default' } })"
          >
            Back to sign in
          </PrimaryButton>

          <div class="auth-center-link">
            <AuthLink
              variant="muted"
              href="mailto:support@vybes.com?subject=VYBES%20Admin%20Access%20Request"
            >
              Contact administrator
            </AuthLink>
          </div>
        </div>
      </AuthForm>
    </template>

    <!-- SCREEN 09: SESSION EXPIRED -->
    <template v-else-if="currentState === '09-session-expired'">
      <AuthForm
        eyebrow="SESSION STATUS"
        title="Session expired"
        description="Your session has expired for security reasons. Please sign in again to continue."
        @submit="handleSubmit"
      >
        <TextInput
          id="session-expired-email"
          label="Email address"
          type="email"
          v-model="email"
          placeholder="Enter your email address"
          disabled
        />

        <PasswordInput
          id="session-expired-password"
          label="Password"
          v-model="password"
          placeholder="Enter your password"
          :error="passwordError"
          :disabled="isSubmitting"
          autocomplete="current-password"
          required
        />

        <div class="auth-stack">
          <PrimaryButton
            id="session-expired-submit-btn"
            type="submit"
            :loading="isSubmitting"
            loading-text="Signing in..."
          >
            Sign in again
          </PrimaryButton>
        </div>
      </AuthForm>
    </template>

    <!-- SCREEN 10: FORGOT PASSWORD -->
    <template v-else-if="currentState === '10-forgot-password'">
      <AuthForm
        eyebrow="ACCOUNT RECOVERY"
        title="Reset your password"
        description="Enter your email address and we'll send you a link to reset your password."
        @submit="handleForgotSubmit"
      >
        <TextInput
          id="forgot-email"
          label="Email address"
          type="email"
          v-model="forgotEmail"
          placeholder="Enter your email address"
          :error="forgotEmailError"
          :disabled="isSubmitting"
          autocomplete="email"
          required
        />

        <div class="auth-stack">
          <PrimaryButton
            id="forgot-submit-btn"
            type="submit"
            :loading="isSubmitting"
            loading-text="Sending..."
          >
            Send reset link
          </PrimaryButton>

          <div class="auth-center-link">
            <AuthLink
              variant="secondary"
              @click="router.push({ query: { state: '01-default' } })"
            >
              Back to sign in
            </AuthLink>
          </div>
        </div>
      </AuthForm>
    </template>

    <!-- SCREEN 11: FORGOT PASSWORD / SUBMITTED -->
    <template v-else-if="currentState === '11-forgot-password-submitted'">
      <AuthForm
        eyebrow="CHECK INBOX"
        title="Check your email"
        description="If an account exists for this email address, we've sent instructions to reset your password."
      >
        <div class="auth-stack">
          <p v-if="resendNotice" class="forgot-resend-notice" role="status">
            {{ resendNotice }}
          </p>

          <PrimaryButton
            id="forgot-back-btn"
            type="button"
            @click="router.push({ query: { state: '01-default' } })"
          >
            Back to sign in
          </PrimaryButton>

          <div class="forgot-secondary-row">
            <span class="forgot-secondary-text">Didn't receive the email?</span>
            <button
              type="button"
              class="forgot-resend-btn"
              @click="handleResend"
            >
              Resend
            </button>
          </div>
        </div>
      </AuthForm>
    </template>

    <!-- SCREENS 01 - 07: LOGIN FORM STATES -->
    <template v-else>
      <AuthForm
        eyebrow="ADMIN ACCESS"
        title="Sign in to VYBES Admin"
        description="Manage the VYBES platform from the admin console."
        @submit="handleSubmit"
      >
        <!-- Network Error notification (Screen 07) -->
        <NetworkError
          v-if="networkErrorVisible"
          :loading="networkErrorRetrying"
          @retry="handleNetworkRetry"
        />

        <!-- Email Field -->
        <TextInput
          id="admin-email"
          label="Email address"
          type="email"
          v-model="email"
          placeholder="Enter your email address"
          :error="emailError"
          :disabled="isSubmitting || isGoogleLoading"
          autocomplete="email"
          required
          @focus="emailError = ''"
        />

        <!-- Password Field -->
        <PasswordInput
          id="admin-password"
          label="Password"
          v-model="password"
          placeholder="Enter your password"
          :error="passwordError"
          :disabled="isSubmitting || isGoogleLoading"
          autocomplete="current-password"
          required
          @focus="passwordError = ''"
        />

        <!-- Horizontal row: Remember this device & Forgot password link in orange -->
        <div class="login-options-row">
          <Checkbox
            id="admin-remember-me"
            v-model="rememberMe"
            label="Remember this device"
            :disabled="isSubmitting || isGoogleLoading"
          />

          <AuthLink
            to="/forgot-password"
            variant="primary"
            :disabled="isSubmitting || isGoogleLoading"
            class="login-forgot-link"
          >
            Forgot password?
          </AuthLink>
        </div>

        <!-- Authentication Error (Screen 04: Invalid credentials) -->
        <ErrorMessage
          v-if="authError"
          :message="authError"
        />

        <!-- Action Stack -->
        <div class="login-actions">
          <!-- Primary Button (Screen 01, 02, 05) -->
          <PrimaryButton
            id="admin-submit-btn"
            type="submit"
            :loading="isSubmitting"
            :disabled="isGoogleLoading"
            loading-text="Signing in..."
          >
            Sign In
          </PrimaryButton>

          <!-- Divider with OR -->
          <div class="login-divider" aria-hidden="true">
            <span class="login-divider__line"></span>
            <span class="login-divider__text">OR</span>
            <span class="login-divider__line"></span>
          </div>

          <!-- Continue with Google (Screen 01, 06) -->
          <GoogleButton
            id="admin-google-btn"
            :loading="isGoogleLoading"
            :disabled="isSubmitting"
            loading-text="Connecting to Google..."
            @click="handleGoogleSignIn"
          >
            Continue with Google
          </GoogleButton>

          <!-- Administrator access only note -->
          <p class="login-note">Administrator access only.</p>
        </div>

        <!-- Bottom metadata separator and footer -->
        <footer class="login-bottom-meta">
          <span>VYBES Admin · Administration Console</span>
        </footer>
      </AuthForm>
    </template>

    <!-- Figma Screen State Inspector Toolbar -->
    <StateSwitcher :current="currentState" />
  </AuthShell>
</template>

<style scoped>
.login-options-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: -2px;
}

.login-forgot-link {
  font-size: 12px;
  color: var(--color-primary, #d85d38);
  font-weight: 500;
}

.login-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 4px;
}

.login-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin: 2px 0;
}

.login-divider__line {
  flex: 1;
  height: 1px;
  background-color: #e4e1d9;
}

.login-divider__text {
  font-family: var(--font-family, 'DM Sans', sans-serif);
  font-size: 9.5px;
  font-weight: 500;
  color: #9c988f;
  letter-spacing: 0.5px;
}

.login-note {
  margin: 4px 0 0 0;
  font-family: var(--font-family, 'DM Sans', sans-serif);
  font-size: 11.5px;
  color: var(--color-text-secondary, #77736c);
  text-align: center;
}

.login-bottom-meta {
  margin-top: 32px;
  padding-top: 18px;
  border-top: 1px solid #ebe8e1;
  text-align: center;
  font-family: var(--font-family, 'DM Sans', sans-serif);
  font-size: 10.5px;
  color: #a3a099;
}

.auth-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.auth-center-link {
  display: flex;
  justify-content: center;
  text-align: center;
}

.forgot-secondary-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: var(--font-family);
  font-size: 12.5px;
}

.forgot-secondary-text {
  color: var(--color-text-secondary, #77736c);
}

.forgot-resend-btn {
  background: none;
  border: none;
  padding: 0;
  font-family: var(--font-family);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--color-primary, #d85d38);
  cursor: pointer;
  text-decoration: none;
  transition: color var(--transition-fast, 120ms ease);
}

.forgot-resend-btn:hover {
  color: var(--color-primary-hover, #c5512e);
  text-decoration: underline;
}

.forgot-resend-notice {
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
