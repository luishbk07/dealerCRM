import {
  Box,
  Button,
  Container,
  Stack,
  Typography
} from '@mui/material'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import type { PublicDealerProfile } from '../types'
import { buildWhatsAppLink, normalizeWebsiteUrl } from '../utils/publicSiteUtils'

interface PublicDealerHeroProps {
  dealer: PublicDealerProfile
}

const PLACEHOLDER_BANNER = 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 45%, #0EA5E9 100%)'

export const PublicDealerHero = ({ dealer }: PublicDealerHeroProps) => {
  const websiteUrl = normalizeWebsiteUrl(dealer.website)
  const whatsappLink = buildWhatsAppLink(
    dealer.whatsapp ?? dealer.phone,
    `Hola ${dealer.name}, me interesa conocer su inventario de vehículos.`
  )

  return (
    <Box
      sx={{
        position: 'relative',
        color: 'common.white',
        background: dealer.bannerUrl ? undefined : PLACEHOLDER_BANNER,
        backgroundImage: dealer.bannerUrl ? `url(${dealer.bannerUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(180deg, rgba(15,23,42,0.72) 0%, rgba(15,23,42,0.88) 100%)'
        }}
      >
        <Container maxWidth='lg' sx={{ py: { xs: 5, md: 7 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Box
              sx={{
                width: { xs: 72, md: 96 },
                height: { xs: 72, md: 96 },
                borderRadius: 3,
                overflow: 'hidden',
                border: 'none',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {dealer.logoUrl ? (
                <Box
                  component='img'
                  src={dealer.logoUrl}
                  alt={`Logo de ${dealer.name}`}
                  loading='lazy'
                  sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              )}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant='h3' component='h1' sx={{ fontWeight: 700, mb: 0.75 }}>
                {dealer.name}
              </Typography>
              {dealer.city ? (
                <Stack direction='row' spacing={0.75} alignItems='center' sx={{ mb: 2, opacity: 0.92 }}>
                  <LocationOnOutlinedIcon fontSize='small' />
                  <Typography variant='body1'>{dealer.city}</Typography>
                </Stack>
              ) : null}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} useFlexGap flexWrap='wrap'>
                {dealer.phone ? (
                  <Button
                    variant='outlined'
                    startIcon={<PhoneOutlinedIcon />}
                    href={`tel:${dealer.phone.replace(/\s/g, '')}`}
                    sx={{
                      color: 'common.white',
                      borderColor: 'rgba(255,255,255,0.45)',
                      '&:hover': { borderColor: 'common.white', backgroundColor: 'rgba(255,255,255,0.08)' }
                    }}
                  >
                    {dealer.phone}
                  </Button>
                ) : null}
                {whatsappLink ? (
                  <Button
                    variant='contained'
                    color='success'
                    startIcon={<WhatsAppIcon />}
                    href={whatsappLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    sx={{ color: '#fff' }}
                  >
                    WhatsApp
                  </Button>
                ) : null}
                {websiteUrl ? (
                  <Button
                    variant='outlined'
                    startIcon={<LanguageOutlinedIcon />}
                    href={websiteUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    sx={{
                      color: 'common.white',
                      borderColor: 'rgba(255,255,255,0.45)',
                      '&:hover': { borderColor: 'common.white', backgroundColor: 'rgba(255,255,255,0.08)' }
                    }}
                  >
                    Sitio web
                  </Button>
                ) : null}
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
