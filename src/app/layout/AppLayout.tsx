import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useScrollRestoration } from '@/shared/hooks/useScrollRestoration'
import { getDealerBannerUrl, getDealerLogoUrl } from '@/shared/utils/dealerBranding'
import { Sidebar, SIDEBAR_WIDTH } from './Sidebar'
import { Topbar } from './Topbar'

export const AppLayout = () => {
  const { user, dealer } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  useScrollRestoration()

  const logoUrl = useMemo(() => getDealerLogoUrl(dealer), [dealer])
  const bannerUrl = useMemo(() => getDealerBannerUrl(dealer), [dealer])

  if (!user) return null

  const toggleMobile = () => setMobileOpen((prev) => !prev)
  const closeMobile = () => setMobileOpen(false)
  const dealershipName = dealer?.name ?? 'Mi concesionario'

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={closeMobile}
        dealershipName={dealershipName}
        logoUrl={logoUrl}
      />
      <Topbar user={user} logoUrl={logoUrl} onToggleMobile={toggleMobile} />
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
        {bannerUrl ? (
          <Box
            component='img'
            src={bannerUrl}
            alt={`Banner de ${dealershipName}`}
            sx={{
              width: '100%',
              height: { xs: 96, sm: 120, md: 140 },
              objectFit: 'cover',
              display: 'block',
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          />
        ) : null}
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
