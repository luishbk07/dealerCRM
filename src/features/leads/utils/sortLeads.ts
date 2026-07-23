import type { Lead } from '@/shared/types'

export type LeadSortOption = 'newest' | 'oldest' | 'lastContact' | 'customerName'

export const LEAD_SORT_OPTIONS: { value: LeadSortOption, label: string }[] = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguos' },
  { value: 'lastContact', label: 'Último contacto' },
  { value: 'customerName', label: 'Nombre del cliente' }
]

const compareDates = (a: string | null | undefined, b: string | null | undefined): number => {
  const aTime = a ? new Date(a).getTime() : 0
  const bTime = b ? new Date(b).getTime() : 0
  return aTime - bTime
}

export const sortLeads = (leads: Lead[], sort: LeadSortOption): Lead[] => {
  const copy = [...leads]

  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => compareDates(b.createdAt, a.createdAt))
    case 'oldest':
      return copy.sort((a, b) => compareDates(a.createdAt, b.createdAt))
    case 'lastContact':
      return copy.sort((a, b) => compareDates(b.lastContactAt, a.lastContactAt))
    case 'customerName':
      return copy.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'es', { sensitivity: 'base' }))
    default:
      return copy
  }
}
