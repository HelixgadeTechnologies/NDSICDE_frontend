import { create } from "zustand";

type StrategicObjectivesAndKPIsState = {
    // add SO
    strategicObjectiveStatement: string;
    thematicAreas: string;
    pillarLeadEmail: string;

    // add KPI
    kpiStatement: string;
    kpiDefinition: string;
    kpiType: string;
    specificArea: string;
    unitOfMeasurement: string;
    itemInMeasure: string;

    // checkboxes
    checkboxes: boolean[]; // 7 items
    checkboxLabels: string[]; // optional
    toggleCheckbox: (index: number) => void;
    setAllCheckboxes: (value: boolean) => void;

    setField: <K extends keyof StrategicObjectivesAndKPIsState>(key: K, value: StrategicObjectivesAndKPIsState[K]) => void;
    resetForm: () => void;
}

const defaultFormState: Omit<StrategicObjectivesAndKPIsState, "setField" | "resetForm" | "toggleCheckbox" | "setAllCheckboxes"> = {
    strategicObjectiveStatement: "",
    thematicAreas: "",
    pillarLeadEmail: "",
    kpiStatement: "",
    kpiDefinition: "",
    kpiType: "",
    specificArea: "",
    unitOfMeasurement: "",
    itemInMeasure: "",
    checkboxes: Array(7).fill(false),
    checkboxLabels: [
        "Department",
        "State",
        "Product",
        "Tenure",
        "Gender",
        "Age",
        "None",
    ],
}

export const useStrategicObjectivesAndKPIsState = create<StrategicObjectivesAndKPIsState>((set) => ({
    ...defaultFormState,
    toggleCheckbox: (index: number) =>
      set((state) => {
        const updated = [...state.checkboxes];
        updated[index] = !updated[index];
        return { checkboxes: updated };
      }),

    setAllCheckboxes: (value: boolean) =>
      set(() => ({ checkboxes: Array(7).fill(value) })),
    
    setField: <K extends keyof StrategicObjectivesAndKPIsState>(key: K, value: StrategicObjectivesAndKPIsState[K]) => set((state) => ({
        ...state,
        [key]: value,
    })),
    resetForm: () => set({...defaultFormState})
}))