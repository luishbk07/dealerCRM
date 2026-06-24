import { Box, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'
import type { ReactNode } from 'react'

interface AuthCardShellProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
  maxWidth?: 'xs' | 'sm'
}

export const AuthCardShell = ({ title, subtitle, children, footer, maxWidth = 'sm' }: AuthCardShellProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)',
        py: 4
      }}
    >
      <Container maxWidth={maxWidth}>
        <Stack spacing={4}>
          <Stack direction='row' spacing={1.5} alignItems='center' justifyContent='center'>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DirectionsCarFilledIcon />
            </Box>
            <Typography variant='h4' sx={{ fontWeight: 700 }}>
              Dealer CRM
            </Typography>
          </Stack>
          <Card>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant='h4'>{title}</Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                    {subtitle}
                  </Typography>
                </Box>
                {children}
              </Stack>
            </CardContent>
          </Card>
          {footer ? (
            <Typography variant='body2' color='text.secondary' textAlign='center'>
              {footer}
            </Typography>
          ) : null}
        </Stack>
      </Container>
    </Box>
  )
}
