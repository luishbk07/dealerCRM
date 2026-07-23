import { LEAD_STATUS_SOLD } from '@/modules/leads/constants/leadStatus'
import type { Lead } from '@/modules/leads/types'
import {
  SaleServiceError,
  SaleValidationError,
  getSaleUserMessage
} from '@/modules/sales/errors/saleErrors'
import type { ConvertLeadToSaleResult, CreateSaleInput, SaleSummary } from '@/modules/sales/types'
import type { Sale } from '@/shared/types'
import { VEHICLE_STATUS_SOLD } from '@/shared/types/vehicle'
import { leadRepository, salesRepository, type SaleListParams, type SaleListResult } from '@/shared/repositories'
import { vehicleRepository } from '@/shared/repositories/vehicleRepository'

const VALIDATION_MESSAGES = {
  leadNotFound: 'No se encontró el lead.',
  vehicleMissing: 'El lead no tiene un vehículo asociado.',
  vehicleNotFound: 'No se encontró el vehículo asociado.',
  vehicleAlreadySold: 'Este vehículo ya fue vendido.',
  leadAlreadySold: 'Este lead ya fue registrado como vendido.',
  priceMissing: 'El vehículo no tiene precio definido.',
  dealerMissing: 'No se pudo determinar el concesionario de la venta.'
} as const

const nowIso = (): string => new Date().toISOString()

const wrapServiceCall = async <T>(action: () => Promise<T>, userMessage: string): Promise<T> => {
  try {
    return await action()
  } catch (error) {
    if (error instanceof SaleValidationError) throw error
    if (error instanceof SaleServiceError) throw error
    throw new SaleServiceError('Sale service operation failed', userMessage, error)
  }
}

const validateLeadForSale = async (leadId: string): Promise<Lead> => {
  const lead = await leadRepository.getById(leadId)
  if (!lead) {
    throw new SaleValidationError(VALIDATION_MESSAGES.leadNotFound)
  }

  if (lead.status === LEAD_STATUS_SOLD) {
    throw new SaleValidationError(VALIDATION_MESSAGES.leadAlreadySold)
  }

  const existingSale = await salesRepository.getByLeadId(leadId)
  if (existingSale) {
    throw new SaleValidationError(VALIDATION_MESSAGES.leadAlreadySold)
  }

  if (!lead.vehicleId) {
    throw new SaleValidationError(VALIDATION_MESSAGES.vehicleMissing)
  }

  return lead
}

const validateVehicleForSale = async (vehicleId: string) => {
  const vehicle = await vehicleRepository.getById(vehicleId)
  if (!vehicle) {
    throw new SaleValidationError(VALIDATION_MESSAGES.vehicleNotFound)
  }

  if (vehicle.status === VEHICLE_STATUS_SOLD) {
    throw new SaleValidationError(VALIDATION_MESSAGES.vehicleAlreadySold)
  }

  const existingSale = await salesRepository.getByVehicleId(vehicleId)
  if (existingSale) {
    throw new SaleValidationError(VALIDATION_MESSAGES.vehicleAlreadySold)
  }

  if (vehicle.price === null || vehicle.price === undefined || vehicle.price <= 0) {
    throw new SaleValidationError(VALIDATION_MESSAGES.priceMissing)
  }

  return vehicle
}

const rollbackSaleConversion = async (params: {
  saleId: string | null
  vehicleId: string | null
  previousVehicleStatus: string | null
  vehicleUpdated: boolean
}): Promise<void> => {
  if (params.vehicleUpdated && params.vehicleId && params.previousVehicleStatus) {
    try {
      await vehicleRepository.update(params.vehicleId, { status: params.previousVehicleStatus })
    } catch {
      // Best-effort rollback
    }
  }

  if (params.saleId) {
    try {
      await salesRepository.delete(params.saleId)
    } catch {
      // Best-effort rollback
    }
  }
}

export const saleService = {
  list(params: SaleListParams): Promise<SaleListResult> {
    return wrapServiceCall(() => salesRepository.list(params), 'No fue posible cargar las ventas.')
  },

  getAll(): Promise<Sale[]> {
    return wrapServiceCall(() => salesRepository.getAll(), 'No fue posible cargar las ventas.')
  },

  getById(saleId: string): Promise<Sale | null> {
    return wrapServiceCall(() => salesRepository.getById(saleId), 'No fue posible cargar la venta.')
  },

  getMonthly() {
    return wrapServiceCall(() => salesRepository.getMonthly(), 'No fue posible cargar las ventas mensuales.')
  },

  getSummary(): Promise<SaleSummary> {
    return wrapServiceCall(() => salesRepository.getSummary(), 'No fue posible cargar el resumen de ventas.')
  },

  create(input: CreateSaleInput): Promise<Sale> {
    return wrapServiceCall(() => salesRepository.create(input), 'No fue posible registrar la venta.')
  },

  async convertLeadToSale(leadId: string): Promise<{ lead: Lead, result: ConvertLeadToSaleResult }> {
    return wrapServiceCall(async () => {
      const lead = await validateLeadForSale(leadId)
      const vehicle = await validateVehicleForSale(lead.vehicleId as string)

      const dealerId = lead.dealerId ?? vehicle.dealerId
      if (!dealerId) {
        throw new SaleValidationError(VALIDATION_MESSAGES.dealerMissing)
      }

      const soldAt = nowIso()
      let createdSaleId: string | null = null
      let vehicleUpdated = false
      const previousVehicleStatus = vehicle.status

      try {
        const sale = await salesRepository.create({
          dealerId,
          vehicleId: vehicle.id,
          leadId: lead.id,
          price: vehicle.price as number,
          soldAt
        })
        createdSaleId = sale.id

        await vehicleRepository.update(vehicle.id, { status: VEHICLE_STATUS_SOLD })
        vehicleUpdated = true

        const updatedLead = await leadRepository.updateStatus(leadId, LEAD_STATUS_SOLD)

        return {
          lead: updatedLead,
          result: {
            saleId: sale.id,
            leadId: lead.id,
            vehicleId: vehicle.id
          }
        }
      } catch (error) {
        await rollbackSaleConversion({
          saleId: createdSaleId,
          vehicleId: vehicle.id,
          previousVehicleStatus,
          vehicleUpdated
        })

        if (error instanceof SaleValidationError) throw error
        throw new SaleServiceError(
          'Lead to sale conversion failed',
          getSaleUserMessage(error),
          error
        )
      }
    }, 'No fue posible registrar la venta.')
  }
}

export { getSaleUserMessage }
export type { CreateSaleInput, SaleSummary, ConvertLeadToSaleResult, SaleListParams, SaleListResult }
