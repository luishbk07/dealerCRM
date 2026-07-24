import Grid from '@mui/material/Grid2'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import FiberNewOutlinedIcon from '@mui/icons-material/FiberNewOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import { KpiCard } from '@/shared/components'
import { formatCurrency, formatNumber } from '@/shared/utils/format'
import type { DealerStats } from '@/shared/types'
import { formatSalesCountLabel } from '../utils/dashboardMetrics'

interface DashboardSummaryCardsProps {
  stats: DealerStats
  pendingLeads: number
}

export const DashboardSummaryCards = ({ stats, pendingLeads }: DashboardSummaryCardsProps) => {
  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard
          label='Vehículos activos'
          value={formatNumber(stats.activeVehicles)}
          description='Disponibles para vender'
          icon={<DirectionsCarFilledOutlinedIcon />}
          accentColor='#2563EB'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard
          label='Leads nuevos'
          value={formatNumber(stats.newLeads)}
          description='Últimas 24 horas'
          icon={<FiberNewOutlinedIcon />}
          accentColor='#0EA5E9'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard
          label='Leads pendientes'
          value={formatNumber(pendingLeads)}
          description='Requieren seguimiento'
          icon={<HourglassEmptyOutlinedIcon />}
          accentColor='#F59E0B'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard
          label='Ventas del mes'
          value={formatCurrency(stats.monthlyRevenue)}
          description={formatSalesCountLabel(stats.monthlySalesCount)}
          icon={<PaidOutlinedIcon />}
          accentColor='#10B981'
        />
      </Grid>
    </Grid>
  )
}
