import { supabase } from '@/shared/services/supabase'
import type { LeadNote } from '@/shared/types'
import { mapLeadNoteRow, type LeadNoteRow } from './rowMappers'

const COLUMNS = 'id, lead_id, note, created_at'

export const leadNoteRepository = {
  async listByLeadId(leadId: string): Promise<LeadNote[]> {
    const { data, error } = await supabase
      .from('lead_notes')
      .select(COLUMNS)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .returns<LeadNoteRow[]>()
    if (error) throw new Error(error.message)
    return (data ?? []).map(mapLeadNoteRow)
  },

  async create(leadId: string, note: string): Promise<LeadNote> {
    const { data, error } = await supabase
      .from('lead_notes')
      .insert({ lead_id: leadId, note })
      .select(COLUMNS)
      .single<LeadNoteRow>()
    if (error) throw new Error(error.message)
    return mapLeadNoteRow(data)
  }
}
