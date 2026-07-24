import { supabase } from '@/shared/services/supabase'

/** @deprecated Use STORAGE_BUCKETS.vehicleImages for new code. */
export const STORAGE_BUCKET = 'vehicle-images'

export const STORAGE_BUCKETS = {
  vehicleImages: 'vehicle-images',
  dealerLogos: 'dealer-logos',
  dealerBanners: 'dealer-banners'
} as const

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS]

export interface UploadBytesOptions {
  contentType: string
  cacheControl?: string
  upsert?: boolean
}

export interface UploadedObject {
  storagePath: string
  publicUrl: string
}

const toStorageError = (error: { message?: string }): Error => {
  const message = error.message ?? 'Error de Supabase Storage'
  if (message.toLowerCase().includes('row-level security') || message.toLowerCase().includes('403')) {
    return new Error(
      'Permiso denegado en Supabase Storage. Ejecuta supabase/storage-setup.sql en el SQL Editor de tu proyecto.'
    )
  }
  return new Error(message)
}

/**
 * Uploads raw bytes via the Supabase JS client.
 * MUST receive ArrayBuffer — never File/Blob (those trigger multipart FormData with an empty field name).
 * Callers must pass an explicit bucket — never assume a default.
 */
export const storageRepository = {
  getPublicUrl(storagePath: string, bucket: StorageBucket): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath)
    return data.publicUrl
  },

  async uploadBytes(
    storagePath: string,
    body: ArrayBuffer,
    options: UploadBytesOptions,
    bucket: StorageBucket
  ): Promise<UploadedObject> {
    if (!(body instanceof ArrayBuffer) || body.byteLength === 0) {
      throw new Error('El cuerpo del archivo está vacío o es inválido')
    }

    const { error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, body, {
        cacheControl: options.cacheControl ?? '3600',
        upsert: options.upsert ?? false,
        contentType: options.contentType
      })

    if (error) throw toStorageError(error)

    return {
      storagePath,
      publicUrl: storageRepository.getPublicUrl(storagePath, bucket)
    }
  },

  async remove(storagePaths: string[], bucket: StorageBucket): Promise<void> {
    if (storagePaths.length === 0) return
    const { error } = await supabase.storage.from(bucket).remove(storagePaths)
    if (error) throw toStorageError(error)
  }
}
