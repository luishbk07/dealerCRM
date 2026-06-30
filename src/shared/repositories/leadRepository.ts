import { supabase } from '@/shared/services/supabase'
import type { Lead } from '@/shared/types'
import { mapLeadRow, type LeadRow } from './rowMappers'

const COLUMNS = 'id, dealer_id, vehicle_id, name, phone, message, source, status, created_at, last_contact_at'

export interface LeadListParams {
  page: number
  pageSize: number
  status?: string | null
  search?: string | null
}

export interface LeadListResult {
  items: Lead[]
  total: number
  page: number
  pageSize: number
}

export interface CreateLeadRow {
  dealer_id: string | null
  vehicle_id: string | null
  name: string | null
  phone: string | null
  message: string | null
  source: string | null
  status: string
}

export interface UpdateLeadRow {
  status?: string
  last_contact_at?: string | null
  message?: string | null
}

export const leadRepository = {
  async list(params: LeadListParams): Promise<LeadListResult> {
    const from = params.page * params.pageSize
    const to = from + params.pageSize - 1

    let query = supabase
      .from('leads')
      .select(COLUMNS, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (params.status) query = query.eq('status', params.status)
    if (params.search) {
      const term = `%${params.search}%`
      query = query.or(`name.ilike.${term},phone.ilike.${term},message.ilike.${term}`)
    }

    const { data, error, count } = await query.returns<LeadRow[]>()
    if (error) throw new Error(error.message)

    return {
      items: (data ?? []).map(mapLeadRow),
      total: count ?? 0,
      page: params.page,
      pageSize: params.pageSize
    }
  },

  async getById(id: string): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .select(COLUMNS)
      .eq('id', id)
      .maybeSingle<LeadRow>()
    if (error) throw new Error(error.message)
    return data ? mapLeadRow(data) : null
  },

  async create(payload: CreateLeadRow): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert(payload)
      .select(COLUMNS)
      .single<LeadRow>()
    if (error) throw new Error(error.message)
    return mapLeadRow(data)
  },

  async update(id: string, patch: UpdateLeadRow): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update(patch)
      .eq('id', id)
      .select(COLUMNS)
      .single<LeadRow>()
    if (error) throw new Error(error.message)
    return mapLeadRow(data)
  }
}
