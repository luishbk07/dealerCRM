import { Box, Button, Card, CardContent, Divider, FormControlLabel, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import { useEffect, useState, type FormEvent } from 'react'
import type { VehicleImage, VehicleWithImages } from '@/shared/types'
import { ImageUploader, type PendingImage } from './ImageUploader'
import { useVehicleForm, toFormPayload, type VehicleFormValues } from '../hooks/useVehicleForm'
import type { VehicleFormPayload, VehicleImageUpload } from '../services/vehicleService'

interface VehicleFormProps {
  initial?: VehicleWithImages | null
  submitting: boolean
  onSubmit: (payload: VehicleFormPayload, images: VehicleImageUpload[]) => Promise<void> | void
  onCancel: () => void
  onDeleteImage?: (image: VehicleImage) => Promise<void> | void
  onSetPrimaryImage?: (image: VehicleImage) => Promise<void> | void
}

const STATUS_OPTIONS: { value: string, label: string }[] = [
  { value: 'active', label: 'Activo' },
  { value: 'sold', label: 'Vendido' },
  { value: 'reserved', label: 'Reservado' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'draft', label: 'Borrador' }
]

const buildId = (): string => `pending_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

export const VehicleForm = ({
  initial,
  submitting,
  onSubmit,
  onCancel,
  onDeleteImage,
  onSetPrimaryImage
}: VehicleFormProps) => {
  const form = useVehicleForm(initial)
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])

  useEffect(() => {
    return () => {
      pendingImages.forEach((image) => URL.revokeObjectURL(image.previewUrl))
    }
  }, [pendingImages])

  const handleAddFiles = (files: File[]) => {
    const hasPrimaryAlready = (initial?.images.some((image) => image.isPrimary) ?? false) || pendingImages.some((image) => image.isPrimary)
    const next: PendingImage[] = files.map((file, index) => ({
      id: buildId(),
      file,
      previewUrl: URL.createObjectURL(file),
      isPrimary: !hasPrimaryAlready && pendingImages.length === 0 && index === 0
    }))
    setPendingImages((prev) => [...prev, ...next])
  }

  const handleRemovePending = (id: string) => {
    setPendingImages((prev) => {
      const target = prev.find((image) => image.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((image) => image.id !== id)
    })
  }

  const handleTogglePendingPrimary = (id: string) => {
    setPendingImages((prev) => prev.map((image) => ({
      ...image,
      isPrimary: image.id === id ? !image.isPrimary : false
    })))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.validate()) return
    const payload = toFormPayload(form.values)
    const uploads: VehicleImageUpload[] = pendingImages.map((image) => ({
      file: image.file,
      isPrimary: image.isPrimary
    }))
    await onSubmit(payload, uploads)
    pendingImages.forEach((image) => URL.revokeObjectURL(image.previewUrl))
    setPendingImages([])
  }

  const renderText = (
    field: keyof VehicleFormValues,
    label: string,
    options: { type?: string, multiline?: boolean, minRows?: number, helperText?: string } = {}
  ) => {
    const value = form.values[field]
    const stringValue = typeof value === 'string' ? value : ''
    return (
      <TextField
        label={label}
        type={options.type ?? 'text'}
        value={stringValue}
        onChange={(event) => form.setField(field, event.target.value as VehicleFormValues[typeof field])}
        error={Boolean(form.errors[field])}
        helperText={form.errors[field] ?? options.helperText}
        multiline={options.multiline}
        minRows={options.minRows}
      />
    )
  }

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={4}>
            <Stack spacing={2}>
              <Typography variant='h6'>Información básica</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>{renderText('brand', 'Marca')}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}>{renderText('model', 'Modelo')}</Grid>
                <Grid size={{ xs: 12, sm: 4 }}>{renderText('year', 'Año', { type: 'number' })}</Grid>
                <Grid size={{ xs: 12, sm: 4 }}>{renderText('price', 'Precio (DOP)', { type: 'number' })}</Grid>
                <Grid size={{ xs: 12, sm: 4 }}>{renderText('salePrice', 'Precio de oferta (DOP)', { type: 'number' })}</Grid>
                <Grid size={{ xs: 12, sm: 4 }}>{renderText('mileage', 'Kilometraje', { type: 'number' })}</Grid>
                <Grid size={{ xs: 12, sm: 4 }}>{renderText('transmission', 'Transmisión', { helperText: 'p. ej. automatic / manual' })}</Grid>
                <Grid size={{ xs: 12, sm: 4 }}>{renderText('fuelType', 'Combustible', { helperText: 'p. ej. gasoline, diesel, hybrid' })}</Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    select
                    label='Estado'
                    value={form.values.status}
                    onChange={(event) => form.setField('status', event.target.value)}
                    error={Boolean(form.errors.status)}
                    helperText={form.errors.status}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>{renderText('vin', 'VIN')}</Grid>
                <Grid size={{ xs: 12, sm: 4 }}>{renderText('stockNumber', 'Stock #')}</Grid>
                <Grid size={{ xs: 12, sm: 4 }}>{renderText('trim', 'Versión / Trim')}</Grid>
                <Grid size={{ xs: 12, sm: 4 }}>{renderText('bodyStyle', 'Carrocería')}</Grid>
                <Grid size={{ xs: 12, sm: 4 }}>{renderText('drivetrain', 'Tracción')}</Grid>
                <Grid size={{ xs: 12, sm: 4 }}>{renderText('engine', 'Motor')}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}>{renderText('exteriorColor', 'Color exterior')}</Grid>
                <Grid size={{ xs: 12, sm: 6 }}>{renderText('interiorColor', 'Color interior')}</Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.values.featured}
                        onChange={(event) => form.setField('featured', event.target.checked)}
                      />
                    }
                    label='Destacar en el catálogo público'
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>{renderText('description', 'Descripción', { multiline: true, minRows: 3 })}</Grid>
              </Grid>
            </Stack>

            <Divider />

            <ImageUploader
              existingImages={initial?.images ?? []}
              pendingImages={pendingImages}
              onAddFiles={handleAddFiles}
              onRemovePending={handleRemovePending}
              onTogglePendingPrimary={handleTogglePendingPrimary}
              onDeleteExisting={onDeleteImage}
              onSetExistingPrimary={onSetPrimaryImage}
              uploading={submitting}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent='flex-end'>
              <Box sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }} />
              <Button onClick={onCancel} color='inherit' disabled={submitting}>
                Cancelar
              </Button>
              <Button
                type='submit'
                variant='contained'
                startIcon={<SaveOutlinedIcon />}
                disabled={submitting}
              >
                {submitting ? 'Guardando…' : 'Guardar vehículo'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}
