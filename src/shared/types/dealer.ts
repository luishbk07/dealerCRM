export interface Dealer {
  id: string
  ownerId: string
  name: string
  phone?: string
  address?: string
  city?: string
  logoUrl?: string
  createdAt: string
  updatedAt: string
}

export interface DealerInput {
  name: string
  phone?: string
  address?: string
  city?: string
  logoUrl?: string
}
