import { Box, Button, Card, CardContent, Divider, Stack, TextField, Typography } from '@mui/material'
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined'
import { useState } from 'react'
import type { LeadNote } from '@/shared/types'
import { formatDateTime } from '@/shared/utils/format'

interface LeadNotesSectionProps {
  notes: LeadNote[]
  onAddNote: (content: string) => Promise<void>
}

export const LeadNotesSection = ({ notes, onAddNote }: LeadNotesSectionProps) => {
  const [noteDraft, setNoteDraft] = useState('')
  const [savingNote, setSavingNote] = useState(false)

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

  return (
    <Card component='section' aria-labelledby='lead-notes-title'>
      <CardContent>
        <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1.5 }}>
          <StickyNote2OutlinedIcon fontSize='small' color='action' aria-hidden />
          <Typography id='lead-notes-title' variant='subtitle1' component='h2'>
            Notas internas
          </Typography>
        </Stack>
        <Stack spacing={1.5}>
          <TextField
            placeholder='Añade una nota privada del lead…'
            value={noteDraft}
            onChange={(event) => setNoteDraft(event.target.value)}
            multiline
            minRows={2}
            fullWidth
            inputProps={{ 'aria-label': 'Nueva nota' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='contained' size='small' onClick={() => void handleAddNote()} disabled={savingNote || !noteDraft.trim()}>
              Añadir nota
            </Button>
          </Box>
          <Divider />
          {notes.length === 0 ? (
            <Typography variant='body2' color='text.secondary'>
              Aún no hay notas para este lead.
            </Typography>
          ) : (
            <Stack spacing={1.5} component='ul' sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {notes.map((note) => (
                <Box component='li' key={note.id}>
                  <Typography variant='caption' color='text.secondary' display='block'>
                    {formatDateTime(note.createdAt)}
                  </Typography>
                  <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', mt: 0.25 }}>
                    {note.note ?? ''}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
