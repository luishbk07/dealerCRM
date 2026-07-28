import type { VehicleWithImages } from '@/shared/types'
import type { PublicRelatedVehicle, PublicVehicleDetail } from '../types'

export const toPublicVehicleDetail = (
  vehicle: VehicleWithImages,
  imageUrls: string[]
): PublicVehicleDetail => ({
  id: vehicle.id,
  brand: vehicle.brand,
  model: vehicle.model,
  year: vehicle.year,
  price: vehicle.price,
  mileage: vehicle.mileage,
  transmission: vehicle.transmission,
  fuelType: vehicle.fuelType,
  description: vehicle.description,
  imageUrls,
  primaryImageUrl: imageUrls[0] ?? null
})

export const toPublicRelatedVehicle = (vehicle: VehicleWithImages): PublicRelatedVehicle => ({
  id: vehicle.id,
  brand: vehicle.brand,
  model: vehicle.model,
  year: vehicle.year,
  price: vehicle.price,
  mileage: vehicle.mileage,
  transmission: vehicle.transmission,
  fuelType: vehicle.fuelType,
  imageUrl: vehicle.primaryImageUrl
})

export const buildVehicleInterestMessage = (
  brand: string,
  model: string,
  year: number | null
): string =>
  `Hola, me interesa el ${brand} ${model}${year ? ` ${year}` : ''} publicado en su inventario.`
