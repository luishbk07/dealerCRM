import { Box, InputAdornment, MenuItem, Stack, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import type { VehicleStatus } from '@/shared/types'

export interface VehicleFiltersState {
  query: string
  status: VehicleStatus | 'all'
}

interface VehicleFiltersProps {
  value: VehicleFiltersState
  onChange: (next: VehicleFiltersState) => void
}

const STATUS_OPTIONS: { value: VehicleStatus | 'all', label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'available', label: 'Disponibles' },
  { value: 'reserved', label: 'Reservados' },
  { value: 'sold', label: 'Vendidos' }
]

export const VehicleFilters = ({ value, onChange }: VehicleFiltersProps) => {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <TextField
          placeholder='Buscar por marca o modelo'
          value={value.query}
          onChange={(event) => onChange({ ...value, query: event.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon fontSize='small' color='action' />
              </InputAdornment>
            )
          }}
        />
      </Box>
      <Box sx={{ minWidth: { sm: 220 } }}>
        <TextField
          select
          label='Estado'
          value={value.status}
          onChange={(event) => onChange({ ...value, status: event.target.value as VehicleStatus | 'all' })}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Stack>
  )
}
