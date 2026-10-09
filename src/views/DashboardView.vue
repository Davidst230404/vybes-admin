<template>
  <div class="space-y-7 select-none text-neutral-900">
    <!-- Top Header: Dashboard & Administrator context matching Figma -->
    <div>
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-[22px] font-bold text-neutral-950 tracking-tight leading-tight">
            Dashboard
          </h1>
          <p class="text-xs text-neutral-500 mt-1 font-normal">
            Platform overview
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

      <!-- Full-width subtle horizontal divider line under header -->
      <div class="border-b border-[#e5e0d8] mt-6"></div>
    </div>

    <!-- State 05: Network Error -->
    <div
      v-if="isNetworkError"
      class="max-w-md mx-auto my-24 p-8 bg-[#f7f5f0] border border-[#d8d3c8] rounded-md text-center"
    >
      <h3 class="text-sm font-bold text-neutral-900 mb-1">Unable to load dashboard</h3>
      <p class="text-xs text-neutral-500 mb-6 font-normal">Check your connection and try again.</p>
      <button
        @click="fetchDashboardData"
        type="button"
        class="px-6 py-2.5 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
      >
        Try Again
      </button>
    </div>

    <!-- State 06: Session Expired -->
    <div
      v-else-if="isSessionExpired"
      class="max-w-md mx-auto my-24 p-8 bg-[#f7f5f0] border border-[#d8d3c8] rounded-md text-center"
    >
      <h3 class="text-sm font-bold text-neutral-900 mb-1">Session expired</h3>
      <p class="text-xs text-neutral-500 mb-6 font-normal">Please sign in again to continue.</p>
      <button
        @click="handleSignOut"
        type="button"
        class="px-6 py-2.5 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
      >
        Sign In Again
      </button>
    </div>

    <!-- State 07: Access Denied -->
    <div
      v-else-if="isAccessDenied"
      class="max-w-md mx-auto my-24 p-8 bg-[#f7f5f0] border border-[#d8d3c8] rounded-md text-center"
    >
      <h3 class="text-sm font-bold text-neutral-900 mb-1">Access denied</h3>
      <p class="text-xs text-neutral-500 mb-6 font-normal">You do not have permission to access the Admin CMS.</p>
      <button
        @click="handleSignOut"
        type="button"
        class="px-6 py-2.5 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
      >
        Back to Login
      </button>
    </div>

    <!-- State 03: Loading Skeleton -->
    <div v-else-if="isLoading" class="space-y-7 animate-pulse">
      <div>
        <div class="h-3.5 bg-neutral-200/80 rounded w-28 mb-3"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="'m-' + i" class="bg-[#f7f5f0] border border-[#d8d3c8] rounded-md p-5 space-y-2">
            <div class="h-3 bg-neutral-200 rounded w-16"></div>
            <div class="h-7 bg-neutral-200 rounded w-28"></div>
            <div class="h-3 bg-neutral-100 rounded w-24"></div>
          </div>
        </div>
      </div>

      <div class="bg-[#f7f5f0] border border-[#d8d3c8] rounded-md p-5 flex items-center justify-between">
        <div class="space-y-1.5">
          <div class="h-3 bg-neutral-200 rounded w-28"></div>
          <div class="h-3 bg-neutral-100 rounded w-20"></div>
        </div>
        <div class="h-7 bg-neutral-200 rounded w-36"></div>
      </div>

      <div>
        <div class="h-3.5 bg-neutral-200/80 rounded w-36 mb-3"></div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="'op-' + i" class="border-l border-[#dcd7ce] pl-3.5 space-y-1.5">
            <div class="h-3 bg-neutral-200 rounded w-24"></div>
            <div class="h-6 bg-neutral-200 rounded w-14"></div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div class="lg:col-span-3 space-y-3">
          <div class="h-3.5 bg-neutral-200/80 rounded w-28"></div>
          <div class="space-y-3 border-t border-[#e5e0d8] pt-3">
            <div v-for="i in 4" :key="'row-' + i" class="h-10 bg-neutral-100/60 rounded"></div>
          </div>
        </div>
        <div class="space-y-3">
          <div class="h-3.5 bg-neutral-200/80 rounded w-24"></div>
          <div class="space-y-2.5">
            <div v-for="i in 4" :key="'btn-' + i" class="h-9 bg-neutral-200 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Populated & Valid Dashboard Content (States 01, 02, 04) -->
    <div v-else class="space-y-7">
      <!-- Section 1: Platform Overview Metric Cards -->
      <section aria-labelledby="platform-overview-heading">
        <h2 id="platform-overview-heading" class="text-xs font-semibold text-neutral-900 mb-3 tracking-tight">
          Platform Overview
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Users -->
          <div class="bg-[#f7f5f0] border border-[#d8d3c8] rounded-md p-5">
            <div class="text-xs text-neutral-600 font-normal">Users</div>
            <div class="text-2xl font-bold text-neutral-950 mt-2 mb-1 tracking-tight leading-none">
              {{ formatNumber(metrics?.total_users) }}
            </div>
            <div class="text-[11px] text-neutral-400 font-normal">Registered users</div>
          </div>

          <!-- Card 2: Merchants -->
          <div class="bg-[#f7f5f0] border border-[#d8d3c8] rounded-md p-5">
            <div class="text-xs text-neutral-600 font-normal">Merchants</div>
            <div class="text-2xl font-bold text-neutral-950 mt-2 mb-1 tracking-tight leading-none">
              {{ formatNumber(metrics?.total_merchants) }}
            </div>
            <div class="text-[11px] text-neutral-400 font-normal">Registered merchants</div>
          </div>

          <!-- Card 3: Bookings -->
          <div class="bg-[#f7f5f0] border border-[#d8d3c8] rounded-md p-5">
            <div class="text-xs text-neutral-600 font-normal">Bookings</div>
            <div class="text-2xl font-bold text-neutral-950 mt-2 mb-1 tracking-tight leading-none">
              {{ formatNumber(metrics?.total_bookings) }}
            </div>
            <div class="text-[11px] text-neutral-400 font-normal">Total bookings</div>
          </div>

          <!-- Card 4: Transactions -->
          <div class="bg-[#f7f5f0] border border-[#d8d3c8] rounded-md p-5">
            <div class="text-xs text-neutral-600 font-normal">Transactions</div>
            <div class="text-2xl font-bold text-neutral-950 mt-2 mb-1 tracking-tight leading-none">
              {{ formatNumber(metrics?.total_transactions) }}
            </div>
            <div class="text-[11px] text-neutral-400 font-normal">Recorded transactions</div>
          </div>
        </div>
      </section>

      <!-- Section 2: Platform Revenue Panel -->
      <section aria-labelledby="platform-revenue-heading">
        <div class="bg-[#f7f5f0] border border-[#d8d3c8] rounded-md p-5 flex items-center justify-between">
          <div>
            <h3 id="platform-revenue-heading" class="text-xs font-semibold text-neutral-900 tracking-tight">
              Platform Revenue
            </h3>
            <p class="text-[11px] text-neutral-400 mt-1 font-normal">Platform revenue</p>
          </div>
          <div>
            <div
              v-if="isRevenueAvailable"
              class="text-2xl sm:text-[28px] font-bold text-neutral-950 tracking-tight leading-none"
            >
              {{ formatRupiah(metrics?.platform_revenue) }}
            </div>
            <!-- State 04: Partial Data -->
            <div v-else class="text-right">
              <div class="text-2xl font-bold text-neutral-400 tracking-tight leading-none">—</div>
              <div class="text-[11px] text-red-500 mt-0.5 font-medium">Data unavailable</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 3: Operational Summary -->
      <section aria-labelledby="operational-summary-heading">
        <h2 id="operational-summary-heading" class="text-xs font-semibold text-neutral-900 mb-3.5 tracking-tight">
          Operational Summary
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div class="border-l border-[#dcd7ce] pl-3.5">
            <div class="text-xs text-neutral-500 font-normal mb-1">Approved Merchants</div>
            <div class="text-xl font-bold text-neutral-950 leading-none">
              {{ formatNumber(operational?.approved_merchants) }}
            </div>
          </div>
          <div class="border-l border-[#dcd7ce] pl-3.5">
            <div class="text-xs text-neutral-500 font-normal mb-1">Approved Organizers</div>
            <div class="text-xl font-bold text-neutral-950 leading-none">
              {{ formatNumber(operational?.approved_organizers) }}
            </div>
          </div>
          <div class="border-l border-[#dcd7ce] pl-3.5">
            <div class="text-xs text-neutral-500 font-normal mb-1">Active Venues</div>
            <div class="text-xl font-bold text-neutral-950 leading-none">
              {{ formatNumber(operational?.active_venues) }}
            </div>
          </div>
          <div class="border-l border-[#dcd7ce] pl-3.5">
            <div class="text-xs text-neutral-500 font-normal mb-1">Upcoming Bookings</div>
            <div class="text-xl font-bold text-neutral-950 leading-none">
              {{ formatNumber(operational?.upcoming_bookings) }}
            </div>
          </div>
        </div>
      </section>

      <!-- Section 4: Recent Activity & Quick Actions (Two-Column Layout) -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pt-2">
        <!-- Recent Activity (col-span-3) - Open Table directly on canvas -->
        <section class="lg:col-span-3" aria-labelledby="recent-activity-heading">
          <h2 id="recent-activity-heading" class="text-xs font-semibold text-neutral-900 mb-3.5 tracking-tight">
            Recent Activity
          </h2>
          <div>
            <!-- Table Header -->
            <div class="grid grid-cols-12 pb-3 border-b border-[#e5e0d8] text-xs font-normal text-neutral-500">
              <div class="col-span-6">Type / Entity</div>
              <div class="col-span-3">Status</div>
              <div class="col-span-3 text-right">Date &amp; time</div>
            </div>

            <!-- Populated Rows -->
            <div v-if="activities && activities.length > 0">
              <div
                v-for="item in activities"
                :key="item.id"
                class="grid grid-cols-12 py-3.5 border-b border-[#e5e0d8] items-center"
              >
                <!-- Entity / Type -->
                <div class="col-span-6 pr-4">
                  <div class="text-xs font-semibold text-neutral-900 leading-tight truncate">
                    {{ item.entity }}
                  </div>
                  <div class="text-[11px] text-neutral-400 mt-0.5 font-normal">
                    {{ item.type }}
                  </div>
                </div>

                <!-- Status Badge -->
                <div class="col-span-3">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-normal leading-normal"
                    :class="getStatusClasses(item.status_raw || item.status)"
                  >
                    {{ item.status }}
                  </span>
                </div>

                <!-- Date & Time -->
                <div class="col-span-3 text-right">
                  <div class="text-xs font-normal text-neutral-800 leading-tight">
                    {{ formatActivityDate(item.created_at).date }}
                  </div>
                  <div class="text-[11px] font-normal text-neutral-400 mt-0.5">
                    {{ formatActivityDate(item.created_at).time }}
                  </div>
                </div>
              </div>
            </div>

            <!-- State 02: No Recent Activity Empty State -->
            <div v-else class="py-14 text-center">
              <div class="text-xs font-semibold text-neutral-900">No recent activity</div>
              <div class="text-[11px] text-neutral-400 mt-1 font-normal">
                New platform activity will appear here.
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Actions (col-span-1) -->
        <section aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" class="text-xs font-semibold text-neutral-900 mb-3.5 tracking-tight">
            Quick Actions
          </h2>
          <div class="flex flex-col space-y-2.5">
            <button
              @click="navigateTo('/admin/approvals')"
              type="button"
              class="w-full py-2.5 px-4 bg-[#d85c35] hover:bg-[#c44f2b] text-white text-xs font-semibold rounded-md text-center transition-colors shadow-none cursor-pointer"
            >
              Review Approvals
            </button>
            <button
              @click="navigateTo('/admin/bookings')"
              type="button"
              class="w-full py-2.5 px-4 bg-[#f6f3ec] hover:bg-[#ece8df] border border-[#e0dbd1] text-neutral-900 text-xs font-semibold rounded-md text-center transition-colors cursor-pointer"
            >
              View Bookings
            </button>
            <button
              @click="navigateTo('/admin/refunds')"
              type="button"
              class="w-full py-2.5 px-4 bg-[#f6f3ec] hover:bg-[#ece8df] border border-[#e0dbd1] text-neutral-900 text-xs font-semibold rounded-md text-center transition-colors cursor-pointer"
            >
              Review Refunds
            </button>
            <button
              @click="navigateTo('/admin/reviews')"
              type="button"
              class="w-full py-2.5 px-4 bg-[#f6f3ec] hover:bg-[#ece8df] border border-[#e0dbd1] text-neutral-900 text-xs font-semibold rounded-md text-center transition-colors cursor-pointer"
            >
              Moderate Reviews
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import dashboardService from '../services/dashboard.service'

