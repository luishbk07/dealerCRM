import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { salesService } from '../services/salesService'
import { queryKeys } from '@/shared/queryKeys'
import type { SaleListParams } from '@/shared/repositories'

export const useSales = (params: SaleListParams) => {
  return useQuery({
    queryKey: queryKeys.sales.list(params),
    queryFn: () => salesService.list(params),
    placeholderData: keepPreviousData
  })
}
