import type { Lead, Sale, Vehicle } from '@/shared/types'
import { startOfDayIso, endOfDayIso } from '@/features/leads/utils/leadDates'
import { formatVehicleLabel } from '@/features/leads/utils/vehicleLabel'

export interface SalesFilterParams {
  search: string
  vehicleId: string
  dateFrom: string
  dateTo: string
}

export const filterSales = (
  sales: Sale[],
  filters: SalesFilterParams,
  leadsById: Map<string, Lead>,
  vehiclesById: Map<string, Vehicle>
): Sale[] => {
  const term = filters.search.trim().toLowerCase()

  return sales.filter((sale) => {
    if (filters.vehicleId && sale.vehicleId !== filters.vehicleId) return false

    if (filters.dateFrom) {
      const from = new Date(startOfDayIso(filters.dateFrom))
      if (new Date(sale.soldAt) < from) return false
    }

    if (filters.dateTo) {
      const to = new Date(endOfDayIso(filters.dateTo))
      if (new Date(sale.soldAt) > to) return false
    }

    if (!term) return true

    const lead = sale.leadId ? leadsById.get(sale.leadId) : undefined
    const vehicle = sale.vehicleId ? vehiclesById.get(sale.vehicleId) : undefined

    const haystack = [
      lead?.name,
      lead?.phone,
      vehicle?.brand,
      vehicle?.model,
      vehicle?.stockNumber,
      formatVehicleLabel(vehicle, sale.vehicleId)
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(term)
  })
}
