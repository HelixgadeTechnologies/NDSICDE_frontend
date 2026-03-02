"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { ProjectRequestType } from "@/types/project-management-types";
import { RetirementRequestType } from "@/types/retirement-request";

type RequestsContextType = {
  requests: ProjectRequestType[];
  retirements: RetirementRequestType[];
  selectedRequest: ProjectRequestType | null;
  selectedRetirement: RetirementRequestType | null;
  isLoading: boolean;
  error: string | null;
  fetchRequests: (params?: any) => Promise<ProjectRequestType[]>;
  fetchRetirements: (params?: any) => Promise<RetirementRequestType[]>;
  fetchRequestById: (id: string) => Promise<ProjectRequestType | null>;
  fetchRetirementById: (id: string) => Promise<RetirementRequestType | null>;
};

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ProjectRequestType[]>([]);
  const [retirements, setRetirements] = useState<RetirementRequestType[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequestType | null>(null);
  const [selectedRetirement, setSelectedRetirement] = useState<RetirementRequestType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequestById = async (id: string): Promise<ProjectRequestType | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // Uses the explicitly requested endpoint for finding single requests
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/request/request/${id}`
      );
      const data = res.data?.data || null;
      setSelectedRequest(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load request details";
      setError(errorMessage);
      console.error(err);
      setSelectedRequest(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRetirementById = async (id: string): Promise<RetirementRequestType | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/request-retirement-dashboard/retirement/${id}`
      );
      const data = res.data?.data || null;
      setSelectedRetirement(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load retirement details";
      setError(errorMessage);
      console.error(err);
      setSelectedRetirement(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRequests = async (params?: any): Promise<ProjectRequestType[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams: any = { type: 'request' };
      if (params) {
          if (params.search) queryParams.search = params.search;
          if (params.status && params.status !== "All") queryParams.status = params.status;
          if (params.projectId) queryParams.projectId = params.projectId;
          if (params.startDate) queryParams.startDate = params.startDate;
          if (params.endDate) queryParams.endDate = params.endDate;
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/request-retirement-dashboard/list`,
        { params: queryParams }
      );
      
      const data = res.data?.data || [];
      setRequests(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load requests";
      setError(errorMessage);
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRetirements = async (params?: any): Promise<RetirementRequestType[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams: any = { type: 'retirement' };
      if (params) {
          if (params.search) queryParams.search = params.search;
          if (params.status && params.status !== "All") queryParams.status = params.status;
          if (params.projectId) queryParams.projectId = params.projectId;
          if (params.startDate) queryParams.startDate = params.startDate;
          if (params.endDate) queryParams.endDate = params.endDate;
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/request-retirement-dashboard/list`,
        { params: queryParams }
      );
      
      const data = res.data?.data || [];
      setRetirements(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load retirements";
      setError(errorMessage);
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RequestsContext.Provider
      value={{
        requests,
        retirements,
        selectedRequest,
        selectedRetirement,
        isLoading,
        error,
        fetchRequests,
        fetchRetirements,
        fetchRequestById,
        fetchRetirementById,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error("useRequests must be used within a RequestsProvider");
  }
  return context;
}
