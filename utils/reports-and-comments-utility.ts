import { ReportsDetails } from "@/types/reports-and-comments";
import { useState } from "react";

export interface ReportsAndCommentsStates {
    addComments: boolean,
    viewAnalytics: boolean,
    selectedReport: ReportsDetails | null;
}

export interface ReportsAndCommentsActions {
    setAddComments: (value: boolean) => void;
    setViewAnalytics: (value: boolean) => void;
    setSelectedReport: (report: ReportsDetails | null) => void;
    handleAddComments: (report: ReportsDetails, setActiveRowId?: (id: number | null) => void) => void;
    handleViewAnalytics: (report: ReportsDetails, setActiveRowId?: (id: number | null) => void) => void;
    closeAllModals: () => void;
    resetModalState: () =>  void;
}

export function useReportsCommentsModal(): ReportsAndCommentsStates & ReportsAndCommentsActions {
    // modal  states
    const [addComments, setAddComments] = useState(false);
    const [viewAnalytics, setViewAnalytics] = useState(false);

    // State to track the selected user
      const [selectedReport, setSelectedReport] = useState<ReportsDetails | null>(null);

    const handleAddComments = (report: ReportsDetails, setActiveRowId?: (id: number | null) => void) => {
        setSelectedReport(report);
        setAddComments(true);
        setActiveRowId?.(null);
    };
    const handleViewAnalytics = (report: ReportsDetails, setActiveRowId?: (id: number | null) => void) => {
        setSelectedReport(report);
        setViewAnalytics(true);
        setActiveRowId?.(null);
    };
    const closeAllModals = () => {
        setAddComments(false);
        setViewAnalytics(false);
    };
    const resetModalState = () => {
        setAddComments(false);
        setViewAnalytics(false);
    };

    return {
        addComments,
        viewAnalytics,
        selectedReport,
        setAddComments,
        setViewAnalytics,
        setSelectedReport,
        handleAddComments,
        handleViewAnalytics,
        closeAllModals,
        resetModalState,
    };
}