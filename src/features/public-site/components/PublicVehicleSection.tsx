import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import type { ReactNode } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined'
import { formatCurrency, formatNumber } from '@/shared/utils/format'
import type { PublicVehicleFiltersState, PublicVehicleSort } from '../types'

interface PublicVehicleFiltersProps {
  value: PublicVehicleFiltersState
  onChange: (next: PublicVehicleFiltersState) => void
}

const SORT_OPTIONS: { value: PublicVehicleSort, label: string }[] = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' }
]

const TRANSMISSION_OPTIONS = ['Manual', 'Automática', 'CVT', 'Secuencial']
const FUEL_OPTIONS = ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'GLP']

export const PublicVehicleFilters = ({ value, onChange }: PublicVehicleFiltersProps) => {
  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <TextField
        fullWidth
        placeholder='Buscar por marca, modelo o año'
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

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} useFlexGap flexWrap='wrap'>
        <TextField
          label='Precio mínimo'
          type='number'
          value={value.priceMin}
          onChange={(event) => onChange({ ...value, priceMin: event.target.value })}
          sx={{ minWidth: 140, flex: 1 }}
        />
        <TextField
          label='Precio máximo'
          type='number'
          value={value.priceMax}
          onChange={(event) => onChange({ ...value, priceMax: event.target.value })}
          sx={{ minWidth: 140, flex: 1 }}
        />
        <TextField
          label='Marca'
          value={value.brand}
          onChange={(event) => onChange({ ...value, brand: event.target.value })}
          sx={{ minWidth: 140, flex: 1 }}
        />
        <TextField
          label='Año'
          type='number'
          value={value.year}
          onChange={(event) => onChange({ ...value, year: event.target.value })}
          sx={{ minWidth: 120, flex: 1 }}
        />
        <TextField
          select
          label='Transmisión'
          value={value.transmission}
          onChange={(event) => onChange({ ...value, transmission: event.target.value })}
          sx={{ minWidth: 150, flex: 1 }}
        >
          <MenuItem value=''>Todas</MenuItem>
          {TRANSMISSION_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label='Combustible'
          value={value.fuelType}
          onChange={(event) => onChange({ ...value, fuelType: event.target.value })}
          sx={{ minWidth: 150, flex: 1 }}
        >
          <MenuItem value=''>Todos</MenuItem>
          {FUEL_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label='Ordenar por'
          value={value.sort}
          onChange={(event) => onChange({ ...value, sort: event.target.value as PublicVehicleSort })}
          sx={{ minWidth: 180, flex: 1 }}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  )
}

interface VehicleSpecProps {
  icon: ReactNode
  text: string
}

const VehicleSpec = ({ icon, text }: VehicleSpecProps) => (
  <Stack direction='row' spacing={0.5} alignItems='center' sx={{ color: 'text.secondary' }}>
    {icon}
    <Typography variant='caption'>{text}</Typography>
  </Stack>
)

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/E2E8F0/64748B?text=Sin+imagen'

interface PublicVehicleCardProps {
  brand: string
  model: string
  year: number | null
  price: number | null
  mileage: number | null
  transmission: string | null
  fuelType: string | null
  status: string
  imageUrl: string | null
  onViewDetails: () => void
}

export const PublicVehicleCard = ({
  brand,
  model,
  year,
  price,
  mileage,
  transmission,
  fuelType,
  status,
  imageUrl,
  onViewDetails
}: PublicVehicleCardProps) => {
  const heroImage = imageUrl ?? PLACEHOLDER_IMAGE
  const priceLabel = price !== null && price !== undefined ? formatCurrency(price) : 'Consultar'

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component='img'
          image={heroImage}
          alt={`${brand} ${model}`}
          loading='lazy'
          sx={{ aspectRatio: '16 / 10', objectFit: 'cover' }}
        />
        <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
          <Chip label={status === 'active' ? 'Disponible' : status} size='small' color='success' />
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box>
          <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
            {brand} {model}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {year ?? '—'}
          </Typography>
        </Box>
        <Typography variant='h5' color='primary.main'>
          {priceLabel}
        </Typography>
        <Stack direction='row' spacing={1.5} flexWrap='wrap' useFlexGap>
          <VehicleSpec
            icon={<SpeedOutlinedIcon fontSize='inherit' />}
            text={`${formatNumber(mileage)} km`}
          />
          <VehicleSpec icon={<SettingsOutlinedIcon fontSize='inherit' />} text={transmission ?? '—'} />
          <VehicleSpec icon={<LocalGasStationOutlinedIcon fontSize='inherit' />} text={fuelType ?? '—'} />
        </Stack>
        <Button variant='contained' fullWidth onClick={onViewDetails} sx={{ mt: 'auto' }}>
          Ver detalles
        </Button>
      </CardContent>
    </Card>
  )
}
