// Shape of a single user
export interface UserManagementCredentials {
  userId: string; // API returns UUID (string), not number
  fullName: string;
  email: string;
  address: string | null;
  phoneNumber: string;
  roleId: string;
  roleName: string;
  status: "Active" | "Inactive" | "ACTIVE" | "INACTIVE";
  assignedProjectId: string | null;
  department: string | null;
  community: string | null;
  state: string | null;
  localGovernmentArea: string | null;
  profilePic: string | null;
  profilePicMimeType: string | null;
  loginLast: string;
  createAt: string;
  updateAt: string;
  password: string;
}

// Data structure for creating/updating users (matches API screenshot)
export interface CreateUserData {
  userId?: string; // Optional for create, required for update
  fullName: string;
  email: string;
  roleId: string;
  department: string;
  phoneNumber: string;
  status: string;
  assignedProjectId: string;
}

// Generic API response type
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// POST/PUT response
export type UserManagementResponse = ApiResponse<string>;

// GET all users response
export type GetUserManagementResponse = ApiResponse<UserManagementCredentials[]>;

// GET single user response
export type GetUserResponse = ApiResponse<UserManagementCredentials>;

// DELETE response
export type DeleteUserResponse = ApiResponse<string>;

// Fetch all users
export async function getUsers(token: string): Promise<GetUserManagementResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/userManagement/users`,
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
        `Failed to fetch users with status ${response.status}`
    );
  }

  return await response.json();
}

// Create a new user
export async function createUser(
  userData: CreateUserData,
  token: string
): Promise<UserManagementResponse> {
  const requestBody = {
    isCreate: true,
    data: {
      userId: "",
      fullName: userData.fullName,
      email: userData.email,
      roleId: userData.roleId,
      department: userData.department,
      phoneNumber: userData.phoneNumber,
      status: userData.status,
      assignedProjectId: userData.assignedProjectId,
    },
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/userManagement/register`,
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
    throw new Error(
      errorData.message ||
        `Failed to create user with status ${response.status}`
    );
  }

  return await response.json();
}

// Update an existing user
export async function updateUser(
  userId: string,
  userData: CreateUserData,
  token: string
): Promise<UserManagementResponse> {
  const requestBody = {
    isCreate: false,
    data: {
      userId: userId,
      fullName: userData.fullName,
      email: userData.email,
      roleId: userData.roleId,
      department: userData.department,
      phoneNumber: userData.phoneNumber,
      status: userData.status,
      assignedProjectId: userData.assignedProjectId,
    },
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/userManagement/register`,
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
    throw new Error(
      errorData.message ||
        `Failed to update user with status ${response.status}`
    );
  }

  return await response.json();
}

// Delete a user
export async function deleteUser(
  userId: string,
  token: string,
): Promise<DeleteUserResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/userManagement/delete`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({userId}),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message ||
        `Failed to delete user with status ${response.status}`
    );
  }

  return await response.json();
}

// Get a single user by ID (bonus function that might be useful)
export async function getUserById(
  userId: string,
  token: string
): Promise<GetUserResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/userManagement/users/${userId}`,
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
        `Failed to fetch user with status ${response.status}`
    );
  }

  return await response.json();
}