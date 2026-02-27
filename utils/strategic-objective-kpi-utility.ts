import { useState } from "react";

export interface StrategicObjectivesAndKPIsStates {
    addStrategicObjective: boolean;
    editStrategicObjective: boolean;
    addKPI: boolean;
}

export interface StrategicObjectivesAndKPIsActions {
    setAddStrategicObjective: (value: boolean) => void;
    setEditStrategicObjective: (value: boolean) => void;
    setAddKPI: (value: boolean) => void;
    handleAddSO: () => void;
    handleEditSO: () => void;
    handleAddKPI: (setActiveRowId?: (id: string | null) => void) => void;
    closeAllModals: () => void;
    resetModalState: () => void;
}

export function useStrategicObjectivesAndKPIsModal(): StrategicObjectivesAndKPIsStates & StrategicObjectivesAndKPIsActions {
    // modal  states
    const [addStrategicObjective, setAddStrategicObjective] = useState(false);
    const [editStrategicObjective, setEditStrategicObjective] = useState(false);
    const [addKPI, setAddKPI] = useState(false);

    const handleAddSO = () => setAddStrategicObjective(true);
    const handleEditSO = () => setEditStrategicObjective(true);
    const handleAddKPI = (setActiveRowId?: (id: string | null) => void) => {
        setAddKPI(true);
        setActiveRowId?.(null);
    };
    const closeAllModals = () => {
        setAddStrategicObjective(false);
        setEditStrategicObjective(false);
        setAddKPI(false);
    };
    const resetModalState = () => {
        setAddStrategicObjective(false);
        setEditStrategicObjective(false);
        setAddKPI(false);
    };

    return {
        addStrategicObjective,
        editStrategicObjective,
        addKPI,
        setAddStrategicObjective,
        setEditStrategicObjective,
        setAddKPI,
        handleAddSO,
        handleEditSO,
        handleAddKPI,
        closeAllModals,
        resetModalState,
    };
}