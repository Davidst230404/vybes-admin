<template>
  <div class="space-y-6">
    <!-- Platform Overview Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-neutral-900 tracking-tight">Platform Overview</h2>
        <p class="text-xs text-neutral-500 mt-0.5">Real-time statistics derived directly from backend database</p>
      </div>

      <div class="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Backend Online</span>
      </div>
    </div>

    <!-- Error State -->
    <ErrorState
      v-if="error"
      title="Failed to load platform metrics"
      :message="error"
      @retry="fetchMetrics"
    />

    <!-- Loading Skeleton -->
    <div v-else-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="bg-white border border-[#e7e5e1] rounded-lg p-5 animate-pulse space-y-2">
        <div class="h-3 bg-neutral-200 rounded w-1/2"></div>
        <div class="h-7 bg-neutral-200 rounded w-3/4"></div>
        <div class="h-3 bg-neutral-100 rounded w-1/3"></div>
      </div>
    </div>

    <!-- Real Metrics Grid -->
    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Users -->
        <div class="bg-white border border-[#e7e5e1] rounded-lg p-5">
          <div class="text-xs font-medium text-neutral-500">Total Users</div>
          <div class="text-2xl font-bold text-neutral-900 mt-1 font-mono">
            {{ formatNumber(metrics?.total_users) }}
          </div>
          <div class="text-[11px] text-neutral-400 mt-1">Platform accounts</div>
        </div>

        <!-- Total Bookings -->
        <div class="bg-white border border-[#e7e5e1] rounded-lg p-5">
          <div class="text-xs font-medium text-neutral-500">Total Bookings</div>
          <div class="text-2xl font-bold text-neutral-900 mt-1 font-mono">
            {{ formatNumber(metrics?.total_bookings) }}
          </div>
          <div class="text-[11px] text-emerald-600 mt-1">
            {{ formatNumber(metrics?.confirmed_bookings) }} confirmed
          </div>
        </div>

        <!-- Total Venues -->
        <div class="bg-white border border-[#e7e5e1] rounded-lg p-5">
          <div class="text-xs font-medium text-neutral-500">Total Venues</div>
          <div class="text-2xl font-bold text-neutral-900 mt-1 font-mono">
            {{ formatNumber(metrics?.total_venues) }}
          </div>
          <div class="text-[11px] text-neutral-400 mt-1">Registered facilities</div>
        </div>

        <!-- Total Events -->
        <div class="bg-white border border-[#e7e5e1] rounded-lg p-5">
          <div class="text-xs font-medium text-neutral-500">Total Events</div>
          <div class="text-2xl font-bold text-neutral-900 mt-1 font-mono">
            {{ formatNumber(metrics?.total_events) }}
          </div>
          <div class="text-[11px] text-neutral-400 mt-1">Organized events</div>
        </div>

        <!-- Total Revenue -->
        <div class="bg-white border border-[#e7e5e1] rounded-lg p-5">
          <div class="text-xs font-medium text-neutral-500">Total Revenue (Paid)</div>
          <div class="text-xl font-bold text-neutral-900 mt-1 font-mono">
            {{ formatCurrency(metrics?.total_revenue || 0) }}
          </div>
          <div class="text-[11px] text-emerald-600 mt-1">Settled payments</div>
        </div>

        <!-- Total Refunds -->
        <div class="bg-white border border-[#e7e5e1] rounded-lg p-5">
          <div class="text-xs font-medium text-neutral-500">Total Refunds</div>
          <div class="text-xl font-bold text-neutral-900 mt-1 font-mono">
            {{ formatCurrency(metrics?.total_refunds || 0) }}
          </div>
          <div class="text-[11px] text-neutral-400 mt-1">Succeeded refunds</div>
        </div>

        <!-- Pending Approvals -->
        <div class="bg-white border border-[#e7e5e1] rounded-lg p-5">
          <div class="text-xs font-medium text-neutral-500">Pending Approvals</div>
          <div class="text-2xl font-bold text-[#f25c05] mt-1 font-mono">
            {{ formatNumber(metrics?.pending_approvals) }}
          </div>
          <div class="text-[11px] text-neutral-500 mt-1">
            {{ breakdown?.merchants || 0 }} merchants · {{ breakdown?.organizers || 0 }} organizers
          </div>
        </div>

        <!-- Net Balance Indicator -->
        <div class="bg-white border border-[#e7e5e1] rounded-lg p-5">
          <div class="text-xs font-medium text-neutral-500">Net Processed</div>
          <div class="text-xl font-bold text-neutral-900 mt-1 font-mono">
            {{ formatCurrency((metrics?.total_revenue || 0) - (metrics?.total_refunds || 0)) }}
          </div>
          <div class="text-[11px] text-neutral-400 mt-1">Revenue minus refunds</div>
        </div>
      </div>

      <!-- Current Administrator Session Card -->
      <div class="bg-white border border-[#e7e5e1] rounded-lg p-6">
        <h3 class="text-sm font-semibold text-neutral-900 mb-4">Current Administrator Session</h3>
        <div v-if="authStore.user" class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="p-3 bg-neutral-50 border border-neutral-200/60 rounded-md">
            <span class="text-neutral-400 block text-[11px] mb-0.5">Admin Name</span>
            <span class="font-medium text-neutral-900">{{ authStore.user.name }}</span>
          </div>

          <div class="p-3 bg-neutral-50 border border-neutral-200/60 rounded-md">
            <span class="text-neutral-400 block text-[11px] mb-0.5">Email Address</span>
            <span class="font-medium text-neutral-900">{{ authStore.user.email }}</span>
          </div>

          <div class="p-3 bg-neutral-50 border border-neutral-200/60 rounded-md">
            <span class="text-neutral-400 block text-[11px] mb-0.5">Assigned Role</span>
            <span class="inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-orange-50 text-[#f25c05] border border-orange-200 rounded">
              {{ authStore.user.role?.display_name || authStore.user.role?.name || 'Administrator' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import dashboardService from '../services/dashboard.service'
import { formatCurrency } from '../utils/formatters'
import ErrorState from '../components/feedback/ErrorState.vue'

const authStore = useAuthStore()
const metrics = ref(null)
const breakdown = ref(null)
const isLoading = ref(true)
const error = ref(null)

function formatNumber(val) {
  if (val === undefined || val === null) return '0'
  return new Intl.NumberFormat('id-ID').format(val)
}

async function fetchMetrics() {
  isLoading.value = true
  error.value = null
  try {
    const data = await dashboardService.getOverview()
    metrics.value = data?.metrics || null
    breakdown.value = data?.pending_breakdown || null
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to connect to backend analytics service.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchMetrics()
})
</script>