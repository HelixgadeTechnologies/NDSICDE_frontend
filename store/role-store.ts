import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'partners'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface RoleState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  setUser: (user: User) => void
}

// Hardcoded users for testing
export const MOCK_USERS: Record<UserRole, User> = {
  admin: {
    id: '1',
    name: 'Super Admin',
    email: 'admin@dsn.org',
    role: 'admin',
    avatar: '/avatars/admin.jpg'
  },
  partners: {
    id: '2',
    name: 'Partner',
    email: 'partner@company.com',
    role: 'partners',
    avatar: '/avatars/partner.jpg'
  },
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (user: User) => {
        set({ user, isAuthenticated: true })
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      
      setUser: (user: User) => {
        set({ user })
      }
    }),
    {
      name: 'role-storage',
    }
  )
)

// Helper functions
export const getRoleBasePath = (role: UserRole): string => {
  return `/${role}`
}

export const getRoleDisplayName = (role: UserRole): string => {
  const names = {
    admin: 'Administrator',
    partners: 'Partners',
  }
  return names[role]
}