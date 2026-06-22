import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, Stack, Typography } from '@mui/material'
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined'
import type { Vehicle } from '@/shared/types'
import { StatusChip } from '@/shared/components'
import { formatCurrency, formatNumber } from '@/shared/utils/format'

const FUEL_LABEL: Record<Vehicle['fuelType'], string> = {
  gasoline: 'Gasolina',
  diesel: 'Diésel',
  hybrid: 'Híbrido',
  electric: 'Eléctrico'
}

const TRANSMISSION_LABEL: Record<Vehicle['transmission'], string> = {
  automatic: 'Automática',
  manual: 'Manual'
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/E2E8F0/64748B?text=Sin+imagen'

interface VehicleCardProps {
  vehicle: Vehicle
  onClick?: () => void
}

interface VehicleSpecProps {
  icon: React.ReactNode
  text: string
}

const VehicleSpec = ({ icon, text }: VehicleSpecProps) => {
  return (
    <Stack direction='row' spacing={0.5} alignItems='center' sx={{ color: 'text.secondary' }}>
      {icon}
      <Typography variant='caption'>{text}</Typography>
    </Stack>
  )
}

export const VehicleCard = ({ vehicle, onClick }: VehicleCardProps) => {
  const heroImage = vehicle.images[0] ?? PLACEHOLDER_IMAGE

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={onClick} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component='img'
            image={heroImage}
            alt={`${vehicle.brand} ${vehicle.model}`}
            sx={{ aspectRatio: '16 / 10', objectFit: 'cover' }}
          />
          <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
            <StatusChip status={vehicle.status} />
          </Box>
          {vehicle.images.length > 1 ? (
            <Chip
              label={`+${vehicle.images.length - 1}`}
              size='small'
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                color: 'white'
              }}
            />
          ) : null}
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                {vehicle.brand} {vehicle.model}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {vehicle.year}
              </Typography>
            </Box>
            <Typography variant='h5' color='primary.main'>
              {formatCurrency(vehicle.price)}
            </Typography>
            <Stack direction='row' spacing={1.5} flexWrap='wrap' useFlexGap>
              <VehicleSpec icon={<SpeedOutlinedIcon fontSize='inherit' />} text={`${formatNumber(vehicle.mileage)} km`} />
              <VehicleSpec icon={<SettingsOutlinedIcon fontSize='inherit' />} text={TRANSMISSION_LABEL[vehicle.transmission]} />
              <VehicleSpec icon={<LocalGasStationOutlinedIcon fontSize='inherit' />} text={FUEL_LABEL[vehicle.fuelType]} />
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
