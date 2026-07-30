import { Box, Card, CardContent, Stack, Typography, useTheme } from '@mui/material'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import type { MonthlySalesPoint } from '@/shared/types'
import { formatCurrency, formatMonthLabel } from '@/shared/utils/format'
import { hasSalesTrendData } from '../utils/dashboardMetrics'

interface SalesTrendChartProps {
  data: MonthlySalesPoint[]
}

const CHART_WIDTH = 640
const CHART_HEIGHT = 220
const PADDING = { top: 20, right: 24, bottom: 40, left: 72 }

const formatCompactCurrency = (value: number): string => {
  if (value >= 1_000_000) return `RD$${Math.round(value / 100_000) / 10}M`
  if (value >= 1_000) return `RD$${Math.round(value / 100) / 10}K`
  return formatCurrency(value)
}

export const SalesTrendChart = ({ data }: SalesTrendChartProps) => {
  const theme = useTheme()
  const chartColor = theme.palette.primary.main
  const hasData = hasSalesTrendData(data)

  if (!hasData) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Stack spacing={0.5} sx={{ mb: 2.5 }}>
            <Typography variant='h5'>Tendencia de ventas</Typography>
            <Typography variant='body2' color='text.secondary'>
              Ingresos mensuales de los últimos 6 meses
            </Typography>
          </Stack>
          <Box
            sx={{
              py: 6,
              px: 2,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider',
              color: 'text.secondary'
            }}
          >
            <TrendingUpOutlinedIcon sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />
            <Typography variant='body2'>Cuando registres ventas aparecerán aquí.</Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom
  const maxRevenue = Math.max(...data.map((point) => point.revenue), 1)
  const yTicks = [0, maxRevenue / 2, maxRevenue]

  const points = data.map((point, index) => {
    const x =
      data.length === 1
        ? PADDING.left + plotWidth / 2
        : PADDING.left + (index / (data.length - 1)) * plotWidth
    const y = PADDING.top + plotHeight - (point.revenue / maxRevenue) * plotHeight
    return { ...point, x, y }
  })

  const linePath =
    points.length === 1
      ? `M ${PADDING.left} ${points[0].y} L ${PADDING.left + plotWidth} ${points[0].y}`
      : points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PADDING.top + plotHeight} L ${points[0].x} ${PADDING.top + plotHeight} Z`

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography variant='h5'>Tendencia de ventas</Typography>
          <Typography variant='body2' color='text.secondary'>
            Ingresos mensuales de los últimos 6 meses
          </Typography>
        </Stack>
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <Box
            component='svg'
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            sx={{ width: '100%', minWidth: 320, height: CHART_HEIGHT, display: 'block' }}
            role='img'
            aria-label='Gráfico de tendencia de ventas mensuales'
          >
            {yTicks.map((tick) => {
              const y = PADDING.top + plotHeight - (tick / maxRevenue) * plotHeight
              return (
                <g key={tick}>
                  <line
                    x1={PADDING.left}
                    y1={y}
                    x2={PADDING.left + plotWidth}
                    y2={y}
                    stroke='currentColor'
                    strokeOpacity={0.08}
                  />
                  <text
                    x={PADDING.left - 10}
                    y={y + 4}
                    textAnchor='end'
                    fontSize='11'
                    fill='currentColor'
                    fillOpacity={0.55}
                  >
                    {formatCompactCurrency(tick)}
                  </text>
                </g>
              )
            })}

            <defs>
              <linearGradient id='salesTrendFill' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor={chartColor} stopOpacity={0.18} />
                <stop offset='100%' stopColor={chartColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <path d={areaPath} fill='url(#salesTrendFill)' />
            <path
              d={linePath}
              fill='none'
              stroke={chartColor}
              strokeWidth={2.5}
              strokeLinecap='round'
              strokeLinejoin='round'
            />

            {points.map((point) => (
              <g key={point.monthStart}>
                <circle cx={point.x} cy={point.y} r={4.5} fill={chartColor} stroke='#fff' strokeWidth={2} />
                <text
                  x={point.x}
                  y={CHART_HEIGHT - 12}
                  textAnchor='middle'
                  fontSize='11'
                  fill='currentColor'
                  fillOpacity={0.7}
                >
                  {formatMonthLabel(point.monthStart)}
                </text>
              </g>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
