<template>
  <header class="h-16 bg-white border-b border-[#e7e5e1] px-8 flex items-center justify-between sticky top-0 z-20">
    <!-- Page Title & Breadcrumb -->
    <div>
      <div class="flex items-center space-x-2 text-xs text-neutral-400 mb-0.5">
        <span>Admin</span>
        <span>/</span>
        <span class="text-neutral-600 font-medium">{{ currentSection }}</span>
      </div>
      <h1 class="text-lg font-bold text-neutral-900 leading-tight">
        {{ pageTitle }}
      </h1>
    </div>

    <!-- Admin User Info & Actions -->
    <div class="flex items-center space-x-4">
      <div v-if="authStore.user" class="text-right hidden sm:block">
        <div class="text-xs font-semibold text-neutral-900 flex items-center justify-end space-x-1.5">
          <span>{{ authStore.user.name }}</span>
          <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-orange-50 text-[#f25c05] border border-orange-200">
            {{ authStore.user.role?.display_name || authStore.user.role?.name || 'Admin' }}
          </span>
        </div>
        <div class="text-[11px] text-neutral-400">
          {{ authStore.user.email }}
        </div>
      </div>

      <div class="h-6 w-px bg-neutral-200 hidden sm:block"></div>

      <!-- Logout Action -->
      <button
        @click="handleLogout"
        :disabled="isLoggingOut"
        class="inline-flex items-center px-3 py-1.5 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-medium rounded-md transition-colors disabled:opacity-50"
        title="Sign Out of VYBES CMS"
      >
        <svg class="w-3.5 h-3.5 mr-1.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>{{ isLoggingOut ? 'Signing out...' : 'Sign Out' }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isLoggingOut = ref(false)

const titles = {
  dashboard: 'Dashboard Overview',
  users: 'Users Management',
  'user-detail': 'User Account Details',
  approvals: 'Merchant & Organizer Approvals',
  categories: 'Categories Management',
  moderation: 'Content Moderation',
  bookings: 'Platform Bookings',
  refunds: 'Refunds Management',
  reviews: 'User Reviews',
  venues: 'Venues Supervision',
  settings: 'Platform Settings',
  audit: 'Audit Log',
  reports: 'Analytics & Reports',
}

const pageTitle = computed(() => {
  return route.meta?.title || titles[route.name] || 'Admin CMS'
})

const currentSection = computed(() => {
  const name = route.name ? String(route.name) : ''
  return name.charAt(0).toUpperCase() + name.slice(1)
})

async function handleLogout() {
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
