import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/queryKeys'
import { publicDealerService } from '../services/publicDealerService'

export const usePublicVehicleDetail = (dealerSlug: string | undefined, vehicleId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.publicSite.vehicle(dealerSlug ?? '', vehicleId ?? ''),
    queryFn: () => publicDealerService.getPublicVehicle(dealerSlug as string, vehicleId as string),
    enabled: Boolean(dealerSlug?.trim() && vehicleId?.trim()),
    retry: false
  })
}

export const usePublicRelatedVehicles = (
  dealerSlug: string | undefined,
  vehicleId: string | undefined,
  enabled: boolean
) => {
  return useQuery({
    queryKey: queryKeys.publicSite.relatedVehicles(dealerSlug ?? '', vehicleId ?? ''),
    queryFn: () => publicDealerService.listRelatedVehicles(dealerSlug as string, vehicleId as string),
    enabled: enabled && Boolean(dealerSlug?.trim() && vehicleId?.trim()),
    staleTime: 60_000
  })
}
