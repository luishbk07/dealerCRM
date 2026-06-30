import { supabase } from '@/shared/services/supabase'
import type { DealerStats, LeadConversionPoint, MonthlySalesPoint } from '@/shared/types'

interface DealerStatsRow {
  total_vehicles: number | string | null
  active_vehicles: number | string | null
  total_leads: number | string | null
  new_leads: number | string | null
  contacted_leads: number | string | null
  qualified_leads: number | string | null
  lost_leads: number | string | null
  sold_leads: number | string | null
  monthly_sales_count: number | string | null
  monthly_revenue: number | string | null
  total_revenue: number | string | null
  average_sale_price: number | string | null
  conversion_rate: number | string | null
}

interface MonthlySalesRow {
  month_start: string
  sales_count: number | string | null
  revenue: number | string | null
}

interface LeadConversionRow {
  status: string | null
  count: number | string | null
}

const toNumber = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) return 0
  const parsed = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(parsed) ? parsed : 0
}

export const dashboardRepository = {
  async getDealerStats(): Promise<DealerStats> {
    const { data, error } = await supabase
      .from('dealer_stats_view')
      .select('*')
      .maybeSingle<DealerStatsRow>()
    if (error) throw new Error(error.message)
    if (!data) {
      return {
        totalVehicles: 0,
        activeVehicles: 0,
        totalLeads: 0,
        newLeads: 0,
        contactedLeads: 0,
        qualifiedLeads: 0,
        lostLeads: 0,
        soldLeads: 0,
        monthlySalesCount: 0,
        monthlyRevenue: 0,
        totalRevenue: 0,
        averageSalePrice: 0,
        conversionRate: 0
      }
    }
    return {
      totalVehicles: toNumber(data.total_vehicles),
      activeVehicles: toNumber(data.active_vehicles),
      totalLeads: toNumber(data.total_leads),
      newLeads: toNumber(data.new_leads),
      contactedLeads: toNumber(data.contacted_leads),
      qualifiedLeads: toNumber(data.qualified_leads),
      lostLeads: toNumber(data.lost_leads),
      soldLeads: toNumber(data.sold_leads),
      monthlySalesCount: toNumber(data.monthly_sales_count),
      monthlyRevenue: toNumber(data.monthly_revenue),
      totalRevenue: toNumber(data.total_revenue),
      averageSalePrice: toNumber(data.average_sale_price),
      conversionRate: toNumber(data.conversion_rate)
    }
  },

  async getMonthlySales(): Promise<MonthlySalesPoint[]> {
    const { data, error } = await supabase
      .from('monthly_sales_view')
      .select('*')
      .order('month_start', { ascending: true })
      .returns<MonthlySalesRow[]>()
    if (error) throw new Error(error.message)
    return (data ?? []).map((row) => ({
      monthStart: row.month_start,
      salesCount: toNumber(row.sales_count),
      revenue: toNumber(row.revenue)
    }))
  },

  async getLeadConversion(): Promise<LeadConversionPoint[]> {
    const { data, error } = await supabase
      .from('lead_conversion_view')
      .select('*')
      .returns<LeadConversionRow[]>()
    if (error) throw new Error(error.message)
    return (data ?? []).map((row) => ({
      status: row.status ?? 'unknown',
      count: toNumber(row.count)
    }))
  }
}
