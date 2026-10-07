<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-100 p-4">
    <div class="w-full max-w-md bg-neutral-800 rounded-xl p-8 shadow-xl border border-neutral-700 text-center">
      <div class="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h1 class="text-xl font-bold text-white mb-2">Session Expired</h1>
      <p class="text-sm text-neutral-400 mb-6">
        Your authentication session has expired or is no longer valid. Please sign in again to continue.
      </p>

      <router-link
        to="/auth/login"
        class="inline-block w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors text-center"
      >
        Return to Sign In
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>
