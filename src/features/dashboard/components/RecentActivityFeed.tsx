import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography
} from '@mui/material'
import type { ReactNode } from 'react'
import { formatRelative } from '@/shared/utils/format'
import type { ActivityAction, ActivityLog } from '@/shared/types/activityLog'

interface RecentActivityFeedProps {
  activities: ActivityLog[]
}

const ACTIVITY_ICONS: Record<ActivityAction, ReactNode> = {
  vehicle_created: <DirectionsCarFilledOutlinedIcon fontSize='small' />,
  vehicle_updated: <EditOutlinedIcon fontSize='small' />,
  vehicle_deleted: <DeleteOutlineIcon fontSize='small' />,
  vehicle_shared: <ShareOutlinedIcon fontSize='small' />,
  vehicle_featured: <StarOutlineIcon fontSize='small' />,
  vehicle_unfeatured: <StarBorderOutlinedIcon fontSize='small' />,
  lead_created: <PersonOutlineIcon fontSize='small' />,
  lead_updated: <TrendingUpOutlinedIcon fontSize='small' />,
  lead_status_changed: <TrendingUpOutlinedIcon fontSize='small' />,
  sale_created: <PaidOutlinedIcon fontSize='small' />,
  dealer_updated: <StorefrontOutlinedIcon fontSize='small' />,
  logo_updated: <ImageOutlinedIcon fontSize='small' />,
  banner_updated: <ImageOutlinedIcon fontSize='small' />
}

const ACTIVITY_COLORS: Record<ActivityAction, string> = {
  vehicle_created: '#2563EB',
  vehicle_updated: '#0EA5E9',
  vehicle_deleted: '#EF4444',
  vehicle_shared: '#6366F1',
  vehicle_featured: '#F59E0B',
  vehicle_unfeatured: '#94A3B8',
  lead_created: '#0EA5E9',
  lead_updated: '#8B5CF6',
  lead_status_changed: '#8B5CF6',
  sale_created: '#F59E0B',
  dealer_updated: '#64748B',
  logo_updated: '#10B981',
  banner_updated: '#10B981'
}

const ActivityIcon = ({ action }: { action: ActivityAction }) => (
  <Box
    sx={{
      width: 36,
      height: 36,
      borderRadius: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      backgroundColor: `${ACTIVITY_COLORS[action]}1A`,
      color: ACTIVITY_COLORS[action]
    }}
  >
    {ACTIVITY_ICONS[action]}
  </Box>
)

export const RecentActivityFeed = ({ activities }: RecentActivityFeedProps) => {
  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant='h5'>Actividad reciente</Typography>
          <Typography variant='body2' color='text.secondary'>
            Lo último que ocurrió en tu CRM
          </Typography>
        </Box>
        <Divider />
        {activities.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant='body2' color='text.secondary'>
              No hay actividad todavía.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: { xs: 360, md: 420 },
              overflowY: 'auto'
            }}
          >
            <Stack divider={<Divider flexItem />} sx={{ p: 0 }}>
              {activities.map((activity) => (
                <Stack
                  key={activity.id}
                  direction='row'
                  spacing={1.5}
                  alignItems='flex-start'
                  sx={{
                    px: 3,
                    py: 2,
                    transition: 'background-color 0.15s ease',
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <ActivityIcon action={activity.action} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack
                      direction='row'
                      justifyContent='space-between'
                      alignItems='flex-start'
                      spacing={1}
                    >
                      <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                        {activity.title}
                      </Typography>
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                      >
                        {formatRelative(activity.createdAt)}
                      </Typography>
                    </Stack>
                    <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                      {activity.description}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
