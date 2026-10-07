<template>
  <aside
    class="fixed inset-y-0 left-0 w-56 bg-[#111111] text-neutral-200 border-r border-[#1f1f1f] flex flex-col z-30 select-none"
    aria-label="Admin Navigation"
  >
    <!-- Brand / Header -->
    <div class="h-16 flex items-center px-5 border-b border-[#1f1f1f]">
      <div class="flex items-center space-x-2">
        <span class="w-2.5 h-2.5 rounded-full bg-[#f25c05]"></span>
        <span class="text-base font-bold tracking-tight text-white">VYBES</span>
        <span class="text-[10px] tracking-wider uppercase font-semibold text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">CMS</span>
      </div>
    </div>

    <!-- Navigation List -->
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="group flex items-center px-3 py-2 text-xs font-medium rounded-md transition-colors"
        :class="[
          isActive(item.path)
            ? 'text-[#f25c05] bg-neutral-900 font-semibold border-l-2 border-[#f25c05] -ml-px pl-[11px]'
            : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/40'
        ]"
        :aria-current="isActive(item.path) ? 'page' : undefined"
      >
        <component
          :is="item.icon"
          class="w-4 h-4 mr-2.5 flex-shrink-0 transition-colors"
          :class="isActive(item.path) ? 'text-[#f25c05]' : 'text-neutral-500 group-hover:text-neutral-300'"
        />
        <span class="truncate">{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-3 border-t border-[#1f1f1f] text-[11px] text-neutral-500 flex items-center justify-between">
      <span>VYBES Admin</span>
      <span class="font-mono text-[10px] text-neutral-600">v1.0</span>
    </div>
  </aside>
</template>

<script setup>
import { h } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

function isActive(path) {
  if (path === '/dashboard') {
    return route.path === '/dashboard' || route.path === '/'
  }
  return route.path.startsWith(path)
}

// Icon helper function for consistent SVG icons
function createIcon(pathD) {
  return () =>
    h(
      'svg',
      {
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      },
      [h('path', { d: pathD })]
    )
}

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: createIcon('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'),
  },
  {
    label: 'Users',
    path: '/users',
    icon: createIcon('M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'),
  },
  {
    label: 'Approvals',
    path: '/approvals',
    icon: createIcon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'),
  },
  {
    label: 'Categories',
    path: '/categories',
    icon: createIcon('M4 6h16M4 10h16M4 14h16M4 18h16'),
  },
  {
    label: 'Moderation',
    path: '/moderation',
    icon: createIcon('M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'),
  },
  {
    label: 'Bookings',
    path: '/bookings',
    icon: createIcon('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'),
  },
  {
    label: 'Refunds',
    path: '/refunds',
    icon: createIcon('M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'),
  },
  {
    label: 'Reviews',
    path: '/reviews',
    icon: createIcon('M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'),
  },
  {
    label: 'Venues',
    path: '/venues',
    icon: createIcon('M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'),
  },
  {
    label: 'Platform Settings',
    path: '/settings',
    icon: createIcon('M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'),
  },
  {
    label: 'Audit Log',
    path: '/audit',
    icon: createIcon('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'),
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: createIcon('M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'),
  },
]
</script>
