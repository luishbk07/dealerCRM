export type UserRole = 'admin' | 'sales'

export interface User {
  id: string
  fullName: string
  email: string
  role: UserRole
  dealershipName: string
  avatarUrl?: string
}
