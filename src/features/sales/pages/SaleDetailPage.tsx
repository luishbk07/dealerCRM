import { Alert, Box, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Grid from '@mui/material/Grid2'
import { useNavigate, useParams } from 'react-router-dom'
import { EmptyState, LoadingState, PageHeader } from '@/shared/components'
import { formatCurrency, formatDateTime } from '@/shared/utils/format'
import { paths } from '@/app/routes/paths'
import { useLead } from '@/features/leads/hooks/useLead'
import { useVehicle } from '@/features/vehicles/hooks/useVehicle'
import { SaleDetailInfo } from '../components/SaleDetailInfo'
import { useSale } from '../hooks/useSale'

export const SaleDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const saleQuery = useSale(id)
  const sale = saleQuery.data ?? null

  const leadQuery = useLead(sale?.leadId ?? undefined)
  const vehicleQuery = useVehicle(sale?.vehicleId ?? undefined)

  if (saleQuery.isLoading) {
    return <LoadingState message='Cargando detalle de la venta…' />
  }

  if (saleQuery.isError) {
    return (
      <Box>
        <PageHeader title='Venta' />
        <Alert severity='error'>No fue posible cargar la venta.</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(paths.sales)} sx={{ mt: 2 }}>
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
            <Button variant='contained' startIcon={<ArrowBackIcon />} onClick={() => navigate(paths.sales)}>
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
            onClick={() => navigate(paths.sales)}
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
