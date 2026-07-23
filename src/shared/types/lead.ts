export type { LeadStatus } from '@/modules/leads/types/leadStatus'
export {
  LEAD_STATUS_NEW,
  LEAD_STATUS_CONTACTED,
  LEAD_STATUS_QUALIFIED,
  LEAD_STATUS_NEGOTIATING,
  LEAD_STATUS_SOLD,
  LEAD_STATUS_LOST,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_SENDER_DEALER,
  LEAD_SENDER_LEAD,
  isLeadStatus
} from '@/modules/leads/constants/leadStatus'

import type { LeadStatus } from '@/modules/leads/types/leadStatus'

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

export interface LeadNote {
  id: string
  leadId: string | null
  note: string | null
  createdAt: string
}

export interface LeadMessage {
  id: string
  leadId: string | null
  sender: string | null
  message: string | null
  createdAt: string
}
