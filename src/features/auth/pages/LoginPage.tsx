import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography, Alert, InputAdornment } from '@mui/material'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { paths } from '@/app/routes/paths'

interface LocationState {
  from?: { pathname: string }
}

export const LoginPage = () => {
  const { isAuthenticated, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('demo@dealercrm.do')
  const [password, setPassword] = useState('demo1234')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to={paths.dashboard} replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signIn(email, password)
      const target = (location.state as LocationState | undefined)?.from?.pathname ?? paths.dashboard
      navigate(target, { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)',
        py: 4
      }}
    >
      <Container maxWidth='sm'>
        <Stack spacing={4}>
          <Stack direction='row' spacing={1.5} alignItems='center' justifyContent='center'>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DirectionsCarFilledIcon />
            </Box>
            <Typography variant='h4' sx={{ fontWeight: 700 }}>
              Dealer CRM
            </Typography>
          </Stack>
          <Card>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant='h4'>Bienvenido de nuevo</Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                    Inicia sesión para gestionar tu inventario y tus leads.
                  </Typography>
                </Box>
                {error ? <Alert severity='error'>{error}</Alert> : null}
                <Box component='form' onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      label='Correo electrónico'
                      type='email'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      autoComplete='email'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <EmailOutlinedIcon fontSize='small' color='action' />
                          </InputAdornment>
                        )
                      }}
                    />
                    <TextField
                      label='Contraseña'
                      type='password'
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      autoComplete='current-password'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <LockOutlinedIcon fontSize='small' color='action' />
                          </InputAdornment>
                        )
                      }}
                    />
                    <Button type='submit' variant='contained' size='large' disabled={submitting} fullWidth>
                      {submitting ? 'Iniciando sesión…' : 'Entrar'}
                    </Button>
                  </Stack>
                </Box>
                <Typography variant='caption' color='text.secondary' sx={{ textAlign: 'center' }}>
                  Demo: usa cualquier correo válido y una contraseña de 4 caracteres o más.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  )
}
