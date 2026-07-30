import { supabase } from '@/shared/services/supabase'
import type { Dealer, DealerThemeMode, UpdateDealerInput } from '@/shared/types'

const isDealerThemeMode = (value: string | null): value is DealerThemeMode =>
  value === 'light' || value === 'dark' || value === 'system'

interface DealerRow {
  id: string
  owner_id: string
  name: string
  email: string | null
  phone: string | null
  whatsapp: string | null
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  country: string | null
  website: string | null
  slug: string | null
  logo_path: string | null
  banner_path: string | null
  primary_color: string | null
  secondary_color: string | null
  accent_color: string | null
  theme: string | null
  is_active: boolean | null
  created_at: string
}

const DEALER_COLUMNS = `
  id, owner_id, name, email, phone, whatsapp, address, city, state, zip_code,
  country, website, slug, logo_path, banner_path, primary_color, secondary_color,
  accent_color, theme, is_active, created_at
`

const mapRow = (row: DealerRow): Dealer => ({
  id: row.id,
  ownerId: row.owner_id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  whatsapp: row.whatsapp,
  address: row.address,
  city: row.city,
  state: row.state,
  zipCode: row.zip_code,
  country: row.country,
  website: row.website,
  slug: row.slug,
  logoPath: row.logo_path,
  bannerPath: row.banner_path,
  primaryColor: row.primary_color,
  secondaryColor: row.secondary_color,
  accentColor: row.accent_color,
  theme: isDealerThemeMode(row.theme) ? row.theme : null,
  isActive: Boolean(row.is_active),
  createdAt: row.created_at
})

const mapUpdateInput = (input: UpdateDealerInput): Partial<DealerRow> => ({
  ...(input.name !== undefined ? { name: input.name } : {}),
  ...(input.email !== undefined ? { email: input.email } : {}),
  ...(input.phone !== undefined ? { phone: input.phone } : {}),
  ...(input.whatsapp !== undefined ? { whatsapp: input.whatsapp } : {}),
  ...(input.address !== undefined ? { address: input.address } : {}),
  ...(input.city !== undefined ? { city: input.city } : {}),
  ...(input.state !== undefined ? { state: input.state } : {}),
  ...(input.zipCode !== undefined ? { zip_code: input.zipCode } : {}),
  ...(input.country !== undefined ? { country: input.country } : {}),
  ...(input.website !== undefined ? { website: input.website } : {}),
  ...(input.logoPath !== undefined ? { logo_path: input.logoPath } : {}),
  ...(input.bannerPath !== undefined ? { banner_path: input.bannerPath } : {}),
  ...(input.primaryColor !== undefined ? { primary_color: input.primaryColor } : {}),
  ...(input.secondaryColor !== undefined ? { secondary_color: input.secondaryColor } : {}),
  ...(input.accentColor !== undefined ? { accent_color: input.accentColor } : {}),
  ...(input.theme !== undefined ? { theme: input.theme } : {})
})

export interface CreateDealerPayload {
  owner_id: string
  name: string
  phone: string
  whatsapp: string
  address: string | null
}

export class DealerRepository {
  async getById(id: string): Promise<Dealer | null> {
    const { data, error } = await supabase
      .from('dealers')
      .select(DEALER_COLUMNS)
      .eq('id', id)
      .maybeSingle<DealerRow>()
    if (error) throw new Error(error.message)
    return data ? mapRow(data) : null
  }

  async getByOwnerId(ownerId: string): Promise<Dealer | null> {
    const { data, error } = await supabase
      .from('dealers')
      .select(DEALER_COLUMNS)
      .eq('owner_id', ownerId)
      .maybeSingle<DealerRow>()
    if (error) throw new Error(error.message)
    return data ? mapRow(data) : null
  }

  async getBySlug(slug: string): Promise<Dealer | null> {
    const { data, error } = await supabase
      .from('dealers')
      .select(DEALER_COLUMNS)
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle<DealerRow>()
    if (error) throw new Error(error.message)
    return data ? mapRow(data) : null
  }

  async create(payload: CreateDealerPayload): Promise<Dealer> {
    const { data, error } = await supabase
      .from('dealers')
      .insert(payload)
      .select(DEALER_COLUMNS)
      .single<DealerRow>()
    if (error) throw new Error(error.message)
    return mapRow(data)
  }

  async update(id: string, input: UpdateDealerInput): Promise<Dealer> {
    const patch = mapUpdateInput(input)
    if (Object.keys(patch).length === 0) {
      throw new Error('Update dealer requires at least one field')
    }

    const { data, error } = await supabase
      .from('dealers')
      .update(patch)
      .eq('id', id)
      .select(DEALER_COLUMNS)
      .single<DealerRow>()
    if (error) throw new Error(error.message)
    return mapRow(data)
  }
}

export const dealerRepository = new DealerRepository()
