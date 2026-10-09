<template>
  <aside
    class="fixed inset-y-0 left-0 w-56 bg-[#111111] text-neutral-200 border-r border-[#1a1a1a] flex flex-col justify-between z-30 select-none overflow-y-auto"
    aria-label="Admin Navigation"
  >
    <!-- Top Brand & Navigation -->
    <div class="px-5 pt-8">
      <!-- Brand Wordmark -->
      <div class="mb-8 px-2">
        <span
          class="font-serif text-2xl font-bold tracking-[0.14em] text-white leading-none block"
          style="font-family: 'Playfair Display', Didot, 'Bodoni MT', Georgia, serif;"
        >
          VYBES
        </span>
        <span class="text-[10px] font-semibold tracking-[0.24em] text-white/70 uppercase mt-1.5 block">
          ADMIN
        </span>
      </div>

      <!-- Navigation List (Text only, matching Figma) -->
      <nav class="space-y-1.5" aria-label="Main Administration Menu">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="group block px-3 py-2 text-xs rounded-md transition-colors"
          :class="[
            isActive(item.path)
              ? 'text-white bg-[#222222] font-semibold relative pl-3.5'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
          ]"
          :aria-current="isActive(item.path) ? 'page' : undefined"
        >
          <!-- Active orange bar indicator on left -->
          <span
            v-if="isActive(item.path)"
            class="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#d85c35] rounded-r"
          ></span>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </div>

    <!-- Bottom User Profile & Logout -->
    <div class="px-7 pb-8 pt-4">
      <div class="border-t border-neutral-800/80 mb-6"></div>

      <div class="space-y-1">
        <div class="text-xs font-bold text-white tracking-tight leading-tight">
          {{ adminName }}
        </div>
        <div class="text-[11px] text-neutral-400 font-normal leading-tight">
          {{ adminRole }}
        </div>
      </div>

      <button
        @click="handleLogout"
        type="button"
        class="mt-6 text-xs text-neutral-400 hover:text-white font-normal transition-colors cursor-pointer text-left block"
      >
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const adminName = computed(() => authStore.user?.name || 'Admin')
const adminRole = computed(() => authStore.user?.role?.display_name || authStore.user?.role?.name || 'Administrator')

function isActive(path) {
  if (path === '/admin/dashboard') {
    return route.path === '/admin/dashboard' || route.path === '/admin' || route.path === '/'
  }
  return route.path.startsWith(path)
}

async function handleLogout() {
  await authStore.logout()
  router.push('/auth/login')
}

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Approvals', path: '/admin/approvals' },
  { label: 'Categories', path: '/admin/categories' },
  { label: 'Moderation', path: '/admin/moderation' },
  { label: 'Bookings', path: '/admin/bookings' },
  { label: 'Refunds', path: '/admin/refunds' },
  { label: 'Reviews', path: '/admin/reviews' },
  { label: 'Venues', path: '/admin/venues' },
  { label: 'Platform Settings', path: '/admin/settings' },
  { label: 'Audit Log', path: '/admin/audit' },
  { label: 'Reports', path: '/admin/reports' },
]
</script>
