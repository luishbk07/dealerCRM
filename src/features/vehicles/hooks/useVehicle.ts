import { useQuery } from '@tanstack/react-query'
import { vehicleService } from '../services/vehicleService'
import { queryKeys } from '@/shared/queryKeys'

export const useVehicle = (id: string | undefined) => {
  return useQuery({
    queryKey: id ? queryKeys.vehicles.detail(id) : queryKeys.vehicles.detail('disabled'),
    queryFn: () => vehicleService.getById(id as string),
    enabled: Boolean(id)
  })
}
