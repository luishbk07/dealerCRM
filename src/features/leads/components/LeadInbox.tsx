import { Avatar, Box, Divider, InputAdornment, List, ListItemButton, ListItemAvatar, ListItemText, MenuItem, Stack, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import type { Lead, LeadStatus, Vehicle } from '@/shared/types'
import { StatusChip } from '@/shared/components'
import { formatRelative } from '@/shared/utils/format'

const STATUS_FILTERS: { value: LeadStatus | 'all', label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'new', label: 'Nuevos' },
  { value: 'contacted', label: 'Contactados' },
  { value: 'negotiating', label: 'Negociando' },
  { value: 'sold', label: 'Vendidos' },
  { value: 'lost', label: 'Perdidos' }
]

const buildInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

interface LeadInboxProps {
  leads: Lead[]
  vehicles: Vehicle[]
  selectedId?: string
  query: string
  statusFilter: LeadStatus | 'all'
  onQueryChange: (query: string) => void
  onStatusChange: (status: LeadStatus | 'all') => void
  onSelect: (lead: Lead) => void
}

export const LeadInbox = ({
  leads,
  vehicles,
  selectedId,
  query,
  statusFilter,
  onQueryChange,
  onStatusChange,
  onSelect
}: LeadInboxProps) => {
  const vehiclesById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]))

  return (
    <Stack sx={{ height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={1.5}>
          <TextField
            placeholder='Buscar por nombre o teléfono'
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon fontSize='small' color='action' />
                </InputAdornment>
              )
            }}
          />
          <TextField
            select
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value as LeadStatus | 'all')}
          >
            {STATUS_FILTERS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {leads.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant='body2' color='text.secondary'>
              No hay leads que coincidan con los filtros.
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {leads.map((lead, index) => {
              const vehicle = vehiclesById.get(lead.vehicleId)
              const isSelected = lead.id === selectedId
              return (
                <Box key={lead.id}>
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => onSelect(lead)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderLeft: '3px solid',
                      borderLeftColor: isSelected ? 'primary.main' : 'transparent'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>{buildInitials(lead.fullName)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                          <Typography variant='subtitle2' noWrap>
                            {lead.fullName}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {formatRelative(lead.updatedAt)}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                          <Typography variant='body2' color='text.secondary' noWrap>
                            {vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : 'Vehículo no disponible'}
                          </Typography>
                          <Box>
                            <StatusChip status={lead.status} />
                          </Box>
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
      </Box>
    </Stack>
  )
}
