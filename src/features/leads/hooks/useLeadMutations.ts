import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { LeadStatus } from '@/modules/leads/types'
import { leadService } from '../services/leadService'
import { queryKeys } from '@/shared/queryKeys'

interface AddNoteVars {
  leadId: string
  note: string
}

interface AddMessageVars {
  leadId: string
  sender: string
  message: string
}

interface UpdateStatusVars {
  leadId: string
  status: LeadStatus
}

export const useLeadMutations = () => {
  const queryClient = useQueryClient()

  const invalidate = (leadId?: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.leads.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.snapshot })
    if (leadId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(leadId) })
    }
  }

  const updateStatus = useMutation({
    mutationFn: ({ leadId, status }: UpdateStatusVars) => leadService.updateStatus(leadId, status),
    onSuccess: (lead) => invalidate(lead.id)
  })

  const addNote = useMutation({
    mutationFn: ({ leadId, note }: AddNoteVars) => leadService.addNote(leadId, note),
    onSuccess: (note) => invalidate(note.leadId ?? undefined)
  })

  const addMessage = useMutation({
    mutationFn: ({ leadId, sender, message }: AddMessageVars) => leadService.addMessage(leadId, sender, message),
    onSuccess: (message) => invalidate(message.leadId ?? undefined)
  })

  return { updateStatus, addNote, addMessage }
}
