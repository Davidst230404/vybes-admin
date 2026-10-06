<script setup>
import BrandPanel from './BrandPanel.vue'

defineProps({
  hideBrandPanelMobile: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <main class="auth-shell">
    <!-- Left Visual Photographic Panel (Desktop & Tablet) -->
    <div class="auth-shell__visual">
      <BrandPanel />
    </div>

    <!-- Right Authentication Panel -->
    <div class="auth-shell__form-pane">
      <!-- Mobile-only top brand header -->
      <header class="auth-shell__mobile-brand" aria-label="VYBES Platform">
        <span class="auth-shell__mobile-wordmark">VYBES</span>
      </header>

      <!-- Center container for form content -->
      <div class="auth-shell__form-container">
        <slot />
      </div>
    </div>
  </main>
</template>

<style scoped>
.auth-shell {
  display: flex;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: var(--color-bg-page, #f7f5f0);
}

/* Left Visual Panel: exactly 50% width on desktop */
.auth-shell__visual {
  flex: 0 0 50%;
  width: 50%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* Right Authentication Panel: 50% width on desktop, reaching all edges */
.auth-shell__form-pane {
  flex: 0 0 50%;
  width: 50%;
  height: 100%;
  background-color: var(--color-bg-page, #f7f5f0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 48px 32px;
}

/* Vertically centered form container with max-width 380-420px */
.auth-shell__form-container {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  margin: auto 0;
}

/* Mobile top header (hidden on desktop/tablet) */
.auth-shell__mobile-brand {
  display: none;
  width: 100%;
  max-width: 400px;
  margin-bottom: 32px;
}

.auth-shell__mobile-wordmark {
  font-family: var(--font-family);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--color-text-primary, #111111);
  text-transform: uppercase;
}

/* Tablet adjustments */
@media (max-width: 1024px) {
  .auth-shell__visual {
    flex: 0 0 42%;
    width: 42%;
  }
  .auth-shell__form-pane {
    flex: 0 0 58%;
    width: 58%;
    padding: 36px 28px;
  }
}

/* Mobile responsive behavior: hide photographic panel, 24px padding */
@media (max-width: 768px) {
  .auth-shell {
    flex-direction: column;
    overflow-y: auto;
    height: auto;
    min-height: 100vh;
  }

  .auth-shell__visual {
    display: none;
  }

  .auth-shell__form-pane {
    flex: 1 1 100%;
    width: 100%;
    min-height: 100vh;
    padding: 48px 24px;
    justify-content: flex-start;
  }

  .auth-shell__form-container {
    max-width: 100%;
    margin: 0;
  }

  .auth-shell__mobile-brand {
    display: block;
  }
}
</style>
