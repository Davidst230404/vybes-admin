<script setup>
import { useRouter } from 'vue-router'
import {
  AuthShell,
  AuthForm,
  PrimaryButton,
  AuthLink,
} from '../../components/auth'
import StateSwitcher from '../../components/auth/StateSwitcher.vue'

const router = useRouter()

const handleBackToSignIn = () => {
  router.push('/login')
}
</script>

<template>
  <AuthShell>
    <AuthForm
      title="Access denied"
      description="You don't have permission to access VYBES Admin."
    >
      <div class="access-denied__actions">
        <PrimaryButton
          id="access-denied-back-btn"
          type="button"
          @click="handleBackToSignIn"
        >
          Back to sign in
        </PrimaryButton>

        <div class="access-denied__contact">
          <AuthLink
            variant="muted"
            href="mailto:support@vybes.com?subject=VYBES%20Admin%20Access%20Request"
          >
            Contact administrator
          </AuthLink>
        </div>
      </div>
    </AuthForm>

    <StateSwitcher current="08-access-denied" />
  </AuthShell>
</template>

<style scoped>
.access-denied__actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.access-denied__contact {
  text-align: center;
  display: flex;
  justify-content: center;
}
</style>
