import { Chip, type ChipProps } from '@mui/material'

type FeaturedBadgeProps = Omit<ChipProps, 'label'>

export const FeaturedBadge = ({ size = 'small', sx, ...rest }: FeaturedBadgeProps) => (
  <Chip
    label='⭐ Destacado'
    size={size}
    sx={{
      backgroundColor: 'rgba(245, 158, 11, 0.95)',
      color: '#fff',
      fontWeight: 600,
      boxShadow: '0 1px 4px rgba(15, 23, 42, 0.2)',
      ...sx
    }}
    {...rest}
  />
)
