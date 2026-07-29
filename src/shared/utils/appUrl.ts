import { paths } from '@/app/routes/paths'
import { environment } from '@/shared/utils/environment'

export const getAppOrigin = (): string => {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin
  }
  return environment.appOrigin
}

export const buildAbsoluteUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const origin = getAppOrigin()
  return origin ? `${origin}${normalizedPath}` : normalizedPath
}

export const buildPublicVehicleUrl = (dealerSlug: string, vehicleId: string): string =>
  buildAbsoluteUrl(paths.dealerPublicVehicle(dealerSlug, vehicleId))
