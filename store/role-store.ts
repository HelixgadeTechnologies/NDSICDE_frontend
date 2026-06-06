import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'super-admin' | 'partners' | 'management' | 'r-managers' | 'team-member' | 'admin' | 'staff'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phoneNumber?: string
  address?: string
  department?: string | null
  community?: string | null
  state?: string | null
  localGovernmentArea?: string | null
  status?: string
  assignedProjectId?: string | null
  roleId?: string
  // Human-readable role name from the JWT (e.g. "Finance Officer"), shown in
  // the top nav for staff users.
  roleName?: string
  // Approval layer (1-5) derived from the user's role in the roles list.
  // null/undefined = no approval rights.
  level?: number | null
}

interface RoleState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
  initializeAuth: () => void
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true })
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
      
      setUser: (user: User) => {
        set({ user })
      },
      
      setToken: (token: string) => {
        set({ token })
      },

      // Initialize auth state on app startup
      initializeAuth: () => {
        const { token } = get()
        if (token && !isTokenExpired(token)) {
          set({ isAuthenticated: true })
          sessionStorage.setItem("isAuthenticated",JSON.stringify(true))
        } else {
          set({ user: null, token: null, isAuthenticated: false })
        }
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
    'super-admin': 'Super Admin',
    'partners': 'Partners',
    'management': 'Management & Staff',
    'r-managers': 'Request & Retirement Managers',
    'team-member': 'Team Members',
    'admin': "Admin - Monitoring and Evaluation System",
    'staff': 'Staff'
  }
  return names[role]
}

// Header label shown in the top nav. Staff users display their actual role
// name (e.g. "Finance Officer") instead of the generic "Staff".
export const getRoleHeaderLabel = (user: User | null): string => {
  if (!user) return 'Dashboard'
  if (user.role === 'staff') {
    return user.roleName || 'Staff'
  }
  return getRoleDisplayName(user.role)
}

// Utility function to get stored token (now from Zustand store)
export const getStoredToken = (): string | null => {
  return useRoleStore.getState().token
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
    return true; 
  }
}