import { supabase } from '@/shared/services/supabase'
import type { Dealer } from '@/shared/types'
import type { CreateDealerDto } from '../types/dealerOnboarding'

interface DealerRow {
  id: string
  owner_id: string
  name: string
  phone: string | null
  whatsapp: string | null
  address: string | null
  logo_url: string | null
  created_at: string
}

const mapRow = (row: DealerRow): Dealer => ({
  id: row.id,
  ownerId: row.owner_id,
  name: row.name,
  phone: row.phone ?? undefined,
  whatsapp: row.whatsapp ?? undefined,
  address: row.address ?? undefined,
  logoUrl: row.logo_url ?? undefined,
  createdAt: row.created_at
})

const buildInsertPayload = (ownerId: string, dto: CreateDealerDto) => ({
  owner_id: ownerId,
  name: dto.name,
  phone: dto.phone,
  whatsapp: dto.whatsapp,
  address: dto.address ?? null
})

export interface DealerService {
  getDealerByOwnerId(ownerId: string): Promise<Dealer | null>
  createDealer(ownerId: string, dto: CreateDealerDto): Promise<Dealer>
}

const DEALER_COLUMNS = 'id, owner_id, name, phone, whatsapp, address, logo_url, created_at'

export const dealerService: DealerService = {
  async getDealerByOwnerId(ownerId) {
    const { data, error } = await supabase
      .from('dealers')
      .select(DEALER_COLUMNS)
      .eq('owner_id', ownerId)
      .maybeSingle<DealerRow>()
    if (error) throw new Error(error.message)
    return data ? mapRow(data) : null
  },

  async createDealer(ownerId, dto) {
    const { data, error } = await supabase
      .from('dealers')
      .insert(buildInsertPayload(ownerId, dto))
      .select(DEALER_COLUMNS)
      .single<DealerRow>()
    if (error) throw new Error(error.message)
    return mapRow(data)
  }
}
