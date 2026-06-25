import { Box, CircularProgress } from '@mui/material'
import { Navigate, Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { paths } from '@/app/routes/paths'

interface DealerGuardProps {
  children?: ReactNode
}

const CenteredLoader = () => (
  <Box
    sx={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <CircularProgress />
  </Box>
)

/**
 * Ensures the authenticated user owns a dealer before rendering protected pages.
 *
 * - While the auth context resolves the session and the matching dealer row, a centered loader is shown.
 * - If no dealer is linked to the user, the visitor is redirected to the onboarding flow.
 * - If a dealer exists, the protected children are rendered.
 *
 * The dealer query itself lives in `AuthContext`, which calls `dealerService.getDealerByOwnerId`
 * once per session change. The guard reads from that single source of truth to avoid redundant
 * round-trips on every navigation.
 */
export const DealerGuard = ({ children }: DealerGuardProps) => {
  const { hasDealer, isInitializing } = useAuth()

  if (isInitializing) return <CenteredLoader />
  if (!hasDealer) return <Navigate to={paths.onboarding} replace />
  return <>{children ?? <Outlet />}</>
}
