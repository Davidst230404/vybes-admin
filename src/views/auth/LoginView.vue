<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-100 p-4">
    <div class="w-full max-w-md bg-neutral-800 rounded-xl p-8 shadow-xl border border-neutral-700">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold tracking-tight text-white">VYBES Admin</h1>
        <p class="text-sm text-neutral-400 mt-1">Sign in with your administrator account</p>
      </div>

      <!-- General error alert -->
      <div
        v-if="errorMessage"
        class="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-sm flex items-start space-x-2"
        role="alert"
      >
        <span>{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
        <!-- Email field -->
        <div>
          <label for="email" class="block text-sm font-medium text-neutral-300 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 bg-neutral-900 border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            :class="fieldErrors.email ? 'border-red-500' : 'border-neutral-700'"
            placeholder="admin@vybes.test"
          />
          <p v-if="fieldErrors.email" class="mt-1 text-xs text-red-400">
            {{ fieldErrors.email[0] }}
          </p>
        </div>

        <!-- Password field -->
        <div>
          <label for="password" class="block text-sm font-medium text-neutral-300 mb-1">
            Password
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 bg-neutral-900 border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            :class="fieldErrors.password ? 'border-red-500' : 'border-neutral-700'"
            placeholder="••••••••"
          />
          <p v-if="fieldErrors.password" class="mt-1 text-xs text-red-400">
            {{ fieldErrors.password[0] }}
          </p>
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-neutral-800 flex items-center justify-center space-x-2"
        >
          <span v-if="isLoading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const isLoading = ref(false)
const errorMessage = ref('')
const fieldErrors = ref({})

async function handleSubmit() {
  if (isLoading.value) return

  // Reset errors
  errorMessage.value = ''
  fieldErrors.value = {}
  isLoading.value = true

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
    })

    const redirectPath = route.query.redirect || '/dashboard'
    router.push(redirectPath)
  } catch (error) {
    if (error.isValidationError) {
      fieldErrors.value = error.errors || {}
      errorMessage.value = error.message || 'Validation failed. Please check your credentials.'
    } else {
      errorMessage.value = error.message || 'An error occurred during sign in.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
