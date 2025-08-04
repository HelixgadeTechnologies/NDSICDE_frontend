import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'partners' | 'management' | 'retirement-managers'

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

// Updated users with kebab-case roles
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
    name: 'Partners',
    email: 'partner@company.com',
    role: 'partners',
    avatar: '/avatars/partner.jpg'
  },
  'management': {
    id: '3',
    name: "Management and Staff",
    email: "managementandstaff@company.com",
    role: 'management',
    avatar: '/management-staff.jpg',
  },
  'retirement-managers': {
    id: '4',
    name: "Retirement Managers",
    email: "retirement@company.com",
    role: 'retirement-managers',
    avatar: '/retirement.jpg',
  }
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

// for name at the top of the page
export const getRoleDisplayName = (role: UserRole): string => {
  const names = {
    admin: 'Super Admin',
    partners: 'Partners',
    'management': 'Management & Staff',
    'retirement-managers': 'Request & Retirement Managers'
  }
  return names[role]
}