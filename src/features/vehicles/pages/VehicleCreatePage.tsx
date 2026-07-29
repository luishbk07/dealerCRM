import { Alert, Box, Button, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/shared/components'
import { useToast } from '@/shared/hooks/useToast'
import { USER_MESSAGES, getUserFriendlyError } from '@/shared/utils/userMessages'
import { useAuth } from '@/features/auth/context/AuthContext'
import { paths } from '@/app/routes/paths'
import { useVehicleMutations } from '../hooks/useVehicleMutations'
import { VehicleForm } from '../components/VehicleForm'
import type { VehicleFormPayload, VehicleImageUpload } from '../services/vehicleService'

export const VehicleCreatePage = () => {
  const navigate = useNavigate()
  const { dealer } = useAuth()
  const { create } = useVehicleMutations()
  const { showToast } = useToast()

  const handleSubmit = async (payload: VehicleFormPayload, images: VehicleImageUpload[]) => {
    try {
      await create.mutateAsync({ payload, images })
      showToast(USER_MESSAGES.vehicleCreated)
      navigate(paths.vehicles)
    } catch (error) {
      showToast(getUserFriendlyError(error, USER_MESSAGES.saveFailed), 'error')
    }
  }

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 2 }}>
        <Button
          variant='text'
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(paths.vehicles)}
          sx={{ alignSelf: 'flex-start', color: 'text.secondary' }}
        >
          Volver al inventario
        </Button>
      </Stack>
      <PageHeader title='Publicar vehículo' subtitle='Completa la información para mostrarlo en tu catálogo' />
      {!dealer ? (
        <Alert severity='warning' sx={{ mb: 2 }}>
          Necesitas completar el onboarding antes de publicar vehículos.
        </Alert>
      ) : null}
      <VehicleForm
        submitting={create.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(paths.vehicles)}
      />
    </Box>
  )
}
