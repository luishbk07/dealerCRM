export type DealerThemeMode = 'light' | 'dark' | 'system'

export interface DealerBranding {
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  theme: DealerThemeMode | null
}

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
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  theme: DealerThemeMode | null
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
  primaryColor?: string | null
  secondaryColor?: string | null
  accentColor?: string | null
  theme?: DealerThemeMode | null
}
