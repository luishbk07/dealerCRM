import type { DealerStats, LeadConversionPoint, MonthlySalesPoint } from '@/shared/types'
import { dashboardRepository } from '@/shared/repositories'

export interface DashboardSnapshot {
  stats: DealerStats
  monthlySales: MonthlySalesPoint[]
  leadConversion: LeadConversionPoint[]
}

export const dashboardService = {
  async getSnapshot(): Promise<DashboardSnapshot> {
    const [stats, monthlySales, leadConversion] = await Promise.all([
      dashboardRepository.getDealerStats(),
      dashboardRepository.getMonthlySales(),
      dashboardRepository.getLeadConversion()
    ])
    return { stats, monthlySales, leadConversion }
  }
}
