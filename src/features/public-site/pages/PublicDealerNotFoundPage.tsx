import { Box, Button, Container, Stack, Typography } from '@mui/material'
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/routes/paths'

export const PublicDealerNotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)'
      }}
    >
      <Container maxWidth='sm'>
        <Stack spacing={3} alignItems='center' textAlign='center'>
          <SearchOffOutlinedIcon sx={{ fontSize: 72, color: 'text.secondary' }} />
          <Box>
            <Typography variant='h3' component='h1' sx={{ mb: 1 }}>
              Concesionario no encontrado
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              El enlace que visitaste no corresponde a un concesionario activo en nuestra plataforma.
            </Typography>
          </Box>
          <Button variant='contained' onClick={() => navigate(paths.login)}>
            Ir al inicio
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
