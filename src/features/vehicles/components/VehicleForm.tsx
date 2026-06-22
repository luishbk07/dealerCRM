import { Button, Card, CardContent, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import type { FormEvent } from 'react'
import type { FuelType, TransmissionType, Vehicle, VehicleInput, VehicleStatus } from '@/shared/types'
import { useVehicleForm } from '../hooks/useVehicleForm'
import { ImageUploader } from './ImageUploader'

interface VehicleFormProps {
  initial?: Vehicle | null
  submitting: boolean
  onSubmit: (values: VehicleInput) => Promise<void> | void
  onCancel: () => void
}

const TRANSMISSION_OPTIONS: { value: TransmissionType, label: string }[] = [
  { value: 'automatic', label: 'Automática' },
  { value: 'manual', label: 'Manual' }
]

const FUEL_OPTIONS: { value: FuelType, label: string }[] = [
  { value: 'gasoline', label: 'Gasolina' },
  { value: 'diesel', label: 'Diésel' },
  { value: 'hybrid', label: 'Híbrido' },
  { value: 'electric', label: 'Eléctrico' }
]

const STATUS_OPTIONS: { value: VehicleStatus, label: string }[] = [
  { value: 'available', label: 'Disponible' },
  { value: 'reserved', label: 'Reservado' },
  { value: 'sold', label: 'Vendido' }
]

export const VehicleForm = ({ initial, submitting, onSubmit, onCancel }: VehicleFormProps) => {
  const form = useVehicleForm(initial)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.validate()) return
    await onSubmit(form.values)
  }

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={4}>
            <Stack spacing={2}>
              <Typography variant='h6'>Información básica</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Marca'
                    value={form.values.brand}
                    onChange={(event) => form.setField('brand', event.target.value)}
                    error={Boolean(form.errors.brand)}
                    helperText={form.errors.brand}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Modelo'
                    value={form.values.model}
                    onChange={(event) => form.setField('model', event.target.value)}
                    error={Boolean(form.errors.model)}
                    helperText={form.errors.model}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label='Año'
                    type='number'
                    value={form.values.year}
                    onChange={(event) => form.setField('year', Number(event.target.value))}
                    error={Boolean(form.errors.year)}
                    helperText={form.errors.year}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label='Precio (DOP)'
                    type='number'
                    value={form.values.price}
                    onChange={(event) => form.setField('price', Number(event.target.value))}
                    error={Boolean(form.errors.price)}
                    helperText={form.errors.price}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label='Kilometraje'
                    type='number'
                    value={form.values.mileage}
                    onChange={(event) => form.setField('mileage', Number(event.target.value))}
                    error={Boolean(form.errors.mileage)}
                    helperText={form.errors.mileage}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    select
                    label='Transmisión'
                    value={form.values.transmission}
                    onChange={(event) => form.setTransmission(event.target.value as TransmissionType)}
                  >
                    {TRANSMISSION_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    select
                    label='Combustible'
                    value={form.values.fuelType}
                    onChange={(event) => form.setFuelType(event.target.value as FuelType)}
                  >
                    {FUEL_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    select
                    label='Estado'
                    value={form.values.status ?? 'available'}
                    onChange={(event) => form.setStatus(event.target.value as VehicleStatus)}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label='Descripción'
                    value={form.values.description ?? ''}
                    onChange={(event) => form.setField('description', event.target.value)}
                    multiline
                    minRows={3}
                    placeholder='Detalles adicionales, historial, equipamiento…'
                  />
                </Grid>
              </Grid>
            </Stack>

            <Divider />

            <ImageUploader images={form.values.images} onChange={form.setImages} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent='flex-end'>
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
