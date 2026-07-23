import { Box, InputAdornment, MenuItem, Stack, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import type { Vehicle } from '@/shared/types'
import { formatVehicleLabel } from '@/features/leads/utils/vehicleLabel'
import { SALE_SORT_OPTIONS, type SaleSortOption } from '../utils/sortSales'

export interface SalesFiltersState {
  search: string
  vehicleId: string
  dateFrom: string
  dateTo: string
  sort: SaleSortOption
}

interface SalesFiltersProps {
  value: SalesFiltersState
  vehicles: Vehicle[]
  onChange: (next: SalesFiltersState) => void
}

export const SalesFilters = ({ value, vehicles, onChange }: SalesFiltersProps) => {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ mb: 3 }}
      useFlexGap
      flexWrap='wrap'
      component='section'
      aria-label='Filtros de ventas'
    >
      <Box sx={{ flexGrow: 1, minWidth: 220 }}>
        <TextField
          fullWidth
          placeholder='Buscar por comprador, teléfono o vehículo'
          value={value.search}
          onChange={(event) => onChange({ ...value, search: event.target.value })}
          inputProps={{ 'aria-label': 'Buscar ventas' }}
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
        onChange={(event) => onChange({ ...value, sort: event.target.value as SaleSortOption })}
        sx={{ minWidth: 180 }}
        inputProps={{ 'aria-label': 'Ordenar ventas' }}
      >
        {SALE_SORT_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  )
}
