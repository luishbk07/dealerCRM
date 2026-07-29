import { Box, InputAdornment, MenuItem, Stack, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

export interface VehicleFiltersState {
  search: string
  status: string | 'all'
  featured: 'all' | 'featured' | 'not_featured'
  brand: string
  yearMin: string
  yearMax: string
  priceMin: string
  priceMax: string
}

interface VehicleFiltersProps {
  value: VehicleFiltersState
  statusOptions: string[]
  onChange: (next: VehicleFiltersState) => void
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Activos',
  sold: 'Vendidos',
  reserved: 'Reservados',
  inactive: 'Inactivos',
  draft: 'Borradores'
}

const buildStatusLabel = (status: string): string => STATUS_LABELS[status] ?? status

export const VehicleFilters = ({ value, statusOptions, onChange }: VehicleFiltersProps) => {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }} useFlexGap flexWrap='wrap'>
      <Box sx={{ flexGrow: 1, minWidth: 220 }}>
        <TextField
          fullWidth
          placeholder='Buscar marca, modelo, VIN o stock'
          value={value.search}
          onChange={(event) => onChange({ ...value, search: event.target.value })}
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
      >
        <MenuItem value='all'>Todos</MenuItem>
        {statusOptions.map((status) => (
          <MenuItem key={status} value={status}>
            {buildStatusLabel(status)}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label='Destacados'
        value={value.featured}
        onChange={(event) => onChange({ ...value, featured: event.target.value as VehicleFiltersState['featured'] })}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value='all'>Todos</MenuItem>
        <MenuItem value='featured'>Destacados</MenuItem>
        <MenuItem value='not_featured'>No destacados</MenuItem>
      </TextField>
      <TextField
        label='Marca'
        value={value.brand}
        onChange={(event) => onChange({ ...value, brand: event.target.value })}
        sx={{ minWidth: 160 }}
      />
      <TextField
        label='Año mín.'
        type='number'
        value={value.yearMin}
        onChange={(event) => onChange({ ...value, yearMin: event.target.value })}
        sx={{ minWidth: 120 }}
      />
      <TextField
        label='Año máx.'
        type='number'
        value={value.yearMax}
        onChange={(event) => onChange({ ...value, yearMax: event.target.value })}
        sx={{ minWidth: 120 }}
      />
      <TextField
        label='Precio mín.'
        type='number'
        value={value.priceMin}
        onChange={(event) => onChange({ ...value, priceMin: event.target.value })}
        sx={{ minWidth: 140 }}
      />
      <TextField
        label='Precio máx.'
        type='number'
        value={value.priceMax}
        onChange={(event) => onChange({ ...value, priceMax: event.target.value })}
        sx={{ minWidth: 140 }}
      />
    </Stack>
  )
}
