<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-neutral-900 tracking-tight">Venues Supervision</h2>
        <p class="text-xs text-neutral-500 mt-0.5">Read-only platform supervision for merchant facilities and partner venues</p>
      </div>

      <div class="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200">
        Supervisory Mode (Read-Only)
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white border border-[#e7e5e1] rounded-lg p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="w-full sm:w-72 relative">
        <label for="venue-search-input" class="sr-only">Search by venue name or city</label>
        <input
          id="venue-search-input"
          v-model="filters.search"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="Search by venue name or city..."
          aria-label="Search by venue name or city"
          class="w-full text-xs pl-8 pr-3 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:border-[#f25c05] focus:ring-1 focus:ring-[#f25c05]"
        />
        <svg class="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Filters & Actions -->
      <div class="w-full sm:w-auto flex items-center justify-end space-x-2.5">
        <label for="venue-status-filter" class="sr-only">Filter by Status</label>
        <select
          id="venue-status-filter"
          v-model="filters.status"
          @change="handleSearch"
          class="text-xs border border-neutral-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#f25c05] bg-white text-neutral-700"
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          @click="handleSearch"
          type="button"
          class="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-md transition-colors"
        >
          Filter
        </button>

        <button
          v-if="filters.search || filters.status"
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
      title="Failed to load venues"
      :message="error"
      @retry="fetchVenues"
    />

    <!-- Main Table Container -->
    <div v-else class="bg-white border border-[#e7e5e1] rounded-lg overflow-hidden">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="p-6">
        <LoadingSkeleton :rows="6" />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else-if="venues.length === 0"
        title="No venues found"
        description="There are currently no venues matching your search or status filter."
      />

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-[#e7e5e1] bg-neutral-50/75 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              <th class="py-3 px-4 w-16">ID</th>
              <th class="py-3 px-4">Venue Name</th>
              <th class="py-3 px-4">Category</th>
              <th class="py-3 px-4">Merchant Partner</th>
              <th class="py-3 px-4">City</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#e7e5e1] text-xs">
            <tr
              v-for="v in venues"
              :key="v.id"
              class="hover:bg-neutral-50/50 transition-colors"
            >
              <td class="py-3 px-4 font-mono text-neutral-500 font-medium">#{{ v.id }}</td>
              <td class="py-3 px-4">
                <div class="font-semibold text-neutral-900">{{ v.name }}</div>
                <div class="text-[11px] font-mono text-neutral-400">{{ v.slug }}</div>
              </td>
              <td class="py-3 px-4">
                <span class="inline-block px-2 py-0.5 bg-neutral-100 rounded text-neutral-700 text-[11px]">
                  {{ v.category?.name || 'Uncategorized' }}
                </span>
              </td>
              <td class="py-3 px-4 text-neutral-700">
                <div class="font-medium text-neutral-900">{{ v.merchant?.business_name || 'N/A' }}</div>
              </td>
              <td class="py-3 px-4 text-neutral-600">
                <div>{{ v.city || '-' }}</div>
                <div v-if="v.province" class="text-[11px] text-neutral-400">{{ v.province }}</div>
              </td>
              <td class="py-3 px-4">
                <StatusBadge :status="v.status" />
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  @click="openDetailModal(v)"
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

    <!-- Venue Detail Modal -->
    <BaseModal
      :is-open="detailModalOpen"
      title="Venue Facility Details"
      @close="detailModalOpen = false"
    >
      <div v-if="selectedVenue" class="space-y-4 text-xs">
        <!-- Status Header -->
        <div class="flex items-center justify-between p-3 bg-neutral-50 rounded-md border border-neutral-200">
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Venue Facility</span>
            <span class="text-sm font-bold text-neutral-900">{{ selectedVenue.name }}</span>
            <span class="block text-[11px] font-mono text-neutral-400">{{ selectedVenue.slug }}</span>
          </div>
          <StatusBadge :status="selectedVenue.status" />
        </div>

        <!-- Detail Grid -->
        <div class="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-md border border-neutral-200">
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Merchant Partner</span>
            <span class="font-medium text-neutral-900 mt-0.5 block">{{ selectedVenue.merchant?.business_name || 'N/A' }}</span>
          </div>
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Category</span>
            <span class="font-medium text-neutral-900 mt-0.5 block">{{ selectedVenue.category?.name || 'Uncategorized' }}</span>
          </div>
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">Phone Contact</span>
            <span class="text-neutral-800 font-mono mt-0.5 block">{{ selectedVenue.phone || 'N/A' }}</span>
          </div>
          <div>
            <span class="text-[11px] text-neutral-500 font-medium block">City / Province</span>
            <span class="text-neutral-800 mt-0.5 block">{{ selectedVenue.city }}{{ selectedVenue.province ? `, ${selectedVenue.province}` : '' }}</span>
          </div>
          <div class="col-span-2">
            <span class="text-[11px] text-neutral-500 font-medium block">Address</span>
            <span class="text-neutral-800 mt-0.5 block">{{ selectedVenue.address || 'N/A' }}</span>
          </div>
        </div>

        <!-- Description -->
        <div v-if="selectedVenue.description" class="p-3 border border-neutral-200 rounded-md">
          <div class="text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">Description</div>
          <p class="text-neutral-800 leading-relaxed">{{ selectedVenue.description }}</p>
        </div>

        <!-- Associated Resources / Courts -->
        <div v-if="selectedVenue.resources && selectedVenue.resources.length > 0" class="p-3 border border-neutral-200 rounded-md">
          <div class="text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-2">Bookable Resources / Courts</div>
          <div class="divide-y divide-neutral-100">
            <div
              v-for="r in selectedVenue.resources"
              :key="r.id"
              class="py-2 flex justify-between items-center text-xs"
            >
              <div>
                <span class="font-semibold text-neutral-900">{{ r.name }}</span>
                <span v-if="r.resource_type" class="text-neutral-400 text-[11px] ml-2">({{ r.resource_type }})</span>
              </div>
              <div class="text-right">
                <span class="font-mono text-neutral-900 font-medium">
                  {{ formatCurrency(r.price_per_hour || r.price) }} / hr
                </span>
              </div>
            </div>
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
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import venueService from '../../services/venue.service'
import { formatCurrency } from '../../utils/formatters'
import StatusBadge from '../../components/feedback/StatusBadge.vue'
import TablePagination from '../../components/tables/TablePagination.vue'
import LoadingSkeleton from '../../components/feedback/LoadingSkeleton.vue'
import EmptyState from '../../components/feedback/EmptyState.vue'
import ErrorState from '../../components/feedback/ErrorState.vue'
import BaseModal from '../../components/overlays/BaseModal.vue'

const venues = ref([])
const meta = ref(null)
const isLoading = ref(true)
const error = ref(null)

const filters = reactive({
  search: '',
  status: '',
  page: 1,
  per_page: 15,
})

const detailModalOpen = ref(false)
const selectedVenue = ref(null)

async function fetchVenues() {
  isLoading.value = true
  error.value = null
  try {
    const params = {
      page: filters.page,
      per_page: filters.per_page,
    }
    if (filters.search.trim()) {
      params.search = filters.search.trim()
    }
    if (filters.status) {
      params.status = filters.status
    }

    const response = await venueService.list(params)
    venues.value = response.data || []
    meta.value = response.meta || null
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to retrieve venues.'
  } finally {
    isLoading.value = false
  }
}

function handleSearch() {
  filters.page = 1
  fetchVenues()
}

function resetFilters() {
  filters.search = ''
  filters.status = ''
  filters.page = 1
  fetchVenues()
}

function handlePageChange(newPage) {
  filters.page = newPage
  fetchVenues()
}

async function openDetailModal(v) {
  try {
    const full = await venueService.get(v.id)
    selectedVenue.value = full
  } catch {
    selectedVenue.value = v
  }
  detailModalOpen.value = true
}

onMounted(() => {
  fetchVenues()
})
</script>
