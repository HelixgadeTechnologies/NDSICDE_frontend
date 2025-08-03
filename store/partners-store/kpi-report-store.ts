import { create } from "zustand";

type KPIReportState = {
    strategicObjective: string;
    kpiName: string;
    kpiType: string;
    baseline: string;
    target: string;
    narrative: string;
    setField: <K extends keyof KPIReportState>(key: K, value: KPIReportState[K]) => void;
    resetForm: () => void;
};

const defaultFormState: Omit<KPIReportState, "setField" | "resetForm"> = {
    strategicObjective: "",
    kpiName: "",
    kpiType: "",
    baseline: "",
    target: "",
    narrative: "",
};

export const useKPIReportState = create<KPIReportState>((set) => ({
  ...defaultFormState,
  setField: <K extends keyof KPIReportState>(key: K, value: KPIReportState[K]) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
  resetForm: () => set({ ...defaultFormState }),
}));