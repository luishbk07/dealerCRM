import type { LeadStatus } from '../types/leadStatus'

export const LEAD_STATUS_NEW: LeadStatus = 'new'
export const LEAD_STATUS_CONTACTED: LeadStatus = 'contacted'
export const LEAD_STATUS_QUALIFIED: LeadStatus = 'qualified'
export const LEAD_STATUS_NEGOTIATING: LeadStatus = 'negotiating'
export const LEAD_STATUS_SOLD: LeadStatus = 'sold'
export const LEAD_STATUS_LOST: LeadStatus = 'lost'

export const LEAD_STATUSES: readonly LeadStatus[] = [
  LEAD_STATUS_NEW,
  LEAD_STATUS_CONTACTED,
  LEAD_STATUS_QUALIFIED,
  LEAD_STATUS_NEGOTIATING,
  LEAD_STATUS_SOLD,
  LEAD_STATUS_LOST
] as const

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Calificado',
  negotiating: 'Negociando',
  sold: 'Vendido',
  lost: 'Perdido'
}

export const LEAD_STATUS_FILTER_OPTIONS: { value: LeadStatus | 'all', label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: LEAD_STATUS_NEW, label: 'Nuevos' },
  { value: LEAD_STATUS_CONTACTED, label: 'Contactados' },
  { value: LEAD_STATUS_QUALIFIED, label: 'Calificados' },
  { value: LEAD_STATUS_NEGOTIATING, label: 'Negociando' },
  { value: LEAD_STATUS_SOLD, label: 'Vendidos' },
  { value: LEAD_STATUS_LOST, label: 'Perdidos' }
]

export const LEAD_STATUS_SELECT_OPTIONS: { value: LeadStatus, label: string }[] = LEAD_STATUSES.map(
  (status) => ({ value: status, label: LEAD_STATUS_LABELS[status] })
)

export const LEAD_SENDER_DEALER = 'dealer'
export const LEAD_SENDER_LEAD = 'lead'

export const LEAD_PIPELINE_STAGES: { status: LeadStatus, label: string, color: string }[] = [
  { status: LEAD_STATUS_NEW, label: 'Nuevos', color: '#0EA5E9' },
  { status: LEAD_STATUS_CONTACTED, label: 'Contactados', color: '#2563EB' },
  { status: LEAD_STATUS_QUALIFIED, label: 'Calificados', color: '#F59E0B' },
  { status: LEAD_STATUS_NEGOTIATING, label: 'Negociando', color: '#8B5CF6' },
  { status: LEAD_STATUS_SOLD, label: 'Vendidos', color: '#10B981' },
  { status: LEAD_STATUS_LOST, label: 'Perdidos', color: '#94A3B8' }
]

export const isLeadStatus = (value: string): value is LeadStatus =>
  (LEAD_STATUSES as readonly string[]).includes(value)
