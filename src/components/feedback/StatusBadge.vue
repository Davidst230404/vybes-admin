<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide border select-none"
    :class="badgeClasses"
  >
    <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="dotClasses"></span>
    <span>{{ label || formatStatusLabel(status) }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { formatStatusLabel } from '../../utils/formatters'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: null,
  },
})

const badgeClasses = computed(() => {
  const s = props.status?.toLowerCase() || ''

  if (['confirmed', 'paid', 'active', 'approved', 'published', 'succeeded'].includes(s)) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
  }
  if (['pending', 'held', 'waiting_payment', 'draft'].includes(s)) {
    return 'bg-amber-50 text-amber-700 border-amber-200/80'
  }
  if (['cancelled', 'rejected', 'failed', 'inactive'].includes(s)) {
    return 'bg-red-50 text-red-700 border-red-200/80'
  }
  if (['completed'].includes(s)) {
    return 'bg-sky-50 text-sky-700 border-sky-200/80'
  }
  return 'bg-neutral-100 text-neutral-600 border-neutral-200'
})

const dotClasses = computed(() => {
  const s = props.status?.toLowerCase() || ''

  if (['confirmed', 'paid', 'active', 'approved', 'published', 'succeeded'].includes(s)) {
    return 'bg-emerald-500'
  }
  if (['pending', 'held', 'waiting_payment', 'draft'].includes(s)) {
    return 'bg-amber-500'
  }
  if (['cancelled', 'rejected', 'failed', 'inactive'].includes(s)) {
    return 'bg-red-500'
  }
  if (['completed'].includes(s)) {
    return 'bg-sky-500'
  }
  return 'bg-neutral-400'
})
</script>
