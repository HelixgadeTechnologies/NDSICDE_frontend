import { useState } from "react";
import { RetirementRequest } from "@/types/retirement-request";

export interface RetirementRequestStates {
    viewRequest: boolean;
    selectedRequest: RetirementRequest | null;
}

export interface RetirementRequestActions {
    setViewRequest: (value: boolean) => void;
    setSelectedRequest: (request: RetirementRequest | null) => void;
    handleViewRequest: (request: RetirementRequest, setActiveRowId?: (id: number | null) => void) => void;
    closeAllModals: () => void;
    resetModalState: () => void;
}


export function useRetirementRequestModal(): RetirementRequestStates & RetirementRequestActions {
    const [viewRequest, setViewRequest] = useState(false);

    const [selectedRequest, setSelectedRequest] = useState<RetirementRequest | null>(null);

    // utility function
    const handleViewRequest = (request: RetirementRequest, setActiveRowId?: (id: number | null) => void) => {
        setSelectedRequest(request);
        setViewRequest(true);
        setActiveRowId?.(null);
    };

    const closeAllModals = () => {
        setViewRequest(false);
    };
    const resetModalState = () => {
        setViewRequest(false);
    };

    return {
        viewRequest,
        selectedRequest,
        setViewRequest,
        setSelectedRequest,
        handleViewRequest,
        closeAllModals,
        resetModalState,
    }
}