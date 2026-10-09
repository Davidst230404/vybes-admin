<template>
  <div class="space-y-6 select-none text-neutral-900">
    <!-- Top Header matching Figma -->
    <div>
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-[24px] font-bold text-neutral-950 tracking-tight leading-tight">
            Users
          </h1>
          <p class="text-xs text-neutral-500 mt-1 font-normal">
            Manage registered VYBES users.
          </p>
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
      <div class="border-b border-[#e5e0d8] mt-5 mb-6"></div>
    </div>

    <!-- State 16: Network Error -->
    <div
      v-if="isNetworkError"
      class="max-w-md mx-auto my-20 p-8 bg-[#f7f5f0] border border-[#d8d3c8] rounded-md text-center"
    >
      <h3 class="text-sm font-bold text-neutral-900 mb-1">Unable to load users</h3>
      <p class="text-xs text-neutral-500 mb-6 font-normal">Check your connection and try again.</p>
      <button
        @click="fetchUsers"
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
      <button
        @click="handleGoBack"
        type="button"
        class="px-6 py-2.5 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded transition-colors cursor-pointer"
      >
        Back
      </button>
    </div>

    <!-- Main Content: Controls, Table & Pagination -->
    <div v-else class="space-y-6">
      <!-- Search & Registered Users Count Bar -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <!-- Search Input -->
        <div class="w-full sm:max-w-sm">
          <label for="users-search-input" class="block text-xs font-semibold text-neutral-900 mb-1.5">
            Search users
          </label>
          <div class="relative">
            <svg
              class="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              id="users-search-input"
              v-model="searchQuery"
              @input="handleSearchInput"
              @keyup.enter="executeSearch"
              type="text"
              placeholder="Search users"
              class="w-full text-xs pl-9 pr-8 py-2 bg-white border border-[#d8d3c8] rounded text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#d85c35] transition-colors"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              type="button"
              class="absolute right-2.5 top-2 text-neutral-400 hover:text-neutral-700 text-xs px-1 cursor-pointer"
              title="Clear search"
            >
              ✕
            </button>
          </div>
          <p class="text-[11px] text-neutral-400 mt-1 font-normal">
            Search by name, email, or phone number.
          </p>
        </div>

        <!-- Total Registered Users Counter -->
        <div class="text-right flex-shrink-0">
          <div class="text-lg font-bold text-neutral-950 leading-tight">
            {{ formattedTotalUsers }} users
          </div>
          <div class="text-[11px] text-neutral-400 mt-0.5 font-normal">
            Registered users
          </div>
        </div>
      </div>

      <!-- Table Surface -->
      <div class="bg-white border border-[#e5e0d8] rounded-none sm:rounded overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-[#e5e0d8] text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                <th class="py-3 px-6 font-medium">User</th>
                <th class="py-3 px-6 font-medium">Email</th>
                <th class="py-3 px-6 font-medium">Phone</th>
                <th class="py-3 px-6 font-medium">Status</th>
                <th class="py-3 px-6 font-medium">Registered</th>
                <th class="py-3 px-6 font-medium text-right">Action</th>
              </tr>
            </thead>

            <!-- State 14: Loading Skeleton Rows -->
            <tbody v-if="isLoading" class="divide-y divide-[#eeeae4] text-xs">
              <tr v-for="i in 4" :key="'skeleton-' + i" class="animate-pulse">
                <td class="py-4 px-6">
                  <div class="h-3.5 bg-neutral-200 rounded w-28"></div>
                </td>
                <td class="py-4 px-6">
                  <div class="h-3.5 bg-neutral-200 rounded w-44"></div>
                </td>
                <td class="py-4 px-6">
                  <div class="h-3.5 bg-neutral-200 rounded w-24"></div>
                </td>
                <td class="py-4 px-6">
                  <div class="h-5 bg-neutral-200 rounded w-16"></div>
                </td>
                <td class="py-4 px-6">
                  <div class="h-3.5 bg-neutral-200 rounded w-20"></div>
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="h-3.5 bg-neutral-200 rounded w-10 ml-auto"></div>
                </td>
              </tr>
            </tbody>

            <!-- State 03 & 20: Empty States -->
            <tbody v-else-if="users.length === 0">
              <tr>
                <td colspan="6" class="py-16 px-6 text-center">
                  <!-- State 03: Search No Results -->
                  <div v-if="activeSearch">
                    <h3 class="text-sm font-bold text-neutral-900 mb-1">No users found</h3>
                    <p class="text-xs text-neutral-400 font-normal">
                      For a different name, email, or phone number.
                    </p>
                  </div>
                  <!-- State 20: Complete Empty State -->
                  <div v-else>
                    <h3 class="text-sm font-bold text-neutral-900 mb-1">No users yet</h3>
                    <p class="text-xs text-neutral-400 font-normal">
                      Registered users will appear here.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>

            <!-- State 01 & 02: Populated Table Rows -->
            <tbody v-else class="divide-y divide-[#eeeae4] text-xs">
              <tr
                v-for="user in users"
                :key="user.id"
                class="hover:bg-[#faf8f5] transition-colors"
              >
                <!-- User Name -->
                <td class="py-4 px-6 font-bold text-neutral-950">
                  {{ user.name }}
                </td>

                <!-- Email -->
                <td class="py-4 px-6 text-neutral-600 font-normal">
                  {{ user.email }}
                </td>

                <!-- Phone (Masked) -->
                <td class="py-4 px-6 text-neutral-600 font-mono text-[11px]">
                  {{ maskPhoneNumber(user.phone) }}
                </td>

                <!-- Status Badge -->
                <td class="py-4 px-6">
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
                </td>

                <!-- Registration Date -->
                <td class="py-4 px-6 text-neutral-600 font-normal">
                  {{ formatDate(user.created_at) }}
                </td>

                <!-- Action: View -->
                <td class="py-4 px-6 text-right">
                  <router-link
                    :to="'/admin/users/' + user.id"
                    class="text-neutral-950 font-bold hover:underline cursor-pointer text-xs"
                  >
                    View
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- State 21: Server-Side Pagination & Record Excerpt -->
      <div
        v-if="!isLoading && users.length > 0"
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-neutral-500 pt-1"
      >
        <!-- Left: Records Excerpt -->
        <div>
          <span v-if="activeSearch">
            {{ users.length }} {{ users.length === 1 ? 'result' : 'results' }}
          </span>
          <span v-else>
            {{ excerptText }}
          </span>
        </div>

        <!-- Right: Pagination Buttons -->
        <div class="flex items-center space-x-1.5">
          <!-- Previous Button -->
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage <= 1 || isLoading"
            type="button"
            class="px-3 py-1.5 text-xs text-neutral-700 bg-white border border-[#d8d3c8] rounded hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Previous
          </button>

          <!-- Page Numbers -->
          <button
            v-for="page in visiblePages"
            :key="'page-' + page"
            @click="changePage(page)"
            :disabled="isLoading"
            type="button"
            class="px-3 py-1.5 text-xs rounded transition-colors cursor-pointer"
            :class="
              page === currentPage
                ? 'bg-[#d85c35] text-white font-semibold'
                : 'bg-white border border-[#d8d3c8] text-neutral-700 hover:bg-neutral-50'
            "
          >
            {{ page }}
          </button>

          <!-- Next Button -->
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages || isLoading"
            type="button"
            class="px-3 py-1.5 text-xs text-neutral-700 bg-white border border-[#d8d3c8] rounded hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import userService from '../../services/user.service'
