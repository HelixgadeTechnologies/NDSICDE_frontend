import { create } from "zustand";

interface AP {
  label: string;
  value: string;
}

type UserManagementState = {
    role: string;
    status: string;
    fullName: string;
    emailAddress: string;
    department: string;
    phoneNumber: string;
    assignedProjects: Array<AP>;

    setField: <K extends keyof UserManagementState>(key: K, value: UserManagementState[K]) => void;
    resetForm: () => void;
};

const defaultFormState: Omit<UserManagementState, "setField" | "resetForm"> = {
    role: "",
    status: "",
    fullName: "",
    emailAddress: "",
    department: "",
    phoneNumber: "",
    assignedProjects: [],
}

export const useUserManagementState = create<UserManagementState>((set) => ({
    ...defaultFormState,
    setField: <K extends keyof UserManagementState>(key: K, value: UserManagementState[K]) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
  resetForm: () => set({ ...defaultFormState }),
}))