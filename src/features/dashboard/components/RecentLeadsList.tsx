import {
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
  Stack,
  Typography
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { Lead, Vehicle } from '@/shared/types'
import { StatusChip } from '@/shared/components'
import { formatRelative } from '@/shared/utils/format'
import { paths } from '@/app/routes/paths'
import { formatVehicleLabel } from '@/features/leads/utils/vehicleLabel'

interface RecentLeadsListProps {
  leads: Lead[]
  vehicleById: Map<string, Vehicle>
  totalLeads: number
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

export const RecentLeadsList = ({ leads, vehicleById, totalLeads }: RecentLeadsListProps) => {
  const navigate = useNavigate()

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant='h5'>Leads recientes</Typography>
          <Typography variant='body2' color='text.secondary'>
            Los últimos 5 prospectos registrados
          </Typography>
        </Box>
        <Divider />
        {leads.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant='body2' color='text.secondary' sx={{ mb: totalLeads === 0 ? 2 : 0 }}>
              No hay leads recientes.
            </Typography>
            {totalLeads === 0 ? (
              <Button variant='outlined' size='small' onClick={() => navigate(paths.leads)}>
                Crea tu primer lead
              </Button>
            ) : null}
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {leads.map((lead, index) => {
              const vehicle = lead.vehicleId ? vehicleById.get(lead.vehicleId) : undefined
              const vehicleLabel = formatVehicleLabel(vehicle, lead.vehicleId)

              return (
                <Box key={lead.id}>
                  <ListItemButton
                    onClick={() => navigate(paths.leadDetail(lead.id))}
                    sx={{
                      py: 1.75,
                      px: 3,
                      transition: 'background-color 0.15s ease'
                    }}
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
        )}
      </CardContent>
    </Card>
  )
}
