import { useQuery } from '@tanstack/react-query'
import { leadService } from '@/features/leads/services/leadService'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import { queryKeys } from '@/shared/queryKeys'
import type { Lead, Vehicle } from '@/shared/types'
import { useMemo } from 'react'

const CATALOG_PAGE_SIZE = 500

export const useSalesCatalog = () => {
  const vehiclesQuery = useVehicles({
    page: 0,
    pageSize: CATALOG_PAGE_SIZE,
    status: null,
    brand: null,
    yearMin: null,
    yearMax: null,
    priceMin: null,
    priceMax: null,
    search: null
  })

  const leadsQuery = useQuery({
    queryKey: queryKeys.leads.allLeads,
    queryFn: () => leadService.getAll()
  })

  const vehicles = vehiclesQuery.data?.items ?? []
  const leads = leadsQuery.data ?? []

  const vehiclesById = useMemo(() => {
    const map = new Map<string, Vehicle>()
    for (const vehicle of vehicles) map.set(vehicle.id, vehicle)
    return map
  }, [vehicles])

  const leadsById = useMemo(() => {
    const map = new Map<string, Lead>()
    for (const lead of leads) map.set(lead.id, lead)
    return map
  }, [leads])

  return {
    vehicles,
    leads,
    vehiclesById,
    leadsById,
    isLoading: vehiclesQuery.isLoading || leadsQuery.isLoading,
    isError: vehiclesQuery.isError || leadsQuery.isError
  }
}
