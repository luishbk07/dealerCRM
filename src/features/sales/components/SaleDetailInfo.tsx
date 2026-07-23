import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography
} from '@mui/material'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import type { Lead, Sale, VehicleWithImages } from '@/shared/types'
import { formatCurrency, formatDateTime } from '@/shared/utils/format'
import { paths } from '@/app/routes/paths'
import { vehicleService } from '@/features/vehicles/services/vehicleService'
import { formatBuyerName } from '../utils/sortSales'

interface SaleDetailInfoProps {
  sale: Sale
  lead: Lead | null
  vehicle: VehicleWithImages | null
}

export const SaleDetailInfo = ({ sale, lead, vehicle }: SaleDetailInfoProps) => {
  const vehicleImage =
    vehicle && vehicle.images.length > 0 ? vehicleService.resolveImageUrl(vehicle.images[0]) : null

  return (
    <Stack spacing={2.5} component='section' aria-label='Detalle de la venta'>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant='caption' color='text.secondary'>
                Monto de venta
              </Typography>
              <Typography variant='h4' component='p' color='success.main' fontWeight={700}>
                {formatCurrency(sale.price)}
              </Typography>
            </Box>
            <Box>
              <Typography variant='caption' color='text.secondary'>
                Fecha de venta
              </Typography>
              <Typography variant='body1'>{formatDateTime(sale.soldAt)}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1.5 }}>
            <PersonOutlineIcon fontSize='small' color='action' aria-hidden />
            <Typography variant='subtitle1' component='h2'>
              Comprador
            </Typography>
          </Stack>
          {lead ? (
            <Stack spacing={1.5}>
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Nombre
                </Typography>
                <Typography variant='body1'>{formatBuyerName(lead)}</Typography>
              </Box>
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Teléfono
                </Typography>
                <Typography variant='body1'>{lead.phone ?? '—'}</Typography>
              </Box>
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Origen del lead
                </Typography>
                <Typography variant='body1'>{lead.source ?? '—'}</Typography>
              </Box>
              <Button
                variant='outlined'
                size='small'
                startIcon={<OpenInNewOutlinedIcon />}
                onClick={() => window.open(paths.leadDetail(lead.id), '_self')}
              >
                Ver lead
              </Button>
            </Stack>
          ) : (
            <Typography variant='body2' color='text.secondary'>
              {sale.leadId ? 'El lead asociado ya no está disponible.' : 'Esta venta no tiene lead vinculado.'}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1.5 }}>
            <DirectionsCarFilledOutlinedIcon fontSize='small' color='action' aria-hidden />
            <Typography variant='subtitle1' component='h2'>
              Vehículo vendido
            </Typography>
          </Stack>
          {vehicle ? (
            <Stack spacing={1.5}>
              {vehicleImage ? (
                <Box
                  component='img'
                  src={vehicleImage}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  sx={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', borderRadius: 2 }}
                />
              ) : null}
              <Box>
                <Typography variant='subtitle1'>
                  {vehicle.brand} {vehicle.model}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {vehicle.year ?? '—'} · {formatCurrency(vehicle.price)}
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button
                  variant='outlined'
                  size='small'
                  startIcon={<OpenInNewOutlinedIcon />}
                  onClick={() => window.open(paths.vehicleEdit(vehicle.id), '_self')}
                >
                  Ver vehículo
                </Button>
                <Button
                  variant='text'
                  size='small'
                  startIcon={<OpenInNewOutlinedIcon />}
                  onClick={() => window.open(paths.vehiclePublic(vehicle.id), '_blank', 'noopener,noreferrer')}
                >
                  Página pública
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Typography variant='body2' color='text.secondary'>
              {sale.vehicleId ? 'El vehículo asociado ya no está disponible.' : 'Esta venta no tiene vehículo vinculado.'}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Stack>
  )
}
