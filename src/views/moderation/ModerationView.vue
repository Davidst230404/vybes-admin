<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-neutral-900 tracking-tight">Content Moderation</h2>
      <p class="text-xs text-neutral-500 mt-0.5">Platform content review and supervision</p>
    </div>

    <div class="bg-white border border-[#e7e5e1] rounded-lg p-8 text-center max-w-xl mx-auto space-y-3">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-600 mb-2">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h3 class="text-sm font-semibold text-neutral-900">PRD Scope Status: DEFERRED</h3>
      <p class="text-xs text-neutral-600 leading-relaxed">
        Sesuai PRD VYBES v1.2.4 Bagian 4.2 (Di Luar Lingkup / Ditunda), seluruh alur moderasi lanjutan saat ini ditunda. Kontrol publikasi inventori ditegakkan melalui status persetujuan merchant dan organizer pada modul Approvals.
      </p>

      <div class="pt-2">
        <router-link
          to="/admin/approvals"
          class="inline-flex items-center px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-md transition-colors"
        >
          Go to Operator Approvals
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
