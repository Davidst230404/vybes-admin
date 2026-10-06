<script setup>
// BrandPanel implements the exact Figma reference specification
</script>

<template>
  <aside class="brand-panel" aria-label="Brand Visual Presentation">
    <!-- Subtle dark overlay: 28-30% opacity black -->
    <div class="brand-panel__overlay" aria-hidden="true"></div>

    <!-- Top Left Branding: 36px from left, 36px from top -->
    <header class="brand-panel__top">
      <span class="brand-panel__wordmark">VYBES</span>
      <span class="brand-panel__submark">ADMIN</span>
    </header>

    <!-- Main Hero: Left 36px, Top ~410-430px -->
    <section class="brand-panel__hero">
      <h1 class="brand-panel__headline">
        <span class="brand-panel__headline-line">CONTROL THE</span>
        <span class="brand-panel__headline-line">PLATFORM.</span>
      </h1>
      <p class="brand-panel__description">
        Administration, operations, and platform oversight in one place.
      </p>
    </section>

    <!-- Bottom Footer Metadata: 36px from left/right, ~38px from bottom -->
    <footer class="brand-panel__footer">
      <div class="brand-panel__footer-left">
        <span class="brand-panel__meta-title">VYBES ADMIN</span>
        <span class="brand-panel__meta-subtitle">Administration Console</span>
      </div>
      <div class="brand-panel__footer-right">
        <span class="brand-panel__meta-right">Internal platform</span>
      </div>
    </footer>
  </aside>
</template>

<style scoped>
.brand-panel {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
  background-color: #111111;
  background-image: url('/auth-bg.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 36px;
  overflow: hidden;
  user-select: none;
}

/* Subtle dark overlay: black 28-32% opacity */
.brand-panel__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.30);
  pointer-events: none;
  z-index: 1;
}

.brand-panel__top,
.brand-panel__hero,
.brand-panel__footer {
  position: relative;
  z-index: 2;
  box-sizing: border-box;
}

/* ────────────────────────────────────────────────────────────
   TOP LEFT BRANDING
   36px from left, 36px from top
   ──────────────────────────────────────────────────────────── */
.brand-panel__top {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

/* VYBES wordmark: DM Serif Display, Regular 400, #F5F3EE, 26-28px */
.brand-panel__wordmark {
  font-family: var(--font-serif, 'DM Serif Display', Georgia, serif);
  font-weight: 400;
  font-size: 27px;
  line-height: 30px;
  color: var(--color-text-warm-white, #F5F3EE);
  letter-spacing: 0.01em;
  display: block;
}

/* ADMIN immediately below: DM Sans, Medium 500, Uppercase, 8-10px, tracking 0.9px */
.brand-panel__submark {
  font-family: var(--font-family, 'DM Sans', sans-serif);
  font-weight: 500;
  font-size: 9px;
  line-height: 12px;
  letter-spacing: 0.9px;
  color: var(--color-text-warm-white, #F5F3EE);
  text-transform: uppercase;
  display: block;
}

/* ────────────────────────────────────────────────────────────
   MAIN HERO TYPOGRAPHY
   Lower-left area: Top ~415px
   ──────────────────────────────────────────────────────────── */
.brand-panel__hero {
  margin-top: auto;
  margin-bottom: 72px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

/* CONTROL THE PLATFORM.: DM Sans Bold 700, #F5F3EE, 48px, line-height 45px, tracking -1.5px */
.brand-panel__headline {
  margin: 0;
  font-family: var(--font-hero, 'DM Sans', sans-serif);
  font-weight: 700;
  font-size: 48px;
  line-height: 45px;
  letter-spacing: -1.5px;
  color: var(--color-text-warm-white, #F5F3EE);
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  max-width: 440px;
}

.brand-panel__headline-line {
  display: block;
}

/* Hero description: DM Sans Regular 400, 11-12px, line-height 17.5px, max-width 310px */
.brand-panel__description {
  margin: 20px 0 0 0;
  font-family: var(--font-family, 'DM Sans', sans-serif);
  font-weight: 400;
  font-size: 11.5px;
  line-height: 17.5px;
  color: rgba(245, 243, 238, 0.68);
  max-width: 310px;
}

/* ────────────────────────────────────────────────────────────
   BOTTOM FOOTER METADATA
   36px from left/right, ~38px from bottom
   ──────────────────────────────────────────────────────────── */
.brand-panel__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 2px;
}

.brand-panel__footer-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.brand-panel__meta-title {
  font-family: var(--font-family, 'DM Sans', sans-serif);
  font-weight: 500;
  font-size: 8px;
  line-height: 10px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: rgba(245, 243, 238, 0.75);
}

.brand-panel__meta-subtitle {
  font-family: var(--font-family, 'DM Sans', sans-serif);
  font-weight: 400;
  font-size: 8px;
  line-height: 10px;
  color: rgba(245, 243, 238, 0.55);
}

.brand-panel__footer-right {
  text-align: right;
}

.brand-panel__meta-right {
  font-family: var(--font-family, 'DM Sans', sans-serif);
  font-weight: 400;
  font-size: 8px;
  line-height: 10px;
  color: rgba(245, 243, 238, 0.55);
}

/* Tablet adjustments */
@media (max-width: 1024px) {
  .brand-panel {
    padding: 28px;
  }
  .brand-panel__headline {
    font-size: 38px;
    line-height: 38px;
  }
}
</style>
