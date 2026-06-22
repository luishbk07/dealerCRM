import { useMemo } from 'react'
import { vehicleService, leadService, saleService } from '@/shared/services'
import { useAsync } from '@/shared/hooks/useAsync'
import type { Lead, Sale, Vehicle } from '@/shared/types'

export interface DashboardMetrics {
  activeVehicles: number
  newLeads: number
  pendingLeads: number
  monthlySales: number
  monthlyRevenue: number
}

export interface DashboardData {
  metrics: DashboardMetrics
  recentLeads: Lead[]
  leads: Lead[]
  vehicles: Vehicle[]
  sales: Sale[]
}

const isInCurrentMonth = (iso: string): boolean => {
  const date = new Date(iso)
  const now = new Date()
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
}

const loadDashboard = async (): Promise<{ vehicles: Vehicle[], leads: Lead[], sales: Sale[] }> => {
  const [vehicles, leads, sales] = await Promise.all([
    vehicleService.list(),
    leadService.list(),
    saleService.list()
  ])
  return { vehicles, leads, sales }
}

export const useDashboardData = () => {
  const { data, loading, error, refresh } = useAsync(loadDashboard)

  const dashboard = useMemo<DashboardData | null>(() => {
    if (!data) return null
    const { vehicles, leads, sales } = data
    const activeVehicles = vehicles.filter((vehicle) => vehicle.status === 'available').length
    const newLeads = leads.filter((lead) => lead.status === 'new').length
    const pendingLeads = leads.filter((lead) => lead.status === 'new' || lead.status === 'contacted' || lead.status === 'negotiating').length
    const monthSales = sales.filter((sale) => isInCurrentMonth(sale.soldAt))
    const monthlyRevenue = monthSales.reduce((total, sale) => total + sale.finalPrice, 0)
    const recentLeads = [...leads]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)

    return {
      metrics: {
        activeVehicles,
        newLeads,
        pendingLeads,
        monthlySales: monthSales.length,
        monthlyRevenue
      },
      recentLeads,
      leads,
      vehicles,
      sales
    }
  }, [data])

  return { dashboard, loading, error, refresh }
}
