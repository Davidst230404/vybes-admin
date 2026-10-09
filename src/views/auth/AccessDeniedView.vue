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
            Access denied
          </h1>
          <p class="text-sm text-neutral-600 font-normal leading-normal">
            Your account does not have permission to access the admin console.
          </p>
        </div>

        <!-- Account Context Box (if signed in) -->
        <div
          v-if="authStore.user"
          class="mb-6 p-4 rounded-lg bg-white border border-[#E5E3DF] text-xs text-neutral-700 shadow-xs space-y-1.5"
        >
          <div class="flex items-center justify-between">
            <span class="text-neutral-500">Signed in as:</span>
            <span class="font-semibold text-neutral-900">{{ authStore.user.name }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-neutral-500">Email:</span>
            <span class="font-medium text-neutral-800">{{ authStore.user.email }}</span>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-neutral-100">
            <span class="text-neutral-500">Current Role:</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
              {{ authStore.user.role?.display_name || authStore.user.role?.name || 'Customer' }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <button
            type="button"
            @click="handleSignOut"
            :disabled="isLoggingOut"
            class="w-full py-2.5 sm:py-3 px-4 bg-[#D9532F] hover:bg-[#C84818] active:bg-[#B83E12] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-xs flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#F25C05]/40"
          >
            <svg
              v-if="isLoggingOut"
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
            <span>{{ isLoggingOut ? 'Signing out...' : 'Back to login' }}</span>
          </button>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import AuthBrandPanel from '../../components/auth/AuthBrandPanel.vue'

const router = useRouter()
const authStore = useAuthStore()
const isLoggingOut = ref(false)

async function handleSignOut() {
  if (isLoggingOut.value) return
  isLoggingOut.value = true
  try {
    await authStore.logout()
  } catch {
    authStore.clearAuth()
  } finally {
    isLoggingOut.value = false
    router.push('/auth/login')
  }
}
</script>
