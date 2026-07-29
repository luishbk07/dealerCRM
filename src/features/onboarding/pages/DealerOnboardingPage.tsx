import { Alert, Box, Button, Card, CardContent, CircularProgress, Container, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import { useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { paths } from '@/app/routes/paths'
import { useDealerOnboarding } from '../hooks/useDealerOnboarding'

export const DealerOnboardingPage = () => {
  const navigate = useNavigate()
  const { hasDealer, signOut } = useAuth()
  const { values, errors, submitting, error, setField, submit } = useDealerOnboarding()

  useEffect(() => {
    if (hasDealer) {
      navigate(paths.dashboard, { replace: true })
    }
  }, [hasDealer, navigate])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await submit()
  }

  const handleSignOut = async () => {
    await signOut()
    navigate(paths.login, { replace: true })
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
              <StorefrontOutlinedIcon />
            </Box>
            <Typography variant='h4' sx={{ fontWeight: 700 }}>
              Dealer CRM
            </Typography>
          </Stack>

          <Card>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant='h4'>Crea tu concesionario</Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                    Antes de comenzar necesitamos algunos datos de tu negocio.
                  </Typography>
                </Box>

                {error ? <Alert severity='error'>{error}</Alert> : null}

                <Box component='form' onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label='Nombre del negocio'
                        value={values.name}
                        onChange={(event) => setField('name', event.target.value)}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        required
                        autoFocus
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <StorefrontOutlinedIcon fontSize='small' color='action' />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label='Teléfono'
                        value={values.phone}
                        onChange={(event) => setField('phone', event.target.value)}
                        error={Boolean(errors.phone)}
                        helperText={errors.phone}
                        placeholder='+1 809 555 0000'
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <PhoneOutlinedIcon fontSize='small' color='action' />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label='WhatsApp'
                        value={values.whatsapp}
                        onChange={(event) => setField('whatsapp', event.target.value)}
                        error={Boolean(errors.whatsapp)}
                        helperText={errors.whatsapp}
                        placeholder='+1 809 555 0000'
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <WhatsAppIcon fontSize='small' color='action' />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label='Dirección (opcional)'
                        value={values.address}
                        onChange={(event) => setField('address', event.target.value)}
                        placeholder='Av. 27 de Febrero #123, Santo Domingo'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <HomeOutlinedIcon fontSize='small' color='action' />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Stack spacing={1.5} sx={{ mt: 3 }}>
                    <Button
                      type='submit'
                      variant='contained'
                      size='large'
                      fullWidth
                      disabled={submitting}
                      startIcon={submitting ? <CircularProgress size={18} color='inherit' /> : null}
                    >
                      {submitting ? 'Creando negocio…' : 'Crear negocio'}
                    </Button>
                    <Button
                      variant='text'
                      size='large'
                      fullWidth
                      color='inherit'
                      startIcon={<LogoutIcon />}
                      onClick={handleSignOut}
                      disabled={submitting}
                    >
                      Cerrar sesión
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  )
}
