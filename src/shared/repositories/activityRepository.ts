import { supabase } from '@/shared/services/supabase'
import type { ActivityLog, CreateActivityLogInput } from '@/shared/types/activityLog'

interface ActivityLogRow {
  id: string
  dealer_id: string
  user_id: string | null
  entity_type: string
  entity_id: string | null
  action: string
  title: string
  description: string
  created_at: string
}

const COLUMNS = 'id, dealer_id, user_id, entity_type, entity_id, action, title, description, created_at'

const mapRow = (row: ActivityLogRow): ActivityLog => ({
  id: row.id,
  dealerId: row.dealer_id,
  userId: row.user_id,
  entityType: row.entity_type as ActivityLog['entityType'],
  entityId: row.entity_id,
  action: row.action as ActivityLog['action'],
  title: row.title,
  description: row.description,
  createdAt: row.created_at
})

const mapCreateInput = (input: CreateActivityLogInput) => ({
  dealer_id: input.dealerId,
  user_id: input.userId ?? null,
  entity_type: input.entityType,
  entity_id: input.entityId ?? null,
  action: input.action,
  title: input.title,
  description: input.description
})

export class ActivityRepository {
  async create(input: CreateActivityLogInput): Promise<ActivityLog> {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert(mapCreateInput(input))
      .select(COLUMNS)
      .single<ActivityLogRow>()

    if (error) throw new Error(error.message)
    return mapRow(data)
  }

  async latest(limit: number): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(COLUMNS)
      .order('created_at', { ascending: false })
      .limit(limit)
      .returns<ActivityLogRow[]>()

    if (error) throw new Error(error.message)
    return (data ?? []).map(mapRow)
  }
}

export const activityRepository = new ActivityRepository()
