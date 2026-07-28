import { Box, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/routes/paths'
import type { PublicRelatedVehicle } from '../types'
import { PublicVehicleCard } from './PublicVehicleSection'

interface PublicRelatedVehiclesProps {
  dealerSlug: string
  vehicles: PublicRelatedVehicle[]
}

export const PublicRelatedVehicles = ({ dealerSlug, vehicles }: PublicRelatedVehiclesProps) => {
  const navigate = useNavigate()

  if (vehicles.length === 0) return null

  return (
    <Box sx={{ mt: { xs: 5, md: 6 } }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant='h4' component='h2'>
          Vehículos relacionados
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Otros vehículos disponibles en este concesionario
        </Typography>
      </Stack>
      <Grid container spacing={2.5}>
        {vehicles.map((vehicle) => (
          <Grid key={vehicle.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <PublicVehicleCard
              brand={vehicle.brand}
              model={vehicle.model}
              year={vehicle.year}
              price={vehicle.price}
              mileage={vehicle.mileage}
              transmission={vehicle.transmission}
              fuelType={vehicle.fuelType}
              status='active'
              imageUrl={vehicle.imageUrl}
              onViewDetails={() => navigate(paths.dealerPublicVehicle(dealerSlug, vehicle.id))}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
