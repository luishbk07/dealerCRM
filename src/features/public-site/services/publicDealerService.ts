import { dealerRepository } from '@/shared/repositories'
import type { Dealer } from '@/shared/types'
import { VEHICLE_STATUS_ACTIVE } from '@/shared/types/vehicle'
import { getDealerBannerUrl, getDealerLogoUrl } from '@/shared/utils/dealerBranding'
import { vehicleService } from '@/features/vehicles/services/vehicleService'
import type { VehicleWithImages } from '@/shared/types'
import type {
  PublicDealerContext,
  PublicDealerProfile,
  PublicRelatedVehicle,
  PublicVehiclePageContext
} from '../types'
import {
  PUBLIC_RELATED_VEHICLES_FETCH_SIZE,
  PUBLIC_RELATED_VEHICLES_LIMIT
} from '../types'
import { leadService } from '@/shared/services/leadService'
import type { PublicLeadInquiryInput } from '../types'
import { buildPublicLeadMessage } from '../utils/publicLeadInquiryValidation'
import { toPublicRelatedVehicle, toPublicVehicleDetail } from '../utils/publicVehicleUtils'

const toPublicProfile = (dealer: Dealer): PublicDealerProfile => ({
  name: dealer.name,
  city: dealer.city,
  phone: dealer.phone,
  whatsapp: dealer.whatsapp,
  address: dealer.address,
  website: dealer.website,
  logoUrl: getDealerLogoUrl(dealer),
  bannerUrl: getDealerBannerUrl(dealer),
  primaryColor: dealer.primaryColor,
  secondaryColor: dealer.secondaryColor,
  accentColor: dealer.accentColor,
  theme: dealer.theme
})

const resolveImageUrls = (vehicle: VehicleWithImages): string[] => {
  if (vehicle.images.length === 0) {
    return vehicle.primaryImageUrl ? [vehicle.primaryImageUrl] : []
  }
  return vehicle.images.map((image) => vehicleService.resolveImageUrl(image))
}

const isPublicActiveVehicle = (vehicle: VehicleWithImages, dealerId: string): boolean =>
  vehicle.dealerId === dealerId && vehicle.status === VEHICLE_STATUS_ACTIVE

export const publicDealerService = {
  async getDealerBySlug(slug: string): Promise<PublicDealerContext | null> {
    const dealer = await dealerRepository.getBySlug(slug.trim())
    if (!dealer || !dealer.slug) return null

    return {
      dealerId: dealer.id,
      profile: toPublicProfile(dealer)
    }
  },

  async listActiveVehicles(dealerId: string, params: import('@/shared/repositories').VehicleListParams) {
    return vehicleService.listWithImages({
      ...params,
      dealerId,
      status: VEHICLE_STATUS_ACTIVE
    })
  },

  async getPublicVehicle(slug: string, vehicleId: string): Promise<PublicVehiclePageContext | null> {
    const dealerContext = await publicDealerService.getDealerBySlug(slug)
    if (!dealerContext) return null

    const vehicle = await vehicleService.getById(vehicleId)
    if (!vehicle || !isPublicActiveVehicle(vehicle, dealerContext.dealerId)) return null

    const imageUrls = resolveImageUrls(vehicle)

    return {
      dealerSlug: slug.trim(),
      profile: dealerContext.profile,
      vehicle: toPublicVehicleDetail(vehicle, imageUrls)
    }
  },

  async listRelatedVehicles(slug: string, vehicleId: string): Promise<PublicRelatedVehicle[]> {
    const dealerContext = await publicDealerService.getDealerBySlug(slug)
    if (!dealerContext) return []

    const page = await publicDealerService.listActiveVehicles(dealerContext.dealerId, {
      page: 0,
      pageSize: PUBLIC_RELATED_VEHICLES_FETCH_SIZE,
      dealerId: dealerContext.dealerId,
      status: VEHICLE_STATUS_ACTIVE,
      sort: 'newest'
    })

    return page.items
      .filter((item) => item.id !== vehicleId)
      .slice(0, PUBLIC_RELATED_VEHICLES_LIMIT)
      .map(toPublicRelatedVehicle)
  },

  async submitVehicleInquiry(input: PublicLeadInquiryInput): Promise<void> {
    const context = await publicDealerService.getPublicVehicle(input.dealerSlug, input.vehicleId)
    if (!context) {
      throw new Error('No fue posible enviar tu consulta.')
    }

    await leadService.createFromPublicForm({
      vehicleId: input.vehicleId,
      name: input.name.trim(),
      phone: input.phone.trim(),
      message: buildPublicLeadMessage(input.message, input.email),
      source: 'website'
    })
  }
}
