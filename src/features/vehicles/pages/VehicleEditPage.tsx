import { Alert, Box, Button, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNew'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { ConfirmDialog, LoadingState, PageHeader } from '@/shared/components'
import { useToast } from '@/shared/hooks/useToast'
import { paths } from '@/app/routes/paths'
import type { VehicleImage } from '@/shared/types'
import { useVehicle } from '../hooks/useVehicle'
import { useVehicleMutations } from '../hooks/useVehicleMutations'
import { VehicleForm } from '../components/VehicleForm'
import { AdGeneratorDialog } from '../components/AdGeneratorDialog'
import { ShareVehicleDialog } from '../components/ShareVehicleDialog'
import type { VehicleFormPayload, VehicleImageUpload } from '../services/vehicleService'

export const VehicleEditPage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { dealer } = useAuth()
  const vehicleQuery = useVehicle(id)
  const { update, remove, deleteImage, setPrimary } = useVehicleMutations()

  const [adOpen, setAdOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleSubmit = async (payload: VehicleFormPayload, images: VehicleImageUpload[]) => {
    try {
      await update.mutateAsync({ id, payload, newImages: images })
      showToast('Cambios guardados')
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  const handleDelete = async () => {
    setConfirmDelete(false)
    try {
      await remove.mutateAsync(id)
      showToast('Vehículo eliminado')
      navigate(paths.vehicles)
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  const handleDeleteImage = async (image: VehicleImage) => {
    try {
      await deleteImage.mutateAsync(image)
      showToast('Imagen eliminada')
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  const handleSetPrimary = async (image: VehicleImage) => {
    try {
      await setPrimary.mutateAsync(image)
      showToast('Imagen principal actualizada')
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  if (vehicleQuery.isLoading) return <LoadingState message='Cargando vehículo…' />
  if (vehicleQuery.isError) return <Alert severity='error'>{(vehicleQuery.error as Error).message}</Alert>

  const vehicle = vehicleQuery.data
  if (!vehicle) return <Alert severity='error'>Vehículo no encontrado</Alert>

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
      <PageHeader
        title={`${vehicle.brand} ${vehicle.model}`}
        subtitle={`Año ${vehicle.year ?? '—'} · Última actualización ${new Date(vehicle.updatedAt).toLocaleDateString('es-DO')}`}
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant='outlined'
              startIcon={<ShareOutlinedIcon />}
              onClick={() => setShareOpen(true)}
            >
              Compartir
            </Button>
            <Button
              variant='outlined'
              startIcon={<OpenInNewOutlinedIcon />}
              onClick={() => window.open(paths.vehiclePublic(vehicle.id), '_blank', 'noopener')}
            >
              Ver página pública
            </Button>
            <Button
              variant='contained'
              startIcon={<AutoAwesomeOutlinedIcon />}
              onClick={() => setAdOpen(true)}
            >
              Generar anuncio
            </Button>
            <Button
              variant='outlined'
              color='error'
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setConfirmDelete(true)}
            >
              Eliminar
            </Button>
          </Stack>
        }
      />

      <VehicleForm
        initial={vehicle}
        submitting={update.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(paths.vehicles)}
        onDeleteImage={handleDeleteImage}
        onSetPrimaryImage={handleSetPrimary}
      />

      <AdGeneratorDialog vehicle={vehicle} open={adOpen} onClose={() => setAdOpen(false)} />
      <ShareVehicleDialog
        vehicle={vehicle}
        dealerSlug={dealer?.slug}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />

      <ConfirmDialog
        open={confirmDelete}
        title='Eliminar vehículo'
        description='Esta acción no se puede deshacer. Los leads asociados se mantendrán pero perderán la referencia al vehículo.'
        confirmLabel='Eliminar'
        destructive
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </Box>
  )
}
