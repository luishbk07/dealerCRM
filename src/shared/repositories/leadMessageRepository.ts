import { supabase } from '@/shared/services/supabase'
import type { LeadMessage } from '@/shared/types'
import { mapLeadMessageRow, type LeadMessageRow } from './rowMappers'

const COLUMNS = 'id, lead_id, sender, message, created_at'

export const leadMessageRepository = {
  async listByLeadId(leadId: string): Promise<LeadMessage[]> {
    const { data, error } = await supabase
      .from('lead_messages')
      .select(COLUMNS)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true })
      .returns<LeadMessageRow[]>()
    if (error) throw new Error(error.message)
    return (data ?? []).map(mapLeadMessageRow)
  },

  async create(leadId: string, sender: string, message: string): Promise<LeadMessage> {
    const { data, error } = await supabase
      .from('lead_messages')
      .insert({ lead_id: leadId, sender, message })
      .select(COLUMNS)
      .single<LeadMessageRow>()
    if (error) throw new Error(error.message)
    return mapLeadMessageRow(data)
  }
}
