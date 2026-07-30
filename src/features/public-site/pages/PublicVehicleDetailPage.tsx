import { Alert, Box, Card, CardContent, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { useMemo, type ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { LoadingState } from '@/shared/components'
import { formatCurrency, formatNumber } from '@/shared/utils/format'
import { PublicSiteHeader } from '../components/PublicSiteHeader'
import { PublicVehicleGallery } from '../components/PublicVehicleGallery'
import { PublicVehicleContactForm } from '../components/PublicVehicleContactForm'
import { PublicVehicleDetailSidebar } from '../components/PublicVehicleDetailSidebar'
import { PublicRelatedVehicles } from '../components/PublicRelatedVehicles'
import { PublicDealerFooter } from '../components/PublicDealerFooter'
import { PublicDealerThemeShell } from '../components/PublicDealerThemeShell'
import { usePublicPageMeta } from '../hooks/usePublicPageMeta'
import { usePublicRelatedVehicles, usePublicVehicleDetail } from '../hooks/usePublicVehicleDetail'
import {
  buildVehiclePageDescription,
  buildVehiclePageTitle
} from '../utils/publicPageMeta'
import { PublicDealerNotFoundPage } from './PublicDealerNotFoundPage'

interface SpecBlockProps {
  icon: ReactNode
  label: string
  value: string
}

const SpecBlock = ({ icon, label, value }: SpecBlockProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 1.5,
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
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
  </Box>
)

export const PublicVehicleDetailPage = () => {
  const { dealerSlug, vehicleId } = useParams<{ dealerSlug: string, vehicleId: string }>()

  const detailQuery = usePublicVehicleDetail(dealerSlug, vehicleId)
  const pageContext = detailQuery.data

  const relatedQuery = usePublicRelatedVehicles(dealerSlug, vehicleId, Boolean(pageContext))

  const shareUrl = useMemo(() => {
    if (!dealerSlug || !vehicleId) return ''
    return `${window.location.origin}/d/${dealerSlug}/vehiculo/${vehicleId}`
  }, [dealerSlug, vehicleId])

  const pageMeta = useMemo(() => {
    if (!pageContext) return null
    const { vehicle, profile } = pageContext
    return {
      title: buildVehiclePageTitle(vehicle.brand, vehicle.model, vehicle.year, profile.name),
      description: buildVehiclePageDescription(vehicle.brand, vehicle.model, vehicle.year, profile.name),
      imageUrl: vehicle.primaryImageUrl,
      url: shareUrl
    }
  }, [pageContext, shareUrl])

  usePublicPageMeta(pageMeta)

  if (detailQuery.isLoading) {
    return <LoadingState message='Cargando vehículo…' />
  }

  if (detailQuery.isError) {
    return (
      <Container maxWidth='md' sx={{ py: 8 }}>
        <Alert severity='error'>No pudimos cargar este vehículo. Intenta de nuevo más tarde.</Alert>
      </Container>
    )
  }

  if (!pageContext) {
    return <PublicDealerNotFoundPage />
  }

  const { profile, vehicle } = pageContext
  const vehicleTitle = `${vehicle.brand} ${vehicle.model}`
  const galleryAlt = vehicle.year ? `${vehicleTitle} ${vehicle.year}` : vehicleTitle

  return (
    <PublicDealerThemeShell profile={profile}>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'background.default' }}>
        <PublicSiteHeader dealer={profile} dealerSlug={pageContext.dealerSlug} />

      <Container maxWidth='lg' sx={{ py: { xs: 3, md: 5 }, flexGrow: 1 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <PublicVehicleGallery imageUrls={vehicle.imageUrls} alt={galleryAlt} />
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant='caption' color='text.secondary'>
                {vehicle.year ?? '—'}
              </Typography>
              <Typography variant='h3' component='h1' sx={{ fontWeight: 700 }}>
                {vehicleTitle}
              </Typography>
              <Typography variant='h4' color='primary.main' sx={{ mt: 1 }}>
                {formatCurrency(vehicle.price)}
              </Typography>
            </Box>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <SpecBlock
                      icon={<CalendarMonthOutlinedIcon fontSize='small' />}
                      label='Año'
                      value={vehicle.year !== null ? `${vehicle.year}` : '—'}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <SpecBlock
                      icon={<SpeedOutlinedIcon fontSize='small' />}
                      label='Kilometraje'
                      value={`${formatNumber(vehicle.mileage)} km`}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <SpecBlock
                      icon={<SettingsOutlinedIcon fontSize='small' />}
                      label='Transmisión'
                      value={vehicle.transmission ?? '—'}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <SpecBlock
                      icon={<LocalGasStationOutlinedIcon fontSize='small' />}
                      label='Combustible'
                      value={vehicle.fuelType ?? '—'}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ mb: 3 }}>
              <PublicVehicleContactForm
                dealerSlug={pageContext.dealerSlug}
                vehicleId={vehicle.id}
              />
            </Box>

            <PublicVehicleDetailSidebar dealer={profile} vehicle={vehicle} shareUrl={shareUrl} />
          </Grid>
        </Grid>

        <Box sx={{ mt: { xs: 4, md: 5 } }}>
          <Typography variant='h5' sx={{ mb: 1.5 }}>
            Descripción
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ whiteSpace: 'pre-line' }}>
            {vehicle.description?.trim() ? vehicle.description : 'No hay descripción disponible.'}
          </Typography>
        </Box>

        <PublicRelatedVehicles
          dealerSlug={pageContext.dealerSlug}
          vehicles={relatedQuery.data ?? []}
        />
      </Container>

      <PublicDealerFooter dealer={profile} />
      </Box>
    </PublicDealerThemeShell>
  )
}
