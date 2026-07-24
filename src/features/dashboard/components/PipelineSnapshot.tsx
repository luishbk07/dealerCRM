import { Box, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material'
import type { LeadConversionPoint } from '@/shared/types'
import {
  LEAD_STATUS_CONTACTED,
  LEAD_STATUS_LOST,
  LEAD_STATUS_NEGOTIATING,
  LEAD_STATUS_NEW,
  LEAD_STATUS_QUALIFIED,
  LEAD_STATUS_SOLD
} from '@/modules/leads/constants/leadStatus'

interface PipelineSnapshotProps {
  data: LeadConversionPoint[]
}

const DASHBOARD_PIPELINE_STAGES = [
  { status: LEAD_STATUS_NEW, label: 'Nuevo', color: '#0EA5E9' },
  { status: LEAD_STATUS_CONTACTED, label: 'Contactado', color: '#2563EB' },
  { status: LEAD_STATUS_QUALIFIED, label: 'Calificado', color: '#F59E0B' },
  { status: LEAD_STATUS_NEGOTIATING, label: 'Negociando', color: '#8B5CF6' },
  { status: LEAD_STATUS_SOLD, label: 'Vendido', color: '#10B981' },
  { status: LEAD_STATUS_LOST, label: 'Perdido', color: '#94A3B8' }
] as const

export const PipelineSnapshot = ({ data }: PipelineSnapshotProps) => {
  const total = data.reduce((sum, point) => sum + point.count, 0)
  const countByStatus = new Map(data.map((point) => [point.status, point.count]))

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Typography variant='h5'>Pipeline</Typography>
          <Typography variant='body2' color='text.secondary'>
            Distribución actual de tus oportunidades
          </Typography>
        </Stack>

        {total === 0 ? (
          <Box
            sx={{
              py: 4,
              px: 2,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider'
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              Aún no hay leads en tu pipeline.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2.25}>
            {DASHBOARD_PIPELINE_STAGES.map((stage) => {
              const count = countByStatus.get(stage.status) ?? 0
              const percent = total === 0 ? 0 : Math.round((count / total) * 100)

              return (
                <Box key={stage.status}>
                  <Stack direction='row' justifyContent='space-between' sx={{ mb: 0.75 }}>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
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
                      transition: 'opacity 0.2s ease',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: stage.color,
                        transition: 'transform 0.4s ease'
                      }
                    }}
                  />
                </Box>
              )
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
