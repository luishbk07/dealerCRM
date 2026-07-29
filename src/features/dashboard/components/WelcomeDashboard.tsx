import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/routes/paths'

interface WelcomeDashboardProps {
  dealerName?: string | null
}

export const WelcomeDashboard = ({ dealerName }: WelcomeDashboardProps) => {
  const navigate = useNavigate()

  return (
    <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(14,165,233,0.06) 100%)' }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant='h4' sx={{ fontWeight: 700, mb: 1 }}>
              Bienvenido{dealerName ? `, ${dealerName}` : ''}
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              Tu CRM está listo. Empieza publicando vehículos y registrando leads para ver métricas aquí.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap='wrap'>
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={() => navigate(paths.vehicleNew)}
              aria-label='Agregar vehículo'
            >
              Agregar vehículo
            </Button>
            <Button
              variant='outlined'
              startIcon={<PeopleOutlineIcon />}
              onClick={() => navigate(paths.leads)}
              aria-label='Ir a leads'
            >
              Crear lead
            </Button>
            <Button
              variant='outlined'
              startIcon={<SettingsOutlinedIcon />}
              onClick={() => navigate(paths.settings)}
              aria-label='Ir a configuración'
            >
              Configurar concesionario
            </Button>
          </Stack>
          <Stack direction='row' spacing={2} flexWrap='wrap' useFlexGap sx={{ pt: 1 }}>
            <Stack direction='row' spacing={1} alignItems='center' color='text.secondary'>
              <DirectionsCarFilledOutlinedIcon fontSize='small' aria-hidden />
              <Typography variant='body2'>Publica tu inventario</Typography>
            </Stack>
            <Stack direction='row' spacing={1} alignItems='center' color='text.secondary'>
              <PeopleOutlineIcon fontSize='small' aria-hidden />
              <Typography variant='body2'>Captura prospectos</Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
