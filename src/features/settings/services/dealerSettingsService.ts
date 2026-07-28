import type { Dealer, UpdateDealerInput } from '@/shared/types'
import { dealerRepository, STORAGE_BUCKETS, storageRepository } from '@/shared/repositories'
import { activityService } from '@/shared/services/activityService'
import { prepareImageForUpload } from '@/features/vehicles/services/storageService'
import {
  buildDealerBannerStoragePath,
  buildDealerLogoStoragePath
} from '../utils/dealerStoragePaths'
import type { DealerSettingsFormValues } from '../utils/dealerSettingsValidation'

class DealerSettingsServiceError extends Error {
  constructor(public readonly userMessage: string, public readonly cause?: unknown) {
    super(userMessage)
    this.name = 'DealerSettingsServiceError'
  }
}

const wrapCall = async <T>(action: () => Promise<T>, userMessage: string): Promise<T> => {
  try {
    return await action()
  } catch (error) {
    if (error instanceof DealerSettingsServiceError) throw error
    throw new DealerSettingsServiceError(userMessage, error)
  }
}

export const getDealerSettingsUserMessage = (error: unknown): string => {
  if (error instanceof DealerSettingsServiceError) return error.userMessage
  return 'No fue posible actualizar la configuración.'
}

export const dealerSettingsService = {
  getById(dealerId: string): Promise<Dealer | null> {
    return wrapCall(() => dealerRepository.getById(dealerId), 'No fue posible cargar la configuración.')
  },

  updateProfile(dealerId: string, values: DealerSettingsFormValues, normalizedWebsite: string | null): Promise<Dealer> {
    const input: UpdateDealerInput = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || null,
      whatsapp: values.whatsapp.trim() || null,
      address: values.address.trim() || null,
      city: values.city.trim() || null,
      state: values.state.trim() || null,
      zipCode: values.zipCode.trim() || null,
      country: values.country.trim() || null,
      website: normalizedWebsite
    }
    return wrapCall(async () => {
      const dealer = await dealerRepository.update(dealerId, input)
      await activityService.logDealerUpdated(dealerId)
      return dealer
    }, 'No fue posible guardar la configuración.')
  },

  resolveLogoUrl(logoPath: string | null | undefined): string | null {
    if (!logoPath) return null
    return storageRepository.getPublicUrl(logoPath, STORAGE_BUCKETS.dealerLogos)
  },

  resolveBannerUrl(bannerPath: string | null | undefined): string | null {
    if (!bannerPath) return null
    return storageRepository.getPublicUrl(bannerPath, STORAGE_BUCKETS.dealerBanners)
  },

  async uploadLogo(dealerId: string, file: File, previousPath: string | null): Promise<Dealer> {
    return wrapCall(async () => {
      const prepared = await prepareImageForUpload(file)
      const storagePath = buildDealerLogoStoragePath(dealerId, prepared.extension)

      await storageRepository.uploadBytes(
        storagePath,
        prepared.buffer,
        { contentType: prepared.contentType, upsert: true },
        STORAGE_BUCKETS.dealerLogos
      )

      const dealer = await dealerRepository.update(dealerId, { logoPath: storagePath })
      await activityService.logLogoUpdated(dealerId)

      if (previousPath && previousPath !== storagePath) {
        try {
          await storageRepository.remove([previousPath], STORAGE_BUCKETS.dealerLogos)
        } catch {
          // Logo already replaced in DB; old file cleanup is best-effort.
        }
      }

      return dealer
    }, 'No fue posible subir el logo.')
  },

  async uploadBanner(dealerId: string, file: File, previousPath: string | null): Promise<Dealer> {
    return wrapCall(async () => {
      const prepared = await prepareImageForUpload(file)
      const storagePath = buildDealerBannerStoragePath(dealerId, prepared.extension)

      await storageRepository.uploadBytes(
        storagePath,
        prepared.buffer,
        { contentType: prepared.contentType, upsert: true },
        STORAGE_BUCKETS.dealerBanners
      )

      const dealer = await dealerRepository.update(dealerId, { bannerPath: storagePath })
      await activityService.logBannerUpdated(dealerId)

      if (previousPath && previousPath !== storagePath) {
        try {
          await storageRepository.remove([previousPath], STORAGE_BUCKETS.dealerBanners)
        } catch {
          // Banner already replaced in DB; old file cleanup is best-effort.
        }
      }

      return dealer
    }, 'No fue posible subir el banner.')
  }
}
