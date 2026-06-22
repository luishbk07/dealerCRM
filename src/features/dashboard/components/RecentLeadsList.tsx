import { Avatar, Box, Card, CardContent, Divider, List, ListItemButton, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { Lead, Vehicle } from '@/shared/types'
import { StatusChip } from '@/shared/components'
import { formatRelative } from '@/shared/utils/format'
import { paths } from '@/app/routes/paths'

interface RecentLeadsListProps {
  leads: Lead[]
  vehicles: Vehicle[]
}

const buildVehicleLabel = (vehicle?: Vehicle): string => {
  if (!vehicle) return 'Vehículo no disponible'
  return `${vehicle.brand} ${vehicle.model} ${vehicle.year}`
}

const buildInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const RecentLeadsList = ({ leads, vehicles }: RecentLeadsListProps) => {
  const navigate = useNavigate()
  const vehiclesById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]))

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant='h5'>Leads recientes</Typography>
          <Typography variant='body2' color='text.secondary'>
            Conversaciones que requieren tu atención
          </Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {leads.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                Aún no hay leads. ¡Comparte tu inventario en redes sociales para empezar!
              </Typography>
            </Box>
          ) : null}
          {leads.map((lead, index) => (
            <Box key={lead.id}>
              <ListItemButton
                onClick={() => navigate(paths.leadDetail(lead.id))}
                sx={{ py: 1.75, px: 3 }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>{buildInitials(lead.fullName)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={1}>
                      <Typography variant='subtitle2'>{lead.fullName}</Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {formatRelative(lead.updatedAt)}
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={1} sx={{ mt: 0.5 }}>
                      <Typography variant='body2' color='text.secondary' noWrap>
                        {buildVehicleLabel(vehiclesById.get(lead.vehicleId))}
                      </Typography>
                      <StatusChip status={lead.status} />
                    </Stack>
                  }
                />
              </ListItemButton>
              {index < leads.length - 1 ? <Divider component='li' /> : null}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
