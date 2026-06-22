import type { Vehicle } from '@/shared/types'
import { delay } from '@/shared/utils/delay'
import { formatCurrency, formatNumber } from '@/shared/utils/format'

export interface GeneratedAd {
  facebook: string
  instagram: string
  marketplace: string
  publicUrl: string
}

const transmissionLabel = (vehicle: Vehicle): string => {
  return vehicle.transmission === 'automatic' ? 'automática' : 'manual'
}

const fuelLabel = (vehicle: Vehicle): string => {
  const labels: Record<Vehicle['fuelType'], string> = {
    gasoline: 'gasolina',
    diesel: 'diésel',
    hybrid: 'híbrido',
    electric: 'eléctrico'
  }
  return labels[vehicle.fuelType]
}

const buildFacebook = (vehicle: Vehicle): string => {
  return [
    `🚗 ${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    ``,
    `Precio: ${formatCurrency(vehicle.price)}`,
    `Kilometraje: ${formatNumber(vehicle.mileage)} km`,
    `Transmisión: ${transmissionLabel(vehicle)}`,
    `Combustible: ${fuelLabel(vehicle)}`,
    ``,
    `${vehicle.description ?? 'Vehículo en excelente estado, listo para entrega.'}`,
    ``,
    `📞 Escríbenos por WhatsApp para agendar una prueba de manejo.`,
    `#Vehiculos #Concesionario #${vehicle.brand} #${vehicle.model} #RepublicaDominicana`
  ].join('\n')
}

const buildInstagram = (vehicle: Vehicle): string => {
  return [
    `✨ ${vehicle.brand} ${vehicle.model} ${vehicle.year} ✨`,
    ``,
    `${formatCurrency(vehicle.price)} · ${transmissionLabel(vehicle)} · ${formatNumber(vehicle.mileage)} km`,
    ``,
    `Desliza para ver más fotos 📸`,
    `DM o WhatsApp para reservar tu test drive.`,
    ``,
    `#${vehicle.brand}${vehicle.model} #CarrosRD #Concesionario #${vehicle.year} #DOM`
  ].join('\n')
}

const buildMarketplace = (vehicle: Vehicle): string => {
  return [
    `${vehicle.brand} ${vehicle.model} ${vehicle.year} — ${formatCurrency(vehicle.price)}`,
    ``,
    `Especificaciones:`,
    `• Año: ${vehicle.year}`,
    `• Kilometraje: ${formatNumber(vehicle.mileage)} km`,
    `• Transmisión: ${transmissionLabel(vehicle)}`,
    `• Combustible: ${fuelLabel(vehicle)}`,
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
    await delay(700)
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dealer-crm.app'
    return {
      facebook: buildFacebook(vehicle),
      instagram: buildInstagram(vehicle),
      marketplace: buildMarketplace(vehicle),
      publicUrl: `${origin}/vehicles/${vehicle.id}/public`
    }
  }
}
