import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/context/AuthContext'
import { queryKeys } from '@/shared/queryKeys'
import { vehicleService, type VehicleFormPayload, type VehicleImageUpload } from '../services/vehicleService'
import type { VehicleImage } from '@/shared/types'

interface CreateVariables {
  payload: VehicleFormPayload
  images: VehicleImageUpload[]
}

interface UpdateVariables {
  id: string
  payload: VehicleFormPayload
  newImages: VehicleImageUpload[]
}

const DEALER_NOT_FOUND = 'Necesitas un dealer activo para gestionar el inventario.'

export const useVehicleMutations = () => {
  const queryClient = useQueryClient()
  const { dealer } = useAuth()

  const invalidate = (vehicleId?: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.snapshot })
    if (vehicleId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.detail(vehicleId) })
    }
  }

  const create = useMutation({
    mutationFn: async ({ payload, images }: CreateVariables) => {
      if (!dealer) throw new Error(DEALER_NOT_FOUND)
      return vehicleService.create(dealer.id, payload, images)
    },
    onSuccess: (vehicle) => invalidate(vehicle.id)
  })

  const update = useMutation({
    mutationFn: async ({ id, payload, newImages }: UpdateVariables) => {
      if (!dealer) throw new Error(DEALER_NOT_FOUND)
      return vehicleService.update(dealer.id, id, payload, newImages)
    },
    onSuccess: (vehicle) => invalidate(vehicle.id)
  })

  const remove = useMutation({
    mutationFn: (id: string) => vehicleService.remove(id),
    onSuccess: () => invalidate()
  })

  const deleteImage = useMutation({
    mutationFn: (image: VehicleImage) => vehicleService.deleteImage(image),
    onSuccess: (_, image) => invalidate(image.vehicleId ?? undefined)
  })

  const setPrimary = useMutation({
    mutationFn: (image: VehicleImage) => vehicleService.setPrimaryImage(image),
    onSuccess: (_, image) => invalidate(image.vehicleId ?? undefined)
  })

  return { create, update, remove, deleteImage, setPrimary }
}
