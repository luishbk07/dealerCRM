import { LEAD_STATUS_LABELS } from '@/modules/leads/constants/leadStatus'
import type { LeadStatus } from '@/modules/leads/types/leadStatus'
import { activityRepository } from '@/shared/repositories/activityRepository'
import { supabase } from '@/shared/services/supabase'
import type {
  ActivityLog,
  CreateActivityLogInput
} from '@/shared/types/activityLog'
import { ACTIVITY_LOG_LIMIT } from '@/shared/types/activityLog'
import type { Lead, Vehicle } from '@/shared/types'
import { formatCurrency } from '@/shared/utils/format'

const vehicleLabel = (vehicle: Pick<Vehicle, 'brand' | 'model' | 'year'>): string => {
  const year = vehicle.year ? ` ${vehicle.year}` : ''
  return `${vehicle.brand} ${vehicle.model}${year}`.trim()
}

const leadName = (lead: Pick<Lead, 'name'>): string => lead.name?.trim() || 'Prospecto'

const resolveUserId = async (userId?: string | null): Promise<string | null> => {
  if (userId !== undefined) return userId
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

const safeLog = async (input: CreateActivityLogInput): Promise<void> => {
  try {
    const userId = await resolveUserId(input.userId)
    await activityRepository.create({ ...input, userId })
  } catch {
    // Activity logging must not break primary operations.
  }
}

export const activityService = {
  latest(limit: number = ACTIVITY_LOG_LIMIT): Promise<ActivityLog[]> {
    return activityRepository.latest(limit)
  },

  log(input: CreateActivityLogInput): Promise<void> {
    return safeLog(input)
  },

  logVehicleCreated(dealerId: string, vehicle: Vehicle): Promise<void> {
    return safeLog({
      dealerId,
      entityType: 'vehicle',
      entityId: vehicle.id,
      action: 'vehicle_created',
      title: 'Vehículo agregado',
      description: `${vehicleLabel(vehicle)} publicado`
    })
  },

  logVehicleUpdated(dealerId: string, vehicle: Vehicle): Promise<void> {
    return safeLog({
      dealerId,
      entityType: 'vehicle',
      entityId: vehicle.id,
      action: 'vehicle_updated',
      title: 'Vehículo actualizado',
      description: `${vehicleLabel(vehicle)} actualizado`
    })
  },

  logVehicleDeleted(dealerId: string, vehicle: Vehicle): Promise<void> {
    return safeLog({
      dealerId,
      entityType: 'vehicle',
      entityId: vehicle.id,
      action: 'vehicle_deleted',
      title: 'Vehículo eliminado',
      description: `${vehicleLabel(vehicle)} eliminado del inventario`
    })
  },

  logVehicleShared(
    dealerId: string,
    vehicle: Vehicle,
    channelLabel: string
  ): Promise<void> {
    return safeLog({
      dealerId,
      entityType: 'vehicle',
      entityId: vehicle.id,
      action: 'vehicle_shared',
      title: 'Vehículo compartido',
      description: `${vehicleLabel(vehicle)} compartido por ${channelLabel}`
    })
  },

  logVehicleFeatured(dealerId: string, vehicle: Vehicle): Promise<void> {
    return safeLog({
      dealerId,
      entityType: 'vehicle',
      entityId: vehicle.id,
      action: 'vehicle_featured',
      title: 'Vehículo destacado',
      description: `${vehicleLabel(vehicle)} ahora aparece primero en el sitio público`
    })
  },

  logVehicleUnfeatured(dealerId: string, vehicle: Vehicle): Promise<void> {
    return safeLog({
      dealerId,
      entityType: 'vehicle',
      entityId: vehicle.id,
      action: 'vehicle_unfeatured',
      title: 'Vehículo removido de destacados',
      description: `${vehicleLabel(vehicle)} ya no está destacado en el sitio público`
    })
  },

  logLeadCreated(lead: Lead): Promise<void> {
    if (!lead.dealerId) return Promise.resolve()
    return safeLog({
      dealerId: lead.dealerId,
      entityType: 'lead',
      entityId: lead.id,
      action: 'lead_created',
      title: 'Nuevo lead',
      description: `${leadName(lead)} solicitó información`
    })
  },

  logLeadCreatedFromWebsite(lead: Lead): Promise<void> {
    if (!lead.dealerId) return Promise.resolve()
    return safeLog({
      dealerId: lead.dealerId,
      entityType: 'lead',
      entityId: lead.id,
      action: 'lead_created',
      title: 'Nuevo lead recibido desde el sitio web',
      description: `${leadName(lead)} consultó por un vehículo`
    })
  },

  logLeadUpdated(lead: Lead): Promise<void> {
    if (!lead.dealerId) return Promise.resolve()
    return safeLog({
      dealerId: lead.dealerId,
      entityType: 'lead',
      entityId: lead.id,
      action: 'lead_updated',
      title: 'Lead actualizado',
      description: `${leadName(lead)} actualizado`
    })
  },

  logLeadStatusChanged(lead: Lead, status: LeadStatus): Promise<void> {
    if (!lead.dealerId) return Promise.resolve()
    return safeLog({
      dealerId: lead.dealerId,
      entityType: 'lead',
      entityId: lead.id,
      action: 'lead_status_changed',
      title: 'Lead actualizado',
      description: `${leadName(lead)} cambió a ${LEAD_STATUS_LABELS[status]}`
    })
  },

  logSaleCreated(
    dealerId: string,
    saleId: string,
    vehicle: Pick<Vehicle, 'brand' | 'model' | 'year'>,
    price: number | null
  ): Promise<void> {
    const priceLabel = price !== null && price !== undefined ? formatCurrency(price) : 'precio no registrado'
    return safeLog({
      dealerId,
      entityType: 'sale',
      entityId: saleId,
      action: 'sale_created',
      title: 'Venta registrada',
      description: `${vehicleLabel(vehicle)} vendido por ${priceLabel}`
    })
  },

  logDealerUpdated(dealerId: string): Promise<void> {
    return safeLog({
      dealerId,
      entityType: 'dealer',
      entityId: dealerId,
      action: 'dealer_updated',
      title: 'Perfil actualizado',
      description: 'Configuración del concesionario actualizada'
    })
  },

  logLogoUpdated(dealerId: string): Promise<void> {
    return safeLog({
      dealerId,
      entityType: 'dealer',
      entityId: dealerId,
      action: 'logo_updated',
      title: 'Logo actualizado',
      description: 'Se actualizó el logo del concesionario'
    })
  },

  logBannerUpdated(dealerId: string): Promise<void> {
    return safeLog({
      dealerId,
      entityType: 'dealer',
      entityId: dealerId,
      action: 'banner_updated',
      title: 'Banner actualizado',
      description: 'Se actualizó el banner del concesionario'
    })
  }
}
