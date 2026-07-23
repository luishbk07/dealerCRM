import { Avatar, Box, Divider, InputAdornment, List, ListItemButton, ListItemAvatar, ListItemText, MenuItem, Stack, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import type { Lead } from '@/shared/types'
import { StatusChip } from '@/shared/components'
import { formatRelative } from '@/shared/utils/format'

import { LEAD_STATUS_FILTER_OPTIONS } from '@/modules/leads/constants/leadStatus'

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

interface LeadInboxProps {
  leads: Lead[]
  selectedId?: string
  query: string
  statusFilter: string
  loading?: boolean
  onQueryChange: (query: string) => void
  onStatusChange: (status: string) => void
  onSelect: (lead: Lead) => void
}

export const LeadInbox = ({
  leads,
  selectedId,
  query,
  statusFilter,
  loading,
  onQueryChange,
  onStatusChange,
  onSelect
}: LeadInboxProps) => {
  return (
    <Stack sx={{ height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={1.5}>
          <TextField
            placeholder='Buscar por nombre, teléfono o mensaje'
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
            onChange={(event) => onStatusChange(event.target.value)}
          >
            {LEAD_STATUS_FILTER_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', opacity: loading ? 0.6 : 1, transition: 'opacity 120ms ease' }}>
        {leads.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant='body2' color='text.secondary'>
              No hay leads que coincidan con los filtros.
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {leads.map((lead, index) => {
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
                      <Avatar sx={{ bgcolor: 'primary.light' }}>{buildInitials(lead.name)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
                          <Typography variant='subtitle2' noWrap>
                            {lead.name ?? 'Sin nombre'}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {formatRelative(lead.lastContactAt ?? lead.createdAt)}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                          <Typography variant='body2' color='text.secondary' noWrap>
                            {lead.phone ?? lead.source ?? 'Sin información'}
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
