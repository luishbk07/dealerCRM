import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { TableSkeleton } from '@/shared/components'

export const SalesListSkeleton = () => (
  <Box>
    <Stack spacing={1} sx={{ mb: 3 }}>
      <Skeleton variant='text' width={160} height={40} />
      <Skeleton variant='text' width={240} height={22} />
    </Stack>
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Skeleton variant='text' width='60%' height={20} />
              <Skeleton variant='text' width='40%' height={36} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Skeleton variant='rounded' height={220} />
      </CardContent>
    </Card>
    <Card>
      <CardContent sx={{ p: 0 }}>
        <TableSkeleton />
      </CardContent>
    </Card>
  </Box>
)
