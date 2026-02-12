import { create } from "zustand";

// type PSD {
//     department: string;
//     manager: string;
//     priority: string;
// }

type PerformanceAnalyticsReportsState = {
    KPIName: string;
    result: string;
    projects: string;
    PSDFilter: string;
    reportType: string;
    reportName: string;
    startDate: string;
    endDate: string;
    reportConfigurationProjects: string;
    metricsAndKPIs: string[];
    setField: <K extends keyof PerformanceAnalyticsReportsState>(key: K, value: PerformanceAnalyticsReportsState[K]) => void;
    resetForm: () => void;
}

const defaultFormState: Omit<PerformanceAnalyticsReportsState, "setField" | "resetForm"> = {
    KPIName: "",
    result: "",
    projects: "",
    PSDFilter: "",
    reportType: "",
    reportName: "",
    startDate: "",
    endDate: "",
    reportConfigurationProjects: "",
    metricsAndKPIs: [],
}

export const usePerformanceAnalyticsReportsState = create<PerformanceAnalyticsReportsState>((set) => ({
    ...defaultFormState,
    setField: <K extends keyof PerformanceAnalyticsReportsState>(key: K, value: PerformanceAnalyticsReportsState[K]) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
  resetForm: () => set({ ...defaultFormState }),
}))
