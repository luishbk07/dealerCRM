import { supabase } from '@/shared/services/supabase'
import { assertSalesRepositorySuccess, SalesRepositoryError } from '@/modules/sales/errors/saleErrors'
import type { CreateSaleInput, SaleSummary } from '@/modules/sales/types'
import type { MonthlySalesPoint, Sale } from '@/shared/types'
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
  sold_at?: string
}

const toNumber = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) return 0
  const parsed = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(parsed) ? parsed : 0
}

const monthStartKey = (iso: string): string => {
  const date = new Date(iso)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-01`
}

const mapCreateInput = (input: CreateSaleInput): CreateSaleRow => ({
  dealer_id: input.dealerId,
  vehicle_id: input.vehicleId,
  lead_id: input.leadId,
  price: input.price,
  sold_at: input.soldAt
})

export class SalesRepository {
  async getAll(): Promise<Sale[]> {
    const { data, error } = await supabase
      .from('sales')
      .select(COLUMNS)
      .order('sold_at', { ascending: false })
      .returns<SaleRow[]>()

    assertSalesRepositorySuccess(error, 'Failed to fetch sales')
    return (data ?? []).map(mapSaleRow)
  }

  async getById(id: string): Promise<Sale | null> {
    const { data, error } = await supabase
      .from('sales')
      .select(COLUMNS)
      .eq('id', id)
      .maybeSingle<SaleRow>()

    assertSalesRepositorySuccess(error, 'Failed to fetch sale')
    return data ? mapSaleRow(data) : null
  }

  async getByLeadId(leadId: string): Promise<Sale | null> {
    const { data, error } = await supabase
      .from('sales')
      .select(COLUMNS)
      .eq('lead_id', leadId)
      .maybeSingle<SaleRow>()

    assertSalesRepositorySuccess(error, 'Failed to fetch sale by lead')
    return data ? mapSaleRow(data) : null
  }

  async getByVehicleId(vehicleId: string): Promise<Sale | null> {
    const { data, error } = await supabase
      .from('sales')
      .select(COLUMNS)
      .eq('vehicle_id', vehicleId)
      .maybeSingle<SaleRow>()

    assertSalesRepositorySuccess(error, 'Failed to fetch sale by vehicle')
    return data ? mapSaleRow(data) : null
  }

  async create(input: CreateSaleInput): Promise<Sale> {
    const { data, error } = await supabase
      .from('sales')
      .insert(mapCreateInput(input))
      .select(COLUMNS)
      .single<SaleRow>()

    assertSalesRepositorySuccess(error, 'Failed to create sale')
    if (!data) throw new SalesRepositoryError('Failed to create sale: empty response')
    return mapSaleRow(data)
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('sales').delete().eq('id', id)
    assertSalesRepositorySuccess(error, 'Failed to delete sale')
  }

  async getMonthly(): Promise<MonthlySalesPoint[]> {
    const { data, error } = await supabase
      .from('sales')
      .select('sold_at, price')
      .order('sold_at', { ascending: true })

    assertSalesRepositorySuccess(error, 'Failed to fetch monthly sales')

    const buckets = new Map<string, { salesCount: number, revenue: number }>()
    for (const row of data ?? []) {
      const soldAt = row.sold_at as string
      const key = monthStartKey(soldAt)
      const current = buckets.get(key) ?? { salesCount: 0, revenue: 0 }
      current.salesCount += 1
      current.revenue += toNumber(row.price as number | string | null)
      buckets.set(key, current)
    }

    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthStart, stats]) => ({
        monthStart,
        salesCount: stats.salesCount,
        revenue: stats.revenue
      }))
  }

  async getSummary(): Promise<SaleSummary> {
    const sales = await this.getAll()
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    let totalRevenue = 0
    let monthlySalesCount = 0
    let monthlyRevenue = 0

    for (const sale of sales) {
      const price = sale.price ?? 0
      totalRevenue += price
      if (new Date(sale.soldAt) >= monthStart) {
        monthlySalesCount += 1
        monthlyRevenue += price
      }
    }

    return {
      totalSales: sales.length,
      totalRevenue,
      averagePrice: sales.length > 0 ? totalRevenue / sales.length : 0,
      monthlySalesCount,
      monthlyRevenue
    }
  }

  async list(params: SaleListParams): Promise<SaleListResult> {
    const from = params.page * params.pageSize
    const to = from + params.pageSize - 1

    const { data, error, count } = await supabase
      .from('sales')
      .select(COLUMNS, { count: 'exact' })
      .order('sold_at', { ascending: false })
      .range(from, to)
      .returns<SaleRow[]>()

    assertSalesRepositorySuccess(error, 'Failed to list sales')

    return {
      items: (data ?? []).map(mapSaleRow),
      total: count ?? 0,
      page: params.page,
      pageSize: params.pageSize
    }
  }
}

export const salesRepository = new SalesRepository()
