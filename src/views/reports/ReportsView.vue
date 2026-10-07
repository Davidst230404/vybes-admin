<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-neutral-900 tracking-tight">Analytics & Reports</h2>
      <p class="text-xs text-neutral-500 mt-0.5">Platform business intelligence and reporting</p>
    </div>

    <div class="bg-white border border-[#e7e5e1] rounded-lg p-8 text-center max-w-xl mx-auto space-y-3">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 text-neutral-600 mb-2">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>

      <h3 class="text-sm font-semibold text-neutral-900">PRD Scope Status: DEFERRED</h3>
      <p class="text-xs text-neutral-600 leading-relaxed">
        Sesuai PRD VYBES v1.2.4 Bagian 4.2 (Di Luar Lingkup / Ditunda), analitik dan pelaporan BI tingkat produksi penuh ditunda. Metrik operasional real-time tetap tersedia melalui Executive Dashboard.
      </p>

      <div class="pt-2">
        <router-link
          to="/admin/dashboard"
          class="inline-flex items-center px-3.5 py-1.5 bg-[#f25c05] hover:bg-[#dc5202] text-white text-xs font-medium rounded-md transition-colors"
        >
          View Dashboard Metrics
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
