import { useCallback } from 'react'
import { leadService } from '@/shared/services'
import { useAsync } from '@/shared/hooks/useAsync'
import type { Lead, LeadMessage, LeadStatus } from '@/shared/types'

export const useLeads = () => {
  const { data, loading, error, refresh, setData } = useAsync<Lead[]>(() => leadService.list())

  const replaceInList = useCallback((updated: Lead) => {
    setData((data ?? []).map((lead) => (lead.id === updated.id ? updated : lead)))
  }, [data, setData])

  const updateStatus = useCallback(async (id: string, status: LeadStatus) => {
    const updated = await leadService.updateStatus(id, status)
    replaceInList(updated)
    return updated
  }, [replaceInList])

  const addNote = useCallback(async (id: string, content: string) => {
    const updated = await leadService.addNote(id, content)
    replaceInList(updated)
    return updated
  }, [replaceInList])

  const addMessage = useCallback(async (id: string, message: Omit<LeadMessage, 'id' | 'createdAt'>) => {
    const updated = await leadService.addMessage(id, message)
    replaceInList(updated)
    return updated
  }, [replaceInList])

  return {
    leads: data ?? [],
    loading,
    error,
    refresh,
    updateStatus,
    addNote,
    addMessage
  }
}
