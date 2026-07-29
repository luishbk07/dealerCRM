import { Box, Button, Container, Stack, Typography } from '@mui/material'
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { paths } from '@/app/routes/paths'

export const NotFoundPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, hasDealer } = useAuth()

  const handleGoHome = () => {
    if (!isAuthenticated) {
      navigate(paths.login, { replace: true })
      return
    }
    if (!hasDealer) {
      navigate(paths.onboarding, { replace: true })
      return
    }
    navigate(paths.dashboard, { replace: true })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'background.default'
      }}
    >
      <Container maxWidth='sm'>
        <Stack spacing={3} alignItems='center' textAlign='center'>
          <SearchOffOutlinedIcon sx={{ fontSize: 72, color: 'text.secondary' }} aria-hidden />
          <Box>
            <Typography variant='h3' component='h1' sx={{ mb: 1, fontWeight: 700 }}>
              Página no encontrada
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              La ruta que buscas no existe o ya no está disponible.
            </Typography>
          </Box>
          <Button variant='contained' onClick={handleGoHome} aria-label='Ir al inicio'>
            Ir al inicio
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
