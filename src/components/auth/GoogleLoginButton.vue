<template>
  <div>
    <button
      type="button"
      :disabled="disabled || isLoading"
      @click="handleClick"
      class="group relative w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-neutral-50 active:bg-neutral-100 disabled:opacity-60 disabled:cursor-not-allowed border border-[#E5E3DF] hover:border-neutral-300 rounded-lg text-sm font-medium text-neutral-800 transition-all duration-150 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#F25C05]/30 focus:border-[#F25C05]"
      :aria-label="buttonLabel"
    >
      <!-- Loading spinner -->
      <svg
        v-if="isLoading"
        class="animate-spin -ml-1 mr-1 h-4 w-4 text-neutral-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
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

      <!-- Google Official Multi-Color "G" SVG -->
      <svg
        v-else
        class="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          fill="#EA4335"
        />
      </svg>

      <span class="truncate">
        {{ isLoading ? 'Connecting to Google...' : buttonLabel }}
      </span>
    </button>

    <!-- Google Unconfigured Notice Banner -->
    <div
      v-if="showUnconfiguredNotice"
      class="mt-2.5 p-2.5 rounded-lg bg-amber-50/90 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-2"
      role="alert"
    >
      <svg
        class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"
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
        <p class="font-medium text-[11px] leading-tight">
          Google OAuth is not configured on this environment.
        </p>
        <p class="text-[11px] text-amber-700/90 mt-0.5 leading-normal">
          Please sign in using your administrator email and password credentials.
        </p>
      </div>
      <button
        type="button"
        @click="showUnconfiguredNotice = false"
        class="text-amber-500 hover:text-amber-800 p-0.5"
        aria-label="Dismiss notice"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  buttonLabel: {
    type: String,
    default: 'Continue with Google',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const isLoading = ref(false)
const showUnconfiguredNotice = ref(false)

function handleClick() {
  if (props.disabled || isLoading.value) return

  // Emulate loading state briefly and inform the user that OAuth is unconfigured per Section 4.6
  isLoading.value = true
  showUnconfiguredNotice.value = false

  setTimeout(() => {
    isLoading.value = false
    showUnconfiguredNotice.value = true
  }, 450)
}
</script>
