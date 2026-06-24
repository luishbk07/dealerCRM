import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '@/shared/services/supabase'
import type { User } from '@/shared/types'

export interface SignInInput {
  email: string
  password: string
}

export interface SignUpInput {
  email: string
  password: string
  fullName: string
}

export interface SignUpResult {
  user: SupabaseUser | null
  session: Session | null
  needsEmailConfirmation: boolean
}

export interface AuthService {
  signIn(input: SignInInput): Promise<{ user: SupabaseUser, session: Session }>
  signUp(input: SignUpInput): Promise<SignUpResult>
  signOut(): Promise<void>
  getCurrentUser(): Promise<SupabaseUser | null>
}

const normalizeError = (message: string): Error => {
  const friendlyMap: Record<string, string> = {
    'Invalid login credentials': 'Correo o contraseña incorrectos',
    'Email not confirmed': 'Confirma tu correo antes de iniciar sesión',
    'User already registered': 'Ya existe una cuenta con este correo',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 8 caracteres'
  }
  return new Error(friendlyMap[message] ?? message)
}

export const authService: AuthService = {
  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw normalizeError(error.message)
    if (!data.user || !data.session) {
      throw new Error('No se pudo iniciar sesión, intenta de nuevo.')
    }
    return { user: data.user, session: data.session }
  },

  async signUp({ email, password, fullName }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
      }
    })
    if (error) throw normalizeError(error.message)
    return {
      user: data.user,
      session: data.session,
      needsEmailConfirmation: data.user !== null && data.session === null
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw normalizeError(error.message)
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) return null
    return data.user
  }
}

export const mapSupabaseUserToUser = (supabaseUser: SupabaseUser, fullName: string, role: User['role'] = 'dealer'): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    fullName,
    role,
    avatarUrl: (supabaseUser.user_metadata?.avatar_url as string | undefined) ?? undefined
  }
}
