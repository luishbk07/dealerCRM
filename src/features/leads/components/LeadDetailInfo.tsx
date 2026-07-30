import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import type { Lead, VehicleWithImages } from '@/shared/types'
import { StatusChip } from '@/shared/components'
import { formatCurrency, formatDateTime } from '@/shared/utils/format'
import { paths } from '@/app/routes/paths'
import { buildAbsoluteUrl } from '@/shared/utils/appUrl'
import { vehicleService } from '@/features/vehicles/services/vehicleService'
import { LEAD_STATUS_SELECT_OPTIONS, isLeadStatus } from '@/modules/leads/constants/leadStatus'
import type { LeadStatus } from '@/modules/leads/types'

interface LeadDetailInfoProps {
  lead: Lead
  vehicle: VehicleWithImages | null
  updatingStatus?: boolean
  onChangeStatus: (status: LeadStatus) => Promise<void>
}

export const LeadDetailInfo = ({ lead, vehicle, updatingStatus, onChangeStatus }: LeadDetailInfoProps) => {
  const phoneDigits = (lead.phone ?? '').replace(/\D/g, '')
  const whatsappLink = phoneDigits ? `https://wa.me/${phoneDigits}` : ''
  const vehicleImage = vehicle && vehicle.images.length > 0 ? vehicleService.resolveImageUrl(vehicle.images[0]) : null

  const handleStatusChange = async (status: string) => {
    if (!isLeadStatus(status) || status === lead.status) return
    await onChangeStatus(status)
  }

  return (
    <Stack spacing={2} component='section' aria-label='Información del lead'>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant='caption' color='text.secondary'>
                Cliente
              </Typography>
              <Typography variant='h5' component='h1' sx={{ mb: 0.75 }}>
                {lead.name ?? 'Sin nombre'}
              </Typography>
              <StatusChip status={lead.status} />
            </Box>

            <TextField
              select
              label='Estado del lead'
              value={lead.status}
              onChange={(event) => void handleStatusChange(event.target.value)}
              disabled={updatingStatus}
              fullWidth
              inputProps={{ 'aria-label': 'Cambiar estado del lead' }}
            >
              {LEAD_STATUS_SELECT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Box>
              <Typography variant='caption' color='text.secondary'>
                Teléfono
              </Typography>
              <Typography variant='body1'>{lead.phone ?? '—'}</Typography>
            </Box>

            <Box>
              <Typography variant='caption' color='text.secondary'>
                Origen
              </Typography>
              <Typography variant='body1'>{lead.source ?? '—'}</Typography>
            </Box>

            <Box>
              <Typography variant='caption' color='text.secondary'>
                Fecha de creación
              </Typography>
              <Typography variant='body1'>{formatDateTime(lead.createdAt)}</Typography>
            </Box>

            <Box>
              <Typography variant='caption' color='text.secondary'>
                Último contacto
              </Typography>
              <Typography variant='body1'>
                {lead.lastContactAt ? formatDateTime(lead.lastContactAt) : '—'}
              </Typography>
            </Box>

            {lead.message ? (
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Mensaje
                </Typography>
                <Typography variant='body1' sx={{ whiteSpace: 'pre-wrap' }}>
                  {lead.message}
                </Typography>
              </Box>
            ) : null}

            {whatsappLink ? (
              <Button
                variant='contained'
                color='success'
                startIcon={<WhatsAppIcon />}
                href={whatsappLink}
                target='_blank'
                rel='noopener noreferrer'
                sx={{ color: '#fff' }}
              >
                Abrir WhatsApp
              </Button>
            ) : null}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant='subtitle1' component='h2' sx={{ mb: 1 }}>
            Vehículo de interés
          </Typography>
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
              <Button
                variant='outlined'
                size='small'
                startIcon={<OpenInNewOutlinedIcon />}
                onClick={() => window.open(buildAbsoluteUrl(paths.vehiclePublic(vehicle.id)), '_blank', 'noopener,noreferrer')}
              >
                Ver página pública
              </Button>
            </Stack>
          ) : (
            <Typography variant='body2' color='text.secondary'>
              {lead.vehicleId
                ? 'El vehículo asociado ya no está disponible.'
                : 'Este lead no está vinculado a un vehículo.'}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Stack>
  )
}
