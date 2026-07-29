import { activityService } from '@/shared/services/activityService'
import type { Vehicle } from '@/shared/types'
import {
  VEHICLE_SHARE_CHANNEL_LABELS,
  type VehicleShareChannel
} from '@/shared/utils/vehicleShare'

export const vehicleShareService = {
  logShare(dealerId: string, vehicle: Vehicle, channel: VehicleShareChannel): Promise<void> {
    return activityService.logVehicleShared(dealerId, vehicle, VEHICLE_SHARE_CHANNEL_LABELS[channel])
  }
}
