import { Box, Card, CardContent, Pagination, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState, ErrorAlert, KpiCard, PageHeader, SalesListSkeleton } from '@/shared/components'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { formatCurrency } from '@/shared/utils/format'
import { paths } from '@/app/routes/paths'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { MonthlyChart } from '../components/MonthlyChart'
import { SalesFilters, type SalesFiltersState } from '../components/SalesFilters'
import { SalesTable } from '../components/SalesTable'
import { useSalesCatalog } from '../hooks/useSalesCatalog'
import { useSalesList } from '../hooks/useSalesList'
import { useSalesMonthly } from '../hooks/useSalesMonthly'
import { useSalesSummary } from '../hooks/useSalesSummary'

const PAGE_SIZE = 25

const INITIAL_FILTERS: SalesFiltersState = {
  search: '',
  vehicleId: '',
  dateFrom: '',
  dateTo: '',
  sort: 'newest'
}

const hasActiveFilters = (filters: SalesFiltersState): boolean =>
  Boolean(filters.search.trim() || filters.vehicleId || filters.dateFrom || filters.dateTo)

export const SalesListPage = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<SalesFiltersState>(INITIAL_FILTERS)
  const [page, setPage] = useState(0)

  const debouncedSearch = useDebouncedValue(filters.search, 300)
  const catalog = useSalesCatalog()

  const listFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch,
      page,
      pageSize: PAGE_SIZE
    }),
    [filters, debouncedSearch, page]
  )

  const { items, total, isLoading, isError, isFetching } = useSalesList(listFilters, {
    leadsById: catalog.leadsById,
    vehiclesById: catalog.vehiclesById
  })

  const summaryQuery = useSalesSummary()
  const monthlyQuery = useSalesMonthly()

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const summary = summaryQuery.data
  const monthly = monthlyQuery.data ?? []

  const handleFiltersChange = (next: SalesFiltersState) => {
    setFilters(next)
    setPage(0)
  }

  const isPageLoading =
    (isLoading && items.length === 0) ||
    catalog.isLoading ||
    summaryQuery.isLoading ||
    monthlyQuery.isLoading

  const loadError = isError || catalog.isError || summaryQuery.isError || monthlyQuery.isError

  if (isPageLoading) {
    return <SalesListSkeleton />
  }

  const loadErrorSource = summaryQuery.error ?? monthlyQuery.error ?? catalog.error

  if (loadError) {
    return (
      <Box>
        <PageHeader title='Ventas' subtitle='Historial y resumen de ventas' />
        <ErrorAlert
          error={loadErrorSource}
          onRetry={() => {
            void summaryQuery.refetch()
            void monthlyQuery.refetch()
            void catalog.refetch()
          }}
        />
      </Box>
    )
  }

  const showEmptyState = total === 0 && !hasActiveFilters(filters)

  return (
    <Box>
      <PageHeader title='Ventas' subtitle='Historial y resumen de ventas' />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label='Ventas del mes'
            value={summary?.monthlySalesCount ?? 0}
            icon={<PaidOutlinedIcon />}
            accentColor='#10B981'
            trend={summary && summary.monthlyRevenue > 0 ? formatCurrency(summary.monthlyRevenue) : undefined}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label='Ingresos acumulados'
            value={formatCurrency(summary?.totalRevenue ?? 0)}
            icon={<TrendingUpOutlinedIcon />}
            accentColor='#2563EB'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label='Ticket promedio'
            value={formatCurrency(summary?.averagePrice ?? 0)}
            icon={<ReceiptLongOutlinedIcon />}
            accentColor='#F59E0B'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label='Total de ventas'
            value={summary?.totalSales ?? 0}
            icon={<ShoppingCartOutlinedIcon />}
            accentColor='#8B5CF6'
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <MonthlyChart data={monthly} />
      </Box>

      <SalesFilters value={filters} vehicles={catalog.vehicles} onChange={handleFiltersChange} />

      {showEmptyState ? (
        <EmptyState
          title='Aún no hay ventas registradas.'
          description='Cuando registres una venta aparecerá aquí.'
        />
      ) : items.length === 0 ? (
        <EmptyState
          title='Sin resultados'
          description='No hay ventas que coincidan con los filtros aplicados.'
        />
      ) : (
        <Card sx={{ opacity: isFetching ? 0.7 : 1, transition: 'opacity 120ms ease' }}>
          <CardContent sx={{ p: 0 }}>
            <Stack sx={{ p: 3, pb: 2 }}>
              <Typography variant='h5' component='h2'>
                Historial de ventas
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {total} venta{total === 1 ? '' : 's'} registrada{total === 1 ? '' : 's'}
              </Typography>
            </Stack>
            <Box sx={{ px: { xs: 2, md: 0 }, pb: { xs: 2, md: 0 } }}>
              <SalesTable
                sales={items}
                leadsById={catalog.leadsById}
                vehiclesById={catalog.vehiclesById}
                onSelect={(sale) => navigate(paths.saleDetail(sale.id))}
              />
            </Box>
            {totalPages > 1 ? (
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={(_, value) => setPage(value - 1)}
                  color='primary'
                  aria-label='Paginación de ventas'
                />
              </Box>
            ) : null}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
