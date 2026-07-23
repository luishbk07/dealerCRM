import { supabase } from '@/shared/services/supabase'
import {
  assertLeadRepositorySuccess,
  LeadRepositoryError
} from '@/modules/leads/errors/leadErrors'
import type { CreateLeadInput, Lead, LeadSearchParams, LeadListResult, LeadStatus, UpdateLeadInput } from '@/modules/leads/types'
import { LEAD_STATUS_NEW, isLeadStatus } from '@/modules/leads/constants/leadStatus'
import { mapLeadRow, type LeadRow } from './rowMappers'

const COLUMNS = 'id, dealer_id, vehicle_id, name, phone, message, source, status, created_at, last_contact_at'

export interface LeadListParams {
  page: number
  pageSize: number
  status?: string | null
  search?: string | null
  vehicleId?: string | null
  dateFrom?: string | null
  dateTo?: string | null
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
  name?: string | null
  phone?: string | null
  vehicle_id?: string | null
  source?: string | null
}

const toLeadStatus = (value: string | null | undefined): LeadStatus => {
  if (value && isLeadStatus(value)) return value
  return LEAD_STATUS_NEW
}

const mapCreateInput = (input: CreateLeadInput): CreateLeadRow => ({
  dealer_id: input.dealerId,
  vehicle_id: input.vehicleId,
  name: input.name,
  phone: input.phone,
  message: input.message,
  source: input.source,
  status: input.status
})

const mapUpdateInput = (input: UpdateLeadInput): UpdateLeadRow => ({
  ...(input.status !== undefined ? { status: input.status } : {}),
  ...(input.lastContactAt !== undefined ? { last_contact_at: input.lastContactAt } : {}),
  ...(input.message !== undefined ? { message: input.message } : {}),
  ...(input.name !== undefined ? { name: input.name } : {}),
  ...(input.phone !== undefined ? { phone: input.phone } : {}),
  ...(input.vehicleId !== undefined ? { vehicle_id: input.vehicleId } : {}),
  ...(input.source !== undefined ? { source: input.source } : {})
})

export type { LeadListResult } from '@/modules/leads/types/filters'

export class LeadRepository {
  private async resolveVehicleIdsForSearch(term: string): Promise<string[]> {
    const pattern = `%${term.trim()}%`
    const { data, error } = await supabase
      .from('vehicles')
      .select('id')
      .or(`brand.ilike.${pattern},model.ilike.${pattern}`)

    assertLeadRepositorySuccess(error, 'Failed to search vehicles for lead filter')
    return (data ?? []).map((row) => row.id as string)
  }

  async getAll(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select(COLUMNS)
      .order('created_at', { ascending: false })
      .returns<LeadRow[]>()

    assertLeadRepositorySuccess(error, 'Failed to fetch leads')
    return (data ?? []).map(mapLeadRow)
  }

  async getById(id: string): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .select(COLUMNS)
      .eq('id', id)
      .maybeSingle<LeadRow>()

    assertLeadRepositorySuccess(error, 'Failed to fetch lead')
    return data ? mapLeadRow(data) : null
  }

  async create(input: CreateLeadInput): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert(mapCreateInput(input))
      .select(COLUMNS)
      .single<LeadRow>()

    assertLeadRepositorySuccess(error, 'Failed to create lead')
    if (!data) throw new LeadRepositoryError('Failed to create lead: empty response')
    return mapLeadRow(data)
  }

  async update(id: string, input: UpdateLeadInput): Promise<Lead> {
    const patch = mapUpdateInput(input)
    if (Object.keys(patch).length === 0) {
      throw new LeadRepositoryError('Update lead requires at least one field')
    }

    const { data, error } = await supabase
      .from('leads')
      .update(patch)
      .eq('id', id)
      .select(COLUMNS)
      .single<LeadRow>()

    assertLeadRepositorySuccess(error, 'Failed to update lead')
    if (!data) throw new LeadRepositoryError('Failed to update lead: empty response')
    return mapLeadRow(data)
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('leads').delete().eq('id', id)
    assertLeadRepositorySuccess(error, 'Failed to delete lead')
  }

  async updateStatus(id: string, status: LeadStatus): Promise<Lead> {
    return this.update(id, {
      status,
      lastContactAt: new Date().toISOString()
    })
  }

  async getByVehicle(vehicleId: string): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select(COLUMNS)
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false })
      .returns<LeadRow[]>()

    assertLeadRepositorySuccess(error, 'Failed to fetch leads by vehicle')
    return (data ?? []).map(mapLeadRow)
  }

  async search(params: LeadSearchParams = {}): Promise<LeadListResult> {
    const page = params.page ?? 0
    const pageSize = params.pageSize ?? 20
    const from = page * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('leads')
      .select(COLUMNS, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (params.status) query = query.eq('status', params.status)
    if (params.vehicleId) query = query.eq('vehicle_id', params.vehicleId)
    if (params.dateFrom) query = query.gte('created_at', params.dateFrom)
    if (params.dateTo) query = query.lte('created_at', params.dateTo)

    const searchTerm = params.search?.trim()
    if (searchTerm) {
      const pattern = `%${searchTerm}%`
      const vehicleIds = await this.resolveVehicleIdsForSearch(searchTerm)
      const orFilters = [`name.ilike.${pattern}`, `phone.ilike.${pattern}`]
      if (vehicleIds.length > 0) {
        orFilters.push(`vehicle_id.in.(${vehicleIds.join(',')})`)
      }
      query = query.or(orFilters.join(','))
    }

    const { data, error, count } = await query.returns<LeadRow[]>()
    assertLeadRepositorySuccess(error, 'Failed to search leads')

    return {
      items: (data ?? []).map(mapLeadRow),
      total: count ?? 0,
      page,
      pageSize
    }
  }

  async list(params: LeadListParams): Promise<LeadListResult> {
    return this.search({
      page: params.page,
      pageSize: params.pageSize,
      status: params.status && isLeadStatus(params.status) ? params.status : null,
      search: params.search ?? null,
      vehicleId: params.vehicleId ?? null,
      dateFrom: params.dateFrom ?? null,
      dateTo: params.dateTo ?? null
    })
  }
}

export const leadRepository = new LeadRepository()

export { toLeadStatus }
