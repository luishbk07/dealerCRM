import { Box, Button, Container, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/routes/paths'
import type { PublicDealerProfile } from '../types'

interface PublicSiteHeaderProps {
  dealer: PublicDealerProfile
  dealerSlug: string
}

export const PublicSiteHeader = ({ dealer, dealerSlug }: PublicSiteHeaderProps) => {
  const navigate = useNavigate()

  return (
    <Box sx={{ backgroundColor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth='lg' sx={{ py: 2 }}>
        <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={2}>
          <Stack direction='row' alignItems='center' spacing={1.5} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                backgroundColor: 'transparent'
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
                <DirectionsCarFilledOutlinedIcon color='primary' />
              )}
            </Box>
            <Typography variant='subtitle1' sx={{ fontWeight: 700 }} noWrap>
              {dealer.name}
            </Typography>
          </Stack>
          <Button
            variant='outlined'
            size='small'
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(paths.dealerPublic(dealerSlug))}
            sx={{ flexShrink: 0 }}
          >
            Volver al inventario
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
