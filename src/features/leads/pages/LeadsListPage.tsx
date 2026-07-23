import { Alert, Box, Button, Card, CardContent, Pagination, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import { EmptyState, LoadingState, PageHeader } from '@/shared/components'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { useToast } from '@/shared/hooks/useToast'
import type { Vehicle } from '@/shared/types'
import { paths } from '@/app/routes/paths'
import { LeadCreateDialog } from '../components/LeadCreateDialog'
import { LeadsFilters, type LeadsFiltersState } from '../components/LeadsFilters'
import { LeadsTable } from '../components/LeadsTable'
import { useLeadMutations } from '../hooks/useLeadMutations'
import { useLeadsList } from '../hooks/useLeadsList'

const PAGE_SIZE = 25
const VEHICLE_FETCH_SIZE = 500

const INITIAL_FILTERS: LeadsFiltersState = {
  search: '',
  status: 'all',
  vehicleId: '',
  dateFrom: '',
  dateTo: '',
  sort: 'newest'
}

export const LeadsListPage = () => {
  const navigate = useNavigate()
  const { dealer } = useAuth()
  const { showToast } = useToast()
  const [filters, setFilters] = useState<LeadsFiltersState>(INITIAL_FILTERS)
  const [page, setPage] = useState(0)
  const [createOpen, setCreateOpen] = useState(false)

  const debouncedSearch = useDebouncedValue(filters.search, 300)

  const listFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch,
      page,
      pageSize: PAGE_SIZE
    }),
    [filters, debouncedSearch, page]
  )

  const { items, total, isLoading, isError, isFetching, hasActiveFilters } = useLeadsList(listFilters)
  const { createLead } = useLeadMutations()

  const vehiclesQuery = useVehicles({
    page: 0,
    pageSize: VEHICLE_FETCH_SIZE,
    status: null,
    brand: null,
    yearMin: null,
    yearMax: null,
    priceMin: null,
    priceMax: null,
    search: null
  })

  const vehicles = vehiclesQuery.data?.items ?? []
  const vehiclesById = useMemo(() => {
    const map = new Map<string, Vehicle>()
    for (const vehicle of vehicles) {
      map.set(vehicle.id, vehicle)
    }
    return map
  }, [vehicles])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const handleFiltersChange = (next: LeadsFiltersState) => {
    setFilters(next)
    setPage(0)
  }

  const handleCreateLead = async (input: {
    name: string
    phone: string
    vehicleId: string | null
    source: string
    message: string | null
  }) => {
    if (!dealer?.id) {
      showToast('No fue posible crear el lead.', 'error')
      return
    }
    try {
      const lead = await createLead.mutateAsync({
        dealerId: dealer.id,
        ...input
      })
      setCreateOpen(false)
      showToast('Lead creado correctamente')
      navigate(paths.leadDetail(lead.id))
    } catch {
      showToast('No fue posible crear el lead.', 'error')
    }
  }

  if (isLoading && items.length === 0) {
    return <LoadingState message='Cargando leads…' />
  }

  if (isError) {
    return (
      <Box>
        <PageHeader title='Leads' subtitle='Gestiona tus prospectos' />
        <Alert severity='error'>No fue posible cargar los leads.</Alert>
      </Box>
    )
  }

  const showEmptyState = total === 0 && !hasActiveFilters

  return (
    <Box>
      <PageHeader
        title='Leads'
        subtitle={`${total} lead${total === 1 ? '' : 's'} en tu bandeja`}
        actions={
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            Crear lead
          </Button>
        }
      />

      <LeadsFilters value={filters} vehicles={vehicles} onChange={handleFiltersChange} />

      {showEmptyState ? (
        <EmptyState
          title='No hay leads registrados'
          description='Los nuevos prospectos aparecerán aquí.'
          icon={<PeopleOutlineIcon fontSize='inherit' />}
          action={
            <Button variant='contained' startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
              Crear lead
            </Button>
          }
        />
      ) : items.length === 0 ? (
        <EmptyState
          title='Sin resultados'
          description='No hay leads que coincidan con los filtros aplicados.'
        />
      ) : (
        <Card sx={{ opacity: isFetching ? 0.7 : 1, transition: 'opacity 120ms ease' }}>
          <CardContent sx={{ p: 0 }}>
            <Stack sx={{ p: 3, pb: 2 }}>
              <Typography variant='h5' component='h2'>
                Lista de leads
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Selecciona un lead para ver el detalle
              </Typography>
            </Stack>
            <Box sx={{ px: { xs: 2, md: 0 }, pb: { xs: 2, md: 0 } }}>
              <LeadsTable
                leads={items}
                vehiclesById={vehiclesById}
                onSelect={(lead) => navigate(paths.leadDetail(lead.id))}
              />
            </Box>
            {totalPages > 1 ? (
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={(_, value) => setPage(value - 1)}
                  color='primary'
                  aria-label='Paginación de leads'
                />
              </Box>
            ) : null}
          </CardContent>
        </Card>
      )}

      <LeadCreateDialog
        open={createOpen}
        vehicles={vehicles}
        loading={createLead.isPending}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateLead}
      />
    </Box>
  )
}
