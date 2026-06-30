import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'
import { queryKeys } from '@/shared/queryKeys'

export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.snapshot,
    queryFn: () => dashboardService.getSnapshot()
  })
}
