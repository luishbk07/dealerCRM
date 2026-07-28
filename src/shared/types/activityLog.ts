export type ActivityEntityType = 'vehicle' | 'lead' | 'sale' | 'dealer'

export type ActivityAction =
  | 'vehicle_created'
  | 'vehicle_updated'
  | 'vehicle_deleted'
  | 'lead_created'
  | 'lead_updated'
  | 'lead_status_changed'
  | 'sale_created'
  | 'dealer_updated'
  | 'logo_updated'
  | 'banner_updated'

export interface ActivityLog {
  id: string
  dealerId: string
  userId: string | null
  entityType: ActivityEntityType
  entityId: string | null
  action: ActivityAction
  title: string
  description: string
  createdAt: string
}

export interface CreateActivityLogInput {
  dealerId: string
  userId?: string | null
  entityType: ActivityEntityType
  entityId?: string | null
  action: ActivityAction
  title: string
  description: string
}

export const ACTIVITY_LOG_LIMIT = 10
