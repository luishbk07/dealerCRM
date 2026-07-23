import {
  LEAD_STATUS_LABELS,
  LEAD_STATUS_NEW,
  LEAD_SENDER_DEALER
} from '@/modules/leads/constants/leadStatus'
import type { Lead, LeadMessage, LeadNote } from '@/modules/leads/types'

export type LeadActivityType = 'lead_created' | 'status_changed' | 'note_added' | 'message_added'

export interface LeadActivityEvent {
  id: string
  type: LeadActivityType
  timestamp: string
  title: string
  description?: string
}

const TIMESTAMP_TOLERANCE_MS = 5000

const isNearTimestamp = (a: string, b: string): boolean =>
  Math.abs(new Date(a).getTime() - new Date(b).getTime()) <= TIMESTAMP_TOLERANCE_MS

export const buildLeadActivity = (
  lead: Lead,
  notes: LeadNote[],
  messages: LeadMessage[]
): LeadActivityEvent[] => {
  const events: LeadActivityEvent[] = []

  events.push({
    id: `created-${lead.id}`,
    type: 'lead_created',
    timestamp: lead.createdAt,
    title: 'Lead creado',
    description: lead.source ? `Origen: ${lead.source}` : undefined
  })

  for (const note of notes) {
    events.push({
      id: `note-${note.id}`,
      type: 'note_added',
      timestamp: note.createdAt,
      title: 'Nota añadida',
      description: note.note ?? undefined
    })
  }

  for (const message of messages) {
    const isDealer = (message.sender ?? '').toLowerCase() === LEAD_SENDER_DEALER
    events.push({
      id: `message-${message.id}`,
      type: 'message_added',
      timestamp: message.createdAt,
      title: isDealer ? 'Mensaje enviado' : 'Mensaje recibido',
      description: message.message ?? undefined
    })
  }

  const initialMessage = lead.message?.trim()
  if (initialMessage) {
    const duplicated = messages.some(
      (message) =>
        (message.message ?? '').trim() === initialMessage &&
        isNearTimestamp(message.createdAt, lead.createdAt)
    )
    if (!duplicated) {
      events.push({
        id: `initial-message-${lead.id}`,
        type: 'message_added',
        timestamp: lead.createdAt,
        title: 'Mensaje inicial',
        description: lead.message ?? undefined
      })
    }
  }

  if (lead.status !== LEAD_STATUS_NEW && lead.lastContactAt) {
    const explainedByMessage = messages.some((message) =>
      isNearTimestamp(message.createdAt, lead.lastContactAt as string)
    )
    if (!explainedByMessage && !isNearTimestamp(lead.lastContactAt, lead.createdAt)) {
      events.push({
        id: `status-${lead.id}-${lead.lastContactAt}`,
        type: 'status_changed',
        timestamp: lead.lastContactAt,
        title: 'Estado actualizado',
        description: LEAD_STATUS_LABELS[lead.status]
      })
    }
  }

  return events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}
