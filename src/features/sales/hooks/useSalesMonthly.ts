import { useQuery } from '@tanstack/react-query'
import { salesService } from '../services/salesService'
import { queryKeys } from '@/shared/queryKeys'

export const useSalesMonthly = () => {
  return useQuery({
    queryKey: queryKeys.sales.monthly,
    queryFn: () => salesService.getMonthly()
  })
}
