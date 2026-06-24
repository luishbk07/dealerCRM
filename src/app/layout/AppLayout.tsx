import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Sidebar, SIDEBAR_WIDTH } from './Sidebar'
import { Topbar } from './Topbar'

export const AppLayout = () => {
  const { user, dealer } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  const toggleMobile = () => setMobileOpen((prev) => !prev)
  const closeMobile = () => setMobileOpen(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={closeMobile} dealershipName={dealer?.name ?? 'Mi concesionario'} />
      <Topbar user={user} onToggleMobile={toggleMobile} />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
