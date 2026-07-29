import { useQuery } from '@tanstack/react-query'
import { leadService } from '../services/leadService'
import { queryKeys } from '@/shared/queryKeys'

const PENDING_TASKS_LIMIT = 5

export const usePendingLeadTasks = (limit: number = PENDING_TASKS_LIMIT) => {
  return useQuery({
    queryKey: queryKeys.leads.pendingTasks(limit),
    queryFn: () => leadService.listPendingTasks(limit)
  })
}

export const useOverdueTaskCount = () => {
  return useQuery({
    queryKey: queryKeys.leads.overdueTaskCount,
    queryFn: () => leadService.countOverdueTasks()
  })
}
