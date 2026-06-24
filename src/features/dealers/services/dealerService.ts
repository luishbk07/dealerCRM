import { supabase } from '@/shared/services/supabase'
import type { Dealer, DealerInput } from '@/shared/types'

interface DealerRow {
  id: string
  owner_id: string
  name: string
  phone: string | null
  address: string | null
  city: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

const mapRow = (row: DealerRow): Dealer => ({
  id: row.id,
  ownerId: row.owner_id,
  name: row.name,
  phone: row.phone ?? undefined,
  address: row.address ?? undefined,
  city: row.city ?? undefined,
  logoUrl: row.logo_url ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at
})

const toRow = (ownerId: string, input: DealerInput) => ({
  owner_id: ownerId,
  name: input.name,
  phone: input.phone ?? null,
  address: input.address ?? null,
  city: input.city ?? null,
  logo_url: input.logoUrl ?? null
})

export interface DealerService {
  getByOwner(ownerId: string): Promise<Dealer | null>
  create(ownerId: string, input: DealerInput): Promise<Dealer>
  update(id: string, input: DealerInput): Promise<Dealer>
}

export const dealerService: DealerService = {
  async getByOwner(ownerId) {
    const { data, error } = await supabase
      .from('dealers')
      .select('*')
      .eq('owner_id', ownerId)
      .maybeSingle<DealerRow>()
    if (error) throw new Error(error.message)
    return data ? mapRow(data) : null
  },

  async create(ownerId, input) {
    const { data, error } = await supabase
      .from('dealers')
      .insert(toRow(ownerId, input))
      .select('*')
      .single<DealerRow>()
    if (error) throw new Error(error.message)
    return mapRow(data)
  },

  async update(id, input) {
    const { data, error } = await supabase
      .from('dealers')
      .update({
        name: input.name,
        phone: input.phone ?? null,
        address: input.address ?? null,
        city: input.city ?? null,
        logo_url: input.logoUrl ?? null
      })
      .eq('id', id)
      .select('*')
      .single<DealerRow>()
    if (error) throw new Error(error.message)
    return mapRow(data)
  }
}
