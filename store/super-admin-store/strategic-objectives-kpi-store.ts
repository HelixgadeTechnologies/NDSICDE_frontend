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
}

export const useStrategicObjectivesAndKPIsState = create<StrategicObjectivesAndKPIsState>((set) => ({
    ...defaultFormState,
    setField: <K extends keyof StrategicObjectivesAndKPIsState>(key: K, value: StrategicObjectivesAndKPIsState[K]) => set((state) => ({
        ...state,
        [key]: value,
    })),
    resetForm: () => set({...defaultFormState})
}))