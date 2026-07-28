import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import type { PublicDealerProfile } from '../types'
import { normalizeWebsiteUrl } from '../utils/publicSiteUtils'

interface PublicDealerFooterProps {
  dealer: PublicDealerProfile
}

export const PublicDealerFooter = ({ dealer }: PublicDealerFooterProps) => {
  const websiteUrl = normalizeWebsiteUrl(dealer.website)

  return (
    <Box component='footer' sx={{ mt: 6, py: 5, backgroundColor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth='lg'>
        <Stack spacing={2}>
          <Typography variant='h6'>{dealer.name}</Typography>
          <Typography variant='body2' color='text.secondary'>
            Contáctanos para más información sobre nuestro inventario.
          </Typography>
          <Divider />
          <Stack spacing={1.25}>
            {dealer.address ? (
              <Stack direction='row' spacing={1} alignItems='flex-start'>
                <LocationOnOutlinedIcon fontSize='small' color='action' sx={{ mt: 0.25 }} />
                <Typography variant='body2' color='text.secondary'>
                  {dealer.address}
                  {dealer.city ? `, ${dealer.city}` : ''}
                </Typography>
              </Stack>
            ) : null}
            {dealer.phone ? (
              <Stack direction='row' spacing={1} alignItems='center'>
                <PhoneOutlinedIcon fontSize='small' color='action' />
                <Link href={`tel:${dealer.phone.replace(/\s/g, '')}`} underline='hover' color='text.secondary'>
                  {dealer.phone}
                </Link>
              </Stack>
            ) : null}
            {websiteUrl ? (
              <Stack direction='row' spacing={1} alignItems='center'>
                <LanguageOutlinedIcon fontSize='small' color='action' />
                <Link href={websiteUrl} target='_blank' rel='noopener noreferrer' underline='hover'>
                  {dealer.website}
                </Link>
              </Stack>
            ) : null}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
