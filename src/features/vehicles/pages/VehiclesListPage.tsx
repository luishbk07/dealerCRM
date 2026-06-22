import { Alert, Box, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import AddIcon from '@mui/icons-material/Add'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState, LoadingState, PageHeader } from '@/shared/components'
import { paths } from '@/app/routes/paths'
import { useVehicles } from '../hooks/useVehicles'
import { VehicleCard } from '../components/VehicleCard'
import { VehicleFilters, type VehicleFiltersState } from '../components/VehicleFilters'

export const VehiclesListPage = () => {
  const navigate = useNavigate()
  const { vehicles, loading, error } = useVehicles()
  const [filters, setFilters] = useState<VehicleFiltersState>({ query: '', status: 'all' })

  const filtered = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    return vehicles.filter((vehicle) => {
      if (filters.status !== 'all' && vehicle.status !== filters.status) return false
      if (!query) return true
      return (
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        `${vehicle.year}`.includes(query)
      )
    })
  }, [vehicles, filters])

  if (loading) return <LoadingState message='Cargando inventario…' />
  if (error) return <Alert severity='error'>{error.message}</Alert>

  return (
    <Box>
      <PageHeader
        title='Vehículos'
        subtitle={`${vehicles.length} vehículos en tu inventario`}
        actions={
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => navigate(paths.vehicleNew)}>
            Nuevo vehículo
          </Button>
        }
      />

      <VehicleFilters value={filters} onChange={setFilters} />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<DirectionsCarFilledOutlinedIcon fontSize='inherit' />}
          title={vehicles.length === 0 ? 'Aún no tienes vehículos' : 'Sin resultados'}
          description={
            vehicles.length === 0
              ? 'Publica tu primer vehículo y empieza a captar leads.'
              : 'Prueba ajustar los filtros o limpiar la búsqueda.'
          }
          action={
            vehicles.length === 0 ? (
              <Button variant='contained' startIcon={<AddIcon />} onClick={() => navigate(paths.vehicleNew)}>
                Publicar vehículo
              </Button>
            ) : null
          }
        />
      ) : (
        <Grid container spacing={2.5}>
          {filtered.map((vehicle) => (
            <Grid key={vehicle.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <VehicleCard vehicle={vehicle} onClick={() => navigate(paths.vehicleEdit(vehicle.id))} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
