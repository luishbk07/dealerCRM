import { supabase } from '@/shared/services/supabase'
import type { Sale } from '@/shared/types'
import { mapSaleRow, type SaleRow } from './rowMappers'

const COLUMNS = 'id, dealer_id, vehicle_id, lead_id, price, sold_at'

export interface SaleListParams {
  page: number
  pageSize: number
}

export interface SaleListResult {
  items: Sale[]
  total: number
  page: number
  pageSize: number
}

export interface CreateSaleRow {
  dealer_id: string
  vehicle_id: string | null
  lead_id: string | null
  price: number | null
}

export const salesRepository = {
  async list(params: SaleListParams): Promise<SaleListResult> {
    const from = params.page * params.pageSize
    const to = from + params.pageSize - 1

    const { data, error, count } = await supabase
      .from('sales')
      .select(COLUMNS, { count: 'exact' })
      .order('sold_at', { ascending: false })
      .range(from, to)
      .returns<SaleRow[]>()
    if (error) throw new Error(error.message)

    return {
      items: (data ?? []).map(mapSaleRow),
      total: count ?? 0,
      page: params.page,
      pageSize: params.pageSize
    }
  },

  async create(payload: CreateSaleRow): Promise<Sale> {
    const { data, error } = await supabase
      .from('sales')
      .insert(payload)
      .select(COLUMNS)
      .single<SaleRow>()
    if (error) throw new Error(error.message)
    return mapSaleRow(data)
  }
}
