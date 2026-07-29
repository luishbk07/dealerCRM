import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Grid from '@mui/material/Grid2'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { LEAD_SENDER_DEALER } from '@/shared/types'
import { ConfirmDialog, DetailPageSkeleton, EmptyState, ErrorAlert, PageHeader } from '@/shared/components'
import { useToast } from '@/shared/hooks/useToast'
import { USER_MESSAGES, getUserFriendlyError } from '@/shared/utils/userMessages'
import { getReturnPath } from '@/shared/utils/listNavigation'
import { LEAD_STATUS_SOLD } from '@/modules/leads/constants/leadStatus'
import type { LeadStatus, LeadTask } from '@/modules/leads/types'
import { getSaleUserMessage } from '@/modules/sales'
import { paths } from '@/app/routes/paths'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import { useVehicle } from '@/features/vehicles/hooks/useVehicle'
import { LeadActivityTimeline } from '../components/LeadActivityTimeline'
import { LeadConversation } from '../components/LeadConversation'
import { LeadDetailInfo } from '../components/LeadDetailInfo'
import { LeadEditDialog, type LeadEditFormValues } from '../components/LeadEditDialog'
import { LeadNotesSection } from '../components/LeadNotesSection'
import { LeadTasksSection } from '../components/LeadTasksSection'
import { useLead } from '../hooks/useLead'
import { useLeadMutations } from '../hooks/useLeadMutations'
import { useLeadTaskMutations } from '../hooks/useLeadTaskMutations'
import { buildLeadActivity } from '../utils/buildLeadActivity'
import { useAuth } from '@/features/auth/context/AuthContext'

const VEHICLE_FETCH_SIZE = 500

