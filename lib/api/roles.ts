// utils/api/roles-api.ts
import axios from "axios";

// types/roles.ts
export type RoleData = {
  roleId: string;
  roleName: string;
  description: string;
  permission: string;
  createAt: string;
  updateAt: string;
  users: number;
};

export type RolesResponse = {
  data: RoleData[];
  message?: string;
  success?: boolean;
};

/**
 * Reusable function to fetch roles from the API
 * @returns Promise containing roles data
 * @throws Error if the request fails
 */
export const fetchRoles = async (): Promise<RoleData[]> => {
  try {
    const response = await axios.get<RolesResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/settings/roles`
    );
    
    // Validate response structure
    if (!response.data.data) {
      throw new Error("Invalid response format: missing data property");
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    
    // Re-throw with more context
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        "Failed to fetch roles"
      );
    }
    
    throw new Error("Failed to fetch roles. Please try again.");
  }
};

/**
 * Fetch roles with optional error handling callback
 * @param onSuccess Callback for successful fetch
 * @param onError Callback for error handling
 */
export const fetchRolesWithCallbacks = async (
  onSuccess?: (roles: RoleData[]) => void,
  onError?: (error: Error) => void
): Promise<RoleData[] | null> => {
  try {
    const roles = await fetchRoles();
    onSuccess?.(roles);
    return roles;
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    onError?.(errorObj);
    return null;
  }
};