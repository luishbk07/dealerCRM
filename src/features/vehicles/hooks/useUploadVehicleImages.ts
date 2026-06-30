import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/context/AuthContext'
import { queryKeys } from '@/shared/queryKeys'
import { storageService, type VehicleImageUploadInput } from '../services/storageService'
import type { VehicleImage } from '@/shared/types'

interface UploadVariables {
  vehicleId: string
  images: VehicleImageUploadInput[]
  startOrder?: number
}

const DEALER_NOT_FOUND = 'Necesitas un dealer activo para subir imágenes.'

export const useUploadVehicleImages = () => {
  const queryClient = useQueryClient()
  const { dealer } = useAuth()

  return useMutation({
    mutationFn: async ({ vehicleId, images, startOrder = 0 }: UploadVariables): Promise<VehicleImage[]> => {
      if (!dealer) throw new Error(DEALER_NOT_FOUND)
      return storageService.uploadVehicleImages(dealer.id, vehicleId, images, startOrder)
    },
    onSuccess: (_, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.detail(vehicleId) })
    }
  })
}