import { formatDate, maskPhoneNumber } from '../../utils/formatters'

const router = useRouter()
const authStore = useAuthStore()

// State
const users = ref([])
const meta = ref(null)
const isLoading = ref(true)
const isNetworkError = ref(false)
const isSessionExpired = ref(false)
const isAccessDenied = ref(false)

const searchQuery = ref('')
const activeSearch = ref('')
const currentPage = ref(1)
const perPage = ref(15)

// Debounce timer for search
let searchDebounceTimer = null

// Display admin header info
const adminDisplayName = computed(() => {
  return authStore.user?.name || 'Admin'
})

const adminDisplayRole = computed(() => {
  return authStore.user?.role?.display_name || 'Administrator'
})

// Registered users total count formatting
const formattedTotalUsers = computed(() => {
  const total = meta.value?.total ?? 0
  return new Intl.NumberFormat('en-US').format(total)
})

// Excerpt text matching Figma e.g. "4 of 2,840 · Example excerpt"
const excerptText = computed(() => {
  const total = meta.value?.total ?? users.value.length
  const currentCount = users.value.length
  const formattedTotal = new Intl.NumberFormat('en-US').format(total)
  return `${currentCount} of ${formattedTotal} · Example excerpt`
})

// Total pages from server meta
const totalPages = computed(() => {
  return meta.value?.last_page || 1
})

// Visible page numbers for pagination controls
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []

  const maxButtons = 5
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + maxButtons - 1)

  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1)
  }

  for (let p = start; p <= end; p++) {
    pages.push(p)
  }

  return pages
})

// Fetch users from API
async function fetchUsers() {
  isLoading.value = true
  isNetworkError.value = false
  isSessionExpired.value = false
  isAccessDenied.value = false

  try {
    const params = {
      page: currentPage.value,
      per_page: perPage.value,
    }

    if (activeSearch.value.trim()) {
      params.search = activeSearch.value.trim()
    }

    const response = await userService.list(params)
    users.value = response.data || []
    meta.value = response.meta || null
  } catch (err) {
    const status = err.response?.status
    if (status === 401) {
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

// Search input handling
function handleSearchInput() {
  clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    executeSearch()
  }, 400)
}

function executeSearch() {
  activeSearch.value = searchQuery.value
  currentPage.value = 1
  fetchUsers()
}

function clearSearch() {
  searchQuery.value = ''
  activeSearch.value = ''
  currentPage.value = 1
  fetchUsers()
}

function changePage(page) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  fetchUsers()
}

function handleGoBack() {
  router.push('/admin/dashboard')
}

async function handleSignOut() {
  try {
    await authStore.logout()
  } finally {
    router.push('/auth/login')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
