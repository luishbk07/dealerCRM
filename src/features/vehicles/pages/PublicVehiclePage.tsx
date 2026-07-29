import { Alert, Box, Button, Card, CardContent, Container, Divider, Stack, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'
import { useState, type ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorAlert, LoadingState } from '@/shared/components'
import { getUserFriendlyError, USER_MESSAGES } from '@/shared/utils/userMessages'
import type { VehicleWithImages } from '@/shared/types'
import { formatCurrency, formatNumber } from '@/shared/utils/format'
import { useToast } from '@/shared/hooks/useToast'
import { useVehicle } from '../hooks/useVehicle'
import { vehicleService } from '../services/vehicleService'
import { leadService } from '@/features/leads/services/leadService'

const PLACEHOLDER_IMAGE = 'https://placehold.co/1200x720/E2E8F0/64748B?text=Sin+imagen'
const LEAD_SOURCE_PUBLIC = 'website'

interface SpecBlockProps {
  icon: ReactNode
  label: string
  value: string
}

const SpecBlock = ({ icon, label, value }: SpecBlockProps) => {
  return (
    <Stack direction='row' spacing={1.5} alignItems='center'>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1.5,
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant='caption' color='text.secondary'>
          {label}
        </Typography>
        <Typography variant='subtitle2'>{value}</Typography>
      </Box>
    </Stack>
  )
}

interface ImageGalleryProps {
  vehicle: VehicleWithImages
}

const ImageGallery = ({ vehicle }: ImageGalleryProps) => {
  const urls = vehicle.images.length > 0
    ? vehicle.images.map((image) => vehicleService.resolveImageUrl(image))
    : [PLACEHOLDER_IMAGE]
  const [active, setActive] = useState(0)
  const current = urls[active] ?? urls[0]
  const altBase = `${vehicle.brand} ${vehicle.model}`

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: 'grey.100',
          aspectRatio: '16 / 10'
        }}
      >
        <Box component='img' src={current} alt={altBase} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Box>
      {urls.length > 1 ? (
        <Stack direction='row' spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
          {urls.map((url, index) => (
            <Box
              key={`${url}-${index}`}
              component='button'
              onClick={() => setActive(index)}
              sx={{
                border: index === active ? '2px solid' : '1px solid',
                borderColor: index === active ? 'primary.main' : 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                p: 0,
                cursor: 'pointer',
                flex: '0 0 96px',
                aspectRatio: '4 / 3',
                background: 'none'
              }}
              aria-label={`Imagen ${index + 1}`}
            >
              <Box component='img' src={url} alt={`${altBase} ${index + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </Box>
          ))}
        </Stack>
      ) : null}
    </Stack>
  )
}

interface RequestInfoFormProps {
  vehicle: VehicleWithImages
}

const RequestInfoForm = ({ vehicle }: RequestInfoFormProps) => {
  const { showToast } = useToast()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState(`Hola, me interesa el ${vehicle.brand} ${vehicle.model}${vehicle.year ? ` ${vehicle.year}` : ''}.`)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!fullName.trim() || !phone.trim()) {
      showToast('Por favor completa nombre y teléfono', 'warning')
      return
    }
    setSubmitting(true)
    try {
      await leadService.createFromPublicForm({
        vehicleId: vehicle.id,
        name: fullName.trim(),
        phone: phone.trim(),
        message: message.trim() || null,
        source: LEAD_SOURCE_PUBLIC
      })
      setDone(true)
      showToast('¡Solicitud enviada! El concesionario te contactará pronto.')
    } catch (err) {
      showToast(getUserFriendlyError(err, USER_MESSAGES.saveFailed), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <Alert severity='success'>
        Gracias, {fullName.split(' ')[0]}. Un asesor te contactará a la brevedad.
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack spacing={2}>
        <TextField label='Nombre completo' value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        <TextField label='Teléfono / WhatsApp' value={phone} onChange={(event) => setPhone(event.target.value)} required />
        <TextField label='Mensaje' value={message} onChange={(event) => setMessage(event.target.value)} multiline minRows={3} />
        <Button type='submit' variant='contained' size='large' startIcon={<SendOutlinedIcon />} disabled={submitting}>
          {submitting ? 'Enviando…' : 'Solicitar información'}
        </Button>
      </Stack>
    </form>
  )
}

export const PublicVehiclePage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const vehicleQuery = useVehicle(id)

  if (vehicleQuery.isLoading) return <LoadingState message='Cargando vehículo…' />
  if (vehicleQuery.isError || !vehicleQuery.data) {
    return (
      <Container sx={{ py: 8 }}>
        <ErrorAlert error={vehicleQuery.error} message='Vehículo no disponible.' />
      </Container>
    )
  }

  const vehicle = vehicleQuery.data
  const whatsappMessage = encodeURIComponent(
    `Hola, me interesa el ${vehicle.brand} ${vehicle.model}${vehicle.year ? ` ${vehicle.year}` : ''} publicado en su web.`
  )
  const whatsappLink = `https://wa.me/?text=${whatsappMessage}`

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ backgroundColor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container sx={{ py: 2 }}>
          <Stack direction='row' alignItems='center' spacing={1.5}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DirectionsCarFilledIcon fontSize='small' />
            </Box>
            <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
              Dealer CRM · Catálogo público
            </Typography>
          </Stack>
        </Container>
      </Box>
      <Container sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <ImageGallery vehicle={vehicle} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  {vehicle.year ?? ''}
                </Typography>
                <Typography variant='h3' component='h1'>
                  {vehicle.brand} {vehicle.model}
                </Typography>
                <Typography variant='h4' color='primary.main' sx={{ mt: 1 }}>
                  {formatCurrency(vehicle.price)}
                </Typography>
              </Box>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <SpecBlock icon={<CalendarMonthOutlinedIcon fontSize='small' />} label='Año' value={vehicle.year !== null ? `${vehicle.year}` : '—'} />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <SpecBlock icon={<SpeedOutlinedIcon fontSize='small' />} label='Kilometraje' value={`${formatNumber(vehicle.mileage)} km`} />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <SpecBlock icon={<SettingsOutlinedIcon fontSize='small' />} label='Transmisión' value={vehicle.transmission ?? '—'} />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <SpecBlock icon={<LocalGasStationOutlinedIcon fontSize='small' />} label='Combustible' value={vehicle.fuelType ?? '—'} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Button
                variant='contained'
                size='large'
                startIcon={<WhatsAppIcon />}
                color='success'
                href={whatsappLink}
                target='_blank'
                rel='noopener'
                sx={{ color: '#fff' }}
              >
                Contactar por WhatsApp
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {vehicle.description ? (
          <Box sx={{ mt: 6 }}>
            <Typography variant='h5' sx={{ mb: 1 }}>
              Descripción
            </Typography>
            <Typography variant='body1' color='text.secondary' sx={{ whiteSpace: 'pre-line' }}>
              {vehicle.description}
            </Typography>
          </Box>
        ) : null}

        <Divider sx={{ my: 6 }} />

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant='h5' sx={{ mb: 1 }}>
              ¿Te interesa este vehículo?
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Déjanos tus datos y un asesor se comunicará contigo para coordinar una prueba de manejo o resolver tus dudas.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                <RequestInfoForm vehicle={vehicle} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
