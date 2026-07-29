export interface LeadTask {
  id: string
  dealerId: string
  leadId: string
  title: string
  notes: string | null
  dueAt: string
  completed: boolean
  completedAt: string | null
  createdAt: string
}

export interface PendingLeadTask extends LeadTask {
  leadName: string | null
}

export interface CreateLeadTaskInput {
  dealerId: string
  leadId: string
  title: string
  notes: string | null
  dueAt: string
}

export interface UpdateLeadTaskInput {
  title?: string
  notes?: string | null
  dueAt?: string
  completed?: boolean
  completedAt?: string | null
}

export type LeadTaskStatus = 'pending' | 'completed' | 'overdue'

export type LeadTaskFilter = 'all' | 'pending' | 'completed' | 'overdue'
