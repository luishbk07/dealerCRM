import { Alert, Box, Button, InputAdornment, Link, Stack, TextField } from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useState, type FormEvent } from 'react'
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { paths } from '@/app/routes/paths'
import { AuthCardShell } from '../components/AuthCardShell'
import { isValidEmail } from '../utils/validation'
import { getUserFriendlyError } from '@/shared/utils/userMessages'

interface LocationState {
  from?: { pathname: string }
}

export const LoginPage = () => {
  const { isAuthenticated, signIn, configError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to={paths.dashboard} replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!isValidEmail(email)) {
      setError('Ingresa un correo válido')
      return
    }
    if (!password) {
      setError('Ingresa tu contraseña')
      return
    }

    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      const target = (location.state as LocationState | undefined)?.from?.pathname ?? paths.dashboard
      navigate(target, { replace: true })
    } catch (err) {
      setError(getUserFriendlyError(err, 'No se pudo iniciar sesión. Intenta nuevamente.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCardShell
      title='Bienvenido de nuevo'
      subtitle='Inicia sesión para gestionar tu inventario y tus leads.'
      footer={
        <>
          ¿No tienes cuenta?{' '}
          <Link component={RouterLink} to={paths.register} underline='hover' sx={{ fontWeight: 600 }}>
            Crear cuenta
          </Link>
        </>
      }
    >
      {configError ? <Alert severity='warning'>{getUserFriendlyError(configError, 'Configura Supabase para continuar.')}</Alert> : null}
      {error ? <Alert severity='error'>{error}</Alert> : null}

      <Box component='form' onSubmit={handleSubmit} noValidate>
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

          <Stack spacing={1.5}>
            <Button type='submit' variant='contained' size='large' fullWidth disabled={submitting}>
              {submitting ? 'Iniciando sesión…' : 'Entrar'}
            </Button>
            <Button
              component={RouterLink}
              to={paths.register}
              variant='text'
              size='large'
              fullWidth
              disabled={submitting}
            >
              ¿No tienes cuenta? Crear cuenta
            </Button>
          </Stack>
        </Stack>
      </Box>
    </AuthCardShell>
  )
}
