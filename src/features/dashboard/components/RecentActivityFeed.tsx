import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
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
  Skeleton,
  Stack,
  Typography,
  Alert,
  useTheme
} from '@mui/material'
import type { ReactNode } from 'react'
import { formatRelative } from '@/shared/utils/format'
import type { ActivityAction, ActivityLog } from '@/shared/types/activityLog'

interface RecentActivityFeedProps {
  activities: ActivityLog[]
  isLoading?: boolean
  isError?: boolean
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
  lead_task_created: <EventAvailableOutlinedIcon fontSize='small' />,
  lead_task_completed: <TaskAltOutlinedIcon fontSize='small' />,
  lead_task_deleted: <EventBusyOutlinedIcon fontSize='small' />,
  sale_created: <PaidOutlinedIcon fontSize='small' />,
  dealer_updated: <StorefrontOutlinedIcon fontSize='small' />,
  logo_updated: <ImageOutlinedIcon fontSize='small' />,
  banner_updated: <ImageOutlinedIcon fontSize='small' />
}

const useActivityColors = (): Record<ActivityAction, string> => {
  const theme = useTheme()
  const { primary, info, secondary, success, warning, error, text } = theme.palette

  return {
    vehicle_created: primary.main,
    vehicle_updated: info.main,
    vehicle_deleted: error.main,
    vehicle_shared: secondary.main,
    vehicle_featured: warning.main,
    vehicle_unfeatured: text.disabled,
    lead_created: info.main,
    lead_updated: secondary.main,
    lead_status_changed: secondary.main,
    lead_task_created: info.main,
    lead_task_completed: success.main,
    lead_task_deleted: error.main,
    sale_created: warning.main,
    dealer_updated: text.secondary,
    logo_updated: success.main,
    banner_updated: success.main
  }
}

const ActivityIcon = ({ action, color }: { action: ActivityAction, color: string }) => (
  <Box
    sx={{
      width: 36,
      height: 36,
      borderRadius: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      backgroundColor: `${color}1A`,
      color
    }}
  >
    {ACTIVITY_ICONS[action]}
  </Box>
)

const LoadingBody = () => (
  <Stack spacing={1.5} sx={{ p: 3 }}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Stack key={index} direction='row' spacing={1.5} alignItems='flex-start'>
        <Skeleton variant='rounded' width={36} height={36} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant='text' width='65%' height={20} />
          <Skeleton variant='text' width='90%' height={16} />
        </Box>
      </Stack>
    ))}
  </Stack>
)

export const RecentActivityFeed = ({ activities, isLoading, isError }: RecentActivityFeedProps) => {
  const activityColors = useActivityColors()

  const renderBody = () => {
    if (isLoading) return <LoadingBody />

    if (isError) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity='warning' sx={{ borderRadius: 2 }}>
            No se pudo cargar la información.
          </Alert>
        </Box>
      )
    }

    if (activities.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='body2' color='text.secondary'>
            No hay actividad todavía.
          </Typography>
        </Box>
      )
    }

    return (
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
              <ActivityIcon action={activity.action} color={activityColors[activity.action]} />
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
    )
  }

  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant='h5' component='h2'>
            Actividad reciente
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Lo último que ocurrió en tu CRM
          </Typography>
        </Box>
        <Divider />
        {renderBody()}
      </CardContent>
    </Card>
  )
}
