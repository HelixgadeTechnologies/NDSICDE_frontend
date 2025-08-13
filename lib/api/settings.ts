export interface AdminSettingsCredentials {
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
export interface AdminSettingsResponse {
  success: boolean;
  message: string;
  data: string;
}

// get
export interface GeneralSettingsResponse {
  success: boolean;
  message: string;
  data: AdminSettingsCredentials;
}

export async function apiAdminSettings(
  credentials: AdminSettingsCredentials,
  token: string,
  isCreate: boolean = true
): Promise<AdminSettingsResponse> {
  const requestBody = {
    isCreate,
    data: credentials
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/settings/general`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('API Error Response:', errorData);
    
    throw new Error(
      errorData.message ||
        `Settings ${isCreate ? 'creation' : 'update'} failed with status ${response.status}`
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
        "Authorization": `Bearer ${token}`
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