<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  current: {
    type: String,
    default: '01-default',
  },
})

const router = useRouter()
const route = useRoute()
const isCollapsed = ref(false)

const states = [
  { id: '01-default', label: '01. Default', path: '/login', query: { state: '01-default' } },
  { id: '02-filled', label: '02. Filled', path: '/login', query: { state: '02-filled' } },
  { id: '03-validation-error', label: '03. Validation Error', path: '/login', query: { state: '03-validation-error' } },
  { id: '04-invalid-credentials', label: '04. Invalid Auth', path: '/login', query: { state: '04-invalid-credentials' } },
  { id: '05-loading', label: '05. Sign In Loading', path: '/login', query: { state: '05-loading' } },
  { id: '06-google-loading', label: '06. Google Loading', path: '/login', query: { state: '06-google-loading' } },
  { id: '07-network-error', label: '07. Network Error', path: '/login', query: { state: '07-network-error' } },
  { id: '08-access-denied', label: '08. Access Denied', path: '/auth/access-denied', query: {} },
  { id: '09-session-expired', label: '09. Session Expired', path: '/auth/session-expired', query: {} },
  { id: '10-forgot-password', label: '10. Forgot Password', path: '/forgot-password', query: {} },
  { id: '11-forgot-password-submitted', label: '11. Email Sent', path: '/forgot-password', query: { state: '11-forgot-password-submitted' } },
]

const selectState = (stateItem) => {
  router.push({ path: stateItem.path, query: stateItem.query })
}
</script>

<template>
  <aside class="state-switcher" aria-label="Figma Screen State Inspector">
    <!-- Toggle pill when collapsed -->
    <div v-if="isCollapsed" class="state-switcher__collapsed">
      <button
        type="button"
        class="state-switcher__expand-btn"
        @click="isCollapsed = false"
        title="Show all 11 Figma screens"
      >
        <span class="state-switcher__indicator"></span>
        <span>Screen States (11)</span>
      </button>
    </div>

    <!-- Expanded toolbar -->
    <div v-else class="state-switcher__bar">
      <div class="state-switcher__header">
        <span class="state-switcher__title">FIGMA SPEC INSPECTOR (00. AUTH)</span>
        <button
          type="button"
          class="state-switcher__collapse-btn"
          @click="isCollapsed = true"
          title="Minimize toolbar"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <nav class="state-switcher__items">
        <button
          v-for="s in states"
          :key="s.id"
          type="button"
          class="state-switcher__item"
          :class="{ 'state-switcher__item--active': current === s.id }"
          @click="selectState(s)"
        >
          {{ s.label }}
        </button>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
.state-switcher {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  max-width: calc(100vw - 32px);
  pointer-events: auto;
}

.state-switcher__collapsed {
  display: flex;
}

.state-switcher__expand-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background-color: #111111;
  color: #f7f5f0;
  border: 1px solid #333333;
  border-radius: 9999px;
  font-family: var(--font-family);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: background-color 150ms ease, transform 150ms ease;
}

.state-switcher__expand-btn:hover {
  background-color: #222222;
  transform: translateY(-1px);
}

.state-switcher__indicator {
  width: 6px;
  height: 6px;
  background-color: #e87c3e;
  border-radius: 50%;
}

.state-switcher__bar {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 12px;
  background-color: rgba(17, 17, 17, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  max-width: 960px;
}

.state-switcher__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.state-switcher__title {
  font-family: var(--font-family);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #a09d96;
}

.state-switcher__collapse-btn {
  background: transparent;
  border: none;
  color: #a09d96;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  display: flex;
  align-items: center;
}

.state-switcher__collapse-btn:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}

.state-switcher__items {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.state-switcher__item {
  padding: 4px 8px;
  font-family: var(--font-family);
  font-size: 11px;
  font-weight: 500;
  color: #c4c1ba;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 120ms ease;
}

.state-switcher__item:hover {
  background-color: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.state-switcher__item--active {
  background-color: #e87c3e;
  border-color: #e87c3e;
  color: #ffffff;
  font-weight: 600;
}
</style>
