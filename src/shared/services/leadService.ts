import { LEAD_STATUS_NEW, LEAD_STATUS_SOLD, LEAD_SENDER_DEALER } from '@/modules/leads/constants/leadStatus'
import { LeadServiceError } from '@/modules/leads/errors/leadErrors'
import type {
  CreateLeadInput,
  CreateLeadMessageInput,
  CreateLeadNoteInput,
  Lead,
  LeadListResult,
  LeadMessage,
  LeadNote,
  LeadSearchParams,
  LeadStatus,
  UpdateLeadInput
} from '@/modules/leads/types'
import {
  leadMessageRepository,
  leadNoteRepository,
  leadRepository,
  type LeadListParams
} from '@/shared/repositories'
import { vehicleRepository } from '@/shared/repositories/vehicleRepository'
import { saleService } from '@/shared/services/saleService'
import { activityService } from '@/shared/services/activityService'

export interface CreateLeadFromPublicInput {
  vehicleId: string
  name: string
  phone: string
  message: string | null
  source: string
}

export interface CreateLeadFromDashboardInput {
  dealerId: string
  vehicleId: string | null
  name: string
  phone: string
  message: string | null
  source: string
}

export interface LeadWithRelations {
  lead: Lead
  notes: LeadNote[]
  messages: LeadMessage[]
}

const nowIso = (): string => new Date().toISOString()

const wrapServiceCall = async <T>(action: () => Promise<T>, context: string): Promise<T> => {
  try {
    return await action()
  } catch (error) {
    if (error instanceof LeadServiceError) throw error
    throw new LeadServiceError(context, error)
  }
}

export const leadService = {
  getAll(): Promise<Lead[]> {
    return wrapServiceCall(() => leadRepository.getAll(), 'Failed to load leads')
  },

  getById(leadId: string): Promise<Lead | null> {
    return wrapServiceCall(() => leadRepository.getById(leadId), 'Failed to load lead')
  },

  search(params: LeadSearchParams): Promise<LeadListResult> {
    return wrapServiceCall(() => leadRepository.search(params), 'Failed to search leads')
  },

  list(params: LeadListParams): Promise<LeadListResult> {
    return wrapServiceCall(() => leadRepository.list(params), 'Failed to list leads')
  },

  create(input: CreateLeadInput): Promise<Lead> {
    return wrapServiceCall(async () => {
      const lead = await leadRepository.create(input)
      await activityService.logLeadCreated(lead)
      return lead
    }, 'Failed to create lead')
  },

  update(leadId: string, input: UpdateLeadInput): Promise<Lead> {
    return wrapServiceCall(async () => {
      const current = await leadRepository.getById(leadId)
      const lead = await leadRepository.update(leadId, input)
      if (input.status !== undefined && current && input.status !== current.status) {
        await activityService.logLeadStatusChanged(lead, input.status)
      } else {
        await activityService.logLeadUpdated(lead)
      }
      return lead
    }, 'Failed to update lead')
  },

  updateDetail(leadId: string, input: UpdateLeadInput, current: Lead): Promise<Lead> {
    return wrapServiceCall(async () => {
      if (input.status === LEAD_STATUS_SOLD && current.status !== LEAD_STATUS_SOLD) {
        const { lead: soldLead } = await saleService.convertLeadToSale(leadId)
        const { status: _status, ...rest } = input
        const hasOtherUpdates = Object.entries(rest).some(([, value]) => value !== undefined)
        if (!hasOtherUpdates) return soldLead

        const payload: UpdateLeadInput = { ...rest }
        if (Object.keys(payload).length === 0) return soldLead
        const updated = await leadRepository.update(leadId, payload)
        await activityService.logLeadUpdated(updated)
        return updated
      }

      const payload: UpdateLeadInput = { ...input }
      if (input.status !== undefined && input.status !== current.status) {
        payload.lastContactAt = nowIso()
      }
      const lead = await leadRepository.update(leadId, payload)
      if (input.status !== undefined && input.status !== current.status) {
        await activityService.logLeadStatusChanged(lead, input.status)
      } else {
        await activityService.logLeadUpdated(lead)
      }
      return lead
    }, 'Failed to update lead')
  },

  delete(leadId: string): Promise<void> {
    return wrapServiceCall(() => leadRepository.delete(leadId), 'Failed to delete lead')
  },

  updateStatus(leadId: string, status: LeadStatus): Promise<Lead> {
    if (status === LEAD_STATUS_SOLD) {
      return wrapServiceCall(
        async () => (await saleService.convertLeadToSale(leadId)).lead,
        'Failed to convert lead to sale'
      )
    }
    return wrapServiceCall(async () => {
      const current = await leadRepository.getById(leadId)
      const lead = await leadRepository.updateStatus(leadId, status)
      if (current && current.status !== status) {
        await activityService.logLeadStatusChanged(lead, status)
      }
      return lead
    }, 'Failed to update lead status')
  },

  getByVehicle(vehicleId: string): Promise<Lead[]> {
    return wrapServiceCall(() => leadRepository.getByVehicle(vehicleId), 'Failed to load vehicle leads')
  },

  async getDetail(leadId: string): Promise<LeadWithRelations | null> {
    return wrapServiceCall(async () => {
      const lead = await leadRepository.getById(leadId)
      if (!lead) return null
      const [notes, messages] = await Promise.all([
        leadNoteRepository.getByLead(leadId),
        leadMessageRepository.getByLead(leadId)
      ])
      return { lead, notes, messages }
    }, 'Failed to load lead detail')
  },

  async createFromPublicForm(input: CreateLeadFromPublicInput): Promise<Lead> {
    return wrapServiceCall(async () => {
      const vehicle = await vehicleRepository.getById(input.vehicleId)
      const lead = await leadRepository.create({
        dealerId: vehicle?.dealerId ?? null,
        vehicleId: input.vehicleId,
        name: input.name,
        phone: input.phone,
        message: input.message,
        source: input.source,
        status: LEAD_STATUS_NEW
      })
      await activityService.logLeadCreated(lead)
      return lead
    }, 'Failed to create lead from public form')
  },

  async createFromDashboard(input: CreateLeadFromDashboardInput): Promise<Lead> {
    return wrapServiceCall(async () => {
      const lead = await leadRepository.create({
        dealerId: input.dealerId,
        vehicleId: input.vehicleId,
        name: input.name,
        phone: input.phone,
        message: input.message,
        source: input.source,
        status: LEAD_STATUS_NEW
      })
      await activityService.logLeadCreated(lead)
      return lead
    }, 'Failed to create lead from dashboard')
  },

  addNote(leadId: string, note: string): Promise<LeadNote> {
    const input: CreateLeadNoteInput = { leadId, note }
    return wrapServiceCall(() => leadNoteRepository.create(input), 'Failed to add lead note')
  },

  async addMessage(leadId: string, sender: string, message: string): Promise<LeadMessage> {
    return wrapServiceCall(async () => {
      const input: CreateLeadMessageInput = { leadId, sender, message }
      const created = await leadMessageRepository.create(input)
      await leadRepository.update(leadId, { lastContactAt: nowIso() })
      return created
    }, 'Failed to add lead message')
  },

  addDealerMessage(leadId: string, message: string): Promise<LeadMessage> {
    return this.addMessage(leadId, LEAD_SENDER_DEALER, message)
  }
}

export type {
  CreateLeadInput,
  CreateLeadMessageInput,
  CreateLeadNoteInput,
  Lead,
  LeadListResult,
  LeadMessage,
  LeadNote,
  LeadSearchParams,
  LeadStatus,
  UpdateLeadInput
}

export type { LeadListParams }
