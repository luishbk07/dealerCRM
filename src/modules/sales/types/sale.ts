export interface CreateSaleInput {
  dealerId: string
  vehicleId: string
  leadId: string
  price: number
  soldAt: string
}

export interface SaleSummary {
  totalSales: number
  totalRevenue: number
  averagePrice: number
  monthlySalesCount: number
  monthlyRevenue: number
}

export interface ConvertLeadToSaleResult {
  saleId: string
  leadId: string
  vehicleId: string
}
