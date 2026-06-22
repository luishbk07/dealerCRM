export type TransmissionType = 'manual' | 'automatic'

export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric'

export type VehicleStatus = 'available' | 'reserved' | 'sold'

export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  transmission: TransmissionType
  fuelType: FuelType
  images: string[]
  description?: string
  status: VehicleStatus
  createdAt: string
  updatedAt: string
}

export type VehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: VehicleStatus
}
