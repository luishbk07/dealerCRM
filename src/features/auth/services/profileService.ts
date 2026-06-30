import { supabase } from '@/shared/services/supabase'
import type { Profile } from '@/shared/types'

interface ProfileRow {
  id: string
  full_name: string | null
  role: string | null
  dealer_id: string | null
  created_at: string
}

const PROFILE_COLUMNS = 'id, full_name, role, dealer_id, created_at'

const mapRow = (row: ProfileRow): Profile => ({
  id: row.id,
  fullName: row.full_name,
  role: row.role ?? 'dealer',
  dealerId: row.dealer_id,
  createdAt: row.created_at
})

export interface EnsureProfileInput {
  id: string
  fullName: string
  role?: string
}

export interface ProfileService {
  getById(userId: string): Promise<Profile | null>
  create(input: EnsureProfileInput): Promise<Profile>
  ensureExists(input: EnsureProfileInput): Promise<Profile>
  setDealerId(profileId: string, dealerId: string): Promise<Profile>
}

export const profileService: ProfileService = {
  async getById(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_COLUMNS)
      .eq('id', userId)
      .maybeSingle<ProfileRow>()
    if (error) throw new Error(error.message)
    return data ? mapRow(data) : null
  },

  async create({ id, fullName, role = 'dealer' }) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ id, full_name: fullName, role })
      .select(PROFILE_COLUMNS)
      .single<ProfileRow>()
    if (error) throw new Error(error.message)
    return mapRow(data)
  },

  async ensureExists({ id, fullName, role = 'dealer' }) {
    const existing = await profileService.getById(id)
    if (existing) return existing
    return profileService.create({ id, fullName, role })
  },

  async setDealerId(profileId, dealerId) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ dealer_id: dealerId })
      .eq('id', profileId)
      .select(PROFILE_COLUMNS)
      .single<ProfileRow>()
    if (error) throw new Error(error.message)
    return mapRow(data)
  }
}
