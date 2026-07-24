import {
  LEAD_STATUS_CONTACTED,
  LEAD_STATUS_NEGOTIATING,
  LEAD_STATUS_NEW,
  LEAD_STATUS_QUALIFIED
} from '@/modules/leads/constants/leadStatus'
import type { LeadConversionPoint, LeadStatus, MonthlySalesPoint } from '@/shared/types'

const PENDING_STATUSES = new Set<LeadStatus>([
  LEAD_STATUS_NEW,
  LEAD_STATUS_CONTACTED,
  LEAD_STATUS_QUALIFIED,
  LEAD_STATUS_NEGOTIATING
])

export const countPendingLeads = (points: LeadConversionPoint[]): number =>
  points
    .filter((point) => PENDING_STATUSES.has(point.status as LeadStatus))
    .reduce((sum, point) => sum + point.count, 0)

export const hasSalesTrendData = (points: MonthlySalesPoint[]): boolean =>
  points.some((point) => point.revenue > 0 || point.salesCount > 0)

export const formatSalesCountLabel = (count: number): string => {
  if (count === 0) return 'Sin ventas cerradas'
  if (count === 1) return '1 venta cerrada'
  return `${count} ventas cerradas`
}
