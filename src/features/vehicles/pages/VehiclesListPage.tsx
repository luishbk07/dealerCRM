import { Alert, Box, Button, Pagination, Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'
import AddIcon from '@mui/icons-material/Add'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { EmptyState, LoadingState, PageHeader } from '@/shared/components'
import { paths } from '@/app/routes/paths'
import type { VehicleWithImages } from '@/shared/types'
import { useVehicles } from '../hooks/useVehicles'
import { VehicleCard } from '../components/VehicleCard'
import { VehicleFilters, type VehicleFiltersState } from '../components/VehicleFilters'
import { ShareVehicleDialog } from '../components/ShareVehicleDialog'

const PAGE_SIZE = 12

const INITIAL_FILTERS: VehicleFiltersState = {
  search: '',
  status: 'all',
  brand: '',
  yearMin: '',
  yearMax: '',
  priceMin: '',
  priceMax: ''
}

const STATUS_OPTIONS = ['active', 'sold', 'reserved', 'inactive', 'draft']

const toNumberOrNull = (value: string): number | null => {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

export const VehiclesListPage = () => {
  const navigate = useNavigate()
  const { dealer } = useAuth()
  const [filters, setFilters] = useState<VehicleFiltersState>(INITIAL_FILTERS)
  const [page, setPage] = useState(0)
  const [shareVehicle, setShareVehicle] = useState<VehicleWithImages | null>(null)

  const queryParams = useMemo(() => ({
    page,
    pageSize: PAGE_SIZE,
    status: filters.status === 'all' ? null : filters.status,
    brand: filters.brand.trim() || null,
    yearMin: toNumberOrNull(filters.yearMin),
    yearMax: toNumberOrNull(filters.yearMax),
    priceMin: toNumberOrNull(filters.priceMin),
    priceMax: toNumberOrNull(filters.priceMax),
    search: filters.search.trim() || null
  }), [page, filters])

  const { data, isLoading, isError, error, isFetching } = useVehicles(queryParams)

  const handleFiltersChange = (next: VehicleFiltersState) => {
    setFilters(next)
    setPage(0)
  }

  if (isLoading) return <LoadingState message='Cargando inventario…' />
  if (isError) return <Alert severity='error'>{(error as Error).message}</Alert>

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <Box>
      <PageHeader
        title='Vehículos'
        subtitle={`${total} vehículo${total === 1 ? '' : 's'} en tu inventario`}
        actions={
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => navigate(paths.vehicleNew)}>
            Nuevo vehículo
          </Button>
        }
      />

      <VehicleFilters value={filters} statusOptions={STATUS_OPTIONS} onChange={handleFiltersChange} />

      {items.length === 0 ? (
        <EmptyState
          icon={<DirectionsCarFilledOutlinedIcon fontSize='inherit' />}
          title={total === 0 ? 'Aún no tienes vehículos' : 'Sin resultados'}
          description={
            total === 0
              ? 'Publica tu primer vehículo y empieza a captar leads.'
              : 'Prueba ajustar los filtros o limpiar la búsqueda.'
          }
          action={
            total === 0 ? (
              <Button variant='contained' startIcon={<AddIcon />} onClick={() => navigate(paths.vehicleNew)}>
                Publicar vehículo
              </Button>
            ) : null
          }
        />
      ) : (
        <Stack spacing={3} sx={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 120ms ease' }}>
          <Grid container spacing={2.5}>
            {items.map((vehicle) => (
              <Grid key={vehicle.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <VehicleCard
                  vehicle={vehicle}
                  onClick={() => navigate(paths.vehicleEdit(vehicle.id))}
                  onShare={setShareVehicle}
                />
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 ? (
            <Stack direction='row' justifyContent='center'>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(_, value) => setPage(value - 1)}
                color='primary'
              />
            </Stack>
          ) : null}
        </Stack>
      )}
      <ShareVehicleDialog
        vehicle={shareVehicle}
        dealerSlug={dealer?.slug}
        open={shareVehicle !== null}
        onClose={() => setShareVehicle(null)}
      />
    </Box>
  )
}
