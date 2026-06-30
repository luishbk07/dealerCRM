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
    list: (params: LeadListParams) => ['leads', 'list', params] as const,
    detail: (id: string) => ['leads', 'detail', id] as const
  },
  sales: {
    all: ['sales'] as const,
    list: (params: SaleListParams) => ['sales', 'list', params] as const
  },
  dashboard: {
    snapshot: ['dashboard', 'snapshot'] as const
  }
}
