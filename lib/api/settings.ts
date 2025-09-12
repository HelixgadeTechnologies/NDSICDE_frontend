import axios from "axios";

export interface SuperAdminSettingsCredentials {
  generalSettingsId: string;
  organizationName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  organizationLogo: string;
  defaultCurrency: string;
  defaultTimeZone: string;
  dateRetentionPolicy: string;
  auditLogRetention: string;
  emailNotification: boolean;
  maintenanceAlert: boolean;
}

// create and update
export interface SuperAdminSettingsResponse {
  success: boolean;
  message: string;
  data: string;
}
// get
export interface GeneralSettingsResponse {
  success: boolean;
  message: string;
  data: SuperAdminSettingsCredentials;
}

interface Role {
  roleId: string;
  roleName: string;
  description: string | null;
  permission: string;
  createAt: string;
  updateAt: string;
  users: number;
}

// Dropdown option interface
export interface RoleOption {
  value: string;
  label: string;
}


export async function apiAdminSettings(
  credentials: SuperAdminSettingsCredentials,
  token: string,
  isCreate: boolean = true
): Promise<SuperAdminSettingsResponse> {
  const requestBody = {
    isCreate,
    data: credentials,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/settings/general`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Response:", errorData);

    throw new Error(
      errorData.message ||
        `Settings ${isCreate ? "creation" : "update"} failed with status ${
          response.status
        }`
    );
  }

  const result = await response.json();
  return result;
}

// Function to get existing general settings
export async function apiGetGeneralSettings(
  token: string
): Promise<GeneralSettingsResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/settings/general`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message ||
        `Failed to fetch general settings with status ${response.status}`
    );
  }

  return await response.json();
}

export async function getAllRoles(token: string): Promise<Role[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/settings/roles`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch roles');
    console.error(error)
  }
}

export async function getRoleOptions(token: string): Promise<RoleOption[]> {
  try {
    const roles = await getAllRoles(token);
    
    return roles.map(role => ({
      value: role.roleId,
      label: role.roleName
    }));
  } catch (error) {
    console.error('Error fetching role options:', error);
    return [];
  }
}