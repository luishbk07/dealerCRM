const currencyFormatter = new Intl.NumberFormat('es-DO', {
  style: 'currency',
  currency: 'DOP',
  maximumFractionDigits: 0
})

const numberFormatter = new Intl.NumberFormat('es-DO')

export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'RD$ —'
  return currencyFormatter.format(value)
}

export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '—'
  return numberFormatter.format(value)
}

/** Keeps digits only — used as the raw form value for currency fields. */
export const stripCurrencyInput = (value: string): string => value.replace(/\D/g, '')

/** Formats digit-only currency input for display (e.g. "1500000" → "1,500,000"). */
export const formatCurrencyInput = (digits: string): string => {
  const normalized = stripCurrencyInput(digits)
  if (!normalized) return ''
  const amount = Number(normalized)
  if (!Number.isFinite(amount)) return ''
  return numberFormatter.format(amount)
}

export const numberToCurrencyInputDigits = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return ''
  return String(Math.round(value))
}

export const stripNumericInput = stripCurrencyInput
export const formatNumericInput = formatCurrencyInput
export const numberToNumericInputDigits = numberToCurrencyInputDigits

const KM_PER_MILE = 1.609344

export const milesToKm = (miles: number): number => Math.round(miles * KM_PER_MILE)
export const kmToMiles = (km: number): number => Math.round(km / KM_PER_MILE)

export const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return '—'
  const date = new Date(iso)
  return date.toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const formatDateTime = (iso: string | null | undefined): string => {
  if (!iso) return '—'
  const date = new Date(iso)
  return date.toLocaleString('es-DO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatRelative = (iso: string | null | undefined): string => {
  if (!iso) return '—'
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diffMinutes = Math.round((now - then) / 60000)

  if (diffMinutes < 1) return 'ahora mismo'
  if (diffMinutes < 60) return `hace ${diffMinutes} min`

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `hace ${diffHours} h`

  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 30) return `hace ${diffDays} d`

  return formatDate(iso)
}
