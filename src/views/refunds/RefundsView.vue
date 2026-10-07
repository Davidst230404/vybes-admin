<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-neutral-900 tracking-tight">Refunds Management</h2>
        <p class="text-xs text-neutral-500 mt-0.5">Track and issue customer payment refunds via backend refund service</p>
      </div>

      <button
        @click="openCreateModal"
        type="button"
        class="inline-flex items-center px-3.5 py-1.5 bg-[#f25c05] hover:bg-[#dc5202] text-white text-xs font-medium rounded-md transition-colors"
      >
        <svg class="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Issue Refund
      </button>
    </div>

    <!-- Feedback Banners -->
    <div
      v-if="successMessage"
      class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between"
    >
      <span>{{ successMessage }}</span>
      <button @click="successMessage = null" class="text-emerald-600 hover:text-emerald-900 font-bold ml-2">×</button>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white border border-[#e7e5e1] rounded-lg p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="flex items-center space-x-2">
        <label for="refund-status-filter" class="text-xs text-neutral-500 font-medium">Status Filter:</label>
        <select
          id="refund-status-filter"
          v-model="filters.status"
          @change="handleSearch"
          class="text-xs border border-neutral-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#f25c05] bg-white text-neutral-800"
        >
          <option value="">All Statuses</option>
          <option value="succeeded">Succeeded</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div class="flex items-center space-x-2">
        <button
          v-if="filters.status"
          @click="resetFilters"
          type="button"
          class="px-2.5 py-1.5 text-neutral-500 hover:text-neutral-700 text-xs font-medium"
        >
          Reset Filter
        </button>
      </div>
    </div>

    <!-- Error State -->
    <ErrorState
      v-if="error"
      title="Failed to load refunds"
      :message="error"
      @retry="fetchRefunds"
    />

    <!-- Main Table Container -->
    <div v-else class="bg-white border border-[#e7e5e1] rounded-lg overflow-hidden">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="p-6">
        <LoadingSkeleton :rows="6" />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else-if="refunds.length === 0"
        title="No refunds found"
        description="There are currently no refund transactions matching your criteria."
      />

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-[#e7e5e1] bg-neutral-50/75 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              <th class="py-3 px-4 w-16">ID</th>
              <th class="py-3 px-4">Payment Ref</th>
              <th class="py-3 px-4">Amount</th>
              <th class="py-3 px-4">Reason</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Requested At</th>
              <th class="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#e7e5e1] text-xs">
            <tr
              v-for="r in refunds"
              :key="r.id"
              class="hover:bg-neutral-50/50 transition-colors"
            >
              <td class="py-3 px-4 font-mono text-neutral-500 font-medium">#{{ r.id }}</td>
              <td class="py-3 px-4">
                <div class="font-mono text-neutral-900 font-medium">
                  {{ r.payment?.reference_id || `Payment #${r.payment_id}` }}
                </div>
                <div v-if="r.reference_id" class="text-[11px] font-mono text-neutral-400">
                  Ref: {{ r.reference_id }}
                </div>
              </td>
              <td class="py-3 px-4 font-mono font-medium text-neutral-900">
                {{ formatCurrency(r.amount) }}
              </td>
              <td class="py-3 px-4 text-neutral-600 max-w-xs truncate">
                {{ r.reason || 'N/A' }}
              </td>
              <td class="py-3 px-4">
                <StatusBadge :status="r.status" />
              </td>
              <td class="py-3 px-4 text-neutral-500">
                {{ formatDate(r.requested_at || r.created_at) }}
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  @click="openDetailModal(r)"
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

    <!-- Refund Detail Modal -->
    <BaseModal
      :is-open="detailModalOpen"
      title="Refund Transaction Overview"
      @close="detailModalOpen = false"
    >
      <div v-if="selectedRefund" class="space-y-4 text-xs">
        <!-- Status Header -->
        <div class="flex items-center justify-between p-3 bg-neutral-50 rounded-md border border-neutral-200">
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Refund Transaction</span>
            <span class="font-mono text-sm font-bold text-neutral-900">#{{ selectedRefund.id }}</span>
          </div>
          <StatusBadge :status="selectedRefund.status" />
        </div>

        <!-- Detail Grid -->
        <div class="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-md border border-neutral-200">
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Refund Amount</span>
            <span class="font-mono font-bold text-[#f25c05] mt-0.5 block">{{ formatCurrency(selectedRefund.amount) }}</span>
          </div>
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Provider</span>
            <span class="font-medium text-neutral-900 uppercase mt-0.5 block">{{ selectedRefund.provider || 'Xendit' }}</span>
          </div>
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Payment ID</span>
            <span class="font-mono text-neutral-800 mt-0.5 block">#{{ selectedRefund.payment_id }}</span>
          </div>
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Provider Refund ID</span>
            <span class="font-mono text-neutral-600 mt-0.5 block truncate">{{ selectedRefund.provider_refund_id || 'N/A' }}</span>
          </div>
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Requested At</span>
            <span class="text-neutral-700 mt-0.5 block">{{ formatDateTime(selectedRefund.requested_at || selectedRefund.created_at) }}</span>
          </div>
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Succeeded At</span>
            <span class="text-neutral-700 mt-0.5 block">{{ selectedRefund.succeeded_at ? formatDateTime(selectedRefund.succeeded_at) : 'N/A' }}</span>
          </div>
        </div>

        <!-- Reason -->
        <div class="p-3 border border-neutral-200 rounded-md">
          <div class="text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">Reason / Notes</div>
          <p class="text-neutral-800">{{ selectedRefund.reason || 'No specific reason provided.' }}</p>
        </div>

        <!-- Failure Details if failed -->
        <div v-if="selectedRefund.status === 'failed' || selectedRefund.failure_reason" class="p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
          <div class="text-[11px] font-semibold uppercase tracking-wider mb-1">Failure Reason</div>
          <p>{{ selectedRefund.failure_reason || selectedRefund.failure_code || 'Provider rejected refund processing.' }}</p>
        </div>

        <!-- Associated Payment Details -->
        <div v-if="selectedRefund.payment" class="p-3 border border-neutral-200 rounded-md space-y-1.5">
          <div class="text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">Original Payment Details</div>
          <div class="grid grid-cols-2 gap-2 text-neutral-700">
            <div><span class="text-neutral-400">Original Amount:</span> <span class="font-mono font-medium">{{ formatCurrency(selectedRefund.payment.amount) }}</span></div>
            <div><span class="text-neutral-400">Payment Status:</span> <span class="capitalize font-medium">{{ selectedRefund.payment.status }}</span></div>
            <div><span class="text-neutral-400">Payment Method:</span> <span class="font-mono">{{ selectedRefund.payment.payment_method || 'N/A' }}</span></div>
            <div><span class="text-neutral-400">Reference:</span> <span class="font-mono truncate">{{ selectedRefund.payment.reference_id || 'N/A' }}</span></div>
          </div>
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

    <!-- Issue Refund Modal -->
    <BaseModal
      :is-open="createModalOpen"
      title="Issue Customer Refund"
      @close="closeCreateModal"
    >
      <form @submit.prevent="submitCreateRefund" class="space-y-3.5 text-xs">
        <div v-if="formError" class="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          {{ formError }}
        </div>

        <!-- Payment ID -->
        <div>
          <label class="block font-medium text-neutral-700 mb-1">
            Payment ID <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="refundForm.payment_id"
            type="number"
            min="1"
            required
            placeholder="e.g. 12"
            class="w-full text-xs font-mono px-3 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:border-[#f25c05]"
            :class="{ 'border-red-400': validationErrors.payment_id }"
          />
          <p v-if="validationErrors.payment_id" class="text-[11px] text-red-600 mt-1">
            {{ validationErrors.payment_id[0] }}
          </p>
        </div>

        <!-- Amount (Optional) -->
        <div>
          <label class="block font-medium text-neutral-700 mb-1">
            Refund Amount (IDR) <span class="text-neutral-400 font-normal">(optional, leave blank for full refund)</span>
          </label>
          <input
            v-model.number="refundForm.amount"
            type="number"
            min="1"
            placeholder="e.g. 150000"
            class="w-full text-xs font-mono px-3 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:border-[#f25c05]"
            :class="{ 'border-red-400': validationErrors.amount }"
          />
          <p v-if="validationErrors.amount" class="text-[11px] text-red-600 mt-1">
            {{ validationErrors.amount[0] }}
          </p>
        </div>

        <!-- Reason -->
        <div>
          <label class="block font-medium text-neutral-700 mb-1">
            Reason / Operational Notes
          </label>
          <input
            v-model="refundForm.reason"
            type="text"
            maxlength="100"
            placeholder="e.g. Venue maintenance cancellation"
            class="w-full text-xs px-3 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:border-[#f25c05]"
            :class="{ 'border-red-400': validationErrors.reason }"
          />
          <p v-if="validationErrors.reason" class="text-[11px] text-red-600 mt-1">
            {{ validationErrors.reason[0] }}
          </p>
        </div>

        <!-- Form Actions -->
        <div class="pt-3 border-t border-neutral-200 flex justify-end space-x-2">
          <button
            @click="closeCreateModal"
            :disabled="isSubmitting"
            type="button"
            class="px-3.5 py-1.5 border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 text-neutral-700 text-xs font-medium rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            :disabled="isSubmitting"
            type="submit"
            class="px-3.5 py-1.5 bg-[#f25c05] hover:bg-[#dc5202] disabled:opacity-50 text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5"
          >
            <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>Process Refund</span>
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import refundService from '../../services/refund.service'
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters'
import StatusBadge from '../../components/feedback/StatusBadge.vue'
import TablePagination from '../../components/tables/TablePagination.vue'
import LoadingSkeleton from '../../components/feedback/LoadingSkeleton.vue'
import EmptyState from '../../components/feedback/EmptyState.vue'
import ErrorState from '../../components/feedback/ErrorState.vue'
import BaseModal from '../../components/overlays/BaseModal.vue'

const refunds = ref([])
const meta = ref(null)
const isLoading = ref(true)
const error = ref(null)
const successMessage = ref(null)

const filters = reactive({
  status: '',
  page: 1,
  per_page: 15,
})

// Modals
const detailModalOpen = ref(false)
const selectedRefund = ref(null)

const createModalOpen = ref(false)
const isSubmitting = ref(false)
const formError = ref(null)
const validationErrors = ref({})
const refundForm = reactive({
  payment_id: '',
  amount: null,
  reason: '',
})

async function fetchRefunds() {
  isLoading.value = true
  error.value = null
  try {
    const params = {
      page: filters.page,
      per_page: filters.per_page,
    }
    if (filters.status) {
      params.status = filters.status
    }

    const response = await refundService.list(params)
    refunds.value = response.data || []
    meta.value = response.meta || null
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to retrieve refunds.'
  } finally {
    isLoading.value = false
  }
}

function handleSearch() {
  filters.page = 1
  fetchRefunds()
}

function resetFilters() {
  filters.status = ''
  filters.page = 1
  fetchRefunds()
}

function handlePageChange(newPage) {
  filters.page = newPage
  fetchRefunds()
}

async function openDetailModal(r) {
  try {
    const full = await refundService.get(r.id)
    selectedRefund.value = full
  } catch {
    selectedRefund.value = r
  }
  detailModalOpen.value = true
}

function openCreateModal() {
  refundForm.payment_id = ''
  refundForm.amount = null
  refundForm.reason = ''
  formError.value = null
  validationErrors.value = {}
  createModalOpen.value = true
}

function closeCreateModal() {
  if (isSubmitting.value) return
  createModalOpen.value = false
}

async function submitCreateRefund() {
  isSubmitting.value = true
  formError.value = null
  validationErrors.value = {}

  try {
    const payload = {
      payment_id: Number(refundForm.payment_id),
      reason: refundForm.reason?.trim() || undefined,
    }
    if (refundForm.amount && Number(refundForm.amount) > 0) {
      payload.amount = Number(refundForm.amount)
    }

    const res = await refundService.create(payload)
    successMessage.value = res.message || 'Refund successfully processed.'
    createModalOpen.value = false
    await fetchRefunds()
  } catch (err) {
    if (err.response?.status === 422) {
      validationErrors.value = err.response.data?.errors || {}
      formError.value = err.response.data?.message || 'Validation failed. Please verify payment ID and amount.'
    } else {
      formError.value = err.response?.data?.message || 'Failed to process refund.'
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchRefunds()
})
</script>
