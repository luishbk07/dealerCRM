import { Box, Skeleton, Stack } from '@mui/material'

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export const TableSkeleton = ({ rows = 8, columns = 5 }: TableSkeletonProps) => (
  <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
    <Stack direction='row' spacing={2} sx={{ mb: 2 }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} variant='text' height={20} sx={{ flex: 1 }} />
      ))}
    </Stack>
    <Stack spacing={1.5}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Skeleton key={rowIndex} variant='rounded' height={48} />
      ))}
    </Stack>
  </Box>
)
