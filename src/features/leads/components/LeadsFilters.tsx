import { Box, InputAdornment, MenuItem, Stack, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import type { Vehicle } from '@/shared/types'
import { LEAD_STATUS_FILTER_OPTIONS } from '@/modules/leads/constants/leadStatus'
import { LEAD_SORT_OPTIONS, type LeadSortOption } from '../utils/sortLeads'
import { formatVehicleLabel } from '../utils/vehicleLabel'

export interface LeadsFiltersState {
  search: string
  status: string
  vehicleId: string
  dateFrom: string
  dateTo: string
  sort: LeadSortOption
}

interface LeadsFiltersProps {
  value: LeadsFiltersState
  vehicles: Vehicle[]
  onChange: (next: LeadsFiltersState) => void
}

export const LeadsFilters = ({ value, vehicles, onChange }: LeadsFiltersProps) => {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ mb: 3 }}
      useFlexGap
      flexWrap='wrap'
      component='section'
      aria-label='Filtros de leads'
    >
      <Box sx={{ flexGrow: 1, minWidth: 220 }}>
        <TextField
          fullWidth
          placeholder='Buscar por nombre, teléfono o vehículo'
          value={value.search}
          onChange={(event) => onChange({ ...value, search: event.target.value })}
          inputProps={{ 'aria-label': 'Buscar leads' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon fontSize='small' color='action' />
              </InputAdornment>
            )
          }}
        />
      </Box>
      <TextField
        select
        label='Estado'
        value={value.status}
        onChange={(event) => onChange({ ...value, status: event.target.value })}
        sx={{ minWidth: 160 }}
        inputProps={{ 'aria-label': 'Filtrar por estado' }}
      >
        {LEAD_STATUS_FILTER_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label='Vehículo'
        value={value.vehicleId}
        onChange={(event) => onChange({ ...value, vehicleId: event.target.value })}
        sx={{ minWidth: 200 }}
        inputProps={{ 'aria-label': 'Filtrar por vehículo' }}
      >
        <MenuItem value=''>Todos</MenuItem>
        {vehicles.map((vehicle) => (
          <MenuItem key={vehicle.id} value={vehicle.id}>
            {formatVehicleLabel(vehicle, vehicle.id)}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label='Desde'
        type='date'
        value={value.dateFrom}
        onChange={(event) => onChange({ ...value, dateFrom: event.target.value })}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 160 }}
        inputProps={{ 'aria-label': 'Fecha desde' }}
      />
      <TextField
        label='Hasta'
        type='date'
        value={value.dateTo}
        onChange={(event) => onChange({ ...value, dateTo: event.target.value })}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 160 }}
        inputProps={{ 'aria-label': 'Fecha hasta' }}
      />
      <TextField
        select
        label='Ordenar por'
        value={value.sort}
        onChange={(event) => onChange({ ...value, sort: event.target.value as LeadSortOption })}
        sx={{ minWidth: 180 }}
        inputProps={{ 'aria-label': 'Ordenar leads' }}
      >
        {LEAD_SORT_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  )
}
