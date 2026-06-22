import { Alert, Box, Card, CardContent, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import { EmptyState, KpiCard, LoadingState, PageHeader } from '@/shared/components'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import { useSalesData } from '../hooks/useSalesData'
import { MonthlyChart } from '../components/MonthlyChart'

export const SalesPage = () => {
  const { data, loading, error } = useSalesData()

  if (loading) return <LoadingState message='Cargando ventas…' />
  if (error) return <Alert severity='error'>{error.message}</Alert>
  if (!data) return null

  const { sales, vehiclesById, currentMonth, totalRevenue, monthlyBreakdown } = data
  const averageTicket = sales.length === 0 ? 0 : Math.round(totalRevenue / sales.length)

  return (
    <Box>
      <PageHeader title='Ventas' subtitle='Resultado histórico y tendencia mensual' />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard
            label='Ventas del mes'
            value={currentMonth.count}
            icon={<PaidOutlinedIcon />}
            accentColor='#10B981'
            trend={currentMonth.revenue > 0 ? formatCurrency(currentMonth.revenue) : undefined}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard
            label='Ingresos acumulados'
            value={formatCurrency(totalRevenue)}
            icon={<TrendingUpOutlinedIcon />}
            accentColor='#2563EB'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard
            label='Ticket promedio'
            value={formatCurrency(averageTicket)}
            icon={<ReceiptLongOutlinedIcon />}
            accentColor='#F59E0B'
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <MonthlyChart data={monthlyBreakdown} />
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
                description='Cuando un lead se cierre como vendido aparecerá aquí.'
              />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ border: 'none', borderRadius: 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Vehículo</TableCell>
                    <TableCell>Comprador</TableCell>
                    <TableCell align='right'>Precio final</TableCell>
                    <TableCell align='right'>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales.map((sale) => {
                    const vehicle = vehiclesById.get(sale.vehicleId)
                    return (
                      <TableRow key={sale.id} hover>
                        <TableCell>
                          {vehicle ? (
                            <Stack>
                              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                {vehicle.brand} {vehicle.model}
                              </Typography>
                              <Typography variant='caption' color='text.secondary'>
                                {vehicle.year}
                              </Typography>
                            </Stack>
                          ) : (
                            <Typography variant='body2' color='text.secondary'>
                              Vehículo no disponible
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{sale.buyerName}</TableCell>
                        <TableCell align='right' sx={{ fontWeight: 600, color: 'success.main' }}>
                          {formatCurrency(sale.finalPrice)}
                        </TableCell>
                        <TableCell align='right'>{formatDate(sale.soldAt)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
