import { LEAD_STATUS_LABELS, LEAD_STATUS_NEW } from '@/modules/leads/constants/leadStatus'
import { formatVehicleLabel } from '@/features/leads/utils/vehicleLabel'
import type { Lead, Sale, Vehicle } from '@/shared/types'
import { VEHICLE_STATUS_SOLD } from '@/shared/types/vehicle'
import { formatCurrency } from '@/shared/utils/format'
import type { ActivityEvent } from '../types/activity'
import { MAX_ACTIVITY_ITEMS } from '../types/activity'

const isAfter = (later: string, earlier: string): boolean =>
  new Date(later).getTime() > new Date(earlier).getTime()

const buildVehicleLabel = (vehicle: Vehicle): string =>
  formatVehicleLabel(vehicle, vehicle.id)

export const buildActivityFeed = (
  vehicles: Vehicle[],
  leads: Lead[],
  sales: Sale[]
): ActivityEvent[] => {
  const events: ActivityEvent[] = []
  const saleVehicleIds = new Set(
    sales.map((sale) => sale.vehicleId).filter((id): id is string => Boolean(id))
  )

  for (const vehicle of vehicles) {
    const label = buildVehicleLabel(vehicle)

    events.push({
      id: `vehicle-created-${vehicle.id}`,
      type: 'vehicle_created',
      title: 'Vehículo publicado',
      description: `${label} agregado al inventario`,
      occurredAt: vehicle.createdAt
    })

    if (
      vehicle.status === VEHICLE_STATUS_SOLD &&
      isAfter(vehicle.updatedAt, vehicle.createdAt) &&
      !saleVehicleIds.has(vehicle.id)
    ) {
      events.push({
        id: `vehicle-sold-${vehicle.id}`,
        type: 'vehicle_sold',
        title: 'Vehículo vendido',
        description: `${label} marcado como vendido`,
        occurredAt: vehicle.updatedAt
      })
    }
  }

  for (const lead of leads) {
    const leadName = lead.name?.trim() || 'Prospecto sin nombre'

    events.push({
      id: `lead-created-${lead.id}`,
      type: 'lead_created',
      title: 'Nuevo lead',
      description: `${leadName} solicitó información`,
      occurredAt: lead.createdAt
    })

    if (
      lead.status !== LEAD_STATUS_NEW &&
      lead.lastContactAt &&
      isAfter(lead.lastContactAt, lead.createdAt)
    ) {
      events.push({
        id: `lead-status-${lead.id}-${lead.lastContactAt}`,
        type: 'lead_status_changed',
        title: 'Lead actualizado',
        description: `${leadName} pasó a ${LEAD_STATUS_LABELS[lead.status]}`,
        occurredAt: lead.lastContactAt
      })
    }
  }

  const vehicleById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]))

  for (const sale of sales) {
    const vehicle = sale.vehicleId ? vehicleById.get(sale.vehicleId) : undefined
    const label = formatVehicleLabel(vehicle, sale.vehicleId)
    const priceLabel =
      sale.price !== null && sale.price !== undefined
        ? formatCurrency(sale.price)
        : 'precio no registrado'

    events.push({
      id: `sale-${sale.id}`,
      type: 'sale_registered',
      title: 'Venta registrada',
      description: `${label} vendido por ${priceLabel}`,
      occurredAt: sale.soldAt
    })
  }

  return events
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, MAX_ACTIVITY_ITEMS)
}
