import { Box, CircularProgress, Typography } from '@mui/material'

interface LoadingStateProps {
  message?: string
}

export const LoadingState = ({ message = 'Cargando…' }: LoadingStateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2
      }}
    >
      <CircularProgress size={32} />
      <Typography variant='body2' color='text.secondary'>
        {message}
      </Typography>
    </Box>
  )
}
