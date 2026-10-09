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
        <!-- STATE 1: Forgot Password Form (Screen 10) -->
        <div v-if="!isSubmitted">
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
              Reset your password
            </h1>
            <p class="text-sm text-neutral-600 font-normal leading-normal">
              Enter your admin email and we'll send you instructions to reset your password.
            </p>
          </div>

          <!-- Backend Capability Notice (Section 4.10) -->
          <div
            class="mb-5 p-3 rounded-lg bg-neutral-100 border border-[#E5E3DF] text-neutral-700 text-xs flex items-start gap-2 shadow-xs"
          >
            <svg
              class="w-4 h-4 text-neutral-500 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="flex-1">
              <span class="font-medium text-[11px] text-neutral-800">
                Self-service password reset is disabled.
              </span>
              <p class="text-[11px] text-neutral-600 mt-0.5">
                Automated SMTP mail delivery is currently unconfigured. Platform administrators must contact system operations to update credentials.
              </p>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
            <!-- Email field -->
            <div>
              <label
                for="reset-email"
                class="block text-xs font-semibold text-neutral-800 mb-1.5"
              >
                Email address
              </label>
              <input
                id="reset-email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                :disabled="isLoading"
                class="w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#F25C05]/30 focus:border-[#F25C05] transition-all shadow-xs"
                :class="
                  emailError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-[#E5E3DF] hover:border-neutral-300'
                "
                placeholder="Enter your email address"
                @input="emailError = ''"
              />
              <p v-if="emailError" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ emailError }}</span>
              </p>
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full py-2.5 sm:py-3 px-4 bg-[#D9532F] hover:bg-[#C84818] active:bg-[#B83E12] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-xs flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#F25C05]/40"
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
                <span>{{ isLoading ? 'Submitting request...' : 'Send reset link' }}</span>
              </button>
            </div>

            <!-- Return link -->
            <div class="text-center pt-2">
              <router-link
                to="/auth/login"
                class="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Back to sign in
              </router-link>
            </div>
          </form>
        </div>

        <!-- STATE 2: Submitted / Confirmation (Screen 11) -->
        <div v-else class="text-left">
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
              Check your email
            </h1>
            <p class="text-sm text-neutral-600 font-normal leading-normal">
              If an admin account exists for <span class="font-medium text-neutral-900">{{ email }}</span>, a password reset link has been dispatched.
            </p>
          </div>

          <div class="space-y-4">
            <router-link
              to="/auth/login"
              class="w-full py-2.5 sm:py-3 px-4 bg-[#D9532F] hover:bg-[#C84818] active:bg-[#B83E12] text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-xs flex items-center justify-center text-center"
            >
              Back to sign in
            </router-link>
          </div>
        </div>

        <!-- Access Note -->
        <p class="mt-8 text-center text-xs text-neutral-400 font-normal">
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
import { ref } from 'vue'
import AuthBrandPanel from '../../components/auth/AuthBrandPanel.vue'

const email = ref('')
const emailError = ref('')
const isLoading = ref(false)
const isSubmitted = ref(false)

function handleSubmit() {
  if (isLoading.value) return

  emailError.value = ''
  const trimmed = email.value.trim()

  if (!trimmed) {
    emailError.value = 'Please enter your email address.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    emailError.value = 'Please enter a valid email address.'
    return
  }

  isLoading.value = true

  // Simulate network dispatch and transition to Figma Screen 11
  setTimeout(() => {
    isLoading.value = false
    isSubmitted.value = true
  }, 400)
}
</script>
