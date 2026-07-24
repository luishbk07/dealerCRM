import type { Vehicle, VehicleImage, VehicleWithImages } from '@/shared/types'
import {
  storageRepository,
  STORAGE_BUCKETS,
  vehicleImageRepository,
  vehicleRepository,
  type CreateVehicleRow,
  type UpdateVehicleRow,
  type VehicleListParams,
  type VehicleListResult
} from '@/shared/repositories'
import { storageService } from './storageService'

export interface VehicleFormPayload {
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
}

const toRow = (payload: VehicleFormPayload): UpdateVehicleRow => ({
  brand: payload.brand,
  model: payload.model,
  year: payload.year,
  price: payload.price,
  mileage: payload.mileage,
  transmission: payload.transmission,
  fuel_type: payload.fuelType,
  description: payload.description,
  status: payload.status,
  vin: payload.vin,
  stock_number: payload.stockNumber,
  trim: payload.trim,
  body_style: payload.bodyStyle,
  exterior_color: payload.exteriorColor,
  interior_color: payload.interiorColor,
  drivetrain: payload.drivetrain,
  engine: payload.engine,
  sale_price: payload.salePrice,
  featured: payload.featured
})

const buildPrimaryImageUrl = (images: VehicleImage[]): string | null => {
  if (images.length === 0) return null
  const primary = images.find((image) => image.isPrimary) ?? images[0]
  if (primary.storagePath) return storageRepository.getPublicUrl(primary.storagePath, STORAGE_BUCKETS.vehicleImages)
  return primary.url
}

const resolveImageUrl = (image: VehicleImage): string => {
  if (image.storagePath) return storageRepository.getPublicUrl(image.storagePath, STORAGE_BUCKETS.vehicleImages)
  return image.url
}

export interface VehicleListResultWithImages extends Omit<VehicleListResult, 'items'> {
  items: VehicleWithImages[]
}

export interface VehicleImageUpload {
  file: File
  isPrimary?: boolean
}

const attachImages = (vehicle: Vehicle, images: VehicleImage[]): VehicleWithImages => ({
  ...vehicle,
  images,
  primaryImageUrl: buildPrimaryImageUrl(images)
})

export const vehicleService = {
  async listWithImages(params: VehicleListParams): Promise<VehicleListResultWithImages> {
    const page = await vehicleRepository.list(params)
    const ids = page.items.map((vehicle) => vehicle.id)
    const images = await vehicleImageRepository.listByVehicleIds(ids)
    const byVehicle = new Map<string, VehicleImage[]>()
    for (const image of images) {
      if (!image.vehicleId) continue
      const list = byVehicle.get(image.vehicleId) ?? []
      list.push(image)
      byVehicle.set(image.vehicleId, list)
    }
    return {
      ...page,
      items: page.items.map((vehicle) => attachImages(vehicle, byVehicle.get(vehicle.id) ?? []))
    }
  },

  async getById(id: string): Promise<VehicleWithImages | null> {
    const vehicle = await vehicleRepository.getById(id)
    if (!vehicle) return null
    const images = await vehicleImageRepository.listByVehicleId(id)
    return attachImages(vehicle, images)
  },

  async create(
    dealerId: string,
    payload: VehicleFormPayload,
    images: VehicleImageUpload[] = []
  ): Promise<VehicleWithImages> {
    const insertPayload: CreateVehicleRow = {
      dealer_id: dealerId,
      ...toRow(payload)
    } as CreateVehicleRow
    const vehicle = await vehicleRepository.create(insertPayload)
    const uploadedImages = await vehicleService.uploadImages(dealerId, vehicle.id, images, 0)
    return attachImages(vehicle, uploadedImages)
  },

  async update(
    dealerId: string,
    id: string,
    payload: VehicleFormPayload,
    newImages: VehicleImageUpload[] = []
  ): Promise<VehicleWithImages> {
    const updated = await vehicleRepository.update(id, toRow(payload))
    const existing = await vehicleImageRepository.listByVehicleId(id)
    const startOrder = existing.length
    const uploaded = await vehicleService.uploadImages(dealerId, id, newImages, startOrder)
    const combined = [...existing, ...uploaded]
    return attachImages(updated, combined)
  },

  async remove(id: string): Promise<void> {
    const images = await vehicleImageRepository.listByVehicleId(id)
    const paths = images.map((image) => image.storagePath).filter((path): path is string => Boolean(path))
    await vehicleRepository.remove(id)
    if (paths.length > 0) {
      try {
        await storageRepository.remove(paths, STORAGE_BUCKETS.vehicleImages)
      } catch {
        // Si Storage falla, los registros ya están borrados; el archivo huérfano se puede limpiar luego.
      }
    }
  },

  uploadImages(
    dealerId: string,
    vehicleId: string,
    images: VehicleImageUpload[],
    startOrder: number
  ): Promise<VehicleImage[]> {
    return storageService.uploadVehicleImages(dealerId, vehicleId, images, startOrder)
  },

  async deleteImage(image: VehicleImage): Promise<void> {
    await vehicleImageRepository.remove(image.id)
    if (image.storagePath) {
      try {
        await storageRepository.remove([image.storagePath], STORAGE_BUCKETS.vehicleImages)
      } catch {
        // Archivo huérfano se puede limpiar luego.
      }
    }
  },

  async setPrimaryImage(image: VehicleImage): Promise<void> {
    if (!image.vehicleId) return
    await vehicleImageRepository.clearPrimaryForVehicle(image.vehicleId)
    await vehicleImageRepository.setPrimary(image.id)
  },

  resolveImageUrl
}
