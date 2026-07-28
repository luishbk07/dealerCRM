export interface PublicDealerProfile {
  name: string
  city: string | null
  phone: string | null
  whatsapp: string | null
  address: string | null
  website: string | null
  logoUrl: string | null
  bannerUrl: string | null
}

export interface PublicDealerContext {
  dealerId: string
  profile: PublicDealerProfile
}

export type PublicVehicleSort = 'newest' | 'price_asc' | 'price_desc'

export interface PublicVehicleFiltersState {
  search: string
  brand: string
  year: string
  priceMin: string
  priceMax: string
  transmission: string
  fuelType: string
  sort: PublicVehicleSort
}

export const INITIAL_PUBLIC_VEHICLE_FILTERS: PublicVehicleFiltersState = {
  search: '',
  brand: '',
  year: '',
  priceMin: '',
  priceMax: '',
  transmission: '',
  fuelType: '',
  sort: 'newest'
}

export const PUBLIC_VEHICLE_PAGE_SIZE = 12
