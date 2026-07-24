import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/queryKeys'
import { dealerSettingsService } from '../services/dealerSettingsService'

export const useDealerSettings = (dealerId: string | undefined) => {
  return useQuery({
    queryKey: dealerId ? queryKeys.dealer.settings(dealerId) : queryKeys.dealer.settings('disabled'),
    queryFn: () => dealerSettingsService.getById(dealerId as string),
    enabled: Boolean(dealerId)
  })
}
