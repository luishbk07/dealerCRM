import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { PendingLeadTask } from '@/shared/types'
import { formatDateTime } from '@/shared/utils/format'
import { paths } from '@/app/routes/paths'
import { getLeadTaskStatus, LEAD_TASK_STATUS_LABELS } from '@/features/leads/utils/leadTaskUtils'

interface PendingFollowUpsCardProps {
  tasks: PendingLeadTask[]
  isLoading?: boolean
  isError?: boolean
}

const STATUS_COLORS = {
  pending: 'warning',
  overdue: 'error',
  completed: 'success'
} as const

export const PendingFollowUpsCard = ({ tasks, isLoading, isError }: PendingFollowUpsCardProps) => {
  const navigate = useNavigate()

  const renderBody = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      )
    }

    if (isError) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity='warning' sx={{ borderRadius: 2 }}>
            No pudimos cargar los seguimientos pendientes.
          </Alert>
        </Box>
      )
    }

    if (tasks.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='body2' color='text.secondary'>
            No hay seguimientos pendientes.
          </Typography>
        </Box>
      )
    }

    return (
      <List sx={{ p: 0 }}>
        {tasks.map((task, index) => {
          const status = getLeadTaskStatus(task)
          return (
            <Box key={task.id}>
              <ListItemButton
                onClick={() => navigate(paths.leadDetail(task.leadId))}
                sx={{ py: 1.75, px: 3 }}
              >
                <ListItemText
                  primary={
                    <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={1}>
                      <Typography variant='subtitle2' sx={{ fontWeight: 600 }} noWrap>
                        {task.leadName ?? 'Lead sin nombre'}
                      </Typography>
                      <Chip
                        label={LEAD_TASK_STATUS_LABELS[status]}
                        size='small'
                        color={STATUS_COLORS[status]}
                      />
                    </Stack>
                  }
                  secondary={
                    <Stack spacing={0.5} sx={{ mt: 0.75 }}>
                      <Typography variant='body2' color='text.secondary' noWrap>
                        {task.title}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Vence: {formatDateTime(task.dueAt)}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItemButton>
              {index < tasks.length - 1 ? <Divider component='li' /> : null}
            </Box>
          )
        })}
      </List>
    )
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant='h5'>Seguimientos pendientes</Typography>
          <Typography variant='body2' color='text.secondary'>
            Próximos recordatorios de contacto
          </Typography>
        </Box>
        <Divider />
        {renderBody()}
      </CardContent>
    </Card>
  )
}
