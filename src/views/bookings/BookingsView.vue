<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-neutral-900 tracking-tight">Bookings Supervision</h2>
        <p class="text-xs text-neutral-500 mt-0.5">Read-only platform supervision for venue reservations and customer bookings</p>
      </div>

      <div class="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200">
        Supervisory Mode (Read-Only)
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white border border-[#e7e5e1] rounded-lg p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="w-full sm:w-72 relative">
        <input
          v-model="filters.booking_code"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="Search by booking code..."
          class="w-full text-xs font-mono pl-8 pr-3 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:border-[#f25c05] focus:ring-1 focus:ring-[#f25c05]"
        />
        <svg class="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Filters & Actions -->
      <div class="w-full sm:w-auto flex items-center justify-end space-x-2.5">
        <label for="booking-status-filter" class="sr-only">Filter by Status</label>
        <select
          id="booking-status-filter"
          v-model="filters.status"
          @change="handleSearch"
          class="text-xs border border-neutral-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#f25c05] bg-white text-neutral-700"
        >
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="waiting_payment">Waiting Payment</option>
          <option value="held">Held</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          @click="handleSearch"
          type="button"
          class="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-md transition-colors"
        >
          Filter
        </button>

        <button
          v-if="filters.booking_code || filters.status"
          @click="resetFilters"
          type="button"
          class="px-2.5 py-1.5 text-neutral-500 hover:text-neutral-700 text-xs font-medium"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Error State -->
    <ErrorState
      v-if="error"
      title="Failed to load bookings"
      :message="error"
      @retry="fetchBookings"
    />

    <!-- Main Container -->
    <div v-else class="bg-white border border-[#e7e5e1] rounded-lg overflow-hidden">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="p-6">
        <LoadingSkeleton :rows="6" />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else-if="bookings.length === 0"
        title="No bookings found"
        description="There are currently no bookings matching your search or status filter."
      />

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-[#e7e5e1] bg-neutral-50/75 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              <th class="py-3 px-4">Code</th>
              <th class="py-3 px-4">Customer</th>
              <th class="py-3 px-4">Venue</th>
              <th class="py-3 px-4">Schedule</th>
              <th class="py-3 px-4">Total Amount</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#e7e5e1] text-xs">
            <tr
              v-for="b in bookings"
              :key="b.id"
              class="hover:bg-neutral-50/50 transition-colors"
            >
              <td class="py-3 px-4 font-mono font-semibold text-neutral-900">
                {{ b.booking_code }}
              </td>
              <td class="py-3 px-4">
                <div class="font-medium text-neutral-900">{{ b.user?.name || 'Customer' }}</div>
                <div class="text-[11px] font-mono text-neutral-400">{{ b.user?.email }}</div>
              </td>
              <td class="py-3 px-4">
                <div class="font-medium text-neutral-900">{{ b.venue?.name || 'Venue' }}</div>
                <div class="text-[11px] text-neutral-400">{{ b.venue?.city }}</div>
              </td>
              <td class="py-3 px-4 text-neutral-600">
                <div>{{ formatDate(b.starts_at) }}</div>
                <div class="text-[11px] text-neutral-400">Qty: {{ b.quantity }}</div>
              </td>
              <td class="py-3 px-4 font-mono font-medium text-neutral-900">
                {{ formatCurrency(b.total_amount) }}
              </td>
              <td class="py-3 px-4">
                <StatusBadge :status="b.status" />
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  @click="openDetailModal(b)"
                  type="button"
                  class="px-2.5 py-1 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 font-medium rounded text-[11px] transition-colors"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <TablePagination
        v-if="meta"
        :meta="meta"
        :disabled="isLoading"
        @change-page="handlePageChange"
      />
    </div>

    <!-- Booking Detail Modal -->
    <BaseModal
      :is-open="detailModalOpen"
      title="Booking Detail Overview"
      @close="detailModalOpen = false"
    >
      <div v-if="selectedBooking" class="space-y-4 text-xs">
        <!-- Top Status Summary -->
        <div class="flex items-center justify-between p-3 bg-neutral-50 rounded-md border border-neutral-200">
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Booking Reference</span>
            <span class="font-mono text-sm font-bold text-neutral-900">{{ selectedBooking.booking_code }}</span>
          </div>
          <StatusBadge :status="selectedBooking.status" />
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-md border border-neutral-200">
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Customer</span>
            <span class="font-medium text-neutral-900">{{ selectedBooking.user?.name || 'N/A' }}</span>
            <span class="block text-[11px] font-mono text-neutral-400">{{ selectedBooking.user?.email }}</span>
          </div>
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Venue Location</span>
            <span class="font-medium text-neutral-900">{{ selectedBooking.venue?.name || 'N/A' }}</span>
            <span class="block text-[11px] text-neutral-400">{{ selectedBooking.venue?.city }}</span>
          </div>
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Starts At</span>
            <span class="text-neutral-800">{{ formatDateTime(selectedBooking.starts_at) }}</span>
          </div>
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Ends At</span>
            <span class="text-neutral-800">{{ formatDateTime(selectedBooking.ends_at) }}</span>
          </div>
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Hold Expires At</span>
            <span class="text-neutral-600">{{ selectedBooking.hold_expires_at ? formatDateTime(selectedBooking.hold_expires_at) : 'N/A' }}</span>
          </div>
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Confirmed At</span>
            <span class="text-neutral-600">{{ selectedBooking.confirmed_at ? formatDateTime(selectedBooking.confirmed_at) : 'N/A' }}</span>
          </div>
        </div>

        <!-- Pricing Summary -->
        <div class="p-3 border border-neutral-200 rounded-md space-y-1.5">
          <div class="text-[11px] font-semibold text-neutral-800 uppercase tracking-wider mb-1">Financial Breakdown</div>
          <div class="flex justify-between text-neutral-600">
            <span>Subtotal (Qty: {{ selectedBooking.quantity }})</span>
            <span class="font-mono">{{ formatCurrency(selectedBooking.subtotal) }}</span>
          </div>
          <div class="flex justify-between font-bold text-neutral-900 pt-1.5 border-t border-neutral-200 text-sm">
            <span>Total Amount</span>
            <span class="font-mono text-[#f25c05]">{{ formatCurrency(selectedBooking.total_amount) }}</span>
          </div>
        </div>

        <!-- Associated Payment Info -->
        <div v-if="selectedBooking.payment" class="p-3 border border-neutral-200 rounded-md space-y-1">
          <div class="text-[11px] font-semibold text-neutral-800 uppercase tracking-wider mb-1">Payment Transaction</div>
          <div class="grid grid-cols-2 gap-2 text-neutral-700">
            <div><span class="text-neutral-400">Payment ID:</span> <span class="font-mono">#{{ selectedBooking.payment.id }}</span></div>
            <div><span class="text-neutral-400">Status:</span> <span class="capitalize font-medium">{{ selectedBooking.payment.status }}</span></div>
            <div><span class="text-neutral-400">Method:</span> <span class="font-mono">{{ selectedBooking.payment.payment_method || 'N/A' }}</span></div>
            <div><span class="text-neutral-400">Reference:</span> <span class="font-mono truncate">{{ selectedBooking.payment.reference_id || 'N/A' }}</span></div>
          </div>
        </div>

        <!-- Booked Items -->
        <div v-if="selectedBooking.items && selectedBooking.items.length > 0" class="p-3 border border-neutral-200 rounded-md">
          <div class="text-[11px] font-semibold text-neutral-800 uppercase tracking-wider mb-2">Booked Items / Resources</div>
          <div class="divide-y divide-neutral-100">
            <div
              v-for="item in selectedBooking.items"
              :key="item.id"
              class="py-1.5 flex justify-between items-center text-xs"
            >
              <div>
                <span class="font-medium text-neutral-800">{{ item.resource?.name || 'Resource' }}</span>
                <span class="text-neutral-400 text-[11px] ml-2">Qty: {{ item.quantity }}</span>
              </div>
              <span class="font-mono text-neutral-700">{{ formatCurrency(item.subtotal || item.price) }}</span>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="selectedBooking.notes" class="p-2.5 bg-neutral-50 rounded border border-neutral-200 text-[11px] text-neutral-600">
          <span class="font-semibold text-neutral-700">Notes:</span> {{ selectedBooking.notes }}
        </div>
      </div>

      <template #footer>
        <button
          @click="detailModalOpen = false"
          type="button"
          class="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-md transition-colors"
        >
          Close
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import bookingService from '../../services/booking.service'
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters'
import StatusBadge from '../../components/feedback/StatusBadge.vue'
import TablePagination from '../../components/tables/TablePagination.vue'
import LoadingSkeleton from '../../components/feedback/LoadingSkeleton.vue'
import EmptyState from '../../components/feedback/EmptyState.vue'
import ErrorState from '../../components/feedback/ErrorState.vue'
import BaseModal from '../../components/overlays/BaseModal.vue'

const bookings = ref([])
const meta = ref(null)
const isLoading = ref(true)
const error = ref(null)

const filters = reactive({
  booking_code: '',
  status: '',
  page: 1,
  per_page: 15,
})

const detailModalOpen = ref(false)
const selectedBooking = ref(null)

async function fetchBookings() {
  isLoading.value = true
  error.value = null
  try {
    const params = {
      page: filters.page,
      per_page: filters.per_page,
    }
    if (filters.booking_code.trim()) {
      params.booking_code = filters.booking_code.trim()
    }
    if (filters.status) {
      params.status = filters.status
    }

    const response = await bookingService.list(params)
    bookings.value = response.data || []
    meta.value = response.meta || null
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to retrieve bookings.'
  } finally {
    isLoading.value = false
  }
}

function handleSearch() {
  filters.page = 1
  fetchBookings()
}

function resetFilters() {
  filters.booking_code = ''
  filters.status = ''
  filters.page = 1
  fetchBookings()
}

function handlePageChange(newPage) {
  filters.page = newPage
  fetchBookings()
}

async function openDetailModal(b) {
  try {
    const full = await bookingService.get(b.id)
    selectedBooking.value = full
  } catch {
    selectedBooking.value = b
  }
  detailModalOpen.value = true
}

onMounted(() => {
  fetchBookings()
})
</script>
