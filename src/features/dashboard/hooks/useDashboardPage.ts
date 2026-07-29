import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLeads } from '@/features/leads/hooks/useLeads'
import { vehicleService } from '@/features/vehicles/services/vehicleService'
import { queryKeys } from '@/shared/queryKeys'
import type { Vehicle } from '@/shared/types'
import { useDashboardStats } from './useDashboardStats'
import { useActivityLogs } from './useActivityLogs'
import { usePendingLeadTasks, useOverdueTaskCount } from '@/features/leads/hooks/usePendingLeadTasks'

const RECENT_LEADS_PARAMS = { page: 0, pageSize: 5 }
const VEHICLE_LOOKUP_PARAMS = { page: 0, pageSize: 500 }

export const useDashboardPage = () => {
  const snapshotQuery = useDashboardStats()
  const activityQuery = useActivityLogs()
  const recentLeadsQuery = useLeads(RECENT_LEADS_PARAMS)
  const pendingTasksQuery = usePendingLeadTasks(5)
  const overdueTasksQuery = useOverdueTaskCount()

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

  return {
    snapshot: snapshotQuery.data,
    snapshotLoading: snapshotQuery.isLoading,
    snapshotError: snapshotQuery.isError ? snapshotQuery.error : null,
    refetchSnapshot: snapshotQuery.refetch,

    recentLeads,
    recentLeadsLoading: recentLeadsQuery.isLoading,
    recentLeadsError: recentLeadsQuery.isError,

    vehicleById,
    vehiclesLoading: needsVehicleLookup && vehiclesQuery.isLoading,
    vehiclesError: needsVehicleLookup && vehiclesQuery.isError,

    activities: activityQuery.data ?? [],
    activitiesLoading: activityQuery.isLoading,
    activitiesError: activityQuery.isError,

    pendingTasks: pendingTasksQuery.data ?? [],
    pendingTasksLoading: pendingTasksQuery.isLoading,
    pendingTasksError: pendingTasksQuery.isError,

    overdueTaskCount: overdueTasksQuery.isError ? 0 : (overdueTasksQuery.data ?? 0),
    overdueTasksError: overdueTasksQuery.isError
  }
}
