import { useMemo } from 'react'
import { saleService, vehicleService } from '@/shared/services'
import { useAsync } from '@/shared/hooks/useAsync'
import type { Sale, Vehicle } from '@/shared/types'

export interface MonthlySaleStat {
  label: string
  count: number
  revenue: number
}

export interface SalesData {
  sales: Sale[]
  vehiclesById: Map<string, Vehicle>
  totalRevenue: number
  currentMonth: MonthlySaleStat
  monthlyBreakdown: MonthlySaleStat[]
}

const monthLabel = (date: Date): string => {
  return date.toLocaleDateString('es-DO', { month: 'short', year: 'numeric' })
}

const monthKey = (date: Date): string => `${date.getFullYear()}-${date.getMonth()}`

const loadSales = async (): Promise<{ sales: Sale[], vehicles: Vehicle[] }> => {
  const [sales, vehicles] = await Promise.all([saleService.list(), vehicleService.list()])
  return { sales, vehicles }
}

export const useSalesData = () => {
  const { data, loading, error, refresh } = useAsync(loadSales)

  const result = useMemo<SalesData | null>(() => {
    if (!data) return null
    const { sales, vehicles } = data
    const vehiclesById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]))
    const sorted = [...sales].sort((a, b) => new Date(b.soldAt).getTime() - new Date(a.soldAt).getTime())

    const now = new Date()
    const buckets = new Map<string, MonthlySaleStat>()

    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
      buckets.set(monthKey(date), { label: monthLabel(date), count: 0, revenue: 0 })
    }

    for (const sale of sorted) {
      const date = new Date(sale.soldAt)
      const key = monthKey(date)
      const entry = buckets.get(key)
      if (entry) {
        entry.count += 1
        entry.revenue += sale.finalPrice
      }
    }

    const monthlyBreakdown = Array.from(buckets.values())
    const currentMonth = monthlyBreakdown[monthlyBreakdown.length - 1]
    const totalRevenue = sorted.reduce((sum, sale) => sum + sale.finalPrice, 0)

    return {
      sales: sorted,
      vehiclesById,
      totalRevenue,
      currentMonth,
      monthlyBreakdown
    }
  }, [data])

  return { data: result, loading, error, refresh }
}
