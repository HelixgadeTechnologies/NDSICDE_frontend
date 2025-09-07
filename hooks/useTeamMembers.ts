import { useState, useEffect, useCallback } from 'react';
import { getUsers } from '@/lib/api/user-management';
import { UserDetails } from '@/types/team-members';

export function useTeamMembers(token: string | null) {
  const [isFetching, setIsFetching] = useState(false);
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    
    setIsFetching(true);
    setError(null);

    try {
      const response = await getUsers(token);

      if (response.success && Array.isArray(response.data)) {
        const mappedUsers: UserDetails[] = response.data.map(
          (user: UserDetails) => ({
            userId: user.userId,
            fullName: user.fullName,
            email: user.email,
            address: user.address,
            phoneNumber: user.phoneNumber,
            roleId: user.roleId,
            roleName: user.roleName,
            status: user.status,
            assignedProjectId: user.assignedProjectId,
            department: user.department,
            community: user.community,
            state: user.state,
            localGovernmentArea: user.localGovernmentArea,
            profilePic: user.profilePic,
            profilePicMimeType: user.profilePicMimeType,
            loginLast: user.loginLast,
            createAt: user.createAt,
            updateAt: user.updateAt,
            password: user.password,
          })
        );

        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to fetch team members");
    } finally {
      setIsFetching(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isFetching,
    error,
    refetch: fetchUsers,
  };
}