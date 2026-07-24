import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'

const SummaryCardSkeleton = () => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Stack direction='row' justifyContent='space-between' spacing={2}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant='text' width='60%' height={20} />
          <Skeleton variant='text' width='40%' height={44} sx={{ mt: 0.5 }} />
          <Skeleton variant='text' width='70%' height={18} sx={{ mt: 0.5 }} />
        </Box>
        <Skeleton variant='rounded' width={48} height={48} />
      </Stack>
    </CardContent>
  </Card>
)

const PanelSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 3 }}>
      <Skeleton variant='text' width='45%' height={32} />
      <Skeleton variant='text' width='65%' height={20} sx={{ mb: 2.5 }} />
      <Stack spacing={2}>
        {Array.from({ length: rows }).map((_, index) => (
          <Box key={index}>
            <Skeleton variant='text' width='100%' height={20} />
            <Skeleton variant='rounded' height={8} sx={{ mt: 0.75 }} />
          </Box>
        ))}
      </Stack>
    </CardContent>
  </Card>
)

export const DashboardSkeleton = () => {
  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Skeleton variant='text' width={180} height={40} />
        <Skeleton variant='text' width={280} height={22} />
      </Stack>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <SummaryCardSkeleton />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <PanelSkeleton rows={5} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <PanelSkeleton rows={4} />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Skeleton variant='text' width='40%' height={32} />
              <Skeleton variant='text' width='55%' height={20} sx={{ mb: 2 }} />
              <Skeleton variant='rounded' height={220} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <PanelSkeleton rows={6} />
        </Grid>
      </Grid>
    </Box>
  )
}
