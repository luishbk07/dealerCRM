import type { Dealer } from '@/shared/types'
import { dealerRepository } from '@/shared/repositories'
import { profileService } from '@/features/auth/services/profileService'
import type { CreateDealerDto } from '../types/dealerOnboarding'

export interface DealerService {
  getDealerByOwnerId(ownerId: string): Promise<Dealer | null>
  createDealer(ownerId: string, dto: CreateDealerDto): Promise<Dealer>
}

export const dealerService: DealerService = {
  getDealerByOwnerId(ownerId) {
    return dealerRepository.getByOwnerId(ownerId)
  },

  async createDealer(ownerId, dto) {
    const dealer = await dealerRepository.create({
      owner_id: ownerId,
      name: dto.name,
      phone: dto.phone,
      whatsapp: dto.whatsapp,
      address: dto.address ?? null
    })
    try {
      await profileService.setDealerId(ownerId, dealer.id)
    } catch {
      // El profile.dealer_id es un denormalizado; si RLS bloquea, AuthContext volverá a leer al refrescar.
    }
    return dealer
  }
}
