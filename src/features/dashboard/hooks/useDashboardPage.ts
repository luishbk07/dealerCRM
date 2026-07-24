import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLeads } from '@/features/leads/hooks/useLeads'
import { vehicleService } from '@/features/vehicles/services/vehicleService'
import { queryKeys } from '@/shared/queryKeys'
import type { Vehicle } from '@/shared/types'
import { useDashboardStats } from './useDashboardStats'

const RECENT_LEADS_PARAMS = { page: 0, pageSize: 5 }
const VEHICLE_LOOKUP_PARAMS = { page: 0, pageSize: 500 }

export const useDashboardPage = () => {
  const snapshotQuery = useDashboardStats()
  const recentLeadsQuery = useLeads(RECENT_LEADS_PARAMS)

  const recentLeads = recentLeadsQuery.data?.items ?? []
  const needsVehicleLookup = recentLeads.some((lead) => lead.vehicleId)

  const vehiclesQuery = useQuery({
    queryKey: queryKeys.vehicles.list(VEHICLE_LOOKUP_PARAMS),
    queryFn: () => vehicleService.listWithImages(VEHICLE_LOOKUP_PARAMS),
    enabled: needsVehicleLookup,
    staleTime: 60_000
  })

  const vehicleById = useMemo(() => {
    const map = new Map<string, Vehicle>()
    for (const vehicle of vehiclesQuery.data?.items ?? []) {
      map.set(vehicle.id, vehicle)
    }
    return map
  }, [vehiclesQuery.data?.items])

  const isLoading =
    snapshotQuery.isLoading ||
    recentLeadsQuery.isLoading ||
    (needsVehicleLookup && vehiclesQuery.isLoading)

  const isError =
    snapshotQuery.isError ||
    recentLeadsQuery.isError ||
    (needsVehicleLookup && vehiclesQuery.isError)

  const error = snapshotQuery.error ?? recentLeadsQuery.error ?? vehiclesQuery.error

  return {
    snapshot: snapshotQuery.data,
    recentLeads,
    vehicleById,
    isLoading,
    isError,
    error
  }
}
