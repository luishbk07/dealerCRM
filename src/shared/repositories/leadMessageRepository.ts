import { supabase } from '@/shared/services/supabase'
import { assertLeadMessagesRepositorySuccess, LeadMessagesRepositoryError } from '@/modules/leads/errors/leadErrors'
import type { CreateLeadMessageInput, LeadMessage } from '@/modules/leads/types'
import { mapLeadMessageRow, type LeadMessageRow } from './rowMappers'

const COLUMNS = 'id, lead_id, sender, message, created_at'

export class LeadMessagesRepository {
  async getByLead(leadId: string): Promise<LeadMessage[]> {
    const { data, error } = await supabase
      .from('lead_messages')
      .select(COLUMNS)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true })
      .returns<LeadMessageRow[]>()

    assertLeadMessagesRepositorySuccess(error, 'Failed to fetch lead messages')
    return (data ?? []).map(mapLeadMessageRow)
  }

  async create(input: CreateLeadMessageInput): Promise<LeadMessage> {
    const { data, error } = await supabase
      .from('lead_messages')
      .insert({
        lead_id: input.leadId,
        sender: input.sender,
        message: input.message
      })
      .select(COLUMNS)
      .single<LeadMessageRow>()

    assertLeadMessagesRepositorySuccess(error, 'Failed to create lead message')
    if (!data) throw new LeadMessagesRepositoryError('Failed to create lead message: empty response')
    return mapLeadMessageRow(data)
  }
}

export const leadMessageRepository = new LeadMessagesRepository()
