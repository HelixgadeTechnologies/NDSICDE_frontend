import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'partners' | 'management' | 'r-managers'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  // Additional fields from your JWT token
  phoneNumber?: string
  address?: string
  department?: string | null
  community?: string | null
  state?: string | null
  localGovernmentArea?: string | null
  status?: string
  assignedProjectId?: string | null
  roleId?: string
}

interface RoleState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true })
      },
      
      logout: () => {
        // Clear stored tokens
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        set({ user: null, token: null, isAuthenticated: false })
      },
      
      setUser: (user: User) => {
        set({ user })
      },
      
      setToken: (token: string) => {
        set({ token })
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
    'r-managers': 'Request & Retirement Managers'
  }
  return names[role]
}

// Utility function to get stored token
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

// Utility function to check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.log(error)
    return true; // Consider expired if we can't decode
  }
}