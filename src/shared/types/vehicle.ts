export interface Vehicle {
  id: string
  dealerId: string | null
  brand: string
  model: string
  year: number | null
  price: number | null
  mileage: number | null
  transmission: string | null
  fuelType: string | null
  description: string | null
  status: string
  vin: string | null
  stockNumber: string | null
  trim: string | null
  bodyStyle: string | null
  exteriorColor: string | null
  interiorColor: string | null
  drivetrain: string | null
  engine: string | null
  salePrice: number | null
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface VehicleImage {
  id: string
  vehicleId: string | null
  url: string
  storagePath: string | null
  position: number | null
  displayOrder: number | null
  isPrimary: boolean
  createdAt: string
}

export interface VehicleWithImages extends Vehicle {
  images: VehicleImage[]
  primaryImageUrl: string | null
}

export const VEHICLE_STATUS_ACTIVE = 'active'
export const VEHICLE_STATUS_SOLD = 'sold'
export const VEHICLE_STATUS_RESERVED = 'reserved'
