import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Lead, LeadStatus, UpdateLeadInput } from '@/modules/leads/types'
import { leadService, type CreateLeadFromDashboardInput } from '../services/leadService'
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

interface UpdateLeadVars {
  leadId: string
  input: UpdateLeadInput
  current: Lead
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

  const createLead = useMutation({
    mutationFn: (input: CreateLeadFromDashboardInput) => leadService.createFromDashboard(input),
    onSuccess: () => invalidate()
  })

  const updateLead = useMutation({
    mutationFn: ({ leadId, input, current }: UpdateLeadVars) => leadService.updateDetail(leadId, input, current),
    onSuccess: (lead) => invalidate(lead.id)
  })

  const deleteLead = useMutation({
    mutationFn: (leadId: string) => leadService.delete(leadId),
    onSuccess: () => invalidate()
  })

  return { updateStatus, addNote, addMessage, createLead, updateLead, deleteLead }
}
