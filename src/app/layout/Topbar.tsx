import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Stack, Toolbar, Typography, Divider } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '@/shared/types'
import { useAuth } from '@/features/auth/context/AuthContext'
import { paths } from '@/app/routes/paths'
import { SIDEBAR_WIDTH } from './Sidebar'

interface TopbarProps {
  user: User
  logoUrl?: string | null
  onToggleMobile: () => void
}

export const Topbar = ({ user, logoUrl, onToggleMobile }: TopbarProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    setAnchorEl(null)
    await signOut()
    navigate(paths.login, { replace: true })
  }

  const initials = user.fullName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

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
        <Stack direction='row' alignItems='center' spacing={1}>
          <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ p: 0.5 }}>
            <Avatar
              src={logoUrl ?? undefined}
              alt={logoUrl ? 'Logo del concesionario' : user.fullName}
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
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
