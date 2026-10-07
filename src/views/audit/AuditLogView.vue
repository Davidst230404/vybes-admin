<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-neutral-900 tracking-tight">Audit Trail</h2>
        <p class="text-xs text-neutral-500 mt-0.5">Immutable operational audit logs recorded per PRD Section 15.3 & 15.4</p>
      </div>

      <div class="flex items-center space-x-2">
        <span class="inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
          <svg class="w-3 h-3 mr-1 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Append-Only / Read-Only
        </span>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white border border-[#e7e5e1] rounded-lg p-3.5 flex flex-wrap items-center gap-3 text-xs">
      <!-- Action Filter -->
      <div class="w-full sm:w-44">
        <label for="filter-action" class="block text-[11px] font-medium text-neutral-500 mb-1">Action</label>
        <input
          id="filter-action"
          v-model="filters.action"
          type="text"
          placeholder="e.g. category.create"
          class="w-full px-2.5 py-1.5 border border-[#e7e5e1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#f25c05]"
          @keyup.enter="applyFilters"
        />
      </div>

      <!-- Entity Type Filter -->
      <div class="w-full sm:w-40">
        <label for="filter-entity" class="block text-[11px] font-medium text-neutral-500 mb-1">Entity Type</label>
        <select
          id="filter-entity"
          v-model="filters.entity_type"
          class="w-full px-2.5 py-1.5 border border-[#e7e5e1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#f25c05] bg-white text-xs"
        >
          <option value="">All Entities</option>
          <option value="category">Category</option>
          <option value="merchant">Merchant</option>
          <option value="organizer">Organizer</option>
          <option value="user">User</option>
          <option value="refund">Refund</option>
          <option value="platform_setting">Platform Setting</option>
        </select>
      </div>

      <!-- Date Range: From -->
      <div class="w-full sm:w-36">
        <label for="filter-from" class="block text-[11px] font-medium text-neutral-500 mb-1">From Date</label>
        <input
          id="filter-from"
          v-model="filters.from_date"
          type="date"
          class="w-full px-2 py-1.5 border border-[#e7e5e1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#f25c05] text-xs"
        />
      </div>

      <!-- Date Range: To -->
      <div class="w-full sm:w-36">
        <label for="filter-to" class="block text-[11px] font-medium text-neutral-500 mb-1">To Date</label>
        <input
          id="filter-to"
          v-model="filters.to_date"
          type="date"
          class="w-full px-2 py-1.5 border border-[#e7e5e1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#f25c05] text-xs"
        />
      </div>

      <!-- Buttons -->
      <div class="flex items-end space-x-2 pt-4 sm:pt-0 sm:self-end">
        <button
          type="button"
          @click="applyFilters"
          class="px-3.5 py-1.5 bg-[#f25c05] hover:bg-[#dc5202] text-white text-xs font-medium rounded-md transition-colors"
        >
          Filter
        </button>
        <button
          type="button"
          @click="resetFilters"
          class="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-md transition-colors"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Error State -->
    <ErrorState
      v-if="error"
      title="Failed to load audit logs"
      :message="error"
      @retry="fetchLogs"
    />

    <!-- Main Container -->
    <div v-else class="bg-white border border-[#e7e5e1] rounded-lg overflow-hidden">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="p-6">
        <LoadingSkeleton :rows="8" />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else-if="logs.length === 0"
        title="No audit entries found"
        description="There are currently no recorded administrative activities matching your filters."
      />

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-[#e7e5e1] bg-neutral-50/75 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              <th class="py-3 px-4 w-40">Timestamp</th>
              <th class="py-3 px-4">Actor</th>
              <th class="py-3 px-4">Action</th>
              <th class="py-3 px-4">Entity</th>
              <th class="py-3 px-4">IP Address</th>
              <th class="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#e7e5e1] text-xs">
            <tr
              v-for="log in logs"
              :key="log.id"
              class="hover:bg-neutral-50/50 transition-colors"
            >
              <!-- Timestamp -->
              <td class="py-3 px-4 font-mono text-[11px] text-neutral-600 whitespace-nowrap">
                {{ formatDateTime(log.created_at) }}
              </td>

              <!-- Actor -->
              <td class="py-3 px-4">
                <div v-if="log.actor" class="font-medium text-neutral-900">
                  {{ log.actor.name }}
                  <div class="text-[11px] text-neutral-500 font-normal">{{ log.actor.email }}</div>
                </div>
                <span v-else class="text-neutral-400 italic">System / CLI</span>
              </td>

              <!-- Action -->
              <td class="py-3 px-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
                  {{ log.action }}
                </span>
              </td>

              <!-- Entity -->
              <td class="py-3 px-4">
                <span class="font-medium text-neutral-800 capitalize">{{ log.entity_type }}</span>
                <span v-if="log.entity_id" class="text-neutral-400 font-mono text-[11px] ml-1.5">
                  #{{ log.entity_id }}
                </span>
              </td>

              <!-- IP Address -->
              <td class="py-3 px-4 font-mono text-[11px] text-neutral-500">
                {{ log.ip_address || '—' }}
              </td>

              <!-- Actions -->
              <td class="py-3 px-4 text-right">
                <button
                  type="button"
                  @click="inspectLog(log)"
                  class="text-xs text-[#f25c05] hover:text-[#dc5202] font-medium"
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
        :meta="meta"
        :disabled="isLoading"
        @change-page="handlePageChange"
      />
    </div>

    <!-- Details Modal -->
    <div
      v-if="selectedLog"
      class="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4"
      @click.self="selectedLog = null"
    >
      <div class="bg-white rounded-lg border border-[#e7e5e1] max-w-xl w-full p-6 space-y-4 shadow-xl">
        <div class="flex items-center justify-between pb-3 border-b border-[#e7e5e1]">
          <div>
            <h3 class="text-sm font-semibold text-neutral-900">Audit Record #{{ selectedLog.id }}</h3>
            <p class="text-xs text-neutral-500">{{ formatDateTime(selectedLog.created_at) }}</p>
          </div>
          <button
            type="button"
            @click="selectedLog = null"
            class="text-neutral-400 hover:text-neutral-700 text-lg font-bold"
          >
            ×
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-2 bg-neutral-50 p-3 rounded border border-neutral-200 text-[11px]">
            <div>
              <span class="text-neutral-500">Actor:</span>
              <div class="font-semibold text-neutral-800">{{ selectedLog.actor?.name || 'System' }} ({{ selectedLog.actor?.email || 'N/A' }})</div>
            </div>
            <div>
              <span class="text-neutral-500">Action:</span>
              <div class="font-mono font-semibold text-neutral-800">{{ selectedLog.action }}</div>
            </div>
            <div>
              <span class="text-neutral-500">Target Entity:</span>
              <div class="font-semibold text-neutral-800">{{ selectedLog.entity_type }} #{{ selectedLog.entity_id || 'N/A' }}</div>
            </div>
            <div>
              <span class="text-neutral-500">IP / User Agent:</span>
              <div class="text-neutral-800 truncate" :title="selectedLog.user_agent">{{ selectedLog.ip_address || '—' }}</div>
            </div>
          </div>

          <!-- Before / After State -->
          <div v-if="selectedLog.before || selectedLog.after" class="space-y-2">
            <h4 class="font-semibold text-neutral-700 text-[11px] uppercase tracking-wider">Change Traceability</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10px]">
              <div class="border border-neutral-200 rounded p-2.5 bg-neutral-50 overflow-x-auto">
                <div class="text-neutral-500 font-sans font-medium mb-1">State Before:</div>
                <pre>{{ JSON.stringify(selectedLog.before, null, 2) || 'null' }}</pre>
              </div>
              <div class="border border-neutral-200 rounded p-2.5 bg-neutral-50 overflow-x-auto">
                <div class="text-neutral-500 font-sans font-medium mb-1">State After:</div>
                <pre>{{ JSON.stringify(selectedLog.after, null, 2) || 'null' }}</pre>
              </div>
            </div>
          </div>

          <!-- Metadata Context -->
          <div v-if="selectedLog.metadata" class="space-y-1">
            <h4 class="font-semibold text-neutral-700 text-[11px] uppercase tracking-wider">Metadata Context</h4>
            <pre class="border border-neutral-200 rounded p-2.5 bg-neutral-50 font-mono text-[10px] overflow-x-auto max-h-48">{{ JSON.stringify(selectedLog.metadata, null, 2) }}</pre>
          </div>
        </div>

        <div class="pt-3 border-t border-[#e7e5e1] flex justify-end">
          <button
            type="button"
            @click="selectedLog = null"
            class="px-4 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import auditService from '../../services/audit.service.js'
import ErrorState from '../../components/feedback/ErrorState.vue'
import EmptyState from '../../components/feedback/EmptyState.vue'
import LoadingSkeleton from '../../components/feedback/LoadingSkeleton.vue'
import TablePagination from '../../components/tables/TablePagination.vue'

const isLoading = ref(true)
const error = ref(null)
const logs = ref([])
const meta = ref(null)
const selectedLog = ref(null)

const filters = reactive({
  action: '',
  entity_type: '',
  from_date: '',
  to_date: '',
  page: 1,
  per_page: 20,
})

async function fetchLogs() {
  isLoading.value = true
  error.value = null

  try {
    const params = {
      page: filters.page,
      per_page: filters.per_page,
    }

    if (filters.action) params.action = filters.action.trim()
    if (filters.entity_type) params.entity_type = filters.entity_type
    if (filters.from_date) params.from_date = filters.from_date
    if (filters.to_date) params.to_date = filters.to_date

    const res = await auditService.list(params)
    logs.value = res.data || []
    meta.value = res.meta || null
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to fetch audit logs.'
  } finally {
    isLoading.value = false
  }
}

function applyFilters() {
  filters.page = 1
  fetchLogs()
}

function resetFilters() {
  filters.action = ''
  filters.entity_type = ''
  filters.from_date = ''
  filters.to_date = ''
  filters.page = 1
  fetchLogs()
}

function handlePageChange(newPage) {
  filters.page = newPage
  fetchLogs()
}

function inspectLog(log) {
  selectedLog.value = log
}

function formatDateTime(isoString) {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

onMounted(() => {
  fetchLogs()
})
</script>
