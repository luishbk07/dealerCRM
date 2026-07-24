import { Alert, Box, Fade } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { PageHeader } from '@/shared/components'
import { isDev } from '@/shared/utils/environment'
import { useDashboardPage } from '../hooks/useDashboardPage'
import { DashboardSummaryCards } from '../components/DashboardSummaryCards'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import { RecentLeadsList } from '../components/RecentLeadsList'
import { PipelineSnapshot } from '../components/PipelineSnapshot'
import { SalesTrendChart } from '../components/SalesTrendChart'
import { DashboardEmptyBanner, QuickActionsCard } from '../components/QuickActionsCard'
import { countPendingLeads } from '../utils/dashboardMetrics'

export const DashboardPage = () => {
  const { snapshot, recentLeads, vehicleById, isLoading, isError, error } = useDashboardPage()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError) {
    return (
      <Alert severity='error'>
        No pudimos cargar tu dashboard. Por favor contacta al soporte.
        {isDev ? ` ${(error as Error).message}` : ''}
      </Alert>
    )
  }

  if (!snapshot) return null

  const { stats, monthlySales, leadConversion } = snapshot
  const pendingLeads = countPendingLeads(leadConversion)

  return (
    <Fade in timeout={300}>
      <Box>
        <PageHeader
          title='Dashboard'
          subtitle='Resumen rápido de tu operación de hoy'
        />

        <DashboardEmptyBanner
          showNoVehicles={stats.totalVehicles === 0}
          showNoLeads={stats.totalLeads === 0}
        />

        <DashboardSummaryCards stats={stats} pendingLeads={pendingLeads} />

        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <RecentLeadsList
              leads={recentLeads}
              vehicleById={vehicleById}
              totalLeads={stats.totalLeads}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <QuickActionsCard />
          </Grid>
        </Grid>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <SalesTrendChart data={monthlySales} />
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <PipelineSnapshot data={leadConversion} />
          </Grid>
        </Grid>
      </Box>
    </Fade>
  )
}
