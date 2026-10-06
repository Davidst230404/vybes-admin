<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  AuthShell,
  AuthForm,
  TextInput,
  PasswordInput,
  PrimaryButton,
} from '../../components/auth'
import StateSwitcher from '../../components/auth/StateSwitcher.vue'

const router = useRouter()
const email = ref('admin@vybes.com')
const password = ref('')
const isLoading = ref(false)

const handleSignInAgain = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    router.push('/login?state=02-filled')
  }, 600)
}
</script>

<template>
  <AuthShell>
    <AuthForm
      title="Session expired"
      description="Your session has expired for security reasons. Please sign in again to continue."
      @submit="handleSignInAgain"
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
      />

      <PrimaryButton
        id="session-expired-submit-btn"
        type="submit"
        :loading="isLoading"
        loading-text="Signing in..."
      >
        Sign in again
      </PrimaryButton>
    </AuthForm>

    <StateSwitcher current="09-session-expired" />
  </AuthShell>
</template>
