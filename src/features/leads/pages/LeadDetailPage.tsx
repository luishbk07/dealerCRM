import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Grid from '@mui/material/Grid2'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LEAD_SENDER_DEALER } from '@/shared/types'
import { ConfirmDialog, EmptyState, LoadingState, PageHeader } from '@/shared/components'
import { useToast } from '@/shared/hooks/useToast'
import type { LeadStatus } from '@/modules/leads/types'
import { paths } from '@/app/routes/paths'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import { useVehicle } from '@/features/vehicles/hooks/useVehicle'
import { LeadActivityTimeline } from '../components/LeadActivityTimeline'
import { LeadConversation } from '../components/LeadConversation'
import { LeadDetailInfo } from '../components/LeadDetailInfo'
import { LeadEditDialog, type LeadEditFormValues } from '../components/LeadEditDialog'
import { LeadNotesSection } from '../components/LeadNotesSection'
import { useLead } from '../hooks/useLead'
import { useLeadMutations } from '../hooks/useLeadMutations'
import { buildLeadActivity } from '../utils/buildLeadActivity'

const VEHICLE_FETCH_SIZE = 500

export const LeadDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { showToast } = useToast()
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const leadQuery = useLead(id)
  const detail = leadQuery.data ?? null
  const lead = detail?.lead ?? null

  const vehicleQuery = useVehicle(lead?.vehicleId ?? undefined)
  const vehicle = vehicleQuery.data ?? null

  const vehiclesQuery = useVehicles({
    page: 0,
    pageSize: VEHICLE_FETCH_SIZE,
    status: null,
    brand: null,
    yearMin: null,
    yearMax: null,
    priceMin: null,
    priceMax: null,
    search: null
  })
  const vehicles = vehiclesQuery.data?.items ?? []

  const { updateStatus, addNote, addMessage, updateLead, deleteLead } = useLeadMutations()

  const activityEvents = useMemo(() => {
    if (!lead) return []
    return buildLeadActivity(lead, detail?.notes ?? [], detail?.messages ?? [])
  }, [lead, detail?.notes, detail?.messages])

  if (leadQuery.isLoading) {
    return <LoadingState message='Cargando detalle del lead…' />
  }

  if (leadQuery.isError) {
    return (
      <Box>
        <PageHeader title='Lead' />
        <Alert severity='error'>No fue posible cargar el lead.</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(paths.leads)} sx={{ mt: 2 }}>
          Volver a leads
        </Button>
      </Box>
    )
  }

  if (!lead) {
    return (
      <Box>
        <PageHeader title='Lead' />
        <EmptyState
          title='Lead no encontrado'
          description='El lead que buscas no existe o ya no está disponible.'
          action={
            <Button variant='contained' startIcon={<ArrowBackIcon />} onClick={() => navigate(paths.leads)}>
              Volver a leads
            </Button>
          }
        />
      </Box>
    )
  }

  const handleChangeStatus = async (status: LeadStatus) => {
    setUpdatingStatus(true)
    try {
      await updateStatus.mutateAsync({ leadId: lead.id, status })
      showToast('Estado actualizado')
    } catch {
      showToast('No fue posible actualizar el estado.', 'error')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleAddNote = async (content: string) => {
    try {
      await addNote.mutateAsync({ leadId: lead.id, note: content })
      showToast('Nota añadida')
    } catch {
      showToast('No fue posible añadir la nota.', 'error')
    }
  }

  const handleSendMessage = async (content: string) => {
    try {
      await addMessage.mutateAsync({ leadId: lead.id, sender: LEAD_SENDER_DEALER, message: content })
      showToast('Mensaje enviado')
    } catch {
      showToast('No fue posible enviar el mensaje.', 'error')
    }
  }

  const handleEditLead = async (values: LeadEditFormValues) => {
    try {
      await updateLead.mutateAsync({
        leadId: lead.id,
        current: lead,
        input: {
          name: values.name.trim(),
          phone: values.phone.trim(),
          vehicleId: values.vehicleId || null,
          source: values.source,
          status: values.status,
          message: values.message.trim() || null
        }
      })
      setEditOpen(false)
      showToast('Lead actualizado correctamente')
    } catch {
      showToast('No fue posible actualizar el lead.', 'error')
    }
  }

  const handleDeleteLead = async () => {
    try {
      await deleteLead.mutateAsync(lead.id)
      setDeleteOpen(false)
      showToast('Lead eliminado')
      navigate(paths.leads)
    } catch {
      showToast('No fue posible eliminar el lead.', 'error')
    }
  }

  return (
    <Box>
      <PageHeader
        title={lead.name ?? 'Lead sin nombre'}
        subtitle='Detalle del prospecto'
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap flexWrap='wrap'>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(paths.leads)}
              aria-label='Volver a la lista de leads'
            >
              Volver
            </Button>
            <Button startIcon={<EditOutlinedIcon />} variant='outlined' onClick={() => setEditOpen(true)}>
              Editar
            </Button>
            <Button
              startIcon={<DeleteOutlineIcon />}
              variant='outlined'
              color='error'
              onClick={() => setDeleteOpen(true)}
            >
              Eliminar
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <LeadDetailInfo
            lead={lead}
            vehicle={vehicle}
            updatingStatus={updatingStatus}
            onChangeStatus={handleChangeStatus}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={2.5}>
            <LeadActivityTimeline events={activityEvents} />
            <LeadNotesSection notes={detail?.notes ?? []} onAddNote={handleAddNote} />
            <Card component='section' aria-labelledby='lead-messages-title'>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                  <Typography id='lead-messages-title' variant='subtitle1' component='h2'>
                    Conversación
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Mensajes con el prospecto
                  </Typography>
                </Box>
                <Box sx={{ height: { xs: 420, md: 520 } }}>
                  <LeadConversation
                    lead={lead}
                    messages={detail?.messages ?? []}
                    onSendMessage={handleSendMessage}
                  />
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <LeadEditDialog
        open={editOpen}
        lead={lead}
        vehicles={vehicles}
        loading={updateLead.isPending}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditLead}
      />

      <ConfirmDialog
        open={deleteOpen}
        title='Eliminar lead'
        description='Esta acción no puede deshacerse.'
        confirmLabel='Eliminar'
        cancelLabel='Cancelar'
        destructive
        onConfirm={() => void handleDeleteLead()}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  )
}
