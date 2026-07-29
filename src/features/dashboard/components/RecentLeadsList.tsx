import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { Lead, Vehicle } from '@/shared/types'
import { StatusChip } from '@/shared/components'
import { formatRelative } from '@/shared/utils/format'
import { paths } from '@/app/routes/paths'
import { withListReturn } from '@/shared/utils/listNavigation'
import { formatVehicleLabel } from '@/features/leads/utils/vehicleLabel'

interface RecentLeadsListProps {
  leads: Lead[]
  vehicleById: Map<string, Vehicle>
  totalLeads: number
  isLoading?: boolean
  isError?: boolean
}

const buildInitials = (name: string | null): string => {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const LoadingBody = () => (
  <Stack spacing={1.5} sx={{ p: 3 }}>
    {Array.from({ length: 4 }).map((_, index) => (
      <Stack key={index} direction='row' spacing={1.5} alignItems='center'>
        <Skeleton variant='circular' width={40} height={40} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant='text' width='70%' height={20} />
          <Skeleton variant='text' width='50%' height={16} />
        </Box>
      </Stack>
    ))}
  </Stack>
)

export const RecentLeadsList = ({ leads, vehicleById, totalLeads, isLoading, isError }: RecentLeadsListProps) => {
  const navigate = useNavigate()

  const renderBody = () => {
    if (isLoading) return <LoadingBody />

    if (isError) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity='warning' sx={{ borderRadius: 2 }}>
            No se pudo cargar la información.
          </Alert>
        </Box>
      )
    }

    if (leads.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='body2' color='text.secondary' sx={{ mb: totalLeads === 0 ? 2 : 0 }}>
            {totalLeads === 0 ? 'Todavía no tienes leads.' : 'No hay leads recientes.'}
          </Typography>
          {totalLeads === 0 ? (
            <Button
              variant='outlined'
              size='small'
              onClick={() => navigate(paths.leads)}
              aria-label='Ir a leads'
            >
              Crea tu primer lead
            </Button>
          ) : null}
        </Box>
      )
    }

    return (
      <List sx={{ p: 0 }}>
        {leads.map((lead, index) => {
          const vehicle = lead.vehicleId ? vehicleById.get(lead.vehicleId) : undefined
          const vehicleLabel = formatVehicleLabel(vehicle, lead.vehicleId)

          return (
            <Box key={lead.id}>
              <ListItemButton
                onClick={() => navigate(paths.leadDetail(lead.id), withListReturn(paths.dashboard))}
                sx={{
                  py: 1.75,
                  px: 3,
                  transition: 'background-color 0.15s ease'
                }}
                aria-label={`Ver lead ${lead.name ?? 'sin nombre'}`}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 600 }}>
                    {buildInitials(lead.name)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack
                      direction='row'
                      justifyContent='space-between'
                      alignItems='center'
                      spacing={1}
                    >
                      <Typography variant='subtitle2' noWrap sx={{ fontWeight: 600 }}>
                        {lead.name ?? 'Lead sin nombre'}
                      </Typography>
                      <Typography variant='caption' color='text.secondary' sx={{ flexShrink: 0 }}>
                        {formatRelative(lead.createdAt)}
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Stack spacing={0.75} sx={{ mt: 0.75 }}>
                      <Typography variant='body2' color='text.secondary' noWrap>
                        {lead.phone ?? 'Sin teléfono'}
                      </Typography>
                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        alignItems='center'
                        spacing={1}
                      >
                        <Typography variant='caption' color='text.secondary' noWrap>
                          {vehicleLabel}
                        </Typography>
                        <StatusChip status={lead.status} />
                      </Stack>
                    </Stack>
                  }
                />
              </ListItemButton>
              {index < leads.length - 1 ? <Divider component='li' /> : null}
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
          <Typography variant='h5' component='h2'>
            Leads recientes
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Los últimos 5 prospectos registrados
          </Typography>
        </Box>
        <Divider />
        {renderBody()}
      </CardContent>
    </Card>
  )
}
