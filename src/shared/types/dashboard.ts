export interface DealerStats {
  totalVehicles: number
  activeVehicles: number
  totalLeads: number
  newLeads: number
  contactedLeads: number
  qualifiedLeads: number
  lostLeads: number
  soldLeads: number
  monthlySalesCount: number
  monthlyRevenue: number
  totalRevenue: number
  averageSalePrice: number
  conversionRate: number
}

export interface MonthlySalesPoint {
  monthStart: string
  salesCount: number
  revenue: number
}

export interface LeadConversionPoint {
  status: string
  count: number
}
