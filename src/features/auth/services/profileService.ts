import { supabase } from '@/shared/services/supabase'
import type { Profile, UserRole } from '@/shared/types'

interface ProfileRow {
  id: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

const mapRow = (row: ProfileRow): Profile => ({
  id: row.id,
  fullName: row.full_name,
  role: row.role,
  createdAt: row.created_at,
  updatedAt: row.updated_at
})

export interface ProfileService {
  getById(userId: string): Promise<Profile | null>
  create(input: { id: string, fullName: string, role?: UserRole }): Promise<Profile>
  ensureExists(input: { id: string, fullName: string, role?: UserRole }): Promise<Profile>
}

export const profileService: ProfileService = {
  async getById(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle<ProfileRow>()
    if (error) throw new Error(error.message)
    return data ? mapRow(data) : null
  },

  async create({ id, fullName, role = 'dealer' }) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ id, full_name: fullName, role })
      .select('*')
      .single<ProfileRow>()
    if (error) throw new Error(error.message)
    return mapRow(data)
  },

  async ensureExists({ id, fullName, role = 'dealer' }) {
    const existing = await profileService.getById(id)
    if (existing) return existing
    return profileService.create({ id, fullName, role })
  }
}
