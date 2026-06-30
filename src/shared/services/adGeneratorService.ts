import type { Vehicle } from '@/shared/types'
import { formatCurrency, formatNumber } from '@/shared/utils/format'

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export interface GeneratedAd {
  facebook: string
  instagram: string
  marketplace: string
  publicUrl: string
}

const labelOr = (value: string | null, fallback: string): string => value && value.trim() ? value : fallback

const buildFacebook = (vehicle: Vehicle): string => {
  return [
    `🚗 ${vehicle.brand} ${vehicle.model}${vehicle.year ? ` ${vehicle.year}` : ''}`,
    ``,
    `Precio: ${formatCurrency(vehicle.price)}`,
    `Kilometraje: ${formatNumber(vehicle.mileage)} km`,
    `Transmisión: ${labelOr(vehicle.transmission, 'consultar')}`,
    `Combustible: ${labelOr(vehicle.fuelType, 'consultar')}`,
    ``,
    `${vehicle.description ?? 'Vehículo en excelente estado, listo para entrega.'}`,
    ``,
    `📞 Escríbenos por WhatsApp para agendar una prueba de manejo.`,
    `#Vehiculos #Concesionario #${vehicle.brand} #${vehicle.model} #RepublicaDominicana`
  ].join('\n')
}

const buildInstagram = (vehicle: Vehicle): string => {
  return [
    `✨ ${vehicle.brand} ${vehicle.model}${vehicle.year ? ` ${vehicle.year}` : ''} ✨`,
    ``,
    `${formatCurrency(vehicle.price)} · ${labelOr(vehicle.transmission, 'consultar')} · ${formatNumber(vehicle.mileage)} km`,
    ``,
    `Desliza para ver más fotos 📸`,
    `DM o WhatsApp para reservar tu test drive.`,
    ``,
    `#${vehicle.brand}${vehicle.model} #CarrosRD #Concesionario${vehicle.year ? ` #${vehicle.year}` : ''} #DOM`
  ].join('\n')
}

const buildMarketplace = (vehicle: Vehicle): string => {
  return [
    `${vehicle.brand} ${vehicle.model}${vehicle.year ? ` ${vehicle.year}` : ''} — ${formatCurrency(vehicle.price)}`,
    ``,
    `Especificaciones:`,
    `• Año: ${vehicle.year ?? 'consultar'}`,
    `• Kilometraje: ${formatNumber(vehicle.mileage)} km`,
    `• Transmisión: ${labelOr(vehicle.transmission, 'consultar')}`,
    `• Combustible: ${labelOr(vehicle.fuelType, 'consultar')}`,
    ``,
    `${vehicle.description ?? 'Vehículo revisado, papeles al día y listo para traspaso.'}`,
    ``,
    `Aceptamos financiamiento y vehículo en parte de pago. Contáctanos para más información.`
  ].join('\n')
}

export interface AdGeneratorService {
  generate(vehicle: Vehicle): Promise<GeneratedAd>
}

export const adGeneratorService: AdGeneratorService = {
  async generate(vehicle) {
    await wait(700)
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dealer-crm.app'
    return {
      facebook: buildFacebook(vehicle),
      instagram: buildInstagram(vehicle),
      marketplace: buildMarketplace(vehicle),
      publicUrl: `${origin}/vehicles/${vehicle.id}/public`
    }
  }
}
