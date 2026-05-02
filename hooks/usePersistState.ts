"use client";

import { useState, useEffect } from "react";

export function usePersistState<T>(key: string | undefined | null, initialValue: T) {
  // Initialize state, trying to load from localStorage first
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined" || !key) return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn("Error reading localStorage key:", key, error);
      return initialValue;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window === "undefined" || !key) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn("Error setting localStorage key:", key, error);
    }
  }, [key, state]);

  return [state, setState] as const;
}
