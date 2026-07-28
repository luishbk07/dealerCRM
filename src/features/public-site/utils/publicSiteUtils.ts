import type { PublicVehicleFiltersState } from '../types'
import type { VehicleListParams } from '@/shared/repositories'

export const toNumberOrNull = (value: string): number | null => {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

export const buildPublicVehicleListParams = (
  dealerId: string,
  filters: PublicVehicleFiltersState,
  page: number,
  pageSize: number
): VehicleListParams => {
  const year = toNumberOrNull(filters.year)

  return {
    page,
    pageSize,
    dealerId,
    status: 'active',
    brand: filters.brand.trim() || null,
    yearMin: year,
    yearMax: year,
    priceMin: toNumberOrNull(filters.priceMin),
    priceMax: toNumberOrNull(filters.priceMax),
    transmission: filters.transmission.trim() || null,
    fuelType: filters.fuelType.trim() || null,
    search: filters.search.trim() || null,
    sort: filters.sort
  }
}

export const buildWhatsAppLink = (phone: string | null | undefined, message?: string): string | null => {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  const base = `https://wa.me/${digits}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

export const normalizeWebsiteUrl = (website: string | null | undefined): string | null => {
  if (!website?.trim()) return null
  const trimmed = website.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}
