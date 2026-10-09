<template>
  <div class="min-h-screen bg-[#f7f5f0] text-neutral-900 flex">
    <!-- Fixed Sidebar -->
    <AdminSidebar />

    <!-- Main Content Area -->
    <div class="pl-56 flex-1 min-h-screen flex flex-col min-w-0 bg-[#f7f5f0]">
      <AdminHeader v-if="!hasCustomHeader" />

      <main class="flex-1 min-w-0 bg-[#f7f5f0]">
        <PageContainer>
          <router-view />
        </PageContainer>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminSidebar from '../components/layout/AdminSidebar.vue'
import AdminHeader from '../components/layout/AdminHeader.vue'
import PageContainer from '../components/layout/PageContainer.vue'

const route = useRoute()
const isDashboard = computed(() => {
  return route.name === 'dashboard' || route.path === '/admin/dashboard' || route.path === '/admin'
})

const hasCustomHeader = computed(() => {
  return isDashboard.value || route.name === 'users' || route.name === 'user-detail' || route.path.startsWith('/admin/users')
})
</script>
