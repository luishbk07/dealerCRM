import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined'
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import XIcon from '@mui/icons-material/X'
import { useMemo, useState } from 'react'
import type { VehicleWithImages } from '@/shared/types'
import { useToast } from '@/shared/hooks/useToast'
import { buildPublicVehicleUrl } from '@/shared/utils/appUrl'
import { formatCurrency } from '@/shared/utils/format'
import {
  buildEmailShareUrl,
  buildFacebookShareUrl,
  buildVehicleShareTitle,
  buildVehicleShareWhatsAppMessage,
  buildWhatsAppShareUrl,
  buildXShareUrl,
  canUseNativeShare,
  type VehicleShareChannel
} from '@/shared/utils/vehicleShare'
import { useShareVehicle } from '../hooks/useShareVehicle'

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/E2E8F0/64748B?text=Sin+imagen'

export interface ShareVehicleDialogProps {
  vehicle: VehicleWithImages | null
  dealerSlug: string | null | undefined
  open: boolean
  onClose: () => void
}

export const ShareVehicleDialog = ({ vehicle, dealerSlug, open, onClose }: ShareVehicleDialogProps) => {
  const { showToast } = useToast()
  const { logShare } = useShareVehicle()
  const [busyChannel, setBusyChannel] = useState<VehicleShareChannel | 'native' | null>(null)

  const shareUrl = useMemo(() => {
    if (!vehicle || !dealerSlug?.trim()) return ''
    return buildPublicVehicleUrl(dealerSlug.trim(), vehicle.id)
  }, [vehicle, dealerSlug])

  const isReady = Boolean(vehicle && shareUrl)
  const isBusy = busyChannel !== null || logShare.isPending

  const recordShare = async (channel: VehicleShareChannel) => {
    if (!vehicle) return
    await logShare.mutateAsync({ vehicle, channel })
  }

  const handleCopyLink = async () => {
    if (!shareUrl || isBusy) return
    setBusyChannel('copy')
    try {
      await navigator.clipboard.writeText(shareUrl)
      await recordShare('copy')
      showToast('Enlace copiado.')
    } catch {
      showToast('No fue posible copiar el enlace.', 'error')
    } finally {
      setBusyChannel(null)
    }
  }

  const openShareWindow = async (channel: VehicleShareChannel, url: string) => {
    if (!vehicle || !shareUrl || isBusy) return
    setBusyChannel(channel)
    try {
      window.open(url, '_blank', 'noopener,noreferrer')
      await recordShare(channel)
    } finally {
      setBusyChannel(null)
    }
  }

  const handleWhatsAppShare = () => {
    if (!vehicle) return
    const message = buildVehicleShareWhatsAppMessage(vehicle, shareUrl)
    openShareWindow('whatsapp', buildWhatsAppShareUrl(message))
  }

  const handleFacebookShare = () => {
    openShareWindow('facebook', buildFacebookShareUrl(shareUrl))
  }

  const handleXShare = () => {
    if (!vehicle) return
    openShareWindow('x', buildXShareUrl(vehicle, shareUrl))
  }

  const handleEmailShare = () => {
    if (!vehicle) return
    openShareWindow('email', buildEmailShareUrl(vehicle, shareUrl))
  }

  const handleNativeShare = async () => {
    if (!vehicle || !shareUrl || isBusy || !canUseNativeShare()) return
    setBusyChannel('native')
    try {
      await navigator.share({
        title: buildVehicleShareTitle(vehicle),
        text: `Mira este vehículo: ${buildVehicleShareTitle(vehicle)} · ${formatCurrency(vehicle.price)}`,
        url: shareUrl
      })
    } catch (error) {
      if ((error as DOMException).name !== 'AbortError') {
        showToast('No fue posible compartir.', 'error')
      }
    } finally {
      setBusyChannel(null)
    }
  }

  const heroImage = vehicle?.primaryImageUrl ?? PLACEHOLDER_IMAGE

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle sx={{ pr: 6 }}>
        Compartir vehículo
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }} aria-label='Cerrar'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {!dealerSlug?.trim() ? (
          <Alert severity='warning'>
            Configura la URL pública de tu concesionario en Configuración para compartir vehículos.
          </Alert>
        ) : null}

        {vehicle ? (
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
              <Box
                component='img'
                src={heroImage}
                alt={buildVehicleShareTitle(vehicle)}
                sx={{
                  width: { xs: '100%', sm: 160 },
                  height: { xs: 180, sm: 110 },
                  objectFit: 'cover',
                  borderRadius: 2,
                  flexShrink: 0
                }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>
                  {vehicle.brand} {vehicle.model}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {vehicle.year ?? '—'}
                </Typography>
                <Typography variant='h5' color='primary.main' sx={{ mt: 1 }}>
                  {formatCurrency(vehicle.price)}
                </Typography>
              </Box>
            </Stack>

            <TextField
              label='URL pública'
              value={shareUrl}
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={handleCopyLink}
                      disabled={!isReady || isBusy}
                      aria-label='Copiar enlace'
                      edge='end'
                    >
                      <ContentCopyOutlinedIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Stack spacing={1.5}>
              <Button
                variant='contained'
                startIcon={<ContentCopyOutlinedIcon />}
                onClick={handleCopyLink}
                disabled={!isReady || isBusy}
                fullWidth
              >
                Copiar enlace
              </Button>

              <Button
                variant='outlined'
                color='success'
                startIcon={<WhatsAppIcon />}
                onClick={handleWhatsAppShare}
                disabled={!isReady || isBusy}
                fullWidth
                sx={{ color: 'success.dark' }}
              >
                Compartir por WhatsApp
              </Button>

              <Button
                variant='outlined'
                startIcon={<FacebookOutlinedIcon />}
                onClick={handleFacebookShare}
                disabled={!isReady || isBusy}
                fullWidth
              >
                Compartir por Facebook
              </Button>

              <Button
                variant='outlined'
                startIcon={<XIcon />}
                onClick={handleXShare}
                disabled={!isReady || isBusy}
                fullWidth
              >
                Compartir por X
              </Button>

              <Button
                variant='outlined'
                startIcon={<EmailOutlinedIcon />}
                onClick={handleEmailShare}
                disabled={!isReady || isBusy}
                fullWidth
              >
                Compartir por correo
              </Button>

              {canUseNativeShare() ? (
                <Button
                  variant='text'
                  startIcon={<IosShareOutlinedIcon />}
                  onClick={handleNativeShare}
                  disabled={!isReady || isBusy}
                  fullWidth
                >
                  Compartir…
                </Button>
              ) : null}
            </Stack>
          </Stack>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
