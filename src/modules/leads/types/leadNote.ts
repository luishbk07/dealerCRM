export interface LeadNote {
  id: string
  leadId: string | null
  note: string | null
  createdAt: string
}

export interface CreateLeadNoteInput {
  leadId: string
  note: string
}
