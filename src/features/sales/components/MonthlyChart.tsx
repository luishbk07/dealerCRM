import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import type { MonthlySaleStat } from '../hooks/useSalesData'
import { formatCurrency } from '@/shared/utils/format'

interface MonthlyChartProps {
  data: MonthlySaleStat[]
}

export const MonthlyChart = ({ data }: MonthlyChartProps) => {
  const maxRevenue = Math.max(...data.map((item) => item.revenue), 1)

  return (
    <Card>
      <CardContent>
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Typography variant='h5'>Ventas por mes</Typography>
          <Typography variant='body2' color='text.secondary'>
            Últimos 6 meses
          </Typography>
        </Stack>
        <Stack direction='row' spacing={2} alignItems='flex-end' sx={{ height: 200 }}>
          {data.map((item) => {
            const heightPercent = (item.revenue / maxRevenue) * 100
            return (
              <Stack key={item.label} sx={{ flex: 1, height: '100%' }} justifyContent='flex-end' spacing={1}>
                <Stack alignItems='center'>
                  <Typography variant='caption' sx={{ fontWeight: 600 }}>
                    {item.count}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    width: '100%',
                    backgroundColor: 'primary.main',
                    borderRadius: 1,
                    minHeight: 4,
                    height: `${heightPercent}%`,
                    transition: 'height 200ms ease'
                  }}
                  title={formatCurrency(item.revenue)}
                />
                <Typography variant='caption' color='text.secondary' textAlign='center'>
                  {item.label}
                </Typography>
              </Stack>
            )
          })}
        </Stack>
      </CardContent>
    </Card>
  )
}
