import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/shared/services/supabase'
import type { Dealer, Profile, User } from '@/shared/types'
import { authService, mapSupabaseUserToUser } from '../services/authService'
import { profileService } from '../services/profileService'
import { dealerService } from '@/features/onboarding/services/dealerService'

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  dealer: Dealer | null
  isAuthenticated: boolean
  hasDealer: boolean
  isInitializing: boolean
  configError: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (input: { email: string, password: string, fullName: string }) => Promise<{ needsEmailConfirmation: boolean }>
  signOut: () => Promise<void>
  refreshDealer: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const SUPABASE_CONFIG_MESSAGE = 'Configura Supabase: copia .env.example a .env y agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'

const extractFullName = (supabaseUser: SupabaseUser, fallbackProfile: Profile | null): string => {
  const metaName = (supabaseUser.user_metadata?.full_name as string | undefined)?.trim()
  if (metaName) return metaName
  if (fallbackProfile?.fullName) return fallbackProfile.fullName
  return supabaseUser.email ?? 'Usuario'
}

const buildUser = (supabaseUser: SupabaseUser, profile: Profile | null): User => {
  return mapSupabaseUserToUser(supabaseUser, extractFullName(supabaseUser, profile), profile?.role ?? 'dealer')
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [dealer, setDealer] = useState<Dealer | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [configError, setConfigError] = useState<string | null>(
    isSupabaseConfigured ? null : SUPABASE_CONFIG_MESSAGE
  )

  const loadAccountContext = useCallback(async (current: SupabaseUser | null) => {
    if (!current) {
      setProfile(null)
      setDealer(null)
      return
    }
    try {
      const fallbackName = (current.user_metadata?.full_name as string | undefined)?.trim() || current.email || 'Usuario'
      const [resolvedProfile, resolvedDealer] = await Promise.all([
        profileService.ensureExists({ id: current.id, fullName: fallbackName }),
        dealerService.getDealerByOwnerId(current.id)
      ])
      setProfile(resolvedProfile)
      setDealer(resolvedDealer)
      setConfigError(null)
    } catch (error) {
      setProfile(null)
      setDealer(null)
      setConfigError((error as Error).message)
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsInitializing(false)
      return
    }

    let cancelled = false

    const initialize = async () => {
      const { data } = await supabase.auth.getSession()
      if (cancelled) return
      const sessionUser = data.session?.user ?? null
      setSupabaseUser(sessionUser)
      await loadAccountContext(sessionUser)
      if (!cancelled) setIsInitializing(false)
    }

    void initialize()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
      const sessionUser = session?.user ?? null
      setSupabaseUser(sessionUser)
      void loadAccountContext(sessionUser)
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [loadAccountContext])

  const signIn = useCallback(async (email: string, password: string) => {
    const { user } = await authService.signIn({ email, password })
    setSupabaseUser(user)
    await loadAccountContext(user)
  }, [loadAccountContext])

  const signUp = useCallback(async ({ email, password, fullName }: { email: string, password: string, fullName: string }) => {
    const result = await authService.signUp({ email, password, fullName })

    if (result.user && result.session) {
      try {
        await profileService.ensureExists({ id: result.user.id, fullName, role: 'dealer' })
      } catch {
        // Si la inserción del perfil falla por RLS o políticas, se reintentará en el próximo loadAccountContext.
      }
      setSupabaseUser(result.user)
      await loadAccountContext(result.user)
    }

    return { needsEmailConfirmation: result.needsEmailConfirmation }
  }, [loadAccountContext])

  const signOut = useCallback(async () => {
    await authService.signOut()
    setSupabaseUser(null)
    setProfile(null)
    setDealer(null)
  }, [])

  const refreshDealer = useCallback(async () => {
    if (!supabaseUser) return
    const next = await dealerService.getDealerByOwnerId(supabaseUser.id)
    setDealer(next)
  }, [supabaseUser])

  const user = useMemo<User | null>(() => {
    if (!supabaseUser) return null
    return buildUser(supabaseUser, profile)
  }, [supabaseUser, profile])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      dealer,
      isAuthenticated: user !== null,
      hasDealer: dealer !== null,
      isInitializing,
      configError,
      signIn,
      signUp,
      signOut,
      refreshDealer
    }),
    [user, profile, dealer, isInitializing, configError, signIn, signUp, signOut, refreshDealer]
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
