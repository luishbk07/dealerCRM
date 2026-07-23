import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField
} from '@mui/material'
import { useState } from 'react'
import { useAuth } from '@/features/auth'
import type { Vehicle } from '@/shared/types'
import { LEAD_SOURCE_OPTIONS } from '../constants/leadSourceOptions'
import { formatVehicleLabel } from '../utils/vehicleLabel'

const SOURCE_OPTIONS = LEAD_SOURCE_OPTIONS

interface LeadCreateDialogProps {
  open: boolean
  vehicles: Vehicle[]
  loading?: boolean
  onClose: () => void
  onSubmit: (input: {
    name: string
    phone: string
    vehicleId: string | null
    source: string
    message: string | null
  }) => Promise<void>
}

export const LeadCreateDialog = ({ open, vehicles, loading, onClose, onSubmit }: LeadCreateDialogProps) => {
  const { dealer } = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [source, setSource] = useState('Manual')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ name?: string, phone?: string }>({})

  const resetForm = () => {
    setName('')
    setPhone('')
    setVehicleId('')
    setSource('Manual')
    setMessage('')
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const validate = (): boolean => {
    const nextErrors: { name?: string, phone?: string } = {}
    if (!name.trim()) nextErrors.name = 'El nombre es obligatorio.'
    if (!phone.trim()) nextErrors.phone = 'El teléfono es obligatorio.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate() || !dealer?.id) return
    await onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      vehicleId: vehicleId || null,
      source,
      message: message.trim() || null
    })
    resetForm()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth aria-labelledby='create-lead-title'>
      <DialogTitle id='create-lead-title'>Crear lead</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label='Nombre del cliente'
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
            required
            autoFocus
            fullWidth
          />
          <TextField
            label='Teléfono'
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            required
            fullWidth
          />
          <TextField
            select
            label='Vehículo (opcional)'
            value={vehicleId}
            onChange={(event) => setVehicleId(event.target.value)}
            fullWidth
          >
            <MenuItem value=''>Sin vehículo</MenuItem>
            {vehicles.map((vehicle) => (
              <MenuItem key={vehicle.id} value={vehicle.id}>
                {formatVehicleLabel(vehicle, vehicle.id)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label='Origen'
            value={source}
            onChange={(event) => setSource(event.target.value)}
            fullWidth
          >
            {SOURCE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label='Mensaje inicial (opcional)'
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            multiline
            minRows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='inherit'>
          Cancelar
        </Button>
        <Button variant='contained' onClick={() => void handleSubmit()} disabled={loading || !dealer?.id}>
          Crear lead
        </Button>
      </DialogActions>
    </Dialog>
  )
}
