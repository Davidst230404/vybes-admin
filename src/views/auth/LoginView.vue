<template>
  <div class="min-h-screen flex w-full bg-[#F7F5F0]">
    <!-- Left Photographic Brand Panel (~43% width on desktop) -->
    <AuthBrandPanel />

    <!-- Right Authentication Panel -->
    <main
      class="flex-1 flex flex-col justify-between items-center min-h-screen p-6 sm:p-10 lg:p-12 overflow-y-auto"
      role="main"
    >
      <!-- Top Spacer / Mobile Header -->
      <div class="w-full max-w-[420px] flex items-center justify-between lg:hidden mb-6">
        <div class="flex flex-col">
          <span class="font-serif text-xl font-bold tracking-wider text-neutral-950">
            VYBES
          </span>
          <span class="text-[9px] font-semibold tracking-widest text-neutral-500 uppercase">
            ADMIN
          </span>
        </div>
      </div>

      <!-- Center Auth Form Container -->
      <div class="w-full max-w-[420px] my-auto py-6">
        <!-- Eyebrow & Headers -->
        <div class="mb-7">
          <span
            class="block text-[11px] font-semibold tracking-[0.16em] text-neutral-500 uppercase mb-2"
          >
            ADMIN ACCESS
          </span>
          <h1
            class="text-[26px] sm:text-[28px] font-bold text-neutral-950 tracking-tight leading-tight mb-2"
          >
            Sign in to VYBES Admin
          </h1>
          <p class="text-sm text-neutral-600 font-normal leading-normal">
            Manage the VYBES platform from the admin console.
          </p>
        </div>

        <!-- Network Error Banner (Screen 07) -->
        <div
          v-if="isNetworkError"
          class="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5 shadow-xs"
          role="alert"
        >
          <svg
            class="w-4 h-4 text-red-600 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div class="flex-1">
            <p class="font-semibold text-red-800 text-[11px]">
              Connection Error
            </p>
            <p class="text-red-700 text-[11px] mt-0.5">
              Unable to reach the server. Please check your network connection and try again.
            </p>
            <button
              type="button"
              @click="handleSubmit"
              :disabled="isLoading"
              class="mt-2 text-[11px] font-semibold text-red-800 hover:text-red-950 underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        </div>

        <!-- Invalid Credentials Banner (Screen 04) -->
        <div
          v-else-if="generalError"
          class="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2.5 shadow-xs"
          role="alert"
        >
          <svg
            class="w-4 h-4 text-red-600 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="font-medium text-[11px] text-red-800 leading-tight">
            {{ generalError }}
          </span>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
          <!-- Email field -->
          <div>
            <label
              for="admin-email"
              class="block text-xs font-semibold text-neutral-800 mb-1.5"
            >
              Email address
            </label>
            <input
              id="admin-email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              :disabled="isLoading"
              :aria-invalid="Boolean(fieldErrors.email)"
              :aria-describedby="fieldErrors.email ? 'email-error' : undefined"
              class="w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#F25C05]/30 focus:border-[#F25C05] transition-all disabled:bg-neutral-100 disabled:opacity-60 shadow-xs"
              :class="
                fieldErrors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-[#E5E3DF] hover:border-neutral-300'
              "
              placeholder="Enter your email address"
              @input="clearFieldError('email')"
            />
            <p
              v-if="fieldErrors.email"
              id="email-error"
              class="mt-1.5 text-xs text-red-600 flex items-center gap-1"
            >
              <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ fieldErrors.email }}</span>
            </p>
          </div>

          <!-- Password field -->
          <div>
            <label
              for="admin-password"
              class="block text-xs font-semibold text-neutral-800 mb-1.5"
            >
              Password
            </label>
            <div class="relative">
              <input
                id="admin-password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                :disabled="isLoading"
                :aria-invalid="Boolean(fieldErrors.password)"
                :aria-describedby="fieldErrors.password ? 'password-error' : undefined"
                class="w-full px-3.5 py-2.5 pr-10 bg-white border rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#F25C05]/30 focus:border-[#F25C05] transition-all disabled:bg-neutral-100 disabled:opacity-60 shadow-xs"
                :class="
                  fieldErrors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-[#E5E3DF] hover:border-neutral-300'
                "
                placeholder="Enter your password"
                @input="clearFieldError('password')"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <!-- Eye Off Icon (Masked) -->
                <svg
                  v-if="!showPassword"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <!-- Eye Open Icon (Visible) -->
                <svg
                  v-else
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              </button>
            </div>
            <p
              v-if="fieldErrors.password"
              id="password-error"
              class="mt-1.5 text-xs text-red-600 flex items-center gap-1"
            >
              <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ fieldErrors.password }}</span>
            </p>
          </div>

          <!-- Controls row: Remember this device & Forgot password -->
          <div class="flex items-center justify-between pt-0.5">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                v-model="rememberDevice"
                class="w-4 h-4 rounded text-[#D9532F] focus:ring-[#F25C05] border-neutral-300 accent-[#D9532F]"
              />
              <span class="text-xs text-neutral-600 font-normal">
                Remember this device
              </span>
            </label>
            <router-link
              to="/auth/forgot-password"
              class="text-xs font-medium text-[#D9532F] hover:text-[#B83E12] transition-colors"
            >
              Forgot password?
            </router-link>
          </div>

          <!-- Primary Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-2.5 sm:py-3 px-4 bg-[#D9532F] hover:bg-[#C84818] active:bg-[#B83E12] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-xs flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#F25C05]/40 focus:ring-offset-2"
            >
              <svg
                v-if="isLoading"
                class="animate-spin -ml-1 mr-1 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
            </button>
          </div>

          <!-- OR Divider -->
          <div class="relative flex items-center justify-center py-2">
            <div class="grow border-t border-[#E5E3DF]"></div>
            <span class="px-3 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
              OR
            </span>
            <div class="grow border-t border-[#E5E3DF]"></div>
          </div>

          <!-- Continue with Google Button -->
          <GoogleLoginButton />
        </form>

        <!-- Access Note -->
        <p class="mt-6 text-center text-xs text-neutral-400 font-normal">
          Administrator access only.
        </p>

        <!-- Subtle Separator -->
        <div class="border-t border-[#E5E3DF] my-5"></div>

        <!-- Footer -->
        <p class="text-center text-xs text-neutral-400 font-normal">
          VYBES Admin - Administration Console
        </p>
      </div>

      <!-- Bottom Spacer for Perfect Centering -->
      <div class="hidden lg:block h-2"></div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import AuthBrandPanel from '../../components/auth/AuthBrandPanel.vue'
import GoogleLoginButton from '../../components/auth/GoogleLoginButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const rememberDevice = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const generalError = ref('')
const isNetworkError = ref(false)
const fieldErrors = reactive({
  email: '',
  password: '',
})

const REMEMBERED_EMAIL_KEY = 'vybes_admin_remembered_email'

onMounted(() => {
  const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY)
  if (savedEmail) {
    form.email = savedEmail
    rememberDevice.value = true
  }
})

