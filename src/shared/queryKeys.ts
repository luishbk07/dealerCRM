import type { LeadListParams, SaleListParams, VehicleListParams } from '@/shared/repositories'

export const queryKeys = {
  vehicles: {
    all: ['vehicles'] as const,
    list: (params: VehicleListParams) => ['vehicles', 'list', params] as const,
    detail: (id: string) => ['vehicles', 'detail', id] as const,
    publicDetail: (id: string) => ['vehicles', 'public-detail', id] as const
  },
  leads: {
    all: ['leads'] as const,
    allLeads: ['leads', 'all'] as const,
    list: (params: LeadListParams) => ['leads', 'list', params] as const,
    search: (params: import('@/modules/leads/types').LeadSearchParams) => ['leads', 'search', params] as const,
    detail: (id: string) => ['leads', 'detail', id] as const
  },
  sales: {
    all: ['sales'] as const,
    allSales: ['sales', 'all'] as const,
    list: (params: SaleListParams) => ['sales', 'list', params] as const,
    detail: (id: string) => ['sales', 'detail', id] as const,
    summary: ['sales', 'summary'] as const,
    monthly: ['sales', 'monthly'] as const
  },
  dashboard: {
    snapshot: ['dashboard', 'snapshot'] as const
  }
}
