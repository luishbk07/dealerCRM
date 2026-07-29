import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/context/AuthContext'
import type { Vehicle } from '@/shared/types'
import type { VehicleShareChannel } from '@/shared/utils/vehicleShare'
import { vehicleShareService } from '../services/vehicleShareService'

interface LogShareVariables {
  vehicle: Vehicle
  channel: VehicleShareChannel
}

export const useShareVehicle = () => {
  const queryClient = useQueryClient()
  const { dealer } = useAuth()

  const logShare = useMutation({
    mutationFn: ({ vehicle, channel }: LogShareVariables) => {
      if (!dealer) return Promise.resolve()
      return vehicleShareService.logShare(dealer.id, vehicle, channel)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity'] })
    }
  })

  return { logShare }
}
