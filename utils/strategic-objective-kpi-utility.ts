import { useState } from "react";

export interface StrategicObjectivesAndKPIsStates {
    addStrategicObjective: boolean;
    addKPI: boolean;
}

export interface StrategicObjectivesAndKPIsActions {
    setAddStrategicObjective: (value: boolean) => void;
    setAddKPI: (value: boolean) => void;
    handleAddSO: () => void;
    handleAddKPI: (setActiveRowId?: (id: number | null) => void) => void;
    closeAllModals: () => void;
    resetModalState: () => void;
}

export function useStrategicObjectivesAndKPIsModal(): StrategicObjectivesAndKPIsStates & StrategicObjectivesAndKPIsActions {
    // modal  states
    const [addStrategicObjective, setAddStrategicObjective] = useState(false);
    const [addKPI, setAddKPI] = useState(false);

    const handleAddSO = () => setAddStrategicObjective(true);
    const handleAddKPI = (setActiveRowId?: (id: number | null) => void) => {
        setAddKPI(true);
        setActiveRowId?.(null);
    };
    const closeAllModals = () => {
        setAddStrategicObjective(false);
        setAddKPI(false);
    };
    const resetModalState = () => {
        setAddStrategicObjective(false);
        setAddKPI(false);
    };

    return {
        addStrategicObjective,
        addKPI,
        setAddStrategicObjective,
        setAddKPI,
        handleAddSO,
        handleAddKPI,
        closeAllModals,
        resetModalState,
    };
}