import type { Vehicle } from '@/shared/types'
import { formatCurrency } from '@/shared/utils/format'

export type VehicleShareChannel = 'copy' | 'whatsapp' | 'facebook' | 'x' | 'email'

export const VEHICLE_SHARE_CHANNEL_LABELS: Record<VehicleShareChannel, string> = {
  copy: 'copiar enlace',
  whatsapp: 'WhatsApp',
  facebook: 'Facebook',
  x: 'X',
  email: 'correo'
}

export const buildVehicleShareTitle = (vehicle: Pick<Vehicle, 'brand' | 'model' | 'year'>): string => {
  const year = vehicle.year ? ` ${vehicle.year}` : ''
  return `${vehicle.brand} ${vehicle.model}${year}`.trim()
}

export const buildVehicleShareWhatsAppMessage = (
  vehicle: Pick<Vehicle, 'brand' | 'model' | 'year' | 'price'>,
  publicUrl: string
): string => {
  const title = buildVehicleShareTitle(vehicle)
  const price = formatCurrency(vehicle.price)

  return ['Hola,', '', 'Mira este vehículo:', '', title, '', price, '', publicUrl].join('\n')
}

export const buildVehicleShareEmailSubject = (): string => 'Vehículo recomendado'

export const buildVehicleShareEmailBody = (
  vehicle: Pick<Vehicle, 'brand' | 'model' | 'year' | 'price'>,
  publicUrl: string
): string => {
  const title = buildVehicleShareTitle(vehicle)
  const price = formatCurrency(vehicle.price)

  return [
    'Hola,',
    '',
    'Quería compartirte este vehículo.',
    '',
    title,
    price,
    '',
    publicUrl
  ].join('\n')
}

export const buildWhatsAppShareUrl = (message: string): string =>
  `https://wa.me/?text=${encodeURIComponent(message)}`

export const buildFacebookShareUrl = (publicUrl: string): string =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`

export const buildXShareUrl = (
  vehicle: Pick<Vehicle, 'brand' | 'model' | 'year' | 'price'>,
  publicUrl: string
): string => {
  const text = `${buildVehicleShareTitle(vehicle)} · ${formatCurrency(vehicle.price)}`
  const params = new URLSearchParams({
    text: `${text} ${publicUrl}`
  })
  return `https://twitter.com/intent/tweet?${params.toString()}`
}

export const buildEmailShareUrl = (
  vehicle: Pick<Vehicle, 'brand' | 'model' | 'year' | 'price'>,
  publicUrl: string
): string => {
  const params = new URLSearchParams({
    subject: buildVehicleShareEmailSubject(),
    body: buildVehicleShareEmailBody(vehicle, publicUrl)
  })
  return `mailto:?${params.toString()}`
}

export const canUseNativeShare = (): boolean =>
  typeof navigator !== 'undefined' && typeof navigator.share === 'function'