export const LeadDetailPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const { showToast } = useToast()
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmSoldOpen, setConfirmSoldOpen] = useState(false)
  const [pendingEditValues, setPendingEditValues] = useState<LeadEditFormValues | null>(null)

  const returnPath = getReturnPath(location.state, paths.leads)
  const { dealer } = useAuth()
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
  const { createTask, completeTask, deleteTask } = useLeadTaskMutations()

  const activityEvents = useMemo(() => {
    if (!lead) return []
    return buildLeadActivity(lead, detail?.notes ?? [], detail?.messages ?? [])
  }, [lead, detail?.notes, detail?.messages])

  if (leadQuery.isLoading) {
    return <DetailPageSkeleton />
  }

  if (leadQuery.isError) {
    return (
      <Box>
        <PageHeader title='Lead' />
        <ErrorAlert error={leadQuery.error} onRetry={() => void leadQuery.refetch()} />
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(returnPath)}
          sx={{ mt: 2 }}
          aria-label='Volver a leads'
        >
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
            <Button
              variant='contained'
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(returnPath)}
              aria-label='Volver a leads'
            >
              Volver a leads
            </Button>
          }
        />
      </Box>
    )
  }

  const handleChangeStatus = async (status: LeadStatus) => {
    if (status === lead.status) return
    if (status === LEAD_STATUS_SOLD && lead.status !== LEAD_STATUS_SOLD) {
      setConfirmSoldOpen(true)
      return
    }
    await applyStatusChange(status)
  }

  const applyStatusChange = async (status: LeadStatus) => {
    setUpdatingStatus(true)
    try {
      await updateStatus.mutateAsync({ leadId: lead.id, status })
      if (status === LEAD_STATUS_SOLD) {
        showToast(USER_MESSAGES.saleRegistered)
      } else {
        showToast(USER_MESSAGES.leadUpdated)
      }
    } catch (error) {
      if (status === LEAD_STATUS_SOLD) {
        showToast(getSaleUserMessage(error), 'error')
      } else {
        showToast(getUserFriendlyError(error, USER_MESSAGES.saveFailed), 'error')
      }
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleAddNote = async (content: string) => {
    try {
      await addNote.mutateAsync({ leadId: lead.id, note: content })
      showToast('Nota añadida correctamente.')
    } catch (err) {
      showToast(getUserFriendlyError(err, USER_MESSAGES.saveFailed), 'error')
    }
  }

  const handleSendMessage = async (content: string) => {
    try {
      await addMessage.mutateAsync({ leadId: lead.id, sender: LEAD_SENDER_DEALER, message: content })
      showToast('Mensaje enviado correctamente.')
    } catch (err) {
      showToast(getUserFriendlyError(err, USER_MESSAGES.saveFailed), 'error')
    }
  }

  const handleEditLead = async (values: LeadEditFormValues) => {
    const convertingToSold = values.status === LEAD_STATUS_SOLD && lead.status !== LEAD_STATUS_SOLD
    if (convertingToSold) {
      setPendingEditValues(values)
      setConfirmSoldOpen(true)
      return
    }
    await applyEditLead(values)
  }

  const applyEditLead = async (values: LeadEditFormValues) => {
    const convertingToSold = values.status === LEAD_STATUS_SOLD && lead.status !== LEAD_STATUS_SOLD
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
      setPendingEditValues(null)
      if (convertingToSold) {
        showToast(USER_MESSAGES.saleRegistered)
      } else {
        showToast(USER_MESSAGES.leadUpdated)
      }
    } catch (error) {
      if (convertingToSold) {
        showToast(getSaleUserMessage(error), 'error')
      } else {
        showToast(getUserFriendlyError(error, USER_MESSAGES.saveFailed), 'error')
      }
    }
  }

  const handleCreateTask = async (input: { title: string, dueAt: string, notes: string | null }) => {
    if (!dealer?.id) {
      showToast(getUserFriendlyError(null, USER_MESSAGES.saveFailed), 'error')
      throw new Error('dealer missing')
    }
    try {
      await createTask.mutateAsync({
        dealerId: dealer.id,
        leadId: lead.id,
        title: input.title,
        dueAt: input.dueAt,
        notes: input.notes
      })
      showToast(USER_MESSAGES.taskCreated)
    } catch (err) {
      showToast(getUserFriendlyError(err, USER_MESSAGES.saveFailed), 'error')
      throw new Error('create task failed')
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask.mutateAsync({ leadId: lead.id, taskId })
      showToast(USER_MESSAGES.taskCompleted)
    } catch (err) {
      showToast(getUserFriendlyError(err, USER_MESSAGES.saveFailed), 'error')
      throw new Error('complete task failed')
    }
  }

  const handleDeleteTask = async (task: LeadTask) => {
    try {
      await deleteTask.mutateAsync({ leadId: lead.id, task })
      showToast(USER_MESSAGES.taskDeleted)
    } catch (err) {
      showToast(getUserFriendlyError(err, USER_MESSAGES.deleteFailed), 'error')
      throw new Error('delete task failed')
    }
  }

  const handleDeleteLead = async () => {
    setDeleting(true)
    try {
      await deleteLead.mutateAsync(lead.id)
      setDeleteOpen(false)
      showToast(USER_MESSAGES.leadDeleted)
      navigate(returnPath)
    } catch (err) {
      showToast(getUserFriendlyError(err, USER_MESSAGES.deleteFailed), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const isBusy = updatingStatus || deleting || updateLead.isPending || deleteLead.isPending

  return (
    <Box>
      <PageHeader
        title={lead.name ?? 'Lead sin nombre'}
        subtitle='Detalle del prospecto'
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap flexWrap='wrap'>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(returnPath)}
              aria-label='Volver a la lista de leads'
            >
              Volver
            </Button>
            <Button
              startIcon={<EditOutlinedIcon />}
              variant='outlined'
              onClick={() => setEditOpen(true)}
              disabled={isBusy}
              aria-label='Editar lead'
            >
              Editar
            </Button>
            <Button
              startIcon={<DeleteOutlineIcon />}
              variant='outlined'
              color='error'
              onClick={() => setDeleteOpen(true)}
              disabled={isBusy}
              aria-label='Eliminar lead'
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
            <LeadTasksSection
              tasks={detail?.tasks ?? []}
              onCreateTask={handleCreateTask}
              onCompleteTask={handleCompleteTask}
              onDeleteTask={handleDeleteTask}
            />
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
        open={confirmSoldOpen}
        title='Registrar venta'
        description='Al marcar este lead como vendido se registrará una venta. ¿Deseas continuar?'
        confirmLabel='Registrar venta'
        confirmLoading={updatingStatus || updateLead.isPending}
        onConfirm={() => {
          setConfirmSoldOpen(false)
          if (pendingEditValues) {
            void applyEditLead(pendingEditValues)
            return
          }
          void applyStatusChange(LEAD_STATUS_SOLD)
        }}
        onCancel={() => {
          if (updatingStatus || updateLead.isPending) return
          setConfirmSoldOpen(false)
          setPendingEditValues(null)
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        title='Eliminar lead'
        description='Esta acción no puede deshacerse.'
        confirmLabel='Eliminar'
        cancelLabel='Cancelar'
        destructive
        confirmLoading={deleting}
        onConfirm={() => void handleDeleteLead()}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  )
}
