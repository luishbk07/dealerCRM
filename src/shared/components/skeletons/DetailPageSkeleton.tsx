import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'

export const DetailPageSkeleton = () => (
  <Box>
    <Skeleton variant='text' width={160} height={36} sx={{ mb: 2 }} />
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent='space-between' spacing={2} sx={{ mb: 3 }}>
      <Box sx={{ flex: 1 }}>
        <Skeleton variant='text' width='45%' height={40} />
        <Skeleton variant='text' width='60%' height={22} />
      </Box>
      <Stack direction='row' spacing={1}>
        <Skeleton variant='rounded' width={120} height={36} />
        <Skeleton variant='rounded' width={120} height={36} />
      </Stack>
    </Stack>
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} variant='rounded' height={56} />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} variant='rounded' height={48} />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
)
