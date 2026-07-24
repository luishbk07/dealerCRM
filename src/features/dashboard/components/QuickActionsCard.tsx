import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/routes/paths'

export const QuickActionsCard = () => {
  const navigate = useNavigate()

  const actions = [
    {
      label: 'Publicar vehículo',
      icon: <AddIcon fontSize='small' />,
      onClick: () => navigate(paths.vehicleNew),
      variant: 'contained' as const
    },
    {
      label: 'Crear lead',
      icon: <PersonAddOutlinedIcon fontSize='small' />,
      onClick: () => navigate(paths.leads),
      variant: 'outlined' as const
    },
    {
      label: 'Ir a ventas',
      icon: <ReceiptLongOutlinedIcon fontSize='small' />,
      onClick: () => navigate(paths.sales),
      variant: 'outlined' as const
    },
    {
      label: 'Ir a configuración',
      icon: <SettingsOutlinedIcon fontSize='small' />,
      onClick: () => navigate(paths.settings),
      variant: 'outlined' as const
    }
  ]

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={0.5} sx={{ mb: 2.5 }}>
          <Typography variant='h5'>Acciones rápidas</Typography>
          <Typography variant='body2' color='text.secondary'>
            Atajos a las tareas más comunes
          </Typography>
        </Stack>
        <Stack spacing={1.25}>
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              startIcon={action.icon}
              onClick={action.onClick}
              fullWidth
              sx={{ justifyContent: 'flex-start', py: 1.1 }}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

interface DashboardEmptyBannerProps {
  showNoVehicles: boolean
  showNoLeads: boolean
}

export const DashboardEmptyBanner = ({ showNoVehicles, showNoLeads }: DashboardEmptyBannerProps) => {
  const navigate = useNavigate()

  if (!showNoVehicles && !showNoLeads) return null

  return (
    <Stack spacing={1.5} sx={{ mb: 3 }}>
      {showNoVehicles ? (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1.5
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            Aún no tienes vehículos publicados en tu inventario.
          </Typography>
          <Button variant='contained' size='small' onClick={() => navigate(paths.vehicleNew)}>
            Publica tu primer vehículo
          </Button>
        </Box>
      ) : null}
      {showNoLeads ? (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1.5
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            Empieza a registrar prospectos para dar seguimiento a tus oportunidades.
          </Typography>
          <Button variant='outlined' size='small' onClick={() => navigate(paths.leads)}>
            Crea tu primer lead
          </Button>
        </Box>
      ) : null}
    </Stack>
  )
}
