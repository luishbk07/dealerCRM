import type { Sale } from '@/shared/types'
import { salesRepository, type SaleListParams, type SaleListResult } from '@/shared/repositories'

export interface CreateSaleInput {
  dealerId: string
  vehicleId: string | null
  leadId: string | null
  price: number | null
}

export const salesService = {
  list(params: SaleListParams): Promise<SaleListResult> {
    return salesRepository.list(params)
  },

  create(input: CreateSaleInput): Promise<Sale> {
    return salesRepository.create({
      dealer_id: input.dealerId,
      vehicle_id: input.vehicleId,
      lead_id: input.leadId,
      price: input.price
    })
  }
}
