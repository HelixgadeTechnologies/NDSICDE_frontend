import { create } from 'zustand';

interface UserManagementState {
  fullName: string;
  emailAddress: string;
  department: string;
  phoneNumber: string;
  roleId: string;
  status: string;
  assignedProjects: string[];
  
  // Actions
  setField: <K extends keyof UserManagementState>(
    field: K, 
    value: UserManagementState[K]
  ) => void;
  resetForm: () => void;
}

const initialState = {
  fullName: '',
  emailAddress: '',
  department: '',
  phoneNumber: '',
  roleId: '',
  status: 'Active',
  assignedProjects: [],
};

export const useUserManagementState = create<UserManagementState>((set) => ({
  ...initialState,
  
  setField: (field, value) => {
    set((state) => {
      // Only update if the value is actually different
      if (state[field] === value) {
        return state; // Return the same state reference to prevent re-renders
      }
      
      return {
        ...state,
        [field]: value,
      };
    });
  },
  
  resetForm: () => {
    set(() => ({
      ...initialState,
    }));
  },
}));