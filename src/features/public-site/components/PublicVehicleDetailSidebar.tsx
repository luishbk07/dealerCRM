import { useState } from 'react'
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import type { PublicDealerProfile, PublicVehicleDetail } from '../types'
import { buildVehicleInterestMessage } from '../utils/publicVehicleUtils'
import { buildWhatsAppLink } from '../utils/publicSiteUtils'

interface PublicVehicleDetailSidebarProps {
  dealer: PublicDealerProfile
  vehicle: PublicVehicleDetail
  shareUrl: string
}

export const PublicVehicleDetailSidebar = ({
  dealer,
  vehicle,
  shareUrl
}: PublicVehicleDetailSidebarProps) => {
  const [shareMessage, setShareMessage] = useState<string | null>(null)

  const interestMessage = buildVehicleInterestMessage(vehicle.brand, vehicle.model, vehicle.year)
  const whatsappLink = buildWhatsAppLink(dealer.whatsapp ?? dealer.phone, interestMessage)
  const phoneLink = dealer.phone ? `tel:${dealer.phone.replace(/\s/g, '')}` : null

  const handleShare = async () => {
    const shareTitle = `${vehicle.brand} ${vehicle.model}${vehicle.year ? ` ${vehicle.year}` : ''}`
    const shareText = `Mira este vehículo en ${dealer.name}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        })
        return
      }

      await navigator.clipboard.writeText(shareUrl)
      setShareMessage('Enlace copiado al portapapeles.')
    } catch {
      setShareMessage(null)
    }
  }

  return (
    <Card sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant='h6'>¿Te interesa este vehículo?</Typography>
          <Typography variant='body2' color='text.secondary'>
            Contáctanos directamente para más información o para coordinar una visita.
          </Typography>

          {whatsappLink ? (
            <Button
              variant='contained'
              color='success'
              size='large'
              fullWidth
              startIcon={<WhatsAppIcon />}
              href={whatsappLink}
              target='_blank'
              rel='noopener noreferrer'
              sx={{ color: '#fff' }}
            >
              WhatsApp
            </Button>
          ) : null}

          {phoneLink ? (
            <Button
              variant='outlined'
              size='large'
              fullWidth
              startIcon={<PhoneOutlinedIcon />}
              href={phoneLink}
            >
              Llamar
            </Button>
          ) : null}

          <Button
            variant='outlined'
            size='large'
            fullWidth
            startIcon={<ShareOutlinedIcon />}
            onClick={handleShare}
          >
            Compartir
          </Button>

          {shareMessage ? (
            <Typography variant='caption' color='success.main'>
              {shareMessage}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}
