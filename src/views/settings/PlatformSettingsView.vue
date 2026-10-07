<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-neutral-900 tracking-tight">Platform Settings</h2>
        <p class="text-xs text-neutral-500 mt-0.5">Runtime platform configurations verified against PRD v1.2.4</p>
      </div>
    </div>

    <!-- Feedback Banners -->
    <div
      v-if="successMessage"
      class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between"
    >
      <span>{{ successMessage }}</span>
      <button @click="successMessage = null" class="text-emerald-600 hover:text-emerald-900 font-bold ml-2">×</button>
    </div>

    <div
      v-if="errorMessage"
      class="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center justify-between"
    >
      <span>{{ errorMessage }}</span>
      <button @click="errorMessage = null" class="text-red-600 hover:text-red-900 font-bold ml-2">×</button>
    </div>

    <!-- Error State -->
    <ErrorState
      v-if="fetchError"
      title="Failed to load platform settings"
      :message="fetchError"
      @retry="fetchSettings"
    />

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="bg-white border border-[#e7e5e1] rounded-lg p-6">
        <LoadingSkeleton :rows="4" />
      </div>

      <!-- Settings Cards -->
      <div v-else class="space-y-6">
        <!-- Active Contract: Booking Hold Duration (PRD BR-003) -->
        <div class="bg-white border border-[#e7e5e1] rounded-lg p-6">
          <div class="flex items-start justify-between pb-4 border-b border-[#e7e5e1]">
            <div>
              <h3 class="text-sm font-semibold text-neutral-900">Booking & Reservation Hold Duration</h3>
              <p class="text-xs text-neutral-500 mt-0.5">
                Baseline rule PRD BR-003: Default durasi hold inventori resource dan tiket event adalah 15 menit.
              </p>
            </div>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Contract
            </span>
          </div>

          <form @submit.prevent="saveSettings" class="mt-5 space-y-4 max-w-lg">
            <div>
              <label for="hold-duration" class="block text-xs font-semibold text-neutral-700 mb-1">
                Hold Duration (Minutes)
              </label>
              <div class="flex items-center space-x-3">
                <input
                  id="hold-duration"
                  v-model.number="form.booking_hold_duration_minutes"
                  type="number"
                  min="1"
                  max="1440"
                  required
                  class="w-32 px-3 py-1.5 text-xs border border-[#e7e5e1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#f25c05] focus:border-[#f25c05]"
                />
                <span class="text-xs text-neutral-500">minutes (valid range: 1 - 1,440)</span>
              </div>
              <p class="text-[11px] text-neutral-500 mt-1.5">
                Runtime consumer: Dikonsumsi secara langsung oleh <code class="font-mono bg-neutral-100 px-1 py-0.5 rounded text-[10px]">BookingService</code> dan <code class="font-mono bg-neutral-100 px-1 py-0.5 rounded text-[10px]">EventTicketPurchaseService</code> saat hold dibuat.
              </p>
            </div>

            <div class="pt-2">
              <button
                type="submit"
                :disabled="isSaving"
                class="inline-flex items-center px-4 py-2 bg-[#f25c05] hover:bg-[#dc5202] disabled:opacity-50 text-white text-xs font-medium rounded-md transition-colors"
              >
                <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                {{ isSaving ? 'Saving...' : 'Save Settings' }}
              </button>
            </div>
          </form>
        </div>

        <!-- PRD Alignment Notice: Planned / Deferred Settings -->
        <div class="bg-neutral-50/75 border border-[#e7e5e1] rounded-lg p-6">
          <h3 class="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            PRD v1.2.4 Traceability Status for Additional Settings
          </h3>
          <p class="text-xs text-neutral-600 mb-4 leading-relaxed">
            Sesuai tata kelola PRD Section 5 & 19, pengaturan tambahan tidak boleh dibuat secara acak tanpa schema backend yang mendukung atau kepastian business rules dari Product Owner.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="bg-white border border-[#e7e5e1] p-3.5 rounded-md">
              <div class="flex items-center justify-between mb-1">
                <span class="font-semibold text-neutral-800">Banner & Platform Marketing</span>
                <span class="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded font-medium">Planned</span>
              </div>
              <p class="text-[11px] text-neutral-500">
                PRD mencantumkan banner/pengaturan, namun schema tabel banner belum didefinisikan pada backend migration. Endpoint belum diimplementasikan.
              </p>
            </div>

            <div class="bg-white border border-[#e7e5e1] p-3.5 rounded-md">
              <div class="flex items-center justify-between mb-1">
                <span class="font-semibold text-neutral-800">Tax & Platform Commission</span>
                <span class="text-[10px] bg-neutral-100 text-neutral-600 border border-neutral-200 px-1.5 py-0.2 rounded font-medium">Out of Scope</span>
              </div>
              <p class="text-[11px] text-neutral-500">
                PRD Section 4.2 secara eksplisit menunda enterprise billing, commission split kustom, dan dynamic pricing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import settingsService from '../../services/settings.service.js'
import ErrorState from '../../components/feedback/ErrorState.vue'
import LoadingSkeleton from '../../components/feedback/LoadingSkeleton.vue'

const isLoading = ref(true)
const isSaving = ref(false)
const fetchError = ref(null)
const successMessage = ref(null)
const errorMessage = ref(null)

const form = ref({
  booking_hold_duration_minutes: 15,
})

async function fetchSettings() {
  isLoading.value = true
  fetchError.value = null

  try {
    const res = await settingsService.list()
    const settingsList = res.data || []
    const holdSetting = settingsList.find(s => s.key === 'booking_hold_duration_minutes')
    if (holdSetting) {
      form.value.booking_hold_duration_minutes = holdSetting.value
    }
  } catch (err) {
    fetchError.value = err.response?.data?.message || err.message || 'Failed to fetch platform settings.'
  } finally {
    isLoading.value = false
  }
}

async function saveSettings() {
  isSaving.value = true
  errorMessage.value = null
  successMessage.value = null

  try {
    const res = await settingsService.update({
      booking_hold_duration_minutes: form.value.booking_hold_duration_minutes,
    })
    successMessage.value = res.message || 'Platform settings updated successfully.'
  } catch (err) {
    errorMessage.value = err.response?.data?.message || err.message || 'Failed to save settings.'
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>
