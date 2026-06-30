import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { leadService } from '../services/leadService'
import { queryKeys } from '@/shared/queryKeys'
import type { LeadListParams } from '@/shared/repositories'

export const useLeads = (params: LeadListParams) => {
  return useQuery({
    queryKey: queryKeys.leads.list(params),
    queryFn: () => leadService.list(params),
    placeholderData: keepPreviousData
  })
}
