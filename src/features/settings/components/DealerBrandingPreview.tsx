import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography
} from '@mui/material'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import { useMemo } from 'react'
import type { DealerThemeMode } from '@/shared/types'
import { createDealerTheme, resolveThemeMode } from '@/shared/utils/dealerThemeUtils'

interface DealerBrandingPreviewProps {
  dealerName: string
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string
  accentColor: string
  theme: DealerThemeMode
  prefersDark?: boolean
}

export const DealerBrandingPreview = ({
  dealerName,
  logoUrl,
  primaryColor,
  secondaryColor,
  accentColor,
  theme,
  prefersDark = false
}: DealerBrandingPreviewProps) => {
  const paletteMode = resolveThemeMode(theme, prefersDark)

  const previewTheme = useMemo(
    () =>
      createDealerTheme(
        { primaryColor, secondaryColor, accentColor, theme },
        paletteMode
      ),
    [primaryColor, secondaryColor, accentColor, theme, paletteMode]
  )

  return (
    <ThemeProvider theme={previewTheme}>
      <Card variant='outlined' sx={{ overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 600 }}>
            Vista previa en vivo
          </Typography>

          <Box
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.default'
            }}
          >
            <AppBar position='static' color='default' sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
              <Toolbar variant='dense' sx={{ minHeight: 48, gap: 1.5 }}>
                {logoUrl ? (
                  <Box
                    component='img'
                    src={logoUrl}
                    alt=''
                    sx={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 0.75 }}
                  />
                ) : (
                  <DirectionsCarFilledOutlinedIcon color='primary' fontSize='small' />
                )}
                <Typography variant='subtitle2' noWrap sx={{ flexGrow: 1 }}>
                  {dealerName || 'Mi concesionario'}
                </Typography>
                <Chip label='Panel' size='small' color='primary' variant='outlined' />
              </Toolbar>
            </AppBar>

            <Stack spacing={2} sx={{ p: 2 }}>
              <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
                <Button variant='contained' color='primary' size='small'>
                  Acción principal
                </Button>
                <Button variant='outlined' color='secondary' size='small'>
                  Acción secundaria
                </Button>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                <Card sx={{ flex: 1 }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box
                      sx={{
                        height: 72,
                        borderRadius: 1,
                        backgroundColor: 'action.hover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1
                      }}
                    >
                      <DirectionsCarFilledOutlinedIcon color='primary' />
                    </Box>
                    <Typography variant='subtitle2'>Toyota Corolla 2022</Typography>
                    <Typography variant='body2' color='primary.main' sx={{ fontWeight: 600 }}>
                      RD$ 1,250,000
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ flex: 1 }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 0.75 }}>
                      <PersonOutlineOutlinedIcon color='secondary' fontSize='small' />
                      <Typography variant='subtitle2'>Lead nuevo</Typography>
                    </Stack>
                    <Typography variant='body2' color='text.secondary'>
                      Juan Pérez · WhatsApp
                    </Typography>
                    <Chip label='Nuevo' size='small' color='success' sx={{ mt: 1 }} />
                  </CardContent>
                </Card>

                <Card sx={{ minWidth: { md: 140 } }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction='row' spacing={0.75} alignItems='center'>
                      <TrendingUpOutlinedIcon color='warning' fontSize='small' />
                      <Typography variant='caption' color='text.secondary'>
                        Ventas del mes
                      </Typography>
                    </Stack>
                    <Typography variant='h6' sx={{ mt: 0.5 }}>
                      12
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </ThemeProvider>
  )
}
