import type { User } from '@/shared/types'
import { delay } from '@/shared/utils/delay'

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthService {
  signIn(credentials: AuthCredentials): Promise<User>
  signOut(): Promise<void>
}

const mockUser: User = {
  id: 'usr_001',
  fullName: 'Demo Dealer',
  email: 'demo@dealercrm.do',
  role: 'admin',
  dealershipName: 'Auto Premier RD'
}

export const authService: AuthService = {
  async signIn({ email, password }) {
    await delay(500)
    if (!email || !password) {
      throw new Error('Correo y contraseña son requeridos')
    }
    if (password.length < 4) {
      throw new Error('Contraseña inválida')
    }
    return { ...mockUser, email }
  },
  async signOut() {
    await delay(150)
  }
}
