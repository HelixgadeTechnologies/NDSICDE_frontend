import { create } from "zustand";

type OrganizationalKPIState = {
    allStrategicObjective: string;
    resultLevel: string;
    indicators: string;
    disaggregation: string;

    setField: <K extends keyof OrganizationalKPIState>(key: K, value: OrganizationalKPIState[K]) => void;
    resetForm: () => void;
}

const defaultFormState: Omit<OrganizationalKPIState, "setField" | "resetForm"> = {
    allStrategicObjective: "",
    resultLevel: "",
    indicators: "",
    disaggregation: "",
}

export const useOrgKPIFormState = create<OrganizationalKPIState>((set) => ({
    ...defaultFormState,
    setField: <K extends keyof OrganizationalKPIState>(key: K, value: OrganizationalKPIState[K]) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
  resetForm: () => set({ ...defaultFormState }),
}))