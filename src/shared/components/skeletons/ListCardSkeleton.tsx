import { Box, Card, CardContent, Divider, Skeleton, Stack } from '@mui/material'

interface ListCardSkeletonProps {
  rows?: number
}

export const ListCardSkeleton = ({ rows = 4 }: ListCardSkeletonProps) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 0 }}>
      <Box sx={{ p: 3, pb: 2 }}>
        <Skeleton variant='text' width='55%' height={32} />
        <Skeleton variant='text' width='70%' height={20} sx={{ mt: 0.5 }} />
      </Box>
      <Divider />
      <Stack spacing={1.5} sx={{ p: 3 }}>
        {Array.from({ length: rows }).map((_, index) => (
          <Stack key={index} direction='row' spacing={1.5} alignItems='center'>
            <Skeleton variant='circular' width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant='text' width='80%' height={20} />
              <Skeleton variant='text' width='55%' height={16} />
            </Box>
          </Stack>
        ))}
      </Stack>
    </CardContent>
  </Card>
)
