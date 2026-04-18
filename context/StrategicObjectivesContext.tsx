"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getStrategicObjectives,
  StrategicObjective,
} from "@/lib/api/admin-api-calls";

// ============================================================================
// TYPES
// ============================================================================

export type SOOption = {
  label: string;
  value: string;
};

type StrategicObjectivesContextType = {
  strategicObjectives: StrategicObjective[];
  soOptions: SOOption[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

// ============================================================================
// HELPERS
// ============================================================================

export const transformSOsToOptions = (sos: StrategicObjective[]): SOOption[] =>
  sos.map((so) => ({
    label: so.statement,
    value: so.strategicObjectiveId,
  }));

// ============================================================================
// CONTEXT
// ============================================================================

const StrategicObjectivesContext = createContext<
  StrategicObjectivesContextType | undefined
>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export function StrategicObjectivesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [strategicObjectives, setStrategicObjectives] = useState<
    StrategicObjective[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const soOptions = transformSOsToOptions(strategicObjectives);

  const fetchSOs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getStrategicObjectives();
      setStrategicObjectives(data);
    } catch (err) {
      console.error("StrategicObjectivesContext: fetch failed", err);
      setError("Failed to load strategic objectives.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch once on mount
  useEffect(() => {
    fetchSOs();
  }, []);

  const value: StrategicObjectivesContextType = {
    strategicObjectives,
    soOptions,
    isLoading,
    error,
    refresh: fetchSOs,
  };

  return (
    <StrategicObjectivesContext.Provider value={value}>
      {children}
    </StrategicObjectivesContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useStrategicObjectives() {
  const ctx = useContext(StrategicObjectivesContext);
  if (!ctx) {
    throw new Error(
      "useStrategicObjectives must be used within a StrategicObjectivesProvider"
    );
  }
  return ctx;
}
