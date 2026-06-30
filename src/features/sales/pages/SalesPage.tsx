import { Alert, Box, Card, CardContent, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import { useState } from 'react'
import { EmptyState, KpiCard, LoadingState, PageHeader } from '@/shared/components'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import { useSales } from '../hooks/useSales'
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats'
import { MonthlyChart } from '../components/MonthlyChart'

const PAGE_SIZE = 25

export const SalesPage = () => {
  const [page, setPage] = useState(0)
  const salesQuery = useSales({ page, pageSize: PAGE_SIZE })
  const dashboardQuery = useDashboardStats()

  if (salesQuery.isLoading || dashboardQuery.isLoading) return <LoadingState message='Cargando ventas…' />
  if (salesQuery.isError) return <Alert severity='error'>{(salesQuery.error as Error).message}</Alert>
  if (dashboardQuery.isError) return <Alert severity='error'>{(dashboardQuery.error as Error).message}</Alert>

  const sales = salesQuery.data?.items ?? []
  const total = salesQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const stats = dashboardQuery.data?.stats
  const monthly = dashboardQuery.data?.monthlySales ?? []

  return (
    <Box>
      <PageHeader title='Ventas' subtitle='Resultado histórico y tendencia mensual' />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard
            label='Ventas del mes'
            value={stats?.monthlySalesCount ?? 0}
            icon={<PaidOutlinedIcon />}
            accentColor='#10B981'
            trend={stats && stats.monthlyRevenue > 0 ? formatCurrency(stats.monthlyRevenue) : undefined}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard
            label='Ingresos acumulados'
            value={formatCurrency(stats?.totalRevenue ?? 0)}
            icon={<TrendingUpOutlinedIcon />}
            accentColor='#2563EB'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard
            label='Ticket promedio'
            value={formatCurrency(stats?.averageSalePrice ?? 0)}
            icon={<ReceiptLongOutlinedIcon />}
            accentColor='#F59E0B'
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <MonthlyChart data={monthly} />
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Stack sx={{ p: 3, pb: 2 }}>
            <Typography variant='h5'>Historial de ventas</Typography>
            <Typography variant='body2' color='text.secondary'>
              Todas las ventas registradas en tu cuenta
            </Typography>
          </Stack>
          {sales.length === 0 ? (
            <Box sx={{ p: 3 }}>
              <EmptyState
                title='Aún no tienes ventas registradas'
                description='Cuando registres una venta aparecerá aquí.'
              />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ border: 'none', borderRadius: 0 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehículo</TableCell>
                      <TableCell>Lead</TableCell>
                      <TableCell align='right'>Precio</TableCell>
                      <TableCell align='right'>Fecha</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id} hover>
                        <TableCell>
                          <Typography variant='body2' color='text.secondary'>
                            {sale.vehicleId ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' color='text.secondary'>
                            {sale.leadId ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 600, color: 'success.main' }}>
                          {formatCurrency(sale.price)}
                        </TableCell>
                        <TableCell align='right'>{formatDate(sale.soldAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {totalPages > 1 ? (
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={(_, value) => setPage(value - 1)}
                    color='primary'
                  />
                </Box>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
