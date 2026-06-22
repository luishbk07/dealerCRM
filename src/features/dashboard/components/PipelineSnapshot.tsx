import { Box, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material'
import type { Lead, LeadStatus } from '@/shared/types'

interface PipelineSnapshotProps {
  leads: Lead[]
}

const STAGES: { status: LeadStatus, label: string, color: string }[] = [
  { status: 'new', label: 'Nuevos', color: '#0EA5E9' },
  { status: 'contacted', label: 'Contactados', color: '#2563EB' },
  { status: 'negotiating', label: 'Negociando', color: '#F59E0B' },
  { status: 'sold', label: 'Vendidos', color: '#10B981' }
]

export const PipelineSnapshot = ({ leads }: PipelineSnapshotProps) => {
  const total = leads.length
  const counts = STAGES.map((stage) => ({
    ...stage,
    count: leads.filter((lead) => lead.status === stage.status).length
  }))

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
          {counts.map((stage) => {
            const percent = total === 0 ? 0 : Math.round((stage.count / total) * 100)
            return (
              <Box key={stage.status}>
                <Stack direction='row' justifyContent='space-between' sx={{ mb: 0.5 }}>
                  <Typography variant='body2' sx={{ fontWeight: 500 }}>
                    {stage.label}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {stage.count} · {percent}%
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
