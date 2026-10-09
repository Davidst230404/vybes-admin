<template>
  <div class="min-h-screen flex w-full bg-[#F7F5F0]">
    <!-- Left Photographic Brand Panel -->
    <AuthBrandPanel />

    <!-- Right Content Panel -->
    <main
      class="flex-1 flex flex-col justify-between items-center min-h-screen p-6 sm:p-10 lg:p-12 overflow-y-auto"
      role="main"
    >
      <!-- Mobile Header -->
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

      <!-- Center Content Container -->
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
            Session expired
          </h1>
          <p class="text-sm text-neutral-600 font-normal leading-normal">
            Your session has expired. Please sign in again to continue.
          </p>
        </div>

        <!-- General Error Alert -->
        <div
          v-if="errorMessage"
          class="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2.5 shadow-xs"
          role="alert"
        >
          <svg class="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium text-[11px] text-red-800 leading-tight">
            {{ errorMessage }}
          </span>
        </div>

        <!-- Direct Re-Authentication Form -->
        <form @submit.prevent="handleReauth" class="space-y-4" novalidate>
          <!-- Email field -->
          <div>
            <label
              for="session-email"
              class="block text-xs font-semibold text-neutral-800 mb-1.5"
            >
              Email address
            </label>
            <input
              id="session-email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              :disabled="isLoading"
              class="w-full px-3.5 py-2.5 bg-white border border-[#E5E3DF] rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#F25C05]/30 focus:border-[#F25C05] transition-all shadow-xs"
              placeholder="Enter your email address"
            />
          </div>

          <!-- Password field -->
          <div>
            <label
              for="session-password"
              class="block text-xs font-semibold text-neutral-800 mb-1.5"
            >
              Password
            </label>
            <div class="relative">
              <input
                id="session-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                :disabled="isLoading"
                class="w-full px-3.5 py-2.5 pr-10 bg-white border border-[#E5E3DF] rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#F25C05]/30 focus:border-[#F25C05] transition-all shadow-xs"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <svg
                  v-if="!showPassword"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg
                  v-else
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Controls row -->
          <div class="flex items-center justify-between pt-0.5">
            <span class="text-xs text-neutral-500">
              Session timed out for security
            </span>
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
              class="w-full py-2.5 sm:py-3 px-4 bg-[#D9532F] hover:bg-[#C84818] active:bg-[#B83E12] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-xs flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#F25C05]/40"
            >
              <svg
                v-if="isLoading"
                class="animate-spin -ml-1 mr-1 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? 'Signing in...' : 'Sign in again' }}</span>
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

      <!-- Bottom Spacer -->
      <div class="hidden lg:block h-2"></div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import AuthBrandPanel from '../../components/auth/AuthBrandPanel.vue'
import GoogleLoginButton from '../../components/auth/GoogleLoginButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

onMounted(() => {
  const remembered = localStorage.getItem('vybes_admin_remembered_email')
  if (remembered) {
    email.value = remembered
  }
})

async function handleReauth() {
  if (isLoading.value) return
  if (!email.value || !password.value) {
    errorMessage.value = 'Please provide both email and password.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const { user } = await authStore.login({
      email: email.value.trim(),
      password: password.value,
    })

    const roleName = user?.role?.name || ''
    const permissions = Array.isArray(user?.role?.permissions)
      ? user.role.permissions.map((p) => p.name)
      : []

    const isAdmin = roleName === 'admin' || permissions.includes('admin.manage')

    if (!isAdmin) {
      router.push('/auth/access-denied')
      return
    }

    const redirectPath = route.query.redirect || '/admin/dashboard'
    router.push(redirectPath)
  } catch (error) {
    errorMessage.value = error.message || 'Invalid email or password. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
