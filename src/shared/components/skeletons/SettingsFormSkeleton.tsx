import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material'

export const SettingsFormSkeleton = () => (
  <Box>
    <Stack spacing={1} sx={{ mb: 3 }}>
      <Skeleton variant='text' width={280} height={40} />
      <Skeleton variant='text' width={360} height={22} />
    </Stack>
    <Card>
      <CardContent>
        <Stack spacing={2.5}>
          <Skeleton variant='rounded' height={120} />
          <Skeleton variant='rounded' height={120} />
          <GridFieldsSkeleton rows={4} />
          <Skeleton variant='rounded' width={160} height={40} sx={{ alignSelf: 'flex-end' }} />
        </Stack>
      </CardContent>
    </Card>
  </Box>
)

const GridFieldsSkeleton = ({ rows }: { rows: number }) => (
  <Stack spacing={2}>
    {Array.from({ length: rows }).map((_, index) => (
      <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Skeleton variant='rounded' height={56} sx={{ flex: 1 }} />
        <Skeleton variant='rounded' height={56} sx={{ flex: 1 }} />
      </Stack>
    ))}
  </Stack>
)
