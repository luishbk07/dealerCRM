import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import { useMemo, useState } from 'react'
import type { LeadTask, LeadTaskFilter } from '@/shared/types'
import { ConfirmDialog } from '@/shared/components'
import { formatDateTime } from '@/shared/utils/format'
import {
  buildDueAtIso,
  defaultTaskDueDate,
  defaultTaskDueTime,
  filterLeadTasks,
  getLeadTaskStatus,
  LEAD_TASK_FILTER_OPTIONS,
  LEAD_TASK_STATUS_LABELS
} from '../utils/leadTaskUtils'

interface LeadTasksSectionProps {
  tasks: LeadTask[]
  onCreateTask: (input: { title: string, dueAt: string, notes: string | null }) => Promise<void>
  onCompleteTask: (taskId: string) => Promise<void>
  onDeleteTask: (task: LeadTask) => Promise<void>
}

const STATUS_COLORS = {
  pending: 'warning',
  overdue: 'error',
  completed: 'success'
} as const

export const LeadTasksSection = ({
  tasks,
  onCreateTask,
  onCompleteTask,
  onDeleteTask
}: LeadTasksSectionProps) => {
  const [filter, setFilter] = useState<LeadTaskFilter>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<LeadTask | null>(null)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState(defaultTaskDueDate)
  const [dueTime, setDueTime] = useState(defaultTaskDueTime())
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [completingId, setCompletingId] = useState<string | null>(null)

  const filteredTasks = useMemo(() => filterLeadTasks(tasks, filter), [tasks, filter])

  const resetForm = () => {
    setTitle('')
    setDueDate(defaultTaskDueDate())
    setDueTime(defaultTaskDueTime())
    setNotes('')
    setFormError(null)
  }

  const handleCreate = async () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setFormError('El título es obligatorio.')
      return
    }
    const dueAt = buildDueAtIso(dueDate, dueTime)
    if (!dueAt) {
      setFormError('La fecha y la hora son obligatorias.')
      return
    }

    setSubmitting(true)
    setFormError(null)
    try {
      await onCreateTask({
        title: trimmedTitle,
        dueAt,
        notes: notes.trim() || null
      })
      setCreateOpen(false)
      resetForm()
    } catch {
      setFormError('No fue posible crear el seguimiento.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleComplete = async (task: LeadTask) => {
    if (task.completed || completingId) return
    setCompletingId(task.id)
    try {
      await onCompleteTask(task.id)
    } finally {
      setCompletingId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await onDeleteTask(deleteTarget)
      setDeleteTarget(null)
    } catch {
      setDeleteTarget(null)
    }
  }

  return (
    <>
      <Card component='section' aria-labelledby='lead-tasks-title'>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent='space-between' spacing={1.5} sx={{ mb: 2 }}>
            <Stack direction='row' spacing={1} alignItems='center'>
              <EventAvailableOutlinedIcon fontSize='small' color='action' aria-hidden />
              <Box>
                <Typography id='lead-tasks-title' variant='subtitle1' component='h2'>
                  Seguimientos
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Recordatorios de contacto con este lead
                </Typography>
              </Box>
            </Stack>
            <Button variant='contained' size='small' startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
              Nuevo seguimiento
            </Button>
          </Stack>

          <TextField
            select
            label='Filtrar'
            value={filter}
            onChange={(event) => setFilter(event.target.value as LeadTaskFilter)}
            size='small'
            sx={{ minWidth: 180, mb: 2 }}
          >
            {LEAD_TASK_FILTER_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {filteredTasks.length === 0 ? (
            <Typography variant='body2' color='text.secondary'>
              No hay seguimientos registrados.
            </Typography>
          ) : (
            <Stack spacing={1.5} divider={<Divider flexItem />}>
              {filteredTasks.map((task) => {
                const status = getLeadTaskStatus(task)
                const isCompleting = completingId === task.id

                return (
                  <Stack
                    key={task.id}
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    alignItems={{ sm: 'center' }}
                    justifyContent='space-between'
                  >
                    <Stack direction='row' spacing={1.5} alignItems='flex-start' sx={{ minWidth: 0, flex: 1 }}>
                      <Checkbox
                        checked={task.completed}
                        disabled={task.completed || isCompleting}
                        onChange={() => void handleComplete(task)}
                        inputProps={{ 'aria-label': `Completar ${task.title}` }}
                        sx={{ mt: -0.5 }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap' useFlexGap>
                          <Typography
                            variant='subtitle2'
                            sx={{
                              fontWeight: 600,
                              textDecoration: task.completed ? 'line-through' : 'none'
                            }}
                          >
                            {task.title}
                          </Typography>
                          <Chip
                            label={LEAD_TASK_STATUS_LABELS[status]}
                            size='small'
                            color={STATUS_COLORS[status]}
                            variant={status === 'completed' ? 'outlined' : 'filled'}
                          />
                        </Stack>
                        <Typography variant='caption' color='text.secondary' display='block' sx={{ mt: 0.5 }}>
                          Vence: {formatDateTime(task.dueAt)}
                        </Typography>
                        {task.notes ? (
                          <Typography variant='body2' color='text.secondary' sx={{ mt: 0.75, whiteSpace: 'pre-wrap' }}>
                            {task.notes}
                          </Typography>
                        ) : null}
                      </Box>
                    </Stack>

                    <Stack direction='row' spacing={1} alignItems='center'>
                      {!task.completed ? (
                        <Button
                          size='small'
                          variant='outlined'
                          onClick={() => void handleComplete(task)}
                          disabled={isCompleting}
                        >
                          Completar
                        </Button>
                      ) : null}
                      <IconButton
                        size='small'
                        color='error'
                        aria-label='Eliminar seguimiento'
                        onClick={() => setDeleteTarget(task)}
                      >
                        <DeleteOutlineIcon fontSize='small' />
                      </IconButton>
                    </Stack>
                  </Stack>
                )
              })}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onClose={() => !submitting && setCreateOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Nuevo seguimiento</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label='Título'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              fullWidth
              autoFocus
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label='Fecha'
                type='date'
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label='Hora'
                type='time'
                value={dueTime}
                onChange={(event) => setDueTime(event.target.value)}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <TextField
              label='Notas'
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              multiline
              minRows={3}
              fullWidth
            />
            {formError ? (
              <Typography variant='body2' color='error'>
                {formError}
              </Typography>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCreateOpen(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant='contained' onClick={() => void handleCreate()} disabled={submitting}>
            {submitting ? 'Guardando…' : 'Crear seguimiento'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        title='Eliminar seguimiento'
        description='¿Eliminar este seguimiento?'
        confirmLabel='Eliminar'
        destructive
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
