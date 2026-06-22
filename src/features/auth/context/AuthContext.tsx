import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@/shared/types'
import { authService, storage } from '@/shared/services'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AUTH_STORAGE_KEY = 'auth_user'

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const stored = storage.get<User | null>(AUTH_STORAGE_KEY, null)
    if (stored) setUser(stored)
    setIsInitializing(false)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const signedUser = await authService.signIn({ email, password })
    storage.set(AUTH_STORAGE_KEY, signedUser)
    setUser(signedUser)
  }, [])

  const signOut = useCallback(async () => {
    await authService.signOut()
    storage.remove(AUTH_STORAGE_KEY)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isInitializing,
      signIn,
      signOut
    }),
    [user, isInitializing, signIn, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
