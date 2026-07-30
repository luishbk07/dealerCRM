import { paths } from '@/app/routes/paths'
import { environment } from '@/shared/utils/environment'

const normalizeBasePath = (): string => {
  const base = import.meta.env.BASE_URL || '/'
  if (base === '/') return ''
  return base.endsWith('/') ? base.slice(0, -1) : base
}

export const getAppOrigin = (): string => {
  if (environment.appOrigin) {
    return environment.appOrigin
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${normalizeBasePath()}`
  }

  return ''
}

export const buildAbsoluteUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const origin = getAppOrigin()
  return origin ? `${origin}${normalizedPath}` : normalizedPath
}

export const buildPublicDealerUrl = (dealerSlug: string): string =>
  buildAbsoluteUrl(paths.dealerPublic(dealerSlug.trim()))

export const buildPublicVehicleUrl = (dealerSlug: string, vehicleId: string): string =>
  buildAbsoluteUrl(paths.dealerPublicVehicle(dealerSlug, vehicleId))

export const buildLegacyPublicVehicleUrl = (vehicleId: string): string =>
  buildAbsoluteUrl(paths.vehiclePublic(vehicleId))
