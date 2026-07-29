import { Box, Button, Card, CardContent, Chip, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNew'
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined'
import { useState } from 'react'
import type { Lead, LeadNote, VehicleWithImages } from '@/shared/types'
import { formatCurrency, formatDateTime } from '@/shared/utils/format'
import { paths } from '@/app/routes/paths'
import { vehicleService } from '@/features/vehicles/services/vehicleService'

import { LEAD_STATUS_SELECT_OPTIONS, isLeadStatus } from '@/modules/leads/constants/leadStatus'
import type { LeadStatus } from '@/modules/leads/types'

interface LeadSidePanelProps {
  lead: Lead
  notes: LeadNote[]
  vehicle: VehicleWithImages | null
  onChangeStatus: (status: LeadStatus) => Promise<void>
  onAddNote: (content: string) => Promise<void>
}

export const LeadSidePanel = ({ lead, notes, vehicle, onChangeStatus, onAddNote }: LeadSidePanelProps) => {
  const [noteDraft, setNoteDraft] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const handleAddNote = async () => {
    const trimmed = noteDraft.trim()
    if (!trimmed) return
    setSavingNote(true)
    try {
      await onAddNote(trimmed)
      setNoteDraft('')
    } finally {
      setSavingNote(false)
    }
  }

  const handleStatusChange = async (status: string) => {
    if (!isLeadStatus(status) || status === lead.status) return
    setUpdatingStatus(true)
    try {
      await onChangeStatus(status)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const phoneDigits = (lead.phone ?? '').replace(/\D/g, '')
  const whatsappLink = phoneDigits ? `https://wa.me/${phoneDigits}` : ''
  const vehicleImage = vehicle && vehicle.images.length > 0 ? vehicleService.resolveImageUrl(vehicle.images[0]) : null

  return (
    <Stack spacing={2} sx={{ p: 2.5, overflowY: 'auto', height: '100%' }}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant='caption' color='text.secondary'>
                Lead
              </Typography>
              <Typography variant='h5' sx={{ mb: 0.75 }}>
                {lead.name ?? 'Sin nombre'}
              </Typography>
              {lead.source ? (
                <Chip label={`Origen: ${lead.source}`} variant='outlined' size='small' />
              ) : null}
            </Box>
            <TextField
              select
              label='Estado del lead'
              value={lead.status}
              onChange={(event) => handleStatusChange(event.target.value)}
              disabled={updatingStatus}
            >
              {LEAD_STATUS_SELECT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Box>
              <Typography variant='caption' color='text.secondary'>
                Teléfono
              </Typography>
              <Typography variant='body2'>{lead.phone ?? '—'}</Typography>
            </Box>
            {whatsappLink ? (
              <Button
                variant='contained'
                color='success'
                startIcon={<WhatsAppIcon />}
                href={whatsappLink}
                target='_blank'
                rel='noopener'
                sx={{ color: '#fff' }}
              >
                Abrir WhatsApp
              </Button>
            ) : null}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant='subtitle2' sx={{ mb: 1 }}>
            Vehículo de interés
          </Typography>
          {vehicle ? (
            <Stack spacing={1.5}>
              {vehicleImage ? (
                <Box
                  component='img'
                  src={vehicleImage}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  sx={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', borderRadius: 2 }}
                />
              ) : null}
              <Box>
                <Typography variant='subtitle1'>
                  {vehicle.brand} {vehicle.model}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {vehicle.year ?? '—'} · {formatCurrency(vehicle.price)}
                </Typography>
              </Box>
              <Button
                variant='outlined'
                size='small'
                startIcon={<OpenInNewOutlinedIcon />}
                onClick={() => window.open(paths.vehiclePublic(vehicle.id), '_blank', 'noopener')}
              >
                Ver página pública
              </Button>
            </Stack>
          ) : (
            <Typography variant='body2' color='text.secondary'>
              {lead.vehicleId
                ? 'El vehículo asociado ya no está disponible.'
                : 'Este lead no está vinculado a un vehículo.'}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1.5 }}>
            <StickyNote2OutlinedIcon fontSize='small' color='action' />
            <Typography variant='subtitle2'>Notas internas</Typography>
          </Stack>
          <Stack spacing={1.5}>
            <TextField
              placeholder='Añade una nota privada del lead…'
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              multiline
              minRows={2}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant='contained' size='small' onClick={handleAddNote} disabled={savingNote || !noteDraft.trim()}>
                Añadir nota
              </Button>
            </Box>
            <Divider />
            {notes.length === 0 ? (
              <Typography variant='body2' color='text.secondary'>
                Aún no hay notas para este lead.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {notes.map((note) => (
                  <Box key={note.id}>
                    <Typography variant='body2'>{note.note ?? ''}</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {formatDateTime(note.createdAt)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
