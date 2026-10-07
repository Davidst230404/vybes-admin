<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-neutral-900 tracking-tight">Approvals Management</h2>
        <p class="text-xs text-neutral-500 mt-0.5">Review and approve incoming merchant partner and event organizer applications</p>
      </div>

      <!-- Status Filter -->
      <div class="flex items-center space-x-2">
        <label for="approval-status-select" class="text-xs text-neutral-500 font-medium">Status:</label>
        <select
          id="approval-status-select"
          v-model="currentStatus"
          @change="fetchApprovals"
          class="text-xs border border-neutral-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#f25c05] bg-white text-neutral-800"
        >
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>

    <!-- Feedback Banners -->
    <div
      v-if="actionSuccessMessage"
      class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between"
    >
      <span>{{ actionSuccessMessage }}</span>
      <button @click="actionSuccessMessage = null" class="text-emerald-600 hover:text-emerald-900 font-bold ml-2">×</button>
    </div>

    <div
      v-if="actionErrorMessage"
      class="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center justify-between"
    >
      <span>{{ actionErrorMessage }}</span>
      <button @click="actionErrorMessage = null" class="text-red-600 hover:text-red-900 font-bold ml-2">×</button>
    </div>

    <!-- Error State -->
    <ErrorState
      v-if="error"
      title="Failed to load approvals"
      :message="error"
      @retry="fetchApprovals"
    />

    <!-- Main Container -->
    <div v-else class="space-y-5">
      <!-- Tabs Navigation -->
      <div class="border-b border-[#e7e5e1] flex space-x-6">
        <button
          @click="activeTab = 'merchants'"
          type="button"
          class="pb-3 text-xs font-semibold tracking-wide border-b-2 transition-colors flex items-center space-x-2"
          :class="activeTab === 'merchants' ? 'border-[#f25c05] text-[#f25c05]' : 'border-transparent text-neutral-500 hover:text-neutral-800'"
        >
          <span>Merchant Partners</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px]"
            :class="activeTab === 'merchants' ? 'bg-orange-100 text-[#f25c05]' : 'bg-neutral-100 text-neutral-600'"
          >
            {{ merchants.length }}
          </span>
        </button>

        <button
          @click="activeTab = 'organizers'"
          type="button"
          class="pb-3 text-xs font-semibold tracking-wide border-b-2 transition-colors flex items-center space-x-2"
          :class="activeTab === 'organizers' ? 'border-[#f25c05] text-[#f25c05]' : 'border-transparent text-neutral-500 hover:text-neutral-800'"
        >
          <span>Event Organizers</span>
          <span
            class="px-2 py-0.5 rounded-full text-[10px]"
            :class="activeTab === 'organizers' ? 'bg-orange-100 text-[#f25c05]' : 'bg-neutral-100 text-neutral-600'"
          >
            {{ organizers.length }}
          </span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white border border-[#e7e5e1] rounded-lg p-6">
        <LoadingSkeleton :rows="5" />
      </div>

      <!-- Tab Content: Merchants -->
      <div v-else-if="activeTab === 'merchants'" class="bg-white border border-[#e7e5e1] rounded-lg overflow-hidden">
        <EmptyState
          v-if="merchants.length === 0"
          :title="`No ${currentStatus} merchant applications`"
          :description="`There are currently no merchant applications with ${currentStatus} status.`"
        />

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-[#e7e5e1] bg-neutral-50/75 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                <th class="py-3 px-4 w-16">ID</th>
                <th class="py-3 px-4">Business Name</th>
                <th class="py-3 px-4">Applicant Account</th>
                <th class="py-3 px-4">Application Date</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#e7e5e1] text-xs">
              <tr
                v-for="m in merchants"
                :key="m.id"
                class="hover:bg-neutral-50/50 transition-colors"
              >
                <td class="py-3 px-4 font-mono text-neutral-500 font-medium">#{{ m.id }}</td>
                <td class="py-3 px-4 font-semibold text-neutral-900">{{ m.business_name }}</td>
                <td class="py-3 px-4 text-neutral-700">
                  <div class="font-medium text-neutral-900">{{ m.user?.name || 'N/A' }}</div>
                  <div class="text-[11px] font-mono text-neutral-400">{{ m.user?.email }}</div>
                </td>
                <td class="py-3 px-4 text-neutral-500">{{ formatDate(m.created_at) }}</td>
                <td class="py-3 px-4">
                  <StatusBadge :status="m.status" />
                </td>
                <td class="py-3 px-4 text-right space-x-1.5">
                  <template v-if="m.status === 'pending'">
                    <button
                      @click="promptAction('merchant', m, 'approved')"
                      type="button"
                      class="px-2.5 py-1 text-white bg-emerald-600 hover:bg-emerald-700 font-medium rounded text-[11px] transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      @click="promptAction('merchant', m, 'rejected')"
                      type="button"
                      class="px-2.5 py-1 text-white bg-red-600 hover:bg-red-700 font-medium rounded text-[11px] transition-colors"
                    >
                      Reject
                    </button>
                  </template>
                  <span v-else class="text-neutral-400 text-[11px] italic">Resolved</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab Content: Organizers -->
      <div v-else-if="activeTab === 'organizers'" class="bg-white border border-[#e7e5e1] rounded-lg overflow-hidden">
        <EmptyState
          v-if="organizers.length === 0"
          :title="`No ${currentStatus} organizer applications`"
          :description="`There are currently no organizer applications with ${currentStatus} status.`"
        />

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-[#e7e5e1] bg-neutral-50/75 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                <th class="py-3 px-4 w-16">ID</th>
                <th class="py-3 px-4">Organization Name</th>
                <th class="py-3 px-4">Applicant Account</th>
                <th class="py-3 px-4">Application Date</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#e7e5e1] text-xs">
              <tr
                v-for="o in organizers"
                :key="o.id"
                class="hover:bg-neutral-50/50 transition-colors"
              >
                <td class="py-3 px-4 font-mono text-neutral-500 font-medium">#{{ o.id }}</td>
                <td class="py-3 px-4 font-semibold text-neutral-900">{{ o.organization_name }}</td>
                <td class="py-3 px-4 text-neutral-700">
                  <div class="font-medium text-neutral-900">{{ o.user?.name || 'N/A' }}</div>
                  <div class="text-[11px] font-mono text-neutral-400">{{ o.user?.email }}</div>
                </td>
                <td class="py-3 px-4 text-neutral-500">{{ formatDate(o.created_at) }}</td>
                <td class="py-3 px-4">
                  <StatusBadge :status="o.status" />
                </td>
                <td class="py-3 px-4 text-right space-x-1.5">
                  <template v-if="o.status === 'pending'">
                    <button
                      @click="promptAction('organizer', o, 'approved')"
                      type="button"
                      class="px-2.5 py-1 text-white bg-emerald-600 hover:bg-emerald-700 font-medium rounded text-[11px] transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      @click="promptAction('organizer', o, 'rejected')"
                      type="button"
                      class="px-2.5 py-1 text-white bg-red-600 hover:bg-red-700 font-medium rounded text-[11px] transition-colors"
                    >
                      Reject
                    </button>
                  </template>
                  <span v-else class="text-neutral-400 text-[11px] italic">Resolved</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmModal
      :is-open="confirmModalOpen"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :confirm-text="confirmDialog.confirmText"
      :variant="confirmDialog.variant"
      :is-loading="isSubmitting"
      @confirm="executeAction"
      @cancel="confirmModalOpen = false"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import approvalService from '../../services/approval.service'
import { formatDate } from '../../utils/formatters'
import StatusBadge from '../../components/feedback/StatusBadge.vue'
import LoadingSkeleton from '../../components/feedback/LoadingSkeleton.vue'
import EmptyState from '../../components/feedback/EmptyState.vue'
import ErrorState from '../../components/feedback/ErrorState.vue'
import ConfirmModal from '../../components/overlays/ConfirmModal.vue'

const currentStatus = ref('pending')
const activeTab = ref('merchants')
const merchants = ref([])
const organizers = ref([])
const isLoading = ref(true)
const error = ref(null)
const actionSuccessMessage = ref(null)
const actionErrorMessage = ref(null)

// Confirmation Modal State
const confirmModalOpen = ref(false)
const isSubmitting = ref(false)
const confirmDialog = reactive({
  type: null, // 'merchant' | 'organizer'
  target: null,
  status: null,
  title: '',
  message: '',
  confirmText: '',
  variant: 'primary',
})

async function fetchApprovals() {
  isLoading.value = true
  error.value = null
  try {
    const data = await approvalService.list({ status: currentStatus.value })
    merchants.value = data?.merchants || []
    organizers.value = data?.organizers || []
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load approval applications.'
  } finally {
    isLoading.value = false
  }
}

function promptAction(type, item, targetStatus) {
  confirmDialog.type = type
  confirmDialog.target = item
  confirmDialog.status = targetStatus

  const name = type === 'merchant' ? item.business_name : item.organization_name
  const roleTitle = type === 'merchant' ? 'Merchant' : 'Organizer'

  if (targetStatus === 'approved') {
    confirmDialog.title = `Approve ${roleTitle} Application`
    confirmDialog.message = `Are you sure you want to approve "${name}"? This will activate their partner privileges.`
    confirmDialog.confirmText = 'Approve Application'
    confirmDialog.variant = 'primary'
  } else {
    confirmDialog.title = `Reject ${roleTitle} Application`
    confirmDialog.message = `Are you sure you want to reject "${name}"? This will decline their partner privileges.`
    confirmDialog.confirmText = 'Reject Application'
    confirmDialog.variant = 'danger'
  }

  confirmModalOpen.value = true
}

async function executeAction() {
  isSubmitting.value = true
  actionErrorMessage.value = null
  actionSuccessMessage.value = null
  try {
    if (confirmDialog.type === 'merchant') {
      const res = await approvalService.updateMerchant(confirmDialog.target.id, confirmDialog.status)
      actionSuccessMessage.value = res.message || 'Merchant status updated.'
    } else {
      const res = await approvalService.updateOrganizer(confirmDialog.target.id, confirmDialog.status)
      actionSuccessMessage.value = res.message || 'Organizer status updated.'
    }

    confirmModalOpen.value = false
    await fetchApprovals()
  } catch (err) {
    actionErrorMessage.value = err.message || err.response?.data?.message || 'Failed to update application status.'
    confirmModalOpen.value = false
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchApprovals()
})
</script>
