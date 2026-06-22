import { Box, Button, Card, CardContent, Chip, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNew'
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined'
import { useState } from 'react'
import type { Lead, LeadStatus, Vehicle } from '@/shared/types'
import { formatCurrency, formatDateTime } from '@/shared/utils/format'
import { paths } from '@/app/routes/paths'

const STATUS_OPTIONS: { value: LeadStatus, label: string }[] = [
  { value: 'new', label: 'Nuevo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'negotiating', label: 'Negociando' },
  { value: 'sold', label: 'Vendido' },
  { value: 'lost', label: 'Perdido' }
]

const CHANNEL_LABEL: Record<Lead['channel'], string> = {
  whatsapp: 'WhatsApp',
  website: 'Sitio web',
  facebook: 'Facebook',
  instagram: 'Instagram',
  phone: 'Teléfono'
}

interface LeadSidePanelProps {
  lead: Lead
  vehicle: Vehicle | null
  onChangeStatus: (status: LeadStatus) => Promise<void>
  onAddNote: (content: string) => Promise<void>
}

export const LeadSidePanel = ({ lead, vehicle, onChangeStatus, onAddNote }: LeadSidePanelProps) => {
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

  const handleStatusChange = async (status: LeadStatus) => {
    setUpdatingStatus(true)
    try {
      await onChangeStatus(status)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const whatsappLink = `https://wa.me/${lead.phone.replace(/\D/g, '')}`

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
                {lead.fullName}
              </Typography>
              <Chip
                label={`Origen: ${CHANNEL_LABEL[lead.channel]}`}
                variant='outlined'
                size='small'
              />
            </Box>
            <TextField
              select
              label='Estado del lead'
              value={lead.status}
              onChange={(event) => handleStatusChange(event.target.value as LeadStatus)}
              disabled={updatingStatus}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Box>
              <Typography variant='caption' color='text.secondary'>
                Teléfono
              </Typography>
              <Typography variant='body2'>{lead.phone}</Typography>
            </Box>
            {lead.email ? (
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Correo
                </Typography>
                <Typography variant='body2'>{lead.email}</Typography>
              </Box>
            ) : null}
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
              <Box
                component='img'
                src={vehicle.images[0] ?? 'https://placehold.co/600x400/E2E8F0/64748B?text=Sin+imagen'}
                alt={`${vehicle.brand} ${vehicle.model}`}
                sx={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', borderRadius: 2 }}
              />
              <Box>
                <Typography variant='subtitle1'>
                  {vehicle.brand} {vehicle.model}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {vehicle.year} · {formatCurrency(vehicle.price)}
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
              El vehículo asociado ya no está disponible.
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
            {lead.notes.length === 0 ? (
              <Typography variant='body2' color='text.secondary'>
                Aún no hay notas para este lead.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {lead.notes.map((note) => (
                  <Box key={note.id}>
                    <Typography variant='body2'>{note.content}</Typography>
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
