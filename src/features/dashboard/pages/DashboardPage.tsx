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
import { useDashboardStats } from '../hooks/useDashboardStats'
import { useLeads } from '@/features/leads/hooks/useLeads'
import { RecentLeadsList } from '../components/RecentLeadsList'
import { PipelineSnapshot } from '../components/PipelineSnapshot'

const RECENT_LEADS_PARAMS = { page: 0, pageSize: 5 }

export const DashboardPage = () => {
  const navigate = useNavigate()
  const snapshotQuery = useDashboardStats()
  const recentLeadsQuery = useLeads(RECENT_LEADS_PARAMS)

  if (snapshotQuery.isLoading || recentLeadsQuery.isLoading) {
    return <LoadingState message='Cargando tu dashboard…' />
  }
  if (snapshotQuery.isError) {
    return <Alert severity='error'>No pudimos cargar las métricas. {(snapshotQuery.error as Error).message}</Alert>
  }
  if (recentLeadsQuery.isError) {
    return <Alert severity='error'>No pudimos cargar los leads. {(recentLeadsQuery.error as Error).message}</Alert>
  }

  const snapshot = snapshotQuery.data
  const recentLeads = recentLeadsQuery.data?.items ?? []
  if (!snapshot) return null

  const { stats, leadConversion } = snapshot
  const pendingLeads = stats.newLeads + stats.contactedLeads + stats.qualifiedLeads

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
            value={stats.activeVehicles}
            icon={<DirectionsCarFilledOutlinedIcon />}
            accentColor='#2563EB'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label='Leads nuevos'
            value={stats.newLeads}
            icon={<FiberNewOutlinedIcon />}
            accentColor='#0EA5E9'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label='Leads pendientes'
            value={pendingLeads}
            icon={<HourglassEmptyOutlinedIcon />}
            accentColor='#F59E0B'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label='Ventas del mes'
            value={stats.monthlySalesCount}
            icon={<PaidOutlinedIcon />}
            accentColor='#10B981'
            trend={stats.monthlyRevenue > 0 ? formatCurrency(stats.monthlyRevenue) : undefined}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <RecentLeadsList leads={recentLeads} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <PipelineSnapshot data={leadConversion} />
        </Grid>
      </Grid>
    </Box>
  )
}
