export function formatCostCompact(cost?: number | null): string {
  if (cost == null) return 'N/A'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(cost)
}

export function formatCostFull(cost?: number | null): string {
  if (cost == null) return 'Not available'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cost)
}

export function formatDate(date?: string | null): string {
  if (!date) return 'Not available'

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) return date

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parsed)
}
