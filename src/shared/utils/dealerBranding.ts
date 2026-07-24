import { STORAGE_BUCKETS, storageRepository } from '@/shared/repositories'
import type { Dealer } from '@/shared/types'

export const getDealerLogoUrl = (dealer: Pick<Dealer, 'logoPath'> | null | undefined): string | null => {
  if (!dealer?.logoPath) return null
  return storageRepository.getPublicUrl(dealer.logoPath, STORAGE_BUCKETS.dealerLogos)
}

export const getDealerBannerUrl = (dealer: Pick<Dealer, 'bannerPath'> | null | undefined): string | null => {
  if (!dealer?.bannerPath) return null
  return storageRepository.getPublicUrl(dealer.bannerPath, STORAGE_BUCKETS.dealerBanners)
}
