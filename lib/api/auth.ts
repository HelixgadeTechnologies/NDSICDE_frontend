import { UserRole } from "@/store/role-store";

// lib/auth-utils.ts

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: string; // The JWT token is directly in the data field as a string
}

export interface ResetPasswordCredentials {
  email: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface DecodedToken {
  userId: string;
  fullName: string;
  email: string;
  address?: string;
  phoneNumber?: string;
  roleId: string;
  roleName: string;
  status: string;
  assignedProjectId?: string | null;
  department?: string | null;
  community?: string | null;
  state?: string | null;
  localGovernmentArea?: string | null;
  profilePic?: string | null;
  profilePicMimeType?: string | null;
  loginLast: string;
  createAt: string;
  updateAt: string;
  password: string;
  iat: number;
  exp: number;
}

// JWT decode function
export function decodeJWT(token: string): DecodedToken | null {
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
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// API login function
export async function apiLogin(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signIn`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Login failed with status ${response.status}`);
  }

  return await response.json();
};

export async function apiResetPassword(credentials: ResetPasswordCredentials): Promise<ResetPasswordResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

    if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Reset password failed with status ${response.status}`);
  }

  return await response.json();
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJWT(token);
    if (!decoded) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.log(error)
    return true;
  }
}

// DEPRECATED: Use Zustand store instead
// These functions are kept for backward compatibility but should not be used
// if you're using the updated role store without manual storage
export function getStoredToken(): string | null {
  console.warn('getStoredToken is deprecated. Use useRoleStore.getState().token instead');
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

export function removeStoredToken(): void {
  console.warn('removeStoredToken is deprecated. Use useRoleStore logout method instead');
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
}

export function storeToken(token: string, remember: boolean): void {
  console.warn('storeToken is deprecated. Use useRoleStore login method instead');
  if (typeof window === 'undefined') return;
  
  if (remember) {
    localStorage.setItem('authToken', token);
  } else {
    sessionStorage.setItem('authToken', token);
  }
}

// Helper function to convert DecodedToken to User object for the store
export function createUserFromToken(decoded: DecodedToken): {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  department?: string | null;
  community?: string | null;
  state?: string | null;
  localGovernmentArea?: string | null;
  status?: string;
  assignedProjectId?: string | null;
  roleId?: string;
} {
  // Map roleName to UserRole
  const roleMap: Record<string, UserRole> = {
    'admin': 'admin',
    'super admin': 'admin', // Handle variations
    'partners': 'partners',
    'management': 'management',
    'management & staff': 'management',
    'r-managers': 'r-managers',
    'request & retirement managers': 'r-managers'
  };

  const role = roleMap[decoded.roleName.toLowerCase()] || 'partners'; // Default fallback

  return {
    id: decoded.userId,
    name: decoded.fullName,
    email: decoded.email,
    role,
    avatar: decoded.profilePic || undefined,
    phoneNumber: decoded.phoneNumber,
    address: decoded.address,
    department: decoded.department,
    community: decoded.community,
    state: decoded.state,
    localGovernmentArea: decoded.localGovernmentArea,
    status: decoded.status,
    assignedProjectId: decoded.assignedProjectId,
    roleId: decoded.roleId
  };
}

export function getDefaultRouteForRole(role: UserRole): string {
  return `/${role}/dashboard`;
}