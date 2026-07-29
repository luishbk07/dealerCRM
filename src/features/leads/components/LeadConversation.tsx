import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useEffect, useRef, useState } from 'react'
import type { Lead, LeadMessage } from '@/shared/types'
import { LEAD_SENDER_DEALER } from '@/shared/types'
import { formatDateTime } from '@/shared/utils/format'

interface LeadConversationProps {
  lead: Lead
  messages: LeadMessage[]
  onSendMessage: (content: string) => Promise<void>
}

export const LeadConversation = ({ lead, messages, onSendMessage }: LeadConversationProps) => {
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length])

  const handleSend = async () => {
    const trimmed = draft.trim()
    if (!trimmed || sending) return
    setSending(true)
    try {
      await onSendMessage(trimmed)
      setDraft('')
    } finally {
      setSending(false)
    }
  }

  return (
    <Stack sx={{ height: '100%' }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, backgroundColor: 'background.default' }}>
        {lead.message && messages.length === 0 ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant='caption' color='text.secondary'>
              Mensaje original del lead:
            </Typography>
            <Typography variant='body2' sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
              {lead.message}
            </Typography>
          </Box>
        ) : null}
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant='body2' color='text.secondary'>
              Aún no hay mensajes registrados. Inicia la conversación con un saludo personalizado.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {messages.map((message) => {
              const isDealer = (message.sender ?? '').toLowerCase() === LEAD_SENDER_DEALER
              return (
                <Box key={message.id} sx={{ alignSelf: isDealer ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
                  <Box
                    sx={{
                      px: 2,
                      py: 1.25,
                      borderRadius: 2.5,
                      backgroundColor: isDealer ? 'primary.main' : 'background.paper',
                      color: isDealer ? 'primary.contrastText' : 'text.primary',
                      border: isDealer ? 'none' : '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.message ?? ''}
                    </Typography>
                  </Box>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ display: 'block', mt: 0.5, textAlign: isDealer ? 'right' : 'left' }}
                  >
                    {formatDateTime(message.createdAt)}
                  </Typography>
                </Box>
              )
            })}
            <div ref={endRef} />
          </Stack>
        )}
      </Box>
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
        <Stack direction='row' spacing={1}>
          <TextField
            multiline
            maxRows={4}
            placeholder='Escribe un mensaje al lead…'
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                void handleSend()
              }
            }}
          />
          <Button variant='contained' onClick={() => void handleSend()} disabled={sending || !draft.trim()} endIcon={<SendIcon />} aria-label='Enviar mensaje'>
            {sending ? 'Enviando…' : 'Enviar'}
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}
