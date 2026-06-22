import { Alert, Box, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Lead, LeadStatus } from '@/shared/types'
import { LoadingState, PageHeader } from '@/shared/components'
import { useToast } from '@/shared/hooks/useToast'
import { paths } from '@/app/routes/paths'
import { useLeads } from '../hooks/useLeads'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import { LeadInbox } from '../components/LeadInbox'
import { LeadConversation } from '../components/LeadConversation'
import { LeadSidePanel } from '../components/LeadSidePanel'

const filterLeads = (leads: Lead[], query: string, status: LeadStatus | 'all'): Lead[] => {
  const normalizedQuery = query.trim().toLowerCase()
  return leads
    .filter((lead) => (status === 'all' ? true : lead.status === status))
    .filter((lead) => {
      if (!normalizedQuery) return true
      return (
        lead.fullName.toLowerCase().includes(normalizedQuery) ||
        lead.phone.includes(normalizedQuery) ||
        (lead.email ?? '').toLowerCase().includes(normalizedQuery)
      )
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export const LeadsInboxPage = () => {
  const navigate = useNavigate()
  const { id: routeId } = useParams<{ id: string }>()
  const { leads, loading, error, updateStatus, addNote, addMessage } = useLeads()
  const { vehicles } = useVehicles()
  const { showToast } = useToast()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')

  const filteredLeads = useMemo(() => filterLeads(leads, query, statusFilter), [leads, query, statusFilter])

  const selectedLead = useMemo<Lead | null>(() => {
    if (routeId) return leads.find((lead) => lead.id === routeId) ?? null
    return filteredLeads[0] ?? null
  }, [routeId, leads, filteredLeads])

  useEffect(() => {
    if (loading) return
    if (!routeId && selectedLead) {
      navigate(paths.leadDetail(selectedLead.id), { replace: true })
    }
  }, [loading, routeId, selectedLead, navigate])

  if (loading) return <LoadingState message='Cargando bandeja de leads…' />
  if (error) return <Alert severity='error'>{error.message}</Alert>

  const selectedVehicle = selectedLead ? vehicles.find((vehicle) => vehicle.id === selectedLead.vehicleId) ?? null : null

  const handleSelect = (lead: Lead) => {
    navigate(paths.leadDetail(lead.id))
  }

  const handleSendMessage = async (content: string) => {
    if (!selectedLead) return
    try {
      await addMessage(selectedLead.id, { author: 'dealer', content })
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  const handleAddNote = async (content: string) => {
    if (!selectedLead) return
    try {
      await addNote(selectedLead.id, content)
      showToast('Nota añadida')
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  const handleChangeStatus = async (status: LeadStatus) => {
    if (!selectedLead) return
    try {
      await updateStatus(selectedLead.id, status)
      showToast('Estado actualizado')
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  return (
    <Box>
      <PageHeader title='Leads' subtitle='Bandeja unificada de conversaciones y oportunidades' />
      <Paper sx={{ overflow: 'hidden' }}>
        <Stack direction='row' sx={{ height: { xs: 'auto', md: 'calc(100vh - 220px)' } }}>
          <Box
            sx={{
              width: { xs: '100%', md: 320 },
              borderRight: { md: '1px solid' },
              borderColor: { md: 'divider' },
              display: { xs: selectedLead ? 'none' : 'block', md: 'block' },
              height: '100%'
            }}
          >
            <LeadInbox
              leads={filteredLeads}
              vehicles={vehicles}
              selectedId={selectedLead?.id}
              query={query}
              statusFilter={statusFilter}
              onQueryChange={setQuery}
              onStatusChange={setStatusFilter}
              onSelect={handleSelect}
            />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {selectedLead ? (
              <LeadConversation lead={selectedLead} onSendMessage={handleSendMessage} />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, p: 4 }}>
                <Typography color='text.secondary' textAlign='center'>
                  Selecciona un lead para ver la conversación.
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 340,
              borderLeft: '1px solid',
              borderColor: 'divider',
              display: { xs: 'none', lg: 'block' },
              height: '100%'
            }}
          >
            {selectedLead ? (
              <LeadSidePanel
                lead={selectedLead}
                vehicle={selectedVehicle}
                onChangeStatus={handleChangeStatus}
                onAddNote={handleAddNote}
              />
            ) : null}
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}
