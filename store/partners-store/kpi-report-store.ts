import { create } from "zustand";

type KPIReportState = {
    strategicObjective: string;
    projectId: string;
    kpiName: string;
    kpiType: string;
    baseline: string;
    target: string;
    actualValue: string;
    narrative: string;
    setField: <K extends keyof KPIReportState>(key: K, value: KPIReportState[K]) => void;
    resetForm: () => void;
};

const defaultFormState: Omit<KPIReportState, "setField" | "resetForm"> = {
    strategicObjective: "",
    projectId: "",
    kpiName: "",
    kpiType: "",
    baseline: "",
    target: "",
    actualValue: "",
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