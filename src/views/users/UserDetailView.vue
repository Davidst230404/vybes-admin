<template>
  <div class="space-y-5">
    <!-- Header with Back Button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <router-link
          to="/admin/users"
          class="p-1.5 border border-neutral-300 rounded-md hover:bg-neutral-100 text-neutral-600 transition-colors"
          title="Back to Users"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </router-link>
        <div>
          <h2 class="text-xl font-bold text-neutral-900 tracking-tight">
            User Profile <span v-if="user" class="font-mono text-neutral-400 font-normal">#{{ user.id }}</span>
          </h2>
          <p class="text-xs text-neutral-500 mt-0.5">Comprehensive account overview and authorization privileges</p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <ErrorState
      v-if="error"
      title="Failed to load user"
      :message="error"
      @retry="fetchUser"
    />

    <!-- Loading Skeleton -->
    <div v-else-if="isLoading" class="bg-white border border-[#e7e5e1] rounded-lg p-6">
      <LoadingSkeleton :rows="5" />
    </div>

    <!-- User Content -->
    <div v-else-if="user" class="space-y-5">
      <!-- Main Info Card -->
      <div class="bg-white border border-[#e7e5e1] rounded-lg p-6">
        <div class="flex items-start justify-between border-b border-[#e7e5e1] pb-4 mb-4">
          <div>
            <h3 class="text-base font-bold text-neutral-900">{{ user.name }}</h3>
            <p class="text-xs font-mono text-neutral-500 mt-0.5">{{ user.email }}</p>
          </div>
          <span
            class="px-2.5 py-1 text-xs font-semibold rounded"
            :class="getRoleBadgeClass(user.role?.name)"
          >
            {{ user.role?.display_name || user.role?.name || 'Customer' }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div class="p-3 bg-neutral-50 rounded border border-neutral-200">
            <div class="text-[11px] text-neutral-400 font-medium">Account ID</div>
            <div class="font-mono text-neutral-900 mt-0.5 font-bold">#{{ user.id }}</div>
          </div>
          <div class="p-3 bg-neutral-50 rounded border border-neutral-200">
            <div class="text-[11px] text-neutral-400 font-medium">Email Verification</div>
            <div class="text-neutral-900 mt-0.5">
              {{ user.email_verified_at ? formatDateTime(user.email_verified_at) : 'Unverified' }}
            </div>
          </div>
          <div class="p-3 bg-neutral-50 rounded border border-neutral-200">
            <div class="text-[11px] text-neutral-400 font-medium">Registration Date</div>
            <div class="text-neutral-900 mt-0.5">{{ formatDateTime(user.created_at) }}</div>
          </div>
        </div>
      </div>

      <!-- Merchant Details if present -->
      <div v-if="user.merchant" class="bg-white border border-[#e7e5e1] rounded-lg p-6">
        <h4 class="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">Merchant Profile</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span class="text-neutral-400 block mb-0.5">Business Name</span>
            <span class="font-medium text-neutral-900">{{ user.merchant.business_name }}</span>
          </div>
          <div>
            <span class="text-neutral-400 block mb-0.5">Approval Status</span>
            <span class="font-medium text-neutral-900 capitalize">{{ user.merchant.status }}</span>
          </div>
        </div>
      </div>

      <!-- Organizer Details if present -->
      <div v-if="user.organizer" class="bg-white border border-[#e7e5e1] rounded-lg p-6">
        <h4 class="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">Event Organizer Profile</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span class="text-neutral-400 block mb-0.5">Organization Name</span>
            <span class="font-medium text-neutral-900">{{ user.organizer.organization_name }}</span>
          </div>
          <div>
            <span class="text-neutral-400 block mb-0.5">Approval Status</span>
            <span class="font-medium text-neutral-900 capitalize">{{ user.organizer.status }}</span>
          </div>
        </div>
      </div>

      <!-- Granted Permissions -->
      <div v-if="user.role?.permissions && user.role.permissions.length > 0" class="bg-white border border-[#e7e5e1] rounded-lg p-6">
        <h4 class="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">Granted Permissions</h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="perm in user.role.permissions"
            :key="perm.id"
            class="px-2.5 py-1 bg-neutral-100 border border-neutral-200 rounded text-xs text-neutral-800 font-mono"
          >
            {{ perm.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import userService from '../../services/user.service'
import { formatDateTime } from '../../utils/formatters'
import LoadingSkeleton from '../../components/feedback/LoadingSkeleton.vue'
import ErrorState from '../../components/feedback/ErrorState.vue'

const route = useRoute()
const user = ref(null)
const isLoading = ref(true)
const error = ref(null)

function getRoleBadgeClass(roleName) {
  switch (roleName?.toLowerCase()) {
    case 'admin':
      return 'bg-purple-50 text-purple-700 border border-purple-200'
    case 'merchant':
      return 'bg-blue-50 text-blue-700 border border-blue-200'
    case 'organizer':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    default:
      return 'bg-neutral-100 text-neutral-700 border border-neutral-200'
  }
}

async function fetchUser() {
  const userId = route.params.id
  if (!userId) return

  isLoading.value = true
  error.value = null
  try {
    user.value = await userService.get(userId)
  } catch (err) {
    error.value = err.response?.data?.message || `User #${userId} could not be found or loaded.`
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUser()
})
</script>
