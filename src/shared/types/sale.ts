export interface Sale {
  id: string
  dealerId: string | null
  vehicleId: string | null
  leadId: string | null
  price: number | null
  soldAt: string
}
