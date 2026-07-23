import type { Lead, Sale } from '@/shared/types'

export type SaleSortOption = 'newest' | 'oldest' | 'amountHigh' | 'amountLow' | 'buyerName'

export const SALE_SORT_OPTIONS: { value: SaleSortOption, label: string }[] = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguas' },
  { value: 'amountHigh', label: 'Mayor monto' },
  { value: 'amountLow', label: 'Menor monto' },
  { value: 'buyerName', label: 'Nombre del comprador' }
]

const compareDates = (a: string, b: string): number =>
  new Date(a).getTime() - new Date(b).getTime()

const compareAmounts = (a: number | null, b: number | null): number =>
  (a ?? 0) - (b ?? 0)

export const sortSales = (
  sales: Sale[],
  sort: SaleSortOption,
  leadsById: Map<string, Lead>
): Sale[] => {
  const copy = [...sales]

  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => compareDates(b.soldAt, a.soldAt))
    case 'oldest':
      return copy.sort((a, b) => compareDates(a.soldAt, b.soldAt))
    case 'amountHigh':
      return copy.sort((a, b) => compareAmounts(b.price, a.price))
    case 'amountLow':
      return copy.sort((a, b) => compareAmounts(a.price, b.price))
    case 'buyerName':
      return copy.sort((a, b) => {
        const nameA = a.leadId ? (leadsById.get(a.leadId)?.name ?? '') : ''
        const nameB = b.leadId ? (leadsById.get(b.leadId)?.name ?? '') : ''
        return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' })
      })
    default:
      return copy
  }
}

export const formatBuyerName = (lead: Lead | undefined): string => lead?.name?.trim() || '—'
