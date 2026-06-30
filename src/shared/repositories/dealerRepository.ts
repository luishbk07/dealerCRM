import { supabase } from '@/shared/services/supabase'
import type { Dealer } from '@/shared/types'

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

const DEALER_COLUMNS = 'id, owner_id, name, phone, whatsapp, address, logo_url, created_at'

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

export interface CreateDealerPayload {
  owner_id: string
  name: string
  phone: string
  whatsapp: string
  address: string | null
}

export const dealerRepository = {
  async getById(id: string): Promise<Dealer | null> {
    const { data, error } = await supabase
      .from('dealers')
      .select(DEALER_COLUMNS)
      .eq('id', id)
      .maybeSingle<DealerRow>()
    if (error) throw new Error(error.message)
    return data ? mapRow(data) : null
  },

  async getByOwnerId(ownerId: string): Promise<Dealer | null> {
    const { data, error } = await supabase
      .from('dealers')
      .select(DEALER_COLUMNS)
      .eq('owner_id', ownerId)
      .maybeSingle<DealerRow>()
    if (error) throw new Error(error.message)
    return data ? mapRow(data) : null
  },

  async create(payload: CreateDealerPayload): Promise<Dealer> {
    const { data, error } = await supabase
      .from('dealers')
      .insert(payload)
      .select(DEALER_COLUMNS)
      .single<DealerRow>()
    if (error) throw new Error(error.message)
    return mapRow(data)
  },

  async updateLogo(id: string, logoUrl: string | null): Promise<Dealer> {
    const { data, error } = await supabase
      .from('dealers')
      .update({ logo_url: logoUrl })
      .eq('id', id)
      .select(DEALER_COLUMNS)
      .single<DealerRow>()
    if (error) throw new Error(error.message)
    return mapRow(data)
  }
}
