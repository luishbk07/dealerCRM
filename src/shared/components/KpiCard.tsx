import { Card, CardContent, Stack, Typography, Box } from '@mui/material'
import type { ReactNode } from 'react'

interface KpiCardProps {
  label: string
  value: string | number
  description?: string
  icon: ReactNode
  accentColor?: string
  trend?: string
}

export const KpiCard = ({ label, value, description, icon, accentColor = '#2563EB', trend }: KpiCardProps) => {
  const secondaryText = description ?? trend

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': { boxShadow: 2 }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack direction='row' alignItems='flex-start' justifyContent='space-between' spacing={2}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500 }}>
              {label}
            </Typography>
            <Typography variant='h3' sx={{ mt: 0.75, lineHeight: 1.15 }}>
              {value}
            </Typography>
            {secondaryText ? (
              <Typography
                variant='caption'
                color={description ? 'text.secondary' : 'success.main'}
                sx={{ display: 'block', mt: 0.75, fontWeight: description ? 400 : 600 }}
              >
                {secondaryText}
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
