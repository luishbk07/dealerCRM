import { Card, CardContent, Skeleton, Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'

interface CardGridSkeletonProps {
  count?: number
  columns?: { xs?: number, sm?: number, md?: number, lg?: number }
}

const VehicleCardSkeleton = () => (
  <Card sx={{ height: '100%' }}>
    <Skeleton variant='rectangular' sx={{ aspectRatio: '16 / 10' }} />
    <CardContent>
      <Skeleton variant='text' width='70%' height={24} />
      <Skeleton variant='text' width='40%' height={18} sx={{ mt: 0.5 }} />
      <Skeleton variant='text' width='50%' height={32} sx={{ mt: 1 }} />
      <Stack direction='row' spacing={1} sx={{ mt: 1.5 }}>
        <Skeleton variant='rounded' width={72} height={20} />
        <Skeleton variant='rounded' width={72} height={20} />
      </Stack>
    </CardContent>
  </Card>
)

export const CardGridSkeleton = ({
  count = 8,
  columns = { xs: 12, sm: 6, md: 4, lg: 3 }
}: CardGridSkeletonProps) => (
  <Grid container spacing={2.5}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid key={index} size={columns}>
        <VehicleCardSkeleton />
      </Grid>
    ))}
  </Grid>
)
