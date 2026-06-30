import { Alert, Box, Pagination, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LEAD_SENDER_DEALER } from '@/shared/types'
import { LoadingState, PageHeader } from '@/shared/components'
import { useToast } from '@/shared/hooks/useToast'
import { paths } from '@/app/routes/paths'
import { useLeads } from '../hooks/useLeads'
import { useLead } from '../hooks/useLead'
import { useLeadMutations } from '../hooks/useLeadMutations'
import { useVehicle } from '@/features/vehicles/hooks/useVehicle'
import { LeadInbox } from '../components/LeadInbox'
import { LeadConversation } from '../components/LeadConversation'
import { LeadSidePanel } from '../components/LeadSidePanel'

const PAGE_SIZE = 20

export const LeadsInboxPage = () => {
  const navigate = useNavigate()
  const { id: routeId } = useParams<{ id: string }>()
  const { showToast } = useToast()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(0)

  const listParams = useMemo(() => ({
    page,
    pageSize: PAGE_SIZE,
    status: statusFilter === 'all' ? null : statusFilter,
    search: query.trim() || null
  }), [page, statusFilter, query])

  const listQuery = useLeads(listParams)
  const leads = listQuery.data?.items ?? []
  const total = listQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const fallbackLeadId = leads[0]?.id
  const activeLeadId = routeId ?? fallbackLeadId
  const leadDetailQuery = useLead(activeLeadId)
  const detail = leadDetailQuery.data ?? null
  const selectedLead = detail?.lead ?? null

  const vehicleQuery = useVehicle(selectedLead?.vehicleId ?? undefined)
  const selectedVehicle = vehicleQuery.data ?? null

  const { updateStatus, addNote, addMessage } = useLeadMutations()

  useEffect(() => {
    if (listQuery.isLoading) return
    if (!routeId && fallbackLeadId) {
      navigate(paths.leadDetail(fallbackLeadId), { replace: true })
    }
  }, [listQuery.isLoading, routeId, fallbackLeadId, navigate])

  if (listQuery.isLoading) return <LoadingState message='Cargando bandeja de leads…' />
  if (listQuery.isError) return <Alert severity='error'>{(listQuery.error as Error).message}</Alert>

  const handleQueryChange = (next: string) => {
    setQuery(next)
    setPage(0)
  }

  const handleStatusChange = (next: string) => {
    setStatusFilter(next)
    setPage(0)
  }

  const handleSendMessage = async (content: string) => {
    if (!selectedLead) return
    try {
      await addMessage.mutateAsync({ leadId: selectedLead.id, sender: LEAD_SENDER_DEALER, message: content })
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  const handleAddNote = async (content: string) => {
    if (!selectedLead) return
    try {
      await addNote.mutateAsync({ leadId: selectedLead.id, note: content })
      showToast('Nota añadida')
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  const handleChangeStatus = async (status: string) => {
    if (!selectedLead) return
    try {
      await updateStatus.mutateAsync({ leadId: selectedLead.id, status })
      showToast('Estado actualizado')
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  return (
    <Box>
      <PageHeader title='Leads' subtitle={`${total} lead${total === 1 ? '' : 's'} en tu bandeja`} />
      <Paper sx={{ overflow: 'hidden' }}>
        <Stack direction='row' sx={{ height: { xs: 'auto', md: 'calc(100vh - 220px)' } }}>
          <Box
            sx={{
              width: { xs: '100%', md: 320 },
              borderRight: { md: '1px solid' },
              borderColor: { md: 'divider' },
              display: { xs: selectedLead ? 'none' : 'flex', md: 'flex' },
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <LeadInbox
              leads={leads}
              selectedId={selectedLead?.id}
              query={query}
              statusFilter={statusFilter}
              loading={listQuery.isFetching}
              onQueryChange={handleQueryChange}
              onStatusChange={handleStatusChange}
              onSelect={(lead) => navigate(paths.leadDetail(lead.id))}
            />
            {totalPages > 1 ? (
              <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  size='small'
                  count={totalPages}
                  page={page + 1}
                  onChange={(_, value) => setPage(value - 1)}
                  color='primary'
                />
              </Box>
            ) : null}
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {selectedLead ? (
              <LeadConversation
                lead={selectedLead}
                messages={detail?.messages ?? []}
                onSendMessage={handleSendMessage}
              />
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
                notes={detail?.notes ?? []}
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
