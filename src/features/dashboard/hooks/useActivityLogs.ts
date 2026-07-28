import { useQuery } from '@tanstack/react-query'
import { activityService } from '@/shared/services/activityService'
import { queryKeys } from '@/shared/queryKeys'
import { ACTIVITY_LOG_LIMIT } from '@/shared/types/activityLog'

export const useActivityLogs = (limit: number = ACTIVITY_LOG_LIMIT) => {
  return useQuery({
    queryKey: queryKeys.activity.latest(limit),
    queryFn: () => activityService.latest(limit)
  })
}
