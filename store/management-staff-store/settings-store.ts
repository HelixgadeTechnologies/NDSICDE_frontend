import { create } from "zustand";

type ManagementSettingsState = {
    name: string;
    email: string;
    phoneNumber: string;
    rolesAndPermissions:  string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    setField: <K extends keyof ManagementSettingsState>(key: K, value: ManagementSettingsState[K]) => void;
    resetForm: () => void;
};

const defaultFormState: Omit<ManagementSettingsState, "setField" | "resetForm"> = {
    name: "",
    email: "",
    phoneNumber: "",
    rolesAndPermissions: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

export const useManagementSettingsState = create<ManagementSettingsState>((set) => ({
  ...defaultFormState,
  setField: <K extends keyof ManagementSettingsState>(key: K, value: ManagementSettingsState[K]) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
  resetForm: () => set({ ...defaultFormState }),
}));