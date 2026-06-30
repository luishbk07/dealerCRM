import {
  storageRepository,
  type UploadedObject
} from '@/shared/repositories/storageRepository'
import type { VehicleImage } from '@/shared/types'
import { vehicleImageRepository } from '@/shared/repositories'

const WEBP_QUALITY = 0.85
const MAX_DIMENSION = 1920

export interface PreparedImageUpload {
  buffer: ArrayBuffer
  contentType: string
  extension: string
}

const sanitizeBaseName = (name: string): string => {
  const withoutExt = name.replace(/\.[^.]+$/, '')
  const trimmed = withoutExt.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return trimmed.replace(/^-+|-+$/g, '') || 'image'
}

const extensionFromType = (type: string): string => {
  if (type === 'image/webp') return 'webp'
  if (type === 'image/png') return 'png'
  if (type === 'image/jpeg' || type === 'image/jpg') return 'jpg'
  if (type === 'image/gif') return 'gif'
  return 'jpg'
}

/**
 * dealers/{dealerId}/vehicles/{vehicleId}/{timestamp}-{filename}.{ext}
 * Example: dealers/e2ab.../vehicles/145d6.../1700000000-honda-civic.jpeg
 */
export const buildVehicleImageStoragePath = (
  dealerId: string,
  vehicleId: string,
  fileName: string,
  extension: string
): string => {
  const safeBase = sanitizeBaseName(fileName)
  const safeExt = extension.replace(/^\./, '').toLowerCase() || 'jpg'
  return `dealers/${dealerId}/vehicles/${vehicleId}/${Date.now()}-${safeBase}.${safeExt}`
}

const assertValidFile = (file: File): void => {
  if (!(file instanceof File)) {
    throw new Error('Se esperaba un archivo válido del dispositivo')
  }
  if (file.size === 0) {
    throw new Error('El archivo está vacío')
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('Solo se permiten archivos de imagen')
  }
}

const compressToWebp = async (file: File): Promise<PreparedImageUpload> => {
  const bitmap = await createImageBitmap(file)
  const longestSide = Math.max(bitmap.width, bitmap.height)
  const scale = longestSide > MAX_DIMENSION ? MAX_DIMENSION / longestSide : 1
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('No se pudo procesar la imagen en este navegador')
  }

  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY)
  })

  if (!blob || blob.size === 0) {
    throw new Error('No se pudo comprimir la imagen')
  }

  return {
    buffer: await blob.arrayBuffer(),
    contentType: 'image/webp',
    extension: 'webp'
  }
}

export const prepareImageForUpload = async (file: File): Promise<PreparedImageUpload> => {
  assertValidFile(file)

  try {
    return await compressToWebp(file)
  } catch {
    const buffer = await file.arrayBuffer()
    if (buffer.byteLength === 0) {
      throw new Error('No se pudo leer el archivo de imagen')
    }
    const contentType = file.type || 'image/jpeg'
    const fromName = file.name.split('.').pop()?.toLowerCase()
    const extension = fromName && fromName.length <= 5 ? fromName : extensionFromType(contentType)
    return { buffer, contentType, extension: extension === 'jpeg' ? 'jpg' : extension }
  }
}

export interface VehicleImageUploadInput {
  file: File
  isPrimary?: boolean
}

export interface VehicleImageUploadResult {
  image: VehicleImage
  storage: UploadedObject
}

export const storageService = {
  buildVehicleImageStoragePath,

  async uploadVehicleImage(
    dealerId: string,
    vehicleId: string,
    file: File
  ): Promise<UploadedObject> {
    const prepared = await prepareImageForUpload(file)
    const storagePath = buildVehicleImageStoragePath(
      dealerId,
      vehicleId,
      file.name,
      prepared.extension
    )
    return storageRepository.uploadBytes(storagePath, prepared.buffer, {
      contentType: prepared.contentType
    })
  },

  async uploadVehicleImages(
    dealerId: string,
    vehicleId: string,
    images: VehicleImageUploadInput[],
    startOrder: number
  ): Promise<VehicleImage[]> {
    if (images.length === 0) return []

    const created: VehicleImage[] = []

    for (let index = 0; index < images.length; index += 1) {
      const { file, isPrimary } = images[index]
      const uploaded = await storageService.uploadVehicleImage(dealerId, vehicleId, file)
      const order = startOrder + index

      if (isPrimary) {
        await vehicleImageRepository.clearPrimaryForVehicle(vehicleId)
      }

      const row = await vehicleImageRepository.create({
        vehicle_id: vehicleId,
        url: uploaded.publicUrl,
        storage_path: uploaded.storagePath,
        display_order: order,
        position: order,
        is_primary: Boolean(isPrimary)
      })

      created.push(row)
    }

    return created
  }
}
