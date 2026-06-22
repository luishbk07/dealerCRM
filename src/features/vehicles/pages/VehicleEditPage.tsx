import { Alert, Box, Button, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNew'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog, LoadingState, PageHeader } from '@/shared/components'
import { useToast } from '@/shared/hooks/useToast'
import { vehicleService } from '@/shared/services'
import { paths } from '@/app/routes/paths'
import type { Vehicle, VehicleInput } from '@/shared/types'
import { useVehicles } from '../hooks/useVehicles'
import { VehicleForm } from '../components/VehicleForm'
import { AdGeneratorDialog } from '../components/AdGeneratorDialog'

export const VehicleEditPage = () => {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { updateVehicle, removeVehicle } = useVehicles()
  const { showToast } = useToast()

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [adOpen, setAdOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    vehicleService
      .getById(id)
      .then((result) => {
        if (cancelled) return
        if (!result) {
          setError('Vehículo no encontrado')
        } else {
          setVehicle(result)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const handleSubmit = async (values: VehicleInput) => {
    setSubmitting(true)
    try {
      const updated = await updateVehicle(id, values)
      setVehicle(updated)
      showToast('Cambios guardados')
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setConfirmDelete(false)
    try {
      await removeVehicle(id)
      showToast('Vehículo eliminado')
      navigate(paths.vehicles)
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  if (loading) return <LoadingState message='Cargando vehículo…' />
  if (error || !vehicle) return <Alert severity='error'>{error ?? 'Vehículo no encontrado'}</Alert>

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
        subtitle={`Año ${vehicle.year} · Última actualización ${new Date(vehicle.updatedAt).toLocaleDateString('es-DO')}`}
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
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
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate(paths.vehicles)}
      />

      <AdGeneratorDialog vehicle={vehicle} open={adOpen} onClose={() => setAdOpen(false)} />

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
