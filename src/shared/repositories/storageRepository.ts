import { supabase } from '@/shared/services/supabase'

export const STORAGE_BUCKET = 'vehicle-images'

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
 */
export const storageRepository = {
  getPublicUrl(storagePath: string): string {
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
    return data.publicUrl
  },

  async uploadBytes(
    storagePath: string,
    body: ArrayBuffer,
    options: UploadBytesOptions
  ): Promise<UploadedObject> {
    if (!(body instanceof ArrayBuffer) || body.byteLength === 0) {
      throw new Error('El cuerpo del archivo está vacío o es inválido')
    }

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, body, {
        cacheControl: options.cacheControl ?? '3600',
        upsert: options.upsert ?? false,
        contentType: options.contentType
      })

    if (error) throw toStorageError(error)

    return {
      storagePath,
      publicUrl: storageRepository.getPublicUrl(storagePath)
    }
  },

  async remove(storagePaths: string[]): Promise<void> {
    if (storagePaths.length === 0) return
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(storagePaths)
    if (error) throw toStorageError(error)
  }
}
