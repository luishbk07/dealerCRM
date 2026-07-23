import { supabase } from '@/shared/services/supabase'
import { assertLeadNotesRepositorySuccess, LeadNotesRepositoryError } from '@/modules/leads/errors/leadErrors'
import type { CreateLeadNoteInput, LeadNote } from '@/modules/leads/types'
import { mapLeadNoteRow, type LeadNoteRow } from './rowMappers'

const COLUMNS = 'id, lead_id, note, created_at'

export class LeadNotesRepository {
  async getByLead(leadId: string): Promise<LeadNote[]> {
    const { data, error } = await supabase
      .from('lead_notes')
      .select(COLUMNS)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .returns<LeadNoteRow[]>()

    assertLeadNotesRepositorySuccess(error, 'Failed to fetch lead notes')
    return (data ?? []).map(mapLeadNoteRow)
  }

  async create(input: CreateLeadNoteInput): Promise<LeadNote> {
    const { data, error } = await supabase
      .from('lead_notes')
      .insert({ lead_id: input.leadId, note: input.note })
      .select(COLUMNS)
      .single<LeadNoteRow>()

    assertLeadNotesRepositorySuccess(error, 'Failed to create lead note')
    if (!data) throw new LeadNotesRepositoryError('Failed to create lead note: empty response')
    return mapLeadNoteRow(data)
  }
}

export const leadNoteRepository = new LeadNotesRepository()
