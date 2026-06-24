import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { LoadingState } from '@/shared/components'
import { paths } from './paths'

interface AuthGuardProps {
  children?: ReactNode
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isInitializing } = useAuth()
  const location = useLocation()

  if (isInitializing) {
    return <LoadingState message='Verificando tu sesión…' />
  }

  if (!isAuthenticated) {
    return <Navigate to={paths.login} state={{ from: location }} replace />
  }

  return <>{children ?? <Outlet />}</>
}
