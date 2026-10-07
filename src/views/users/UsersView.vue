<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-neutral-900 tracking-tight">Users Management</h2>
        <p class="text-xs text-neutral-500 mt-0.5">Manage registered accounts and role assignments across VYBES platform</p>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white border border-[#e7e5e1] rounded-lg p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="w-full sm:w-72 relative">
        <label for="users-search-input" class="sr-only">Search by name or email</label>
        <input
          id="users-search-input"
          v-model="filters.search"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="Search by name or email..."
          aria-label="Search by name or email"
          class="w-full text-xs pl-8 pr-3 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:border-[#f25c05] focus:ring-1 focus:ring-[#f25c05]"
        />
        <svg class="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Filters & Actions -->
      <div class="w-full sm:w-auto flex items-center justify-end space-x-2.5">
        <label for="user-role-filter" class="sr-only">Filter by Role</label>
        <select
          id="user-role-filter"
          v-model="filters.role"
          @change="handleSearch"
          class="text-xs border border-neutral-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#f25c05] bg-white text-neutral-700"
        >
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="merchant">Merchant</option>
          <option value="organizer">Event Organizer</option>
          <option value="admin">Administrator</option>
        </select>

        <button
          @click="handleSearch"
          type="button"
          class="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-md transition-colors"
        >
          Filter
        </button>

        <button
          v-if="filters.search || filters.role"
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
      title="Failed to load users"
      :message="error"
      @retry="fetchUsers"
    />

    <!-- Main Table Container -->
    <div v-else class="bg-white border border-[#e7e5e1] rounded-lg overflow-hidden">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="p-6">
        <LoadingSkeleton :rows="6" />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else-if="users.length === 0"
        title="No users found"
        description="No user accounts matched your search or role filter criteria."
      />

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-[#e7e5e1] bg-neutral-50/75 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              <th class="py-3 px-4 w-16">ID</th>
              <th class="py-3 px-4">Name</th>
              <th class="py-3 px-4">Email</th>
              <th class="py-3 px-4">Assigned Role</th>
              <th class="py-3 px-4">Created Date</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#e7e5e1] text-xs">
            <tr
              v-for="user in users"
              :key="user.id"
              class="hover:bg-neutral-50/50 transition-colors"
            >
              <td class="py-3 px-4 font-mono text-neutral-500 font-medium">#{{ user.id }}</td>
              <td class="py-3 px-4 font-medium text-neutral-900">
                {{ user.name }}
              </td>
              <td class="py-3 px-4 text-neutral-600">
                <div class="flex items-center space-x-1.5">
                  <span>{{ user.email }}</span>
                  <span
                    v-if="user.email_verified_at"
                    title="Verified Email"
                    class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"
                  ></span>
                </div>
              </td>
              <td class="py-3 px-4">
                <span
                  class="inline-block px-2 py-0.5 text-[11px] font-semibold rounded"
                  :class="getRoleBadgeClass(user.role?.name)"
                >
                  {{ user.role?.display_name || user.role?.name || 'Customer' }}
                </span>
              </td>
              <td class="py-3 px-4 text-neutral-500">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="py-3 px-4 text-right space-x-1.5">
                <button
                  @click="openDetailModal(user)"
                  type="button"
                  class="px-2.5 py-1 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 font-medium rounded text-[11px] transition-colors"
                >
                  View
                </button>
                <button
                  @click="openEditModal(user)"
                  type="button"
                  class="px-2.5 py-1 text-white bg-[#f25c05] hover:bg-[#dc5202] font-medium rounded text-[11px] transition-colors"
                >
                  Edit
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

    <!-- User Detail Modal -->
    <BaseModal
      :is-open="detailModalOpen"
      title="User Account Details"
      @close="detailModalOpen = false"
    >
      <div v-if="selectedUser" class="space-y-4 text-xs">
        <div class="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-md border border-neutral-200">
          <div>
            <div class="text-[11px] text-neutral-500 font-medium">User ID</div>
            <div class="font-mono text-neutral-900 mt-0.5">#{{ selectedUser.id }}</div>
          </div>
          <div>
            <div class="text-[11px] text-neutral-500 font-medium">Role</div>
            <div class="mt-0.5">
              <span
                class="inline-block px-2 py-0.5 text-[11px] font-semibold rounded"
                :class="getRoleBadgeClass(selectedUser.role?.name)"
              >
                {{ selectedUser.role?.display_name || selectedUser.role?.name }}
              </span>
            </div>
          </div>
          <div>
            <div class="text-[11px] text-neutral-500 font-medium">Full Name</div>
            <div class="font-medium text-neutral-900 mt-0.5">{{ selectedUser.name }}</div>
          </div>
          <div>
            <div class="text-[11px] text-neutral-500 font-medium">Email Address</div>
            <div class="font-mono text-neutral-900 mt-0.5">{{ selectedUser.email }}</div>
          </div>
          <div>
            <div class="text-[11px] text-neutral-500 font-medium">Registered At</div>
            <div class="text-neutral-700 mt-0.5">{{ formatDateTime(selectedUser.created_at) }}</div>
          </div>
          <div>
            <div class="text-[11px] text-neutral-500 font-medium">Email Verified At</div>
            <div class="text-neutral-700 mt-0.5">{{ selectedUser.email_verified_at ? formatDateTime(selectedUser.email_verified_at) : 'Unverified' }}</div>
          </div>
        </div>

        <!-- Associated Merchant Profile -->
        <div v-if="selectedUser.merchant" class="p-3 border border-neutral-200 rounded-md">
          <div class="text-[11px] font-semibold text-neutral-900 uppercase tracking-wider mb-2">Merchant Profile</div>
          <div class="grid grid-cols-2 gap-2 text-neutral-700">
            <div><span class="text-neutral-400">Business Name:</span> {{ selectedUser.merchant.business_name }}</div>
            <div><span class="text-neutral-400">Status:</span> {{ selectedUser.merchant.status }}</div>
          </div>
        </div>

        <!-- Associated Organizer Profile -->
        <div v-if="selectedUser.organizer" class="p-3 border border-neutral-200 rounded-md">
          <div class="text-[11px] font-semibold text-neutral-900 uppercase tracking-wider mb-2">Organizer Profile</div>
          <div class="grid grid-cols-2 gap-2 text-neutral-700">
            <div><span class="text-neutral-400">Organization Name:</span> {{ selectedUser.organizer.organization_name }}</div>
            <div><span class="text-neutral-400">Status:</span> {{ selectedUser.organizer.status }}</div>
          </div>
        </div>

        <!-- Permissions List -->
        <div v-if="selectedUser.role?.permissions && selectedUser.role.permissions.length > 0" class="space-y-1.5">
          <div class="text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">Granted Role Permissions</div>
          <div class="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-neutral-50 rounded border border-neutral-200">
            <span
              v-for="perm in selectedUser.role.permissions"
              :key="perm.id"
              class="px-2 py-0.5 bg-white border border-neutral-200 rounded text-[10px] text-neutral-700 font-mono"
            >
              {{ perm.name }}
            </span>
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

    <!-- Edit User Modal -->
    <BaseModal
      :is-open="editModalOpen"
      title="Edit User Account"
      @close="closeEditModal"
    >
      <form @submit.prevent="submitUserUpdate" class="space-y-3.5 text-xs">
        <!-- Backend Feedback Banner -->
        <div v-if="editError" class="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          {{ editError }}
        </div>

        <!-- Name Field -->
        <div>
          <label for="edit-user-name" class="block font-medium text-neutral-700 mb-1">Full Name</label>
          <input
            id="edit-user-name"
            v-model="editForm.name"
            type="text"
            required
            maxlength="100"
            class="w-full text-xs px-3 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:border-[#f25c05]"
            :class="{ 'border-red-400': validationErrors.name }"
          />
          <p v-if="validationErrors.name" class="text-[11px] text-red-600 mt-1">
            {{ validationErrors.name[0] }}
          </p>
        </div>

        <!-- Email Field -->
        <div>
          <label for="edit-user-email" class="block font-medium text-neutral-700 mb-1">Email Address</label>
          <input
            id="edit-user-email"
            v-model="editForm.email"
            type="email"
            required
            maxlength="255"
            class="w-full text-xs px-3 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:border-[#f25c05]"
            :class="{ 'border-red-400': validationErrors.email }"
          />
          <p v-if="validationErrors.email" class="text-[11px] text-red-600 mt-1">
            {{ validationErrors.email[0] }}
          </p>
        </div>

        <!-- Role Select -->
        <div>
          <label for="edit-user-role" class="block font-medium text-neutral-700 mb-1">Assigned Role</label>
          <select
            id="edit-user-role"
            v-model="editForm.role_id"
            class="w-full text-xs px-3 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:border-[#f25c05] bg-white text-neutral-800"
            :class="{ 'border-red-400': validationErrors.role_id }"
          >
            <option :value="1">Customer</option>
            <option :value="2">Merchant</option>
            <option :value="3">Event Organizer</option>
            <option :value="4">Administrator</option>
          </select>
          <p v-if="validationErrors.role_id" class="text-[11px] text-red-600 mt-1">
            {{ validationErrors.role_id[0] }}
          </p>
        </div>

        <!-- Modal Footer Actions -->
        <div class="pt-3 border-t border-neutral-200 flex justify-end space-x-2">
          <button
            @click="closeEditModal"
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
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import userService from '../../services/user.service'
import { formatDate, formatDateTime } from '../../utils/formatters'
import TablePagination from '../../components/tables/TablePagination.vue'
import LoadingSkeleton from '../../components/feedback/LoadingSkeleton.vue'
import EmptyState from '../../components/feedback/EmptyState.vue'
import ErrorState from '../../components/feedback/ErrorState.vue'
import BaseModal from '../../components/overlays/BaseModal.vue'

const users = ref([])
const meta = ref(null)
const isLoading = ref(true)
const error = ref(null)

const filters = reactive({
  search: '',
  role: '',
  page: 1,
  per_page: 15,
})

// Modals
const detailModalOpen = ref(false)
const selectedUser = ref(null)

const editModalOpen = ref(false)
const isSubmitting = ref(false)
const editError = ref(null)
const validationErrors = ref({})
const editForm = reactive({
  id: null,
  name: '',
  email: '',
  role_id: 1,
})

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

async function fetchUsers() {
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
    if (filters.role) {
      params.role = filters.role
    }

    const response = await userService.list(params)
    users.value = response.data || []
    meta.value = response.meta || null
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to retrieve users from backend.'
  } finally {
    isLoading.value = false
  }
}

function handleSearch() {
  filters.page = 1
  fetchUsers()
}

function resetFilters() {
  filters.search = ''
  filters.role = ''
  filters.page = 1
  fetchUsers()
}

function handlePageChange(newPage) {
  filters.page = newPage
  fetchUsers()
}

async function openDetailModal(user) {
  try {
    const fullUser = await userService.get(user.id)
    selectedUser.value = fullUser
  } catch {
    selectedUser.value = user
  }
  detailModalOpen.value = true
}

function openEditModal(user) {
  editForm.id = user.id
  editForm.name = user.name
  editForm.email = user.email
  editForm.role_id = user.role_id || (user.role?.id ?? 1)
  validationErrors.value = {}
  editError.value = null
  editModalOpen.value = true
}

function closeEditModal() {
  if (isSubmitting.value) return
  editModalOpen.value = false
}

async function submitUserUpdate() {
  isSubmitting.value = true
  editError.value = null
  validationErrors.value = {}

  try {
    const payload = {
      name: editForm.name,
      email: editForm.email,
      role_id: Number(editForm.role_id),
    }

    await userService.update(editForm.id, payload)
    editModalOpen.value = false
    await fetchUsers()
  } catch (err) {
    if (err.response?.status === 422) {
      validationErrors.value = err.response.data?.errors || {}
      editError.value = err.response.data?.message || 'Validation failed. Please correct the fields.'
    } else {
      editError.value = err.response?.data?.message || 'Failed to update user account.'
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
