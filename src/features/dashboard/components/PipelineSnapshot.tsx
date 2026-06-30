import { Box, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material'
import type { LeadConversionPoint } from '@/shared/types'

interface PipelineSnapshotProps {
  data: LeadConversionPoint[]
}

interface StageConfig {
  status: string
  label: string
  color: string
}

const STAGES: StageConfig[] = [
  { status: 'new', label: 'Nuevos', color: '#0EA5E9' },
  { status: 'contacted', label: 'Contactados', color: '#2563EB' },
  { status: 'qualified', label: 'Calificados', color: '#F59E0B' },
  { status: 'sold', label: 'Vendidos', color: '#10B981' },
  { status: 'lost', label: 'Perdidos', color: '#94A3B8' }
]

export const PipelineSnapshot = ({ data }: PipelineSnapshotProps) => {
  const total = data.reduce((sum, point) => sum + point.count, 0)
  const countByStatus = new Map(data.map((point) => [point.status, point.count]))

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Typography variant='h5'>Pipeline</Typography>
          <Typography variant='body2' color='text.secondary'>
            Distribución actual de tus oportunidades
          </Typography>
        </Stack>
        <Stack spacing={2.5}>
          {STAGES.map((stage) => {
            const count = countByStatus.get(stage.status) ?? 0
            const percent = total === 0 ? 0 : Math.round((count / total) * 100)
            return (
              <Box key={stage.status}>
                <Stack direction='row' justifyContent='space-between' sx={{ mb: 0.5 }}>
                  <Typography variant='body2' sx={{ fontWeight: 500 }}>
                    {stage.label}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {count} · {percent}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant='determinate'
                  value={percent}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: 'action.hover',
                    '& .MuiLinearProgress-bar': { backgroundColor: stage.color }
                  }}
                />
              </Box>
            )
          })}
        </Stack>
      </CardContent>
    </Card>
  )
}
