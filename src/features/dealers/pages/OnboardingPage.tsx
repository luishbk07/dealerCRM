import { Alert, Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Grid2'
import { useAuth } from '@/features/auth/context/AuthContext'
import { paths } from '@/app/routes/paths'
import { dealerService } from '../services/dealerService'
import { useDealerForm } from '../hooks/useDealerForm'

export const OnboardingPage = () => {
  const navigate = useNavigate()
  const { user, hasDealer, refreshDealer, signOut } = useAuth()
  const { values, errors, setField, validate } = useDealerForm({ name: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (hasDealer) {
      navigate(paths.dashboard, { replace: true })
    }
  }, [hasDealer, navigate])

  if (!user) return null

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitError(null)
    const { valid, payload } = validate()
    if (!valid) return

    setSubmitting(true)
    try {
      await dealerService.create(user.id, payload)
      await refreshDealer()
      navigate(paths.dashboard, { replace: true })
    } catch (err) {
      setSubmitError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate(paths.login, { replace: true })
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: { xs: 3, md: 6 } }}>
      <Container maxWidth='md'>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent='space-between' alignItems={{ sm: 'center' }}>
            <Stack direction='row' spacing={1.5} alignItems='center'>
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
                <StorefrontOutlinedIcon />
              </Box>
              <Box>
                <Typography variant='h4'>Configura tu concesionario</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Solo necesitamos algunos datos para personalizar tu CRM.
                </Typography>
              </Box>
            </Stack>
            <Button startIcon={<LogoutIcon />} color='inherit' onClick={handleSignOut} disabled={submitting}>
              Cerrar sesión
            </Button>
          </Stack>

          {submitError ? <Alert severity='error'>{submitError}</Alert> : null}

          <Card>
            <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
              <Box component='form' onSubmit={handleSubmit} noValidate>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant='h6'>Datos del concesionario</Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Puedes editar esta información más adelante desde la configuración.
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label='Nombre del concesionario'
                        value={values.name}
                        onChange={(event) => setField('name', event.target.value)}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        required
                        autoFocus
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label='Teléfono / WhatsApp'
                        value={values.phone ?? ''}
                        onChange={(event) => setField('phone', event.target.value)}
                        placeholder='+1 809 555 0000'
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label='Ciudad'
                        value={values.city ?? ''}
                        onChange={(event) => setField('city', event.target.value)}
                        placeholder='Santo Domingo'
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label='Dirección'
                        value={values.address ?? ''}
                        onChange={(event) => setField('address', event.target.value)}
                        placeholder='Av. 27 de Febrero #123'
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label='URL del logo (opcional)'
                        value={values.logoUrl ?? ''}
                        onChange={(event) => setField('logoUrl', event.target.value)}
                        placeholder='https://…'
                      />
                    </Grid>
                  </Grid>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent='flex-end'>
                    <Button type='submit' variant='contained' size='large' disabled={submitting}>
                      {submitting ? 'Creando concesionario…' : 'Continuar al dashboard'}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  )
}
