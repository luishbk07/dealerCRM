import { useQuery } from '@tanstack/react-query'
import { leadService } from '../services/leadService'
import { queryKeys } from '@/shared/queryKeys'

export const useLead = (id: string | undefined) => {
  return useQuery({
    queryKey: id ? queryKeys.leads.detail(id) : queryKeys.leads.detail('disabled'),
    queryFn: () => leadService.getDetail(id as string),
    enabled: Boolean(id)
  })
}
