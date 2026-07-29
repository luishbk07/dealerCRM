import { Box, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Grid from '@mui/material/Grid2'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { DetailPageSkeleton, EmptyState, ErrorAlert, PageHeader } from '@/shared/components'
import { formatCurrency, formatDateTime } from '@/shared/utils/format'
import { paths } from '@/app/routes/paths'
import { getReturnPath } from '@/shared/utils/listNavigation'
import { useLead } from '@/features/leads/hooks/useLead'
import { useVehicle } from '@/features/vehicles/hooks/useVehicle'
import { SaleDetailInfo } from '../components/SaleDetailInfo'
import { useSale } from '../hooks/useSale'

export const SaleDetailPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const returnPath = getReturnPath(location.state, paths.sales)

  const saleQuery = useSale(id)
  const sale = saleQuery.data ?? null

  const leadQuery = useLead(sale?.leadId ?? undefined)
  const vehicleQuery = useVehicle(sale?.vehicleId ?? undefined)

  if (saleQuery.isLoading) {
    return <DetailPageSkeleton />
  }

  if (saleQuery.isError) {
    return (
      <Box>
        <PageHeader title='Venta' />
        <ErrorAlert error={saleQuery.error} onRetry={() => void saleQuery.refetch()} />
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(returnPath)}
          sx={{ mt: 2 }}
          aria-label='Volver a ventas'
        >
          Volver a ventas
        </Button>
      </Box>
    )
  }

  if (!sale) {
    return (
      <Box>
        <PageHeader title='Venta' />
        <EmptyState
          title='Venta no encontrada'
          description='La venta que buscas no existe o ya no está disponible.'
          action={
            <Button
              variant='contained'
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(returnPath)}
              aria-label='Volver a ventas'
            >
              Volver a ventas
            </Button>
          }
        />
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader
        title={`Venta · ${formatCurrency(sale.price)}`}
        subtitle={`Registrada el ${formatDateTime(sale.soldAt)}`}
        actions={
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(returnPath)}
            aria-label='Volver a la lista de ventas'
          >
            Volver
          </Button>
        }
      />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SaleDetailInfo
            sale={sale}
            lead={leadQuery.data?.lead ?? null}
            vehicle={vehicleQuery.data ?? null}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
