import type { LeadStatus } from './leadStatus'

export interface Lead {
  id: string
  dealerId: string | null
  vehicleId: string | null
  name: string | null
  phone: string | null
  message: string | null
  source: string | null
  status: LeadStatus
  createdAt: string
  lastContactAt: string | null
}

export interface CreateLeadInput {
  dealerId: string | null
  vehicleId: string | null
  name: string | null
  phone: string | null
  message: string | null
  source: string | null
  status: LeadStatus
}

export interface UpdateLeadInput {
  status?: LeadStatus
  lastContactAt?: string | null
  message?: string | null
  name?: string | null
  phone?: string | null
  vehicleId?: string | null
}
