/**
 * Format a numeric amount to Indonesian Rupiah (IDR).
 *
 * @param {number|string|null} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return 'Rp0'
  }

  const numeric = Math.round(Number(amount))
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(numeric)
}

/**
 * Format a date string to Indonesian-readable date and time.
 * e.g. "29 Sep 2026, 18:00"
 *
 * @param {string|Date|null} date
 * @returns {string}
 */
export function formatDateTime(date) {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return String(date)

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Format a date string to Indonesian-readable date.
 * e.g. "29 Sep 2026"
 *
 * @param {string|Date|null} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return String(date)

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

/**
 * Clean status string for human-readable display.
 *
 * @param {string|null} status
 * @returns {string}
 */
export function formatStatusLabel(status) {
  if (!status) return '-'
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
