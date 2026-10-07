<template>
  <div class="min-h-screen bg-[#f8f7f4] text-neutral-900 flex">
    <!-- Fixed Sidebar -->
    <AdminSidebar />

    <!-- Main Content Area -->
    <div class="pl-56 flex-1 min-h-screen flex flex-col min-w-0">
      <AdminHeader />

      <main class="flex-1 min-w-0">
        <PageContainer>
          <router-view />
        </PageContainer>
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '../components/layout/AdminSidebar.vue'
import AdminHeader from '../components/layout/AdminHeader.vue'
import PageContainer from '../components/layout/PageContainer.vue'
</script>
