import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, Tab, Tabs, TextField, Typography, Alert, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNew'
import { useEffect, useState } from 'react'
import type { Vehicle } from '@/shared/types'
import { adGeneratorService, type GeneratedAd } from '@/shared/services'
import { useToast } from '@/shared/hooks/useToast'

interface AdGeneratorDialogProps {
  vehicle: Vehicle | null
  open: boolean
  onClose: () => void
}

const formatVehicleYear = (vehicle: Vehicle): string => vehicle.year !== null ? ` ${vehicle.year}` : ''

type ChannelTab = 'facebook' | 'instagram' | 'marketplace'

const TABS: { value: ChannelTab, label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'marketplace', label: 'Marketplace' }
]

export const AdGeneratorDialog = ({ vehicle, open, onClose }: AdGeneratorDialogProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GeneratedAd | null>(null)
  const [activeTab, setActiveTab] = useState<ChannelTab>('facebook')
  const { showToast } = useToast()

  useEffect(() => {
    if (!open || !vehicle) return
    let cancelled = false
    setLoading(true)
    setError(null)
    setResult(null)
    adGeneratorService
      .generate(vehicle)
      .then((generated) => {
        if (!cancelled) setResult(generated)
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
  }, [open, vehicle])

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast(`${label} copiado al portapapeles`)
    } catch {
      showToast('No se pudo copiar al portapapeles', 'error')
    }
  }

  const currentText = result ? result[activeTab] : ''

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle sx={{ pr: 6 }}>
        <Stack>
          <Typography variant='h6'>Generador de anuncios con IA</Typography>
          {vehicle ? (
            <Typography variant='body2' color='text.secondary'>
              {vehicle.brand} {vehicle.model}{formatVehicleYear(vehicle)}
            </Typography>
          ) : null}
        </Stack>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }} aria-label='Cerrar'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={28} />
            <Typography variant='body2' color='text.secondary'>
              Generando copias optimizadas para cada canal…
            </Typography>
          </Box>
        ) : null}
        {error ? <Alert severity='error'>{error}</Alert> : null}
        {result ? (
          <Stack spacing={2}>
            <Tabs
              value={activeTab}
              onChange={(_, value: ChannelTab) => setActiveTab(value)}
              variant='scrollable'
              scrollButtons='auto'
            >
              {TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} label={tab.label} />
              ))}
            </Tabs>
            <TextField multiline minRows={10} value={currentText} InputProps={{ readOnly: true }} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent='space-between' alignItems={{ sm: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                Página pública: <strong>{result.publicUrl}</strong>
              </Typography>
              <Stack direction='row' spacing={1}>
                <Button
                  startIcon={<ContentCopyOutlinedIcon />}
                  onClick={() => copyToClipboard(currentText, TABS.find((tab) => tab.value === activeTab)?.label ?? 'Texto')}
                >
                  Copiar texto
                </Button>
                <Button
                  variant='contained'
                  startIcon={<OpenInNewOutlinedIcon />}
                  onClick={() => window.open(result.publicUrl, '_blank', 'noopener')}
                >
                  Abrir página pública
                </Button>
              </Stack>
            </Stack>
          </Stack>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
