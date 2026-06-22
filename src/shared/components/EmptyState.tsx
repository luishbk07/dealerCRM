import { Box, Paper, Stack, Typography } from '@mui/material'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => {
  return (
    <Paper sx={{ p: 5, textAlign: 'center', borderStyle: 'dashed' }}>
      <Stack spacing={2} alignItems='center'>
        <Box sx={{ color: 'text.secondary', fontSize: 48, display: 'flex' }}>
          {icon ?? <InboxOutlinedIcon fontSize='inherit' />}
        </Box>
        <Box>
          <Typography variant='h6'>{title}</Typography>
          {description ? (
            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {action}
      </Stack>
    </Paper>
  )
}
