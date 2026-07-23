import { useQuery } from '@tanstack/react-query'
import { salesService } from '../services/salesService'
import { queryKeys } from '@/shared/queryKeys'

export const useSale = (id: string | undefined) => {
  return useQuery({
    queryKey: id ? queryKeys.sales.detail(id) : queryKeys.sales.detail('disabled'),
    queryFn: () => salesService.getById(id as string),
    enabled: Boolean(id)
  })
}
