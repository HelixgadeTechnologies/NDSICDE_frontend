import  { create } from "zustand";

type SettingsFormState = {
    organizationName: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    // organizationLogo: ImageBitmap;
    defaultCurrency: string;
    defaultTimezone: string;
    dataRententionPolicy: string;
    auditLogRetention: string;
    isEmailNotificationsClicked: boolean;
    isMaintenanceAlertsClicked: boolean;
    setField: <K extends keyof SettingsFormState>(key: K, value: SettingsFormState[K]) => void;
    resetForm: () => void;
}

const defaultFormState: Omit<SettingsFormState, "setField" | "resetForm"> = {
  organizationName: "",
  contactEmail: "",
  contactPhone: "",
  website: "",
  //   organizationLogo: 
  defaultCurrency: "",
  defaultTimezone: "",
  dataRententionPolicy: "",
  auditLogRetention: "",
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
}));
