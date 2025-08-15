import  { create } from "zustand";

type SettingsFormState = {
    generalSettingsId: string;
    organizationName: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    organizationLogo: string;
    defaultCurrency: string;
    defaultTimezone: string;
    dataRententionPolicy: string;
    auditLogRetention: string;
    isEmailNotificationsClicked: boolean;
    isMaintenanceAlertsClicked: boolean;
    setField: <K extends keyof SettingsFormState>(key: K, value: SettingsFormState[K]) => void;
    resetForm: () => void;
    setAllFields: <K extends keyof SettingsFormState>(key: K, value: SettingsFormState[K]) => void;
}

const defaultFormState: Omit<SettingsFormState, "setField" | "resetForm" | "setAllFields"> = {
  organizationName: "",
  contactEmail: "",
  contactPhone: "",
  website: "",
  organizationLogo: "",
  defaultCurrency: "",
  defaultTimezone: "",
  dataRententionPolicy: "",
  auditLogRetention: "",
  generalSettingsId: " ",
  isEmailNotificationsClicked: false,
  isMaintenanceAlertsClicked: false,
};

export const useSettingsFormState = create<SettingsFormState>((set) => ({
  ...defaultFormState,
  setField: <K extends keyof SettingsFormState>(key: K, value: SettingsFormState[K]) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
  resetForm: () => set({ ...defaultFormState }),
    setAllFields: (fields: Partial<SettingsFormState>) => {
    set((state) => ({ ...state, ...fields }));
  }
}));
