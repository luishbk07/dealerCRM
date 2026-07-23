import type { Vehicle } from '@/shared/types'

export const formatVehicleLabel = (vehicle: Vehicle | undefined, vehicleId: string | null): string => {
  if (!vehicleId) return '—'
  if (!vehicle) return 'Vehículo no disponible'
  const year = vehicle.year ? ` ${vehicle.year}` : ''
  return `${vehicle.brand} ${vehicle.model}${year}`.trim()
}
