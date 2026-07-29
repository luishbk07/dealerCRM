import { Alert, Box, Button, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNew'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import {
  ConfirmDialog,
  DetailPageSkeleton,
  ErrorAlert,
  PageHeader
} from '@/shared/components'
import { useToast } from '@/shared/hooks/useToast'
import { paths } from '@/app/routes/paths'
import { getReturnPath } from '@/shared/utils/listNavigation'
import { getUserFriendlyError, USER_MESSAGES } from '@/shared/utils/userMessages'
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
  const location = useLocation()
  const { showToast } = useToast()
  const { dealer } = useAuth()
  const vehicleQuery = useVehicle(id)
  const { update, remove, deleteImage, setPrimary } = useVehicleMutations()

  const [adOpen, setAdOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<VehicleImage | null>(null)
  const [deleting, setDeleting] = useState(false)

  const returnPath = getReturnPath(location.state, paths.vehicles)

  const handleSubmit = async (payload: VehicleFormPayload, images: VehicleImageUpload[]) => {
    try {
      await update.mutateAsync({ id, payload, newImages: images })
      showToast(USER_MESSAGES.vehicleUpdated)
    } catch (err) {
      showToast(getUserFriendlyError(err, USER_MESSAGES.saveFailed), 'error')
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await remove.mutateAsync(id)
      setConfirmDelete(false)
      showToast(USER_MESSAGES.vehicleDeleted)
      navigate(returnPath)
    } catch (err) {
      showToast(getUserFriendlyError(err, USER_MESSAGES.deleteFailed), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteImage = async () => {
    if (!imageToDelete) return
    try {
      await deleteImage.mutateAsync(imageToDelete)
      setImageToDelete(null)
      showToast('Imagen eliminada correctamente.')
    } catch (err) {
      showToast(getUserFriendlyError(err, USER_MESSAGES.deleteFailed), 'error')
    }
  }

  const handleSetPrimary = async (image: VehicleImage) => {
    try {
      await setPrimary.mutateAsync(image)
      showToast('Imagen principal actualizada.')
    } catch (err) {
      showToast(getUserFriendlyError(err, USER_MESSAGES.saveFailed), 'error')
    }
  }

  if (vehicleQuery.isLoading) return <DetailPageSkeleton />
  if (vehicleQuery.isError) {
    return (
      <Box>
        <ErrorAlert error={vehicleQuery.error} onRetry={() => void vehicleQuery.refetch()} />
      </Box>
    )
  }

  const vehicle = vehicleQuery.data
  if (!vehicle) {
    return <Alert severity='warning'>Vehículo no encontrado.</Alert>
  }

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 2 }}>
        <Button
          variant='text'
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(returnPath)}
          sx={{ alignSelf: 'flex-start', color: 'text.secondary' }}
          aria-label='Volver al inventario'
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
              aria-label='Compartir vehículo'
            >
              Compartir
            </Button>
            <Button
              variant='outlined'
              startIcon={<OpenInNewOutlinedIcon />}
              onClick={() => window.open(paths.vehiclePublic(vehicle.id), '_blank', 'noopener')}
              aria-label='Ver página pública del vehículo'
            >
              Ver página pública
            </Button>
            <Button
              variant='contained'
              startIcon={<AutoAwesomeOutlinedIcon />}
              onClick={() => setAdOpen(true)}
              aria-label='Generar anuncio del vehículo'
            >
              Generar anuncio
            </Button>
            <Button
              variant='outlined'
              color='error'
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setConfirmDelete(true)}
              aria-label='Eliminar vehículo'
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
        onCancel={() => navigate(returnPath)}
        onDeleteImage={(image) => setImageToDelete(image)}
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
        confirmLoading={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirmDelete(false)}
      />

      <ConfirmDialog
        open={imageToDelete !== null}
        title='Eliminar imagen'
        description='¿Eliminar esta imagen del vehículo?'
        confirmLabel='Eliminar'
        destructive
        confirmLoading={deleteImage.isPending}
        onConfirm={() => void handleDeleteImage()}
        onCancel={() => setImageToDelete(null)}
      />
    </Box>
  )
}
