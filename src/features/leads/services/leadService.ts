import type { Lead, LeadMessage, LeadNote } from '@/shared/types'
import {
  leadMessageRepository,
  leadNoteRepository,
  leadRepository,
  vehicleRepository
} from '@/shared/repositories'
import type { LeadListParams } from '@/shared/repositories'

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

const NOW = (): string => new Date().toISOString()

export const leadService = {
  list(params: LeadListParams) {
    return leadRepository.list(params)
  },

  async getDetail(leadId: string): Promise<LeadWithRelations | null> {
    const lead = await leadRepository.getById(leadId)
    if (!lead) return null
    const [notes, messages] = await Promise.all([
      leadNoteRepository.listByLeadId(leadId),
      leadMessageRepository.listByLeadId(leadId)
    ])
    return { lead, notes, messages }
  },

  async createFromPublicForm(input: CreateLeadFromPublicInput): Promise<Lead> {
    const vehicle = await vehicleRepository.getById(input.vehicleId)
    return leadRepository.create({
      dealer_id: vehicle?.dealerId ?? null,
      vehicle_id: input.vehicleId,
      name: input.name,
      phone: input.phone,
      message: input.message,
      source: input.source,
      status: 'new'
    })
  },

  async createFromDashboard(input: CreateLeadFromDashboardInput): Promise<Lead> {
    return leadRepository.create({
      dealer_id: input.dealerId,
      vehicle_id: input.vehicleId,
      name: input.name,
      phone: input.phone,
      message: input.message,
      source: input.source,
      status: 'new'
    })
  },

  updateStatus(leadId: string, status: string): Promise<Lead> {
    return leadRepository.update(leadId, { status, last_contact_at: NOW() })
  },

  async addNote(leadId: string, note: string): Promise<LeadNote> {
    return leadNoteRepository.create(leadId, note)
  },

  async addMessage(leadId: string, sender: string, message: string): Promise<LeadMessage> {
    const created = await leadMessageRepository.create(leadId, sender, message)
    await leadRepository.update(leadId, { last_contact_at: NOW() })
    return created
  }
}
