import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/queryKeys'
import { publicDealerService } from '../services/publicDealerService'

export const usePublicDealer = (slug: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.publicSite.dealer(slug ?? ''),
    queryFn: () => publicDealerService.getDealerBySlug(slug as string),
    enabled: Boolean(slug?.trim()),
    retry: false
  })
}
