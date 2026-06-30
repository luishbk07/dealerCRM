import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { vehicleService } from '../services/vehicleService'
import { queryKeys } from '@/shared/queryKeys'
import type { VehicleListParams } from '@/shared/repositories'

export const useVehicles = (params: VehicleListParams) => {
  return useQuery({
    queryKey: queryKeys.vehicles.list(params),
    queryFn: () => vehicleService.listWithImages(params),
    placeholderData: keepPreviousData
  })
}
