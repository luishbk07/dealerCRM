import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography
} from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined'
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'
import type { ReactNode } from 'react'
import { formatDateTime } from '@/shared/utils/format'
import type { LeadActivityEvent, LeadActivityType } from '../utils/buildLeadActivity'

interface LeadActivityTimelineProps {
  events: LeadActivityEvent[]
}

const ACTIVITY_ICONS: Record<LeadActivityType, ReactNode> = {
  lead_created: <PersonAddOutlinedIcon fontSize='small' />,
  status_changed: <SwapHorizOutlinedIcon fontSize='small' />,
  note_added: <StickyNote2OutlinedIcon fontSize='small' />,
  message_added: <ChatOutlinedIcon fontSize='small' />
}

export const LeadActivityTimeline = ({ events }: LeadActivityTimelineProps) => {
  return (
    <Card component='section' aria-labelledby='lead-activity-title'>
      <CardContent>
        <Typography id='lead-activity-title' variant='subtitle1' component='h2' sx={{ mb: 2 }}>
          Actividad
        </Typography>
        {events.length === 0 ? (
          <Typography variant='body2' color='text.secondary'>
            Aún no hay actividad registrada para este lead.
          </Typography>
        ) : (
          <Stack component='ol' spacing={0} sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {events.map((event, index) => (
              <Box
                component='li'
                key={event.id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  pb: index < events.length - 1 ? 2.5 : 0,
                  position: 'relative'
                }}
              >
                {index < events.length - 1 ? (
                  <Box
                    aria-hidden
                    sx={{
                      position: 'absolute',
                      left: 15,
                      top: 28,
                      bottom: 0,
                      width: 2,
                      bgcolor: 'divider'
                    }}
                  />
                ) : null}
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'action.hover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 1
                  }}
                >
                  {ACTIVITY_ICONS[event.type]}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
                    <Typography variant='subtitle2'>{event.title}</Typography>
                    <FiberManualRecordIcon sx={{ fontSize: 6, color: 'text.disabled' }} />
                    <Typography variant='caption' color='text.secondary'>
                      {formatDateTime(event.timestamp)}
                    </Typography>
                  </Stack>
                  {event.description ? (
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                    >
                      {event.description}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
