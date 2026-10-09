<template>
  <div class="space-y-6 select-none text-neutral-900">
    <!-- Top Header matching Figma -->
    <div>
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-[24px] font-bold text-neutral-950 tracking-tight leading-tight">
            User Detail
          </h1>
        </div>
        <div class="text-right">
          <div class="text-xs font-bold text-neutral-950 leading-tight">
            {{ adminDisplayName }}
          </div>
          <div class="text-[11px] text-neutral-400 mt-0.5 font-normal">
            {{ adminDisplayRole }}
          </div>
        </div>
      </div>

      <!-- Subtle horizontal divider line under header -->
      <div class="border-b border-[#e5e0d8] mt-4 mb-6"></div>
    </div>

    <!-- State 15: Loading Skeleton -->
    <div v-if="isLoading" class="space-y-6 animate-pulse">
      <div class="h-4 bg-neutral-200 rounded w-24"></div>
      <div class="flex items-center justify-between pt-2">
        <div class="space-y-2">
          <div class="h-7 bg-neutral-200 rounded w-48"></div>
          <div class="h-4 bg-neutral-200 rounded w-16"></div>
        </div>
        <div class="h-9 bg-neutral-200 rounded w-28"></div>
      </div>
      <div class="pt-8 space-y-4">
        <div class="h-4 bg-neutral-200 rounded w-36"></div>
        <div class="border-b border-[#e5e0d8]"></div>
        <div class="space-y-3 pt-2">
          <div class="h-4 bg-neutral-200 rounded w-64"></div>
          <div class="h-4 bg-neutral-200 rounded w-48"></div>
          <div class="h-4 bg-neutral-200 rounded w-40"></div>
        </div>
      </div>
    </div>

    <!-- State 17: User Not Found (404) -->
    <div
      v-else-if="isNotFound"
      class="max-w-md mx-auto my-20 p-8 bg-[#f7f5f0] border border-[#d8d3c8] rounded-md text-center"
    >
      <h3 class="text-sm font-bold text-neutral-900 mb-1">User not found</h3>
      <p class="text-xs text-neutral-500 mb-6 font-normal">
        The user may have been removed or is no longer available.
      </p>
      <router-link
        to="/admin/users"
        class="inline-block px-6 py-2.5 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded transition-colors cursor-pointer"
      >
        Back to Users
      </router-link>
    </div>

    <!-- State 16: Network Error -->
    <div
      v-else-if="isNetworkError"
      class="max-w-md mx-auto my-20 p-8 bg-[#f7f5f0] border border-[#d8d3c8] rounded-md text-center"
    >
      <h3 class="text-sm font-bold text-neutral-900 mb-1">Unable to load user</h3>
      <p class="text-xs text-neutral-500 mb-6 font-normal">Check your connection and try again.</p>
      <button
        @click="fetchUser"
        type="button"
        class="px-6 py-2.5 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded transition-colors cursor-pointer"
      >
        Try Again
      </button>
    </div>

    <!-- State 18: Session Expired -->
    <div
      v-else-if="isSessionExpired"
      class="max-w-md mx-auto my-20 p-8 bg-[#f7f5f0] border border-[#d8d3c8] rounded-md text-center"
    >
      <h3 class="text-sm font-bold text-neutral-900 mb-1">Session expired</h3>
      <p class="text-xs text-neutral-500 mb-6 font-normal">Please sign in again to continue.</p>
      <button
        @click="handleSignOut"
        type="button"
        class="px-6 py-2.5 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded transition-colors cursor-pointer"
      >
        Sign In Again
      </button>
    </div>

    <!-- State 19: Access Denied -->
    <div
      v-else-if="isAccessDenied"
      class="max-w-md mx-auto my-20 p-8 bg-[#f7f5f0] border border-[#d8d3c8] rounded-md text-center"
    >
      <h3 class="text-sm font-bold text-neutral-900 mb-1">Access denied</h3>
      <p class="text-xs text-neutral-500 mb-6 font-normal">You do not have permission to manage users.</p>
      <router-link
        to="/admin/users"
        class="inline-block px-6 py-2.5 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded transition-colors cursor-pointer"
      >
        Back
      </router-link>
    </div>

    <!-- State 04 & 08: User Detail Active / Suspended Profile -->
    <div v-else-if="user" class="space-y-6">
      <!-- Back Navigation Link -->
      <div>
        <router-link
          to="/admin/users"
          class="inline-flex items-center text-xs text-neutral-600 hover:text-neutral-950 font-normal transition-colors cursor-pointer"
        >
          <span class="mr-1">&larr;</span> Back to Users
        </router-link>
      </div>

      <!-- Identity Header with Action Button -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-1">
        <div>
          <h2 class="text-2xl font-bold text-neutral-950 tracking-tight">
            {{ user.name }}
          </h2>
          <div class="mt-2">
            <span
              v-if="user.status === 'suspended'"
              class="bg-[#fdeeed] text-[#d32f2f] px-2.5 py-0.5 rounded text-[11px] font-medium inline-block"
            >
              Suspended
            </span>
            <span
              v-else
              class="bg-[#edf7ed] text-[#2e7d32] px-2.5 py-0.5 rounded text-[11px] font-medium inline-block"
            >
              Active
            </span>
          </div>
        </div>

        <!-- Mutation Button: Suspend User or Reactivate User -->
        <div>
          <button
            v-if="user.status === 'suspended'"
            @click="openReactivateModal"
            type="button"
            class="px-4 py-2 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded shadow-none transition-colors cursor-pointer"
          >
            Reactivate User
          </button>
          <button
            v-else
            @click="openSuspendModal"
            type="button"
            class="px-4 py-2 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded shadow-none transition-colors cursor-pointer"
          >
            Suspend User
          </button>
        </div>
      </div>

      <!-- Account Information Section -->
      <div class="pt-6">
        <h3 class="text-xs font-bold text-neutral-900 tracking-tight uppercase mb-3">
          Account Information
        </h3>
        <div class="border-b border-[#e5e0d8] mb-4"></div>

        <div class="space-y-3.5 text-xs">
          <!-- Email Row -->
          <div class="flex items-start">
            <span class="w-36 text-neutral-400 font-normal">Email</span>
            <span class="text-neutral-900 font-normal">{{ user.email }}</span>
          </div>

          <!-- Phone Row -->
          <div class="flex items-start">
            <span class="w-36 text-neutral-400 font-normal">Phone</span>
            <span class="text-neutral-900 font-mono text-[11px]">{{ maskPhoneNumber(user.phone) }}</span>
          </div>

          <!-- Registered Row -->
          <div class="flex items-start">
            <span class="w-36 text-neutral-400 font-normal">Registered</span>
            <span class="text-neutral-900 font-normal">{{ formatDate(user.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================= -->
    <!-- MODALS: Suspend and Reactivate Flow States (05-07, 09-13)      -->
    <!-- ============================================================= -->

    <!-- Backdrop for Active Workflow Modal -->
    <div
      v-if="modalState !== 'none'"
      class="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4"
    >
      <!-- STATE 05: Suspend Confirmation Modal -->
      <div
        v-if="modalState === 'suspend_confirm'"
        class="bg-white border border-[#d8d3c8] rounded-md p-6 max-w-md w-full shadow-lg"
      >
        <h3 class="text-sm font-bold text-neutral-900 mb-1">
          Suspend user?
        </h3>
        <p class="text-xs text-neutral-500 mb-5 font-normal">
          This will suspend the user's account.
        </p>

        <!-- User identity banner -->
        <div class="bg-[#faf8f5] border border-[#e5e0d8] p-3 rounded flex items-center justify-between mb-6">
          <span class="font-bold text-xs text-neutral-900">{{ user?.name }}</span>
          <span class="bg-[#edf7ed] text-[#2e7d32] px-2 py-0.5 rounded text-[11px] font-medium">
            Active
          </span>
        </div>

        <!-- Buttons -->
        <div class="flex items-center space-x-2.5">
          <button
            @click="executeSuspend"
            type="button"
            class="px-4 py-2 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded cursor-pointer transition-colors"
          >
            Suspend User
          </button>
          <button
            @click="closeModal"
            type="button"
            class="px-4 py-2 bg-white border border-[#d8d3c8] text-neutral-700 hover:bg-neutral-50 text-xs font-normal rounded cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- STATE 06: Suspend Processing Modal -->
      <div
        v-else-if="modalState === 'suspend_processing'"
        class="bg-white border border-[#d8d3c8] rounded-md p-6 max-w-md w-full shadow-lg"
      >
        <h3 class="text-sm font-bold text-neutral-900 mb-1">
          Suspending user...
        </h3>

        <!-- User transition info -->
        <div class="bg-[#faf8f5] border border-[#e5e0d8] p-3 rounded mb-6">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-neutral-900">{{ user?.name }}</span>
            <span class="text-[11px] text-neutral-500 font-normal">
              Current status: <span class="text-[#2e7d32] font-medium">Active</span>
            </span>
          </div>
          <div class="text-[11px] text-neutral-400 mt-1 font-normal">
            Intended transition: Active &rarr; Suspended
          </div>
        </div>

        <button
          disabled
          type="button"
          class="px-4 py-2 bg-[#d85c35]/80 text-white text-xs font-semibold rounded cursor-not-allowed flex items-center space-x-2"
        >
          <span class="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
          <span>Suspending user...</span>
        </button>
      </div>

      <!-- STATE 07: Suspend Success Modal -->
      <div
        v-else-if="modalState === 'suspend_success'"
        class="bg-white border border-[#d8d3c8] rounded-md p-6 max-w-md w-full shadow-lg"
      >
        <h3 class="text-sm font-bold text-neutral-900 mb-1">
          User suspended
        </h3>
        <p class="text-xs text-neutral-500 mb-5 font-normal">
          The user's account has been suspended.
        </p>

        <!-- User identity banner with Suspended badge -->
        <div class="bg-[#faf8f5] border border-[#e5e0d8] p-3 rounded flex items-center justify-between mb-6">
          <span class="font-bold text-xs text-neutral-900">{{ user?.name }}</span>
          <span class="bg-[#fdeeed] text-[#d32f2f] px-2 py-0.5 rounded text-[11px] font-medium">
            Suspended
          </span>
        </div>

        <button
          @click="handleSuccessReturn"
          type="button"
          class="px-4 py-2 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded cursor-pointer transition-colors"
        >
          Back to Users
        </button>
      </div>

      <!-- STATE 12: Suspend Failed Modal -->
      <div
        v-else-if="modalState === 'suspend_failed'"
        class="bg-white border border-[#d8d3c8] rounded-md p-6 max-w-md w-full shadow-lg"
      >
        <h3 class="text-sm font-bold text-neutral-900 mb-1">
          Unable to suspend user
        </h3>
        <p class="text-xs text-[#d32f2f] mb-5 font-normal">
          {{ actionErrorMessage || 'The user could not be suspended. Please try again.' }}
        </p>

        <!-- User identity banner -->
        <div class="bg-[#faf8f5] border border-[#e5e0d8] p-3 rounded flex items-center justify-between mb-6">
          <span class="font-bold text-xs text-neutral-900">{{ user?.name }}</span>
          <span class="bg-[#edf7ed] text-[#2e7d32] px-2 py-0.5 rounded text-[11px] font-medium">
            Active
          </span>
        </div>

        <!-- Buttons -->
        <div class="flex items-center space-x-2.5">
          <button
            @click="executeSuspend"
            type="button"
            class="px-4 py-2 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded cursor-pointer transition-colors"
          >
            Try Again
          </button>
          <button
            @click="closeModal"
            type="button"
            class="px-4 py-2 bg-white border border-[#d8d3c8] text-neutral-700 hover:bg-neutral-50 text-xs font-normal rounded cursor-pointer transition-colors"
          >
            Back
          </button>
        </div>
      </div>

      <!-- STATE 09: Reactivate Confirmation Modal -->
      <div
        v-else-if="modalState === 'reactivate_confirm'"
        class="bg-white border border-[#d8d3c8] rounded-md p-6 max-w-md w-full shadow-lg"
      >
        <h3 class="text-sm font-bold text-neutral-900 mb-1">
          Reactivate user?
        </h3>
        <p class="text-xs text-neutral-500 mb-5 font-normal">
          This will reactivate the user's account.
        </p>

        <!-- User identity banner with Suspended badge -->
        <div class="bg-[#faf8f5] border border-[#e5e0d8] p-3 rounded flex items-center justify-between mb-6">
          <span class="font-bold text-xs text-neutral-900">{{ user?.name }}</span>
          <span class="bg-[#fdeeed] text-[#d32f2f] px-2 py-0.5 rounded text-[11px] font-medium">
            Suspended
          </span>
        </div>

        <!-- Buttons -->
        <div class="flex items-center space-x-2.5">
          <button
            @click="executeReactivate"
            type="button"
            class="px-4 py-2 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded cursor-pointer transition-colors"
          >
            Reactivate User
          </button>
          <button
            @click="closeModal"
            type="button"
            class="px-4 py-2 bg-white border border-[#d8d3c8] text-neutral-700 hover:bg-neutral-50 text-xs font-normal rounded cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- STATE 10: Reactivate Processing Modal -->
      <div
        v-else-if="modalState === 'reactivate_processing'"
        class="bg-white border border-[#d8d3c8] rounded-md p-6 max-w-md w-full shadow-lg"
      >
        <h3 class="text-sm font-bold text-neutral-900 mb-1">
          Reactivating user...
        </h3>

        <!-- User transition info -->
        <div class="bg-[#faf8f5] border border-[#e5e0d8] p-3 rounded mb-6">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-neutral-900">{{ user?.name }}</span>
            <span class="text-[11px] text-neutral-500 font-normal">
              Current status: <span class="text-[#d32f2f] font-medium">Suspended</span>
            </span>
          </div>
          <div class="text-[11px] text-neutral-400 mt-1 font-normal">
            Intended transition: Suspended &rarr; Active
          </div>
        </div>

        <button
          disabled
          type="button"
          class="px-4 py-2 bg-[#d85c35]/80 text-white text-xs font-semibold rounded cursor-not-allowed flex items-center space-x-2"
        >
          <span class="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
          <span>Reactivating user...</span>
        </button>
      </div>

      <!-- STATE 11: Reactivate Success Modal -->
      <div
        v-else-if="modalState === 'reactivate_success'"
        class="bg-white border border-[#d8d3c8] rounded-md p-6 max-w-md w-full shadow-lg"
      >
        <h3 class="text-sm font-bold text-neutral-900 mb-1">
          User reactivated
        </h3>
        <p class="text-xs text-neutral-500 mb-5 font-normal">
          The user's account has been reactivated.
        </p>

        <!-- User identity banner with Active badge -->
        <div class="bg-[#faf8f5] border border-[#e5e0d8] p-3 rounded flex items-center justify-between mb-6">
          <span class="font-bold text-xs text-neutral-900">{{ user?.name }}</span>
          <span class="bg-[#edf7ed] text-[#2e7d32] px-2 py-0.5 rounded text-[11px] font-medium">
            Active
          </span>
        </div>

        <button
          @click="handleSuccessReturn"
          type="button"
          class="px-4 py-2 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded cursor-pointer transition-colors"
        >
          Back to Users
        </button>
      </div>

      <!-- STATE 13: Reactivate Failed Modal -->
      <div
        v-else-if="modalState === 'reactivate_failed'"
        class="bg-white border border-[#d8d3c8] rounded-md p-6 max-w-md w-full shadow-lg"
      >
        <h3 class="text-sm font-bold text-neutral-900 mb-1">
          Unable to reactivate user
        </h3>
        <p class="text-xs text-[#d32f2f] mb-5 font-normal">
          {{ actionErrorMessage || 'The user could not be reactivated. Please try again.' }}
        </p>

        <!-- User identity banner -->
        <div class="bg-[#faf8f5] border border-[#e5e0d8] p-3 rounded flex items-center justify-between mb-6">
          <span class="font-bold text-xs text-neutral-900">{{ user?.name }}</span>
          <span class="bg-[#fdeeed] text-[#d32f2f] px-2 py-0.5 rounded text-[11px] font-medium">
            Suspended
          </span>
        </div>

        <!-- Buttons -->
        <div class="flex items-center space-x-2.5">
          <button
            @click="executeReactivate"
            type="button"
            class="px-4 py-2 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded cursor-pointer transition-colors"
          >
            Try Again
          </button>
          <button
            @click="closeModal"
            type="button"
            class="px-4 py-2 bg-white border border-[#d8d3c8] text-neutral-700 hover:bg-neutral-50 text-xs font-normal rounded cursor-pointer transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import userService from '../../services/user.service'
import { formatDate, maskPhoneNumber } from '../../utils/formatters'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State
const user = ref(null)
const isLoading = ref(true)
const isNotFound = ref(false)
const isNetworkError = ref(false)
const isSessionExpired = ref(false)
const isAccessDenied = ref(false)

// Workflow Modal State:
// 'none' | 'suspend_confirm' | 'suspend_processing' | 'suspend_success' | 'suspend_failed'
// 'reactivate_confirm' | 'reactivate_processing' | 'reactivate_success' | 'reactivate_failed'
const modalState = ref('none')
const actionErrorMessage = ref('')

const adminDisplayName = computed(() => {
  return authStore.user?.name || 'Admin'
})

const adminDisplayRole = computed(() => {
  return authStore.user?.role?.display_name || 'Administrator'
})

async function fetchUser() {
  const userId = route.params.id
  if (!userId) {
    isNotFound.value = true
    return
  }

  isLoading.value = true
  isNotFound.value = false
  isNetworkError.value = false
  isSessionExpired.value = false
  isAccessDenied.value = false

  try {
    const data = await userService.get(userId)
    if (!data) {
      isNotFound.value = true
    } else {
      user.value = data
    }
  } catch (err) {
    const status = err.response?.status
    if (status === 404) {
      isNotFound.value = true
    } else if (status === 401) {
      isSessionExpired.value = true
    } else if (status === 403) {
      isAccessDenied.value = true
    } else {
      isNetworkError.value = true
    }
  } finally {
    isLoading.value = false
  }
}

// Suspend workflow triggers
function openSuspendModal() {
  modalState.value = 'suspend_confirm'
  actionErrorMessage.value = ''
}

async function executeSuspend() {
  modalState.value = 'suspend_processing'
  actionErrorMessage.value = ''

  try {
    const res = await userService.suspend(user.value.id, 'Administrative suspension via CMS')
    if (res.data) {
      user.value = res.data
    } else {
      user.value.status = 'suspended'
    }
    modalState.value = 'suspend_success'
  } catch (err) {
    actionErrorMessage.value = err.response?.data?.message || 'The user could not be suspended. Please try again.'
    modalState.value = 'suspend_failed'
  }
}

// Reactivate workflow triggers
function openReactivateModal() {
  modalState.value = 'reactivate_confirm'
  actionErrorMessage.value = ''
}

async function executeReactivate() {
  modalState.value = 'reactivate_processing'
  actionErrorMessage.value = ''

  try {
    const res = await userService.reactivate(user.value.id, 'Administrative reactivation via CMS')
    if (res.data) {
      user.value = res.data
    } else {
      user.value.status = 'active'
    }
    modalState.value = 'reactivate_success'
  } catch (err) {
    actionErrorMessage.value = err.response?.data?.message || 'The user could not be reactivated. Please try again.'
    modalState.value = 'reactivate_failed'
  }
}

function closeModal() {
  modalState.value = 'none'
  actionErrorMessage.value = ''
}

function handleSuccessReturn() {
  closeModal()
  router.push('/admin/users')
}

async function handleSignOut() {
  try {
    await authStore.logout()
  } finally {
    router.push('/auth/login')
  }
}

onMounted(() => {
  fetchUser()
})
</script>
