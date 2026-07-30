import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Stack, Toolbar, Typography, Divider } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '@/shared/types'
import { useAuth } from '@/features/auth/context/AuthContext'
import { paths } from '@/app/routes/paths'
import { SIDEBAR_WIDTH } from './Sidebar'
import { ThemeModeToggle } from './ThemeModeToggle'
import { buildInitials } from '@/shared/utils/initials'

interface TopbarProps {
  user: User
  logoUrl?: string | null
  onToggleMobile: () => void
}

export const Topbar = ({ user, logoUrl, onToggleMobile }: TopbarProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { signOut, dealer } = useAuth()
  const navigate = useNavigate()
  const publicSiteUrl = dealer?.slug ? paths.dealerPublic(dealer.slug) : null

  const handleOpenPublicSite = () => {
    setAnchorEl(null)
    if (publicSiteUrl) {
      window.open(publicSiteUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleSignOut = async () => {
    setAnchorEl(null)
    await signOut()
    navigate(paths.login, { replace: true })
  }

  const initials = buildInitials(user.fullName)

  return (
    <AppBar
      position='fixed'
      sx={{
        width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { md: `${SIDEBAR_WIDTH}px` }
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction='row' alignItems='center' spacing={1}>
          <IconButton
            edge='start'
            color='inherit'
            onClick={onToggleMobile}
            sx={{ display: { md: 'none' }, color: 'text.primary' }}
            aria-label='Abrir menú'
          >
            <MenuIcon />
          </IconButton>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Hola, {user.fullName.split(' ')[0]} 👋
            </Typography>
            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
              Tu CRM hoy
            </Typography>
          </Box>
        </Stack>
        <Stack direction='row' alignItems='center' spacing={0.5}>
          <ThemeModeToggle />
          <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ p: 0.5 }}>
            <Avatar
              src={logoUrl ?? undefined}
              alt={logoUrl ? 'Logo del concesionario' : user.fullName}
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& img': { objectFit: 'contain', p: logoUrl ? 0.25 : 0 }
              }}
            >
              {!logoUrl ? initials : null}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ px: 2, py: 1.5, minWidth: 200 }}>
              <Typography variant='subtitle2'>{user.fullName}</Typography>
              <Typography variant='caption' color='text.secondary'>
                {user.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleOpenPublicSite} disabled={!publicSiteUrl}>
              <OpenInNewIcon fontSize='small' style={{ marginRight: 8 }} />
              Ver sitio público
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <LogoutIcon fontSize='small' style={{ marginRight: 8 }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
