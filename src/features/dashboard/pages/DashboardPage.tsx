import { Alert, Box, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import AddIcon from '@mui/icons-material/Add'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import FiberNewOutlinedIcon from '@mui/icons-material/FiberNewOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import { useNavigate } from 'react-router-dom'
import { KpiCard, LoadingState, PageHeader } from '@/shared/components'
import { paths } from '@/app/routes/paths'
import { formatCurrency } from '@/shared/utils/format'
import { useDashboardData } from '../hooks/useDashboardData'
import { RecentLeadsList } from '../components/RecentLeadsList'
import { PipelineSnapshot } from '../components/PipelineSnapshot'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { dashboard, loading, error } = useDashboardData()

  if (loading) return <LoadingState message='Cargando tu dashboard…' />
  if (error) return <Alert severity='error'>No pudimos cargar la información. {error.message}</Alert>
  if (!dashboard) return null

  const { metrics, recentLeads, vehicles } = dashboard

  return (
    <Box>
      <PageHeader
        title='Dashboard'
        subtitle='Resumen rápido de tu operación de hoy'
        actions={
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => navigate(paths.vehicleNew)}>
            Publicar vehículo
          </Button>
        }
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label='Vehículos activos'
            value={metrics.activeVehicles}
            icon={<DirectionsCarFilledOutlinedIcon />}
            accentColor='#2563EB'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label='Leads nuevos'
            value={metrics.newLeads}
            icon={<FiberNewOutlinedIcon />}
            accentColor='#0EA5E9'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label='Leads pendientes'
            value={metrics.pendingLeads}
            icon={<HourglassEmptyOutlinedIcon />}
            accentColor='#F59E0B'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label='Ventas del mes'
            value={metrics.monthlySales}
            icon={<PaidOutlinedIcon />}
            accentColor='#10B981'
            trend={metrics.monthlyRevenue > 0 ? formatCurrency(metrics.monthlyRevenue) : undefined}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <RecentLeadsList leads={recentLeads} vehicles={vehicles} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <PipelineSnapshot leads={dashboard.leads} />
        </Grid>
      </Grid>
    </Box>
  )
}
