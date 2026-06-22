import { Box, Stack, Typography, type SxProps, type Theme } from '@mui/material'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  sx?: SxProps<Theme>
}

export const PageHeader = ({ title, subtitle, actions, sx }: PageHeaderProps) => {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent='space-between'
      sx={{ mb: 3, ...sx }}
    >
      <Box>
        <Typography variant='h3' component='h1'>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {actions ? <Box>{actions}</Box> : null}
    </Stack>
  )
}
