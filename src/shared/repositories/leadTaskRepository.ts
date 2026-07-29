import { supabase } from '@/shared/services/supabase'
import { assertLeadTasksRepositorySuccess, LeadTasksRepositoryError } from '@/modules/leads/errors/leadErrors'
import type { CreateLeadTaskInput, LeadTask, PendingLeadTask, UpdateLeadTaskInput } from '@/modules/leads/types'
import { mapLeadTaskRow, mapPendingLeadTaskRow, type LeadTaskRow, type LeadTaskWithLeadRow } from './rowMappers'

const COLUMNS = 'id, dealer_id, lead_id, title, notes, due_at, completed, completed_at, created_at'

const PENDING_WITH_LEAD_COLUMNS = `
  id, dealer_id, lead_id, title, notes, due_at, completed, completed_at, created_at,
  leads ( name )
`

export class LeadTaskRepository {
  async listByLead(leadId: string): Promise<LeadTask[]> {
    const { data, error } = await supabase
      .from('lead_tasks')
      .select(COLUMNS)
      .eq('lead_id', leadId)
      .order('due_at', { ascending: true })
      .returns<LeadTaskRow[]>()

    assertLeadTasksRepositorySuccess(error, 'Failed to fetch lead tasks')
    return (data ?? []).map(mapLeadTaskRow)
  }

  async listPending(limit: number): Promise<PendingLeadTask[]> {
    const { data, error } = await supabase
      .from('lead_tasks')
      .select(PENDING_WITH_LEAD_COLUMNS)
      .eq('completed', false)
      .order('due_at', { ascending: true })
      .limit(limit)
      .returns<LeadTaskWithLeadRow[]>()

    assertLeadTasksRepositorySuccess(error, 'Failed to fetch pending lead tasks')
    return (data ?? []).map(mapPendingLeadTaskRow)
  }

  async countOverdue(): Promise<number> {
    const { count, error } = await supabase
      .from('lead_tasks')
      .select('id', { count: 'exact', head: true })
      .eq('completed', false)
      .lt('due_at', new Date().toISOString())

    assertLeadTasksRepositorySuccess(error, 'Failed to count overdue lead tasks')
    return count ?? 0
  }

  async create(input: CreateLeadTaskInput): Promise<LeadTask> {
    const { data, error } = await supabase
      .from('lead_tasks')
      .insert({
        dealer_id: input.dealerId,
        lead_id: input.leadId,
        title: input.title,
        notes: input.notes,
        due_at: input.dueAt
      })
      .select(COLUMNS)
      .single<LeadTaskRow>()

    assertLeadTasksRepositorySuccess(error, 'Failed to create lead task')
    if (!data) throw new LeadTasksRepositoryError('Failed to create lead task: empty response')
    return mapLeadTaskRow(data)
  }

  async update(id: string, patch: UpdateLeadTaskInput): Promise<LeadTask> {
    const payload: Record<string, unknown> = {}
    if (patch.title !== undefined) payload.title = patch.title
    if (patch.notes !== undefined) payload.notes = patch.notes
    if (patch.dueAt !== undefined) payload.due_at = patch.dueAt
    if (patch.completed !== undefined) payload.completed = patch.completed
    if (patch.completedAt !== undefined) payload.completed_at = patch.completedAt

    const { data, error } = await supabase
      .from('lead_tasks')
      .update(payload)
      .eq('id', id)
      .select(COLUMNS)
      .single<LeadTaskRow>()

    assertLeadTasksRepositorySuccess(error, 'Failed to update lead task')
    if (!data) throw new LeadTasksRepositoryError('Failed to update lead task: empty response')
    return mapLeadTaskRow(data)
  }

  async complete(id: string): Promise<LeadTask> {
    return this.update(id, {
      completed: true,
      completedAt: new Date().toISOString()
    })
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('lead_tasks').delete().eq('id', id)
    assertLeadTasksRepositorySuccess(error, 'Failed to delete lead task')
  }
}

export const leadTaskRepository = new LeadTaskRepository()
