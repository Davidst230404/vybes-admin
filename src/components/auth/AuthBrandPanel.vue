<template>
  <aside
    class="relative hidden lg:flex lg:w-[43%] xl:w-[42%] flex-col justify-between overflow-hidden bg-neutral-950 p-10 lg:p-12 xl:p-14 text-white select-none"
    aria-label="Brand Visual Panel"
  >
    <!-- Background Photograph with Atmospheric Gradient Overlay -->
    <div class="absolute inset-0 z-0">
      <img
        :src="bgImage"
        alt="VYBES venue entrance"
        class="h-full w-full object-cover object-center filter brightness-[0.92] contrast-[1.04]"
      />
      <!-- Subtle atmospheric gradient to guarantee headline and metadata contrast -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none"
      ></div>
    </div>

    <!-- Header: VYBES Wordmark + ADMIN Subtitle -->
    <div class="relative z-10 flex flex-col items-start">
      <span
        class="font-serif text-[26px] xl:text-[30px] font-bold tracking-[0.14em] text-white leading-none"
        style="font-family: 'Playfair Display', Didot, 'Bodoni MT', Georgia, serif;"
      >
        VYBES
      </span>
      <span
        class="text-[10px] xl:text-[11px] font-semibold tracking-[0.24em] text-white/80 uppercase mt-1.5"
      >
        ADMIN
      </span>
    </div>

    <!-- Lower-third Brand Statement: positioned below the illuminated doorway -->
    <div class="relative z-10 mt-auto mb-14 xl:mb-18 max-w-md">
      <h1
        class="text-4xl sm:text-[44px] xl:text-[52px] font-extrabold uppercase tracking-tight text-white leading-[1.02]"
      >
        CONTROL THE<br />PLATFORM.
      </h1>
      <p
        class="mt-4 text-[13px] xl:text-[14px] font-normal text-white/75 leading-relaxed max-w-[340px]"
      >
        Administration, operations, and platform oversight in one place.
      </p>
    </div>

    <!-- Bottom Metadata Footnotes (no dividing line, clean floating labels) -->
    <div
      class="relative z-10 flex items-end justify-between text-[10px] xl:text-[11px] font-sans tracking-normal select-none"
    >
      <div class="flex flex-col space-y-0.5">
        <span class="text-white/60 font-semibold tracking-wider uppercase text-[10px] xl:text-[11px]">
          VYBES ADMIN
        </span>
        <span class="text-white/45 text-[10px] xl:text-[11px]">
          Administration Console
        </span>
      </div>
      <div class="text-right">
        <span class="text-white/45 text-[10px] xl:text-[11px]">
          Internal platform
        </span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import bgImage from '../../assets/images/auth-bg.jpg'
</script>
