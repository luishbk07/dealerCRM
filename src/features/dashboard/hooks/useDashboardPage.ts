import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { leadService } from '@/shared/services/leadService'
import { salesService } from '@/features/sales/services/salesService'
import { vehicleService } from '@/features/vehicles/services/vehicleService'
import { queryKeys } from '@/shared/queryKeys'
import type { Vehicle } from '@/shared/types'
import { buildActivityFeed } from '../utils/buildActivityFeed'
import { useDashboardStats } from './useDashboardStats'

const RECENT_LEADS_COUNT = 5
const VEHICLE_LOOKUP_PARAMS = { page: 0, pageSize: 500 }

export const useDashboardPage = () => {
  const snapshotQuery = useDashboardStats()

  const leadsQuery = useQuery({
    queryKey: queryKeys.leads.allLeads,
    queryFn: () => leadService.getAll(),
    staleTime: 60_000
  })

  const salesQuery = useQuery({
    queryKey: queryKeys.sales.allSales,
    queryFn: () => salesService.getAll(),
    staleTime: 60_000
  })

  const vehiclesQuery = useQuery({
    queryKey: queryKeys.vehicles.list(VEHICLE_LOOKUP_PARAMS),
    queryFn: () => vehicleService.listWithImages(VEHICLE_LOOKUP_PARAMS),
    staleTime: 60_000
  })

  const leads = leadsQuery.data ?? []
  const sales = salesQuery.data ?? []
  const vehicles = vehiclesQuery.data?.items ?? []

  const vehicleById = useMemo(() => {
    const map = new Map<string, Vehicle>()
    for (const vehicle of vehicles) {
      map.set(vehicle.id, vehicle)
    }
    return map
  }, [vehicles])

  const recentLeads = useMemo(
    () =>
      [...leads]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, RECENT_LEADS_COUNT),
    [leads]
  )

  const activities = useMemo(
    () => buildActivityFeed(vehicles, leads, sales),
    [vehicles, leads, sales]
  )

  const isLoading =
    snapshotQuery.isLoading ||
    leadsQuery.isLoading ||
    salesQuery.isLoading ||
    vehiclesQuery.isLoading

  const isError =
    snapshotQuery.isError ||
    leadsQuery.isError ||
    salesQuery.isError ||
    vehiclesQuery.isError

  const error =
    snapshotQuery.error ?? leadsQuery.error ?? salesQuery.error ?? vehiclesQuery.error

  return {
    snapshot: snapshotQuery.data,
    recentLeads,
    vehicleById,
    activities,
    isLoading,
    isError,
    error
  }
}
