import { Alert, Box, Button, InputAdornment, Link, Stack, TextField } from '@mui/material'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useState, type FormEvent } from 'react'
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { paths } from '@/app/routes/paths'
import { AuthCardShell } from '../components/AuthCardShell'
import { validateRegisterForm, type RegisterFormErrors, type RegisterFormValues } from '../utils/validation'

const INITIAL_VALUES: RegisterFormValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
}

export const RegisterPage = () => {
  const { isAuthenticated, signUp, configError } = useAuth()
  const navigate = useNavigate()

  const [values, setValues] = useState<RegisterFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [emailNotice, setEmailNotice] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to={paths.onboarding} replace />
  }

  const setField = <K extends keyof RegisterFormValues>(field: K, value: RegisterFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setSubmitError(null)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitError(null)
    setEmailNotice(null)

    const nextErrors = validateRegisterForm(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const { needsEmailConfirmation } = await signUp({
        email: values.email.trim(),
        password: values.password,
        fullName: values.fullName.trim()
      })

      if (needsEmailConfirmation) {
        setEmailNotice('Te enviamos un correo de confirmación. Revisa tu bandeja para activar la cuenta antes de iniciar sesión.')
        return
      }

      navigate(paths.onboarding, { replace: true })
    } catch (err) {
      setSubmitError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCardShell
      title='Crea tu cuenta'
      subtitle='Comienza a gestionar tus vehículos y clientes.'
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link component={RouterLink} to={paths.login} underline='hover' sx={{ fontWeight: 600 }}>
            Inicia sesión
          </Link>
        </>
      }
    >
      {configError ? <Alert severity='warning'>{configError}</Alert> : null}
      {submitError ? <Alert severity='error'>{submitError}</Alert> : null}
      {emailNotice ? <Alert severity='success'>{emailNotice}</Alert> : null}

      <Box component='form' onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            label='Nombre completo'
            value={values.fullName}
            onChange={(event) => setField('fullName', event.target.value)}
            error={Boolean(errors.fullName)}
            helperText={errors.fullName}
            autoComplete='name'
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <BadgeOutlinedIcon fontSize='small' color='action' />
                </InputAdornment>
              )
            }}
          />
          <TextField
            label='Correo electrónico'
            type='email'
            value={values.email}
            onChange={(event) => setField('email', event.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
            autoComplete='email'
            required
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
            value={values.password}
            onChange={(event) => setField('password', event.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password ?? 'Mínimo 8 caracteres'}
            autoComplete='new-password'
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <LockOutlinedIcon fontSize='small' color='action' />
                </InputAdornment>
              )
            }}
          />
          <TextField
            label='Confirmar contraseña'
            type='password'
            value={values.confirmPassword}
            onChange={(event) => setField('confirmPassword', event.target.value)}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            autoComplete='new-password'
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <LockOutlinedIcon fontSize='small' color='action' />
                </InputAdornment>
              )
            }}
          />

          <Stack spacing={1.5}>
            <Button
              type='submit'
              variant='contained'
              size='large'
              fullWidth
              disabled={submitting}
            >
              {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
            </Button>
            <Button
              component={RouterLink}
              to={paths.login}
              variant='text'
              size='large'
              fullWidth
              disabled={submitting}
            >
              Ya tengo cuenta
            </Button>
          </Stack>
        </Stack>
      </Box>
    </AuthCardShell>
  )
}
