import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/queryKeys'
import type { VehicleListParams } from '@/shared/repositories'
import { publicDealerService } from '../services/publicDealerService'

export const usePublicDealerVehicles = (
  dealerId: string | undefined,
  params: VehicleListParams
) => {
  return useQuery({
    queryKey: queryKeys.publicSite.vehicles(dealerId ?? '', params),
    queryFn: () => publicDealerService.listActiveVehicles(dealerId as string, params),
    enabled: Boolean(dealerId && params.dealerId),
    placeholderData: keepPreviousData
  })
}
