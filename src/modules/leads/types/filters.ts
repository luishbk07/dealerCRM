import type { LeadStatus } from './leadStatus'

export interface LeadSearchParams {
  page?: number
  pageSize?: number
  status?: LeadStatus | null
  vehicleId?: string | null
  dateFrom?: string | null
  dateTo?: string | null
  search?: string | null
}

export interface LeadListResult {
  items: import('./lead').Lead[]
  total: number
  page: number
  pageSize: number
}
