export interface Lead {
  id: string
  dealerId: string | null
  vehicleId: string | null
  name: string | null
  phone: string | null
  message: string | null
  source: string | null
  status: string
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

export const LEAD_STATUS_NEW = 'new'
export const LEAD_STATUS_CONTACTED = 'contacted'
export const LEAD_STATUS_QUALIFIED = 'qualified'
export const LEAD_STATUS_SOLD = 'sold'
export const LEAD_STATUS_LOST = 'lost'

export const LEAD_SENDER_DEALER = 'dealer'
export const LEAD_SENDER_LEAD = 'lead'
