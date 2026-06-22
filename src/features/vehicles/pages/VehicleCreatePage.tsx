import { Box, Button, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/shared/components'
import { useToast } from '@/shared/hooks/useToast'
import { paths } from '@/app/routes/paths'
import type { VehicleInput } from '@/shared/types'
import { useVehicles } from '../hooks/useVehicles'
import { VehicleForm } from '../components/VehicleForm'

export const VehicleCreatePage = () => {
  const navigate = useNavigate()
  const { createVehicle } = useVehicles()
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values: VehicleInput) => {
    setSubmitting(true)
    try {
      const created = await createVehicle(values)
      showToast(`${created.brand} ${created.model} publicado correctamente`)
      navigate(paths.vehicles)
    } catch (error) {
      showToast((error as Error).message, 'error')
    } finally {
      setSubmitting(false)
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
      <VehicleForm submitting={submitting} onSubmit={handleSubmit} onCancel={() => navigate(paths.vehicles)} />
    </Box>
  )
}
