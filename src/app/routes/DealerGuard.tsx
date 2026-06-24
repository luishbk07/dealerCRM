import { Navigate, Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { LoadingState } from '@/shared/components'
import { paths } from './paths'

interface DealerGuardProps {
  children?: ReactNode
}

export const DealerGuard = ({ children }: DealerGuardProps) => {
  const { hasDealer, isInitializing } = useAuth()

  if (isInitializing) {
    return <LoadingState message='Cargando tu concesionario…' />
  }

  if (!hasDealer) {
    return <Navigate to={paths.onboarding} replace />
  }

  return <>{children ?? <Outlet />}</>
}
