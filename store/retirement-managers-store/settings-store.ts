import { create } from "zustand";

type RetirementManagersSettingsState = {
    name: string;
    email: string;
    phoneNumber: string;
    rolesAndPermissions:  string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    setField: <K extends keyof RetirementManagersSettingsState>(key: K, value: RetirementManagersSettingsState[K]) => void;
    resetForm: () => void;
};

const defaultFormState: Omit<RetirementManagersSettingsState, "setField" | "resetForm"> = {
    name: "",
    email: "",
    phoneNumber: "",
    rolesAndPermissions: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

export const useRetirementManagersSettingsState = create<RetirementManagersSettingsState>((set) => ({
  ...defaultFormState,
  setField: <K extends keyof RetirementManagersSettingsState>(key: K, value: RetirementManagersSettingsState[K]) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
  resetForm: () => set({ ...defaultFormState }),
}));