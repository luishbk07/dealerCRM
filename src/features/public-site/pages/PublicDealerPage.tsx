import { Alert, Box, Container, Pagination, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingState } from '@/shared/components'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { paths } from '@/app/routes/paths'
import { formatNumber } from '@/shared/utils/format'
import { PublicDealerHero } from '../components/PublicDealerHero'
import { PublicDealerFooter } from '../components/PublicDealerFooter'
import { PublicVehicleCard, PublicVehicleFilters } from '../components/PublicVehicleSection'
import { usePageMeta } from '../hooks/usePageMeta'
import { usePublicDealer } from '../hooks/usePublicDealer'
import { usePublicDealerVehicles } from '../hooks/usePublicDealerVehicles'
import {
  INITIAL_PUBLIC_VEHICLE_FILTERS,
  PUBLIC_VEHICLE_PAGE_SIZE,
  type PublicVehicleFiltersState
} from '../types'
import { buildPublicVehicleListParams } from '../utils/publicSiteUtils'
import { PublicDealerNotFoundPage } from './PublicDealerNotFoundPage'

export const PublicDealerPage = () => {
  const { dealerSlug } = useParams<{ dealerSlug: string }>()
  const navigate = useNavigate()
  const [filters, setFilters] = useState<PublicVehicleFiltersState>(INITIAL_PUBLIC_VEHICLE_FILTERS)
  const [page, setPage] = useState(0)

  const debouncedSearch = useDebouncedValue(filters.search, 300)

  const dealerQuery = usePublicDealer(dealerSlug)
  const dealerContext = dealerQuery.data

  const listParams = useMemo(() => {
    if (!dealerContext) return null
    return buildPublicVehicleListParams(
      dealerContext.dealerId,
      { ...filters, search: debouncedSearch },
      page,
      PUBLIC_VEHICLE_PAGE_SIZE
    )
  }, [dealerContext, filters, debouncedSearch, page])

  const vehiclesQuery = usePublicDealerVehicles(
    dealerContext?.dealerId,
    listParams ?? {
      page: 0,
      pageSize: PUBLIC_VEHICLE_PAGE_SIZE,
      dealerId: '',
      status: 'active'
    }
  )

  const pageTitle = dealerContext
    ? `${dealerContext.profile.name} | Inventario`
    : 'Inventario | Dealer CRM'
  const pageDescription = dealerContext
    ? `Explora el inventario de vehículos disponibles en ${dealerContext.profile.name}.`
    : 'Inventario de vehículos disponibles.'

  usePageMeta(pageTitle, pageDescription)

  if (dealerQuery.isLoading) {
    return <LoadingState message='Cargando concesionario…' />
  }

  if (dealerQuery.isError) {
    return (
      <Container maxWidth='md' sx={{ py: 8 }}>
        <Alert severity='error'>No pudimos cargar este concesionario. Intenta de nuevo más tarde.</Alert>
      </Container>
    )
  }

  if (!dealerContext) {
    return <PublicDealerNotFoundPage />
  }

  const { profile } = dealerContext
  const items = vehiclesQuery.data?.items ?? []
  const total = vehiclesQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PUBLIC_VEHICLE_PAGE_SIZE))

  const handleFiltersChange = (next: PublicVehicleFiltersState) => {
    setFilters(next)
    setPage(0)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'background.default' }}>
      <PublicDealerHero dealer={profile} />

      <Container maxWidth='lg' sx={{ py: { xs: 4, md: 5 }, flexGrow: 1 }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant='h4' component='h2'>
            Vehículos disponibles
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {total === 0
              ? 'Explora nuestro inventario'
              : `${formatNumber(total)} vehículo${total === 1 ? '' : 's'} disponible${total === 1 ? '' : 's'}`}
          </Typography>
        </Stack>

        <PublicVehicleFilters value={filters} onChange={handleFiltersChange} />

        {vehiclesQuery.isLoading ? (
          <LoadingState message='Cargando vehículos…' />
        ) : vehiclesQuery.isError ? (
          <Alert severity='error'>No pudimos cargar el inventario. Intenta de nuevo más tarde.</Alert>
        ) : items.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider'
            }}
          >
            <Typography variant='body1' color='text.secondary'>
              No hay vehículos disponibles.
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={2.5}>
              {items.map((vehicle) => (
                <Grid key={vehicle.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <PublicVehicleCard
                    brand={vehicle.brand}
                    model={vehicle.model}
                    year={vehicle.year}
                    price={vehicle.price}
                    mileage={vehicle.mileage}
                    transmission={vehicle.transmission}
                    fuelType={vehicle.fuelType}
                    status={vehicle.status}
                    imageUrl={vehicle.primaryImageUrl}
                    onViewDetails={() => navigate(paths.vehiclePublic(vehicle.id))}
                  />
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 ? (
              <Stack alignItems='center' sx={{ mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={(_, nextPage) => setPage(nextPage - 1)}
                  color='primary'
                  shape='rounded'
                />
              </Stack>
            ) : null}
          </>
        )}
      </Container>

      <PublicDealerFooter dealer={profile} />
    </Box>
  )
}
