export interface LeadMessage {
  id: string
  leadId: string | null
  sender: string | null
  message: string | null
  createdAt: string
}

export interface CreateLeadMessageInput {
  leadId: string
  sender: string
  message: string
}
