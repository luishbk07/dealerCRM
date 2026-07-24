export interface Dealer {
  id: string
  ownerId: string
  name: string
  email: string | null
  phone: string | null
  whatsapp: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  country: string | null
  website: string | null
  slug: string | null
  logoPath: string | null
  bannerPath: string | null
  isActive: boolean
  createdAt: string
}

export interface UpdateDealerInput {
  name?: string
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  country?: string | null
  website?: string | null
  logoPath?: string | null
  bannerPath?: string | null
}