function clearFieldError(field) {
  fieldErrors[field] = ''
  generalError.value = ''
  isNetworkError.value = false
}

function validateClient() {
  let isValid = true
  fieldErrors.email = ''
  fieldErrors.password = ''

  const emailTrimmed = form.email.trim()

  if (!emailTrimmed) {
    fieldErrors.email = 'Please enter your email address.'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
    fieldErrors.email = 'Please enter a valid email address.'
    isValid = false
  }

  if (!form.password) {
    fieldErrors.password = 'Password is required.'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (isLoading.value) return

  generalError.value = ''
  isNetworkError.value = false

  if (!validateClient()) {
    return
  }

  isLoading.value = true

  try {
    const { user } = await authStore.login({
      email: form.email.trim(),
      password: form.password,
    })

    // Handle "Remember this device" UI preference
    if (rememberDevice.value) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, form.email.trim())
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY)
    }

    // Role-based authorization check
    const roleName = user?.role?.name || ''
    const permissions = Array.isArray(user?.role?.permissions)
      ? user.role.permissions.map((p) => p.name)
      : []

    const isAdmin = roleName === 'admin' || permissions.includes('admin.manage')

    if (!isAdmin) {
      // Authenticated non-admin -> Route to Access Denied screen (Screen 08)
      router.push('/auth/access-denied')
      return
    }

    const redirectPath = route.query.redirect || '/admin/dashboard'
    router.push(redirectPath)
  } catch (error) {
    if (error.isNetworkError || error.status === 0) {
      isNetworkError.value = true
    } else if (error.isValidationError) {
      const errors = error.errors || {}
      if (errors.email) {
        fieldErrors.email = Array.isArray(errors.email) ? errors.email[0] : errors.email
        // If it's the backend's "The provided credentials are incorrect." message
        if (fieldErrors.email.toLowerCase().includes('credentials are incorrect')) {
          generalError.value = 'Invalid email or password. Please try again.'
        }
      }
      if (errors.password) {
        fieldErrors.password = Array.isArray(errors.password) ? errors.password[0] : errors.password
      }
      if (!fieldErrors.email && !fieldErrors.password) {
        generalError.value = error.message || 'Validation failed. Please check your credentials.'
      }
    } else {
      generalError.value = error.message || 'Invalid email or password. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
