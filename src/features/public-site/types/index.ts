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

export interface PublicVehicleDetail {
  id: string
  brand: string
  model: string
  year: number | null
  price: number | null
  mileage: number | null
  transmission: string | null
  fuelType: string | null
  description: string | null
  imageUrls: string[]
  primaryImageUrl: string | null
}

export interface PublicVehiclePageContext {
  dealerSlug: string
  profile: PublicDealerProfile
  vehicle: PublicVehicleDetail
}

export interface PublicRelatedVehicle {
  id: string
  brand: string
  model: string
  year: number | null
  price: number | null
  mileage: number | null
  transmission: string | null
  fuelType: string | null
  imageUrl: string | null
}

export const PUBLIC_VEHICLE_PAGE_SIZE = 12
export const PUBLIC_RELATED_VEHICLES_LIMIT = 4
export const PUBLIC_RELATED_VEHICLES_FETCH_SIZE = 8

export type { PublicLeadInquiryInput } from './publicLeadInquiry'
