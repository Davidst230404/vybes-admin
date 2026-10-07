<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-100 p-4">
    <div class="w-full max-w-md bg-neutral-800 rounded-xl p-8 shadow-xl border border-neutral-700 text-center">
      <h1 class="text-xl font-bold text-white mb-2">Reset Password</h1>
      <p class="text-sm text-neutral-400 mb-6">
        Password reset endpoint is not yet available on the backend API.
      </p>

      <router-link
        to="/auth/login"
        class="inline-block py-2 px-4 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors text-sm"
      >
        Back to Sign In
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>
