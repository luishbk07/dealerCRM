import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { LoadingState } from '@/shared/components'
import { paths } from './paths'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isInitializing } = useAuth()
  const location = useLocation()

  if (isInitializing) {
    return <LoadingState message='Iniciando sesión…' />
  }

  if (!isAuthenticated) {
    return <Navigate to={paths.login} state={{ from: location }} replace />
  }

  return <>{children}</>
}
