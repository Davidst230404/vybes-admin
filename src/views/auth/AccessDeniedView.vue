<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-100 p-4">
    <div class="w-full max-w-md bg-neutral-800 rounded-xl p-8 shadow-xl border border-neutral-700 text-center">
      <div class="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center mb-4">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h1 class="text-xl font-bold text-white mb-2">Access Denied</h1>
      <p class="text-sm text-neutral-300 mb-4">
        You do not have permission to access the VYBES Admin CMS.
      </p>

      <div v-if="authStore.user" class="p-3 mb-6 bg-neutral-900/80 rounded-lg border border-neutral-700/60 text-xs text-neutral-400 text-left">
        <div class="flex justify-between py-0.5">
          <span>Signed in as:</span>
          <span class="text-white font-medium">{{ authStore.user.name }}</span>
        </div>
        <div class="flex justify-between py-0.5">
          <span>Email:</span>
          <span class="text-white font-medium">{{ authStore.user.email }}</span>
        </div>
        <div class="flex justify-between py-0.5">
          <span>Role:</span>
          <span class="text-amber-400 font-medium">{{ authStore.user.role?.display_name || authStore.user.role?.name || 'No Role' }}</span>
        </div>
      </div>

      <div class="space-y-2">
        <button
          @click="handleSignOut"
          :disabled="isLoggingOut"
          class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors text-sm"
        >
          <span v-if="isLoggingOut">Signing out...</span>
          <span v-else>Sign In with Different Account</span>
        </button>

        <router-link
          to="/auth/login"
          class="block w-full py-2 px-4 text-neutral-400 hover:text-white text-xs transition-colors"
        >
          Return to Sign In Page
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isLoggingOut = ref(false)

async function handleSignOut() {
  if (isLoggingOut.value) return
  isLoggingOut.value = true
  try {
    await authStore.logout()
    router.push('/auth/login')
  } finally {
    isLoggingOut.value = false
  }
}
</script>
