export type ActivityEventType =
  | 'vehicle_created'
  | 'vehicle_sold'
  | 'lead_created'
  | 'lead_status_changed'
  | 'sale_registered'

export interface ActivityEvent {
  id: string
  type: ActivityEventType
  title: string
  description: string
  occurredAt: string
}

export const MAX_ACTIVITY_ITEMS = 10
