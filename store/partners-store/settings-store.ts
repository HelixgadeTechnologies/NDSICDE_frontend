import { create } from "zustand";

type PartnerSettingsState = {
    name: string;
    email: string;
    phoneNumber: string;
    rolesAndPermissions:  string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    setField: <K extends keyof PartnerSettingsState>(key: K, value: PartnerSettingsState[K]) => void;
    resetForm: () => void;
};

const defaultFormState: Omit<PartnerSettingsState, "setField" | "resetForm"> = {
    name: "",
    email: "",
    phoneNumber: "",
    rolesAndPermissions: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

export const usePartnerSettingsState = create<PartnerSettingsState>((set) => ({
  ...defaultFormState,
  setField: <K extends keyof PartnerSettingsState>(key: K, value: PartnerSettingsState[K]) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
  resetForm: () => set({ ...defaultFormState }),
}));