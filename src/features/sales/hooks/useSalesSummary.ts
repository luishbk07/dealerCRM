import { useQuery } from '@tanstack/react-query'
import { salesService } from '../services/salesService'
import { queryKeys } from '@/shared/queryKeys'

export const useSalesSummary = () => {
  return useQuery({
    queryKey: queryKeys.sales.summary,
    queryFn: () => salesService.getSummary()
  })
}
