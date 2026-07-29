import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/context/AuthContext'
import { queryKeys } from '@/shared/queryKeys'
import { vehicleService } from '../services/vehicleService'

export const useFeaturedVehicleCount = (excludeVehicleId?: string | null) => {
  const { dealer } = useAuth()

  return useQuery({
    queryKey: queryKeys.vehicles.featuredCount(dealer?.id ?? '', excludeVehicleId ?? null),
    queryFn: () => vehicleService.countFeatured(dealer!.id, excludeVehicleId),
    enabled: Boolean(dealer?.id)
  })
}