const router = useRouter()
const authStore = useAuthStore()

const metrics = ref(null)
const operational = ref(null)
const activities = ref([])

const isLoading = ref(true)
const isNetworkError = ref(false)
const isSessionExpired = ref(false)
const isAccessDenied = ref(false)

const adminDisplayName = computed(() => {
  return authStore.user?.name || 'Admin'
})

const adminDisplayRole = computed(() => {
  return authStore.user?.role?.display_name || authStore.user?.role?.name || 'Administrator'
})

const isRevenueAvailable = computed(() => {
  return metrics.value?.platform_revenue !== null && metrics.value?.platform_revenue !== undefined
})

function formatNumber(val) {
  if (val === undefined || val === null || isNaN(Number(val))) return '0'
  return new Intl.NumberFormat('id-ID').format(val)
}

function formatRupiah(amount) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return 'Rp0'
  }
  const numeric = Math.round(Number(amount))
  return 'Rp' + new Intl.NumberFormat('id-ID').format(numeric)
}

function formatActivityDate(dateStr) {
  if (!dateStr) return { date: '-', time: '' }
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return { date: String(dateStr), time: '' }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const date = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  const hours = String(d.getHours()).padStart(2, '0')
  const mins = String(d.getMinutes()).padStart(2, '0')
  return { date, time: `${hours}:${mins}` }
}

function getStatusClasses(rawStatus) {
  const s = String(rawStatus || '').toLowerCase()
  if (s.includes('pending') || s === 'draft' || s === 'held') {
    return 'bg-[#fbeee4] text-[#b25325]'
  }
  if (s.includes('confirmed') || s.includes('approved') || s.includes('succeeded') || s === 'paid' || s === 'active') {
    return 'bg-[#e5f3eb] text-[#266b44]'
  }
  if (s.includes('reject') || s.includes('cancel') || s.includes('fail') || s === 'expired') {
    return 'bg-[#fae8e8] text-[#9b2c2c]'
  }
  return 'bg-neutral-100 text-neutral-600'
}

function navigateTo(path) {
  router.push(path)
}

async function handleSignOut() {
  await authStore.logout()
  router.push('/auth/login')
}

async function fetchDashboardData() {
  isLoading.value = true
  isNetworkError.value = false
  isSessionExpired.value = false
  isAccessDenied.value = false

  try {
    const data = await dashboardService.getOverview()
    metrics.value = data?.metrics || null
    operational.value = data?.operational_summary || null
    activities.value = data?.recent_activity || []
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

onMounted(() => {
  fetchDashboardData()
})
</script>