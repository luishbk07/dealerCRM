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
import { useEffect, useState } from 'react'
import type { Lead, LeadStatus, Vehicle } from '@/shared/types'
import { LEAD_STATUS_SELECT_OPTIONS, isLeadStatus } from '@/modules/leads/constants/leadStatus'
import { LEAD_SOURCE_OPTIONS } from '../constants/leadSourceOptions'
import { formatVehicleLabel } from '../utils/vehicleLabel'

export interface LeadEditFormValues {
  name: string
  phone: string
  vehicleId: string
  source: string
  status: LeadStatus
  message: string
}

interface LeadEditDialogProps {
  open: boolean
  lead: Lead | null
  vehicles: Vehicle[]
  loading?: boolean
  onClose: () => void
  onSubmit: (values: LeadEditFormValues) => Promise<void>
}

const buildFormValues = (lead: Lead | null): LeadEditFormValues => ({
  name: lead?.name ?? '',
  phone: lead?.phone ?? '',
  vehicleId: lead?.vehicleId ?? '',
  source: lead?.source ?? 'Manual',
  status: lead?.status && isLeadStatus(lead.status) ? lead.status : 'new',
  message: lead?.message ?? ''
})

export const LeadEditDialog = ({ open, lead, vehicles, loading, onClose, onSubmit }: LeadEditDialogProps) => {
  const [values, setValues] = useState<LeadEditFormValues>(() => buildFormValues(lead))
  const [errors, setErrors] = useState<{ name?: string, phone?: string }>({})

  useEffect(() => {
    if (open) {
      setValues(buildFormValues(lead))
      setErrors({})
    }
  }, [open, lead])

  const validate = (): boolean => {
    const nextErrors: { name?: string, phone?: string } = {}
    if (!values.name.trim()) nextErrors.name = 'El nombre es obligatorio.'
    if (!values.phone.trim()) nextErrors.phone = 'El teléfono es obligatorio.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleClose = () => {
    if (loading) return
    setErrors({})
    onClose()
  }

  const handleSubmit = async () => {
    if (!validate()) return
    await onSubmit(values)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth aria-labelledby='edit-lead-title'>
      <DialogTitle id='edit-lead-title'>Editar lead</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label='Nombre del cliente'
            value={values.name}
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            error={Boolean(errors.name)}
            helperText={errors.name}
            required
            autoFocus
            fullWidth
          />
          <TextField
            label='Teléfono'
            value={values.phone}
            onChange={(event) => setValues((prev) => ({ ...prev, phone: event.target.value }))}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            required
            fullWidth
          />
          <TextField
            select
            label='Vehículo'
            value={values.vehicleId}
            onChange={(event) => setValues((prev) => ({ ...prev, vehicleId: event.target.value }))}
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
            value={values.source}
            onChange={(event) => setValues((prev) => ({ ...prev, source: event.target.value }))}
            fullWidth
          >
            {LEAD_SOURCE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label='Estado'
            value={values.status}
            onChange={(event) => {
              const next = event.target.value
              if (isLeadStatus(next)) {
                setValues((prev) => ({ ...prev, status: next }))
              }
            }}
            fullWidth
          >
            {LEAD_STATUS_SELECT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label='Mensaje'
            value={values.message}
            onChange={(event) => setValues((prev) => ({ ...prev, message: event.target.value }))}
            multiline
            minRows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='inherit' disabled={loading}>
          Cancelar
        </Button>
        <Button variant='contained' onClick={() => void handleSubmit()} disabled={loading || !lead}>
          {loading ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
