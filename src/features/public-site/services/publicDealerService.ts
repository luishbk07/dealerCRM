import { dealerRepository, type VehicleListParams } from '@/shared/repositories'
import type { Dealer } from '@/shared/types'
import { getDealerBannerUrl, getDealerLogoUrl } from '@/shared/utils/dealerBranding'
import { vehicleService } from '@/features/vehicles/services/vehicleService'
import { VEHICLE_STATUS_ACTIVE } from '@/shared/types/vehicle'
import type { PublicDealerContext, PublicDealerProfile } from '../types'

const toPublicProfile = (dealer: Dealer): PublicDealerProfile => ({
  name: dealer.name,
  city: dealer.city,
  phone: dealer.phone,
  whatsapp: dealer.whatsapp,
  address: dealer.address,
  website: dealer.website,
  logoUrl: getDealerLogoUrl(dealer),
  bannerUrl: getDealerBannerUrl(dealer)
})

export const publicDealerService = {
  async getDealerBySlug(slug: string): Promise<PublicDealerContext | null> {
    const dealer = await dealerRepository.getBySlug(slug.trim())
    if (!dealer || !dealer.slug) return null

    return {
      dealerId: dealer.id,
      profile: toPublicProfile(dealer)
    }
  },

  async listActiveVehicles(dealerId: string, params: VehicleListParams) {
    return vehicleService.listWithImages({
      ...params,
      dealerId,
      status: VEHICLE_STATUS_ACTIVE
    })
  }
}
