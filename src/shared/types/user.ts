export type UserRole = 'dealer' | 'admin' | 'sales'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  avatarUrl?: string
}

export interface Profile {
  id: string
  fullName: string | null
  role: string
  dealerId: string | null
  createdAt: string
}
