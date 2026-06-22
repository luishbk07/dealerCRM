import { Card, CardContent, Stack, Typography, Box } from '@mui/material'
import type { ReactNode } from 'react'

interface KpiCardProps {
  label: string
  value: string | number
  icon: ReactNode
  accentColor?: string
  trend?: string
}

export const KpiCard = ({ label, value, icon, accentColor = '#2563EB', trend }: KpiCardProps) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={2}>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              {label}
            </Typography>
            <Typography variant='h3' sx={{ mt: 0.5 }}>
              {value}
            </Typography>
            {trend ? (
              <Typography variant='caption' color='success.main' sx={{ fontWeight: 600 }}>
                {trend}
              </Typography>
            ) : null}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${accentColor}1A`,
              color: accentColor
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
