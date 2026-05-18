import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ProjectRequestResponseType } from "@/types/project-management-types";
import { RetirementRequestType } from "@/types/retirement-request";

export function useProjectRequests(projectId: string) {
  const [requests, setRequests] = useState<ProjectRequestResponseType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/request/getRequestByProjectId/${projectId}`,
      );
      setRequests(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      setError("Failed to fetch requests");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, isLoading, error, refetch: fetchRequests };
}

export function useProjectRetirements(projectId: string) {
  const [retirements, setRetirements] = useState<RetirementRequestType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRetirements = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/retirement/retirement/project/${projectId}`,
      );
      setRetirements(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch retirements:", err);
      setError("Failed to fetch retirements");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchRetirements();
  }, [fetchRetirements]);

  return { retirements, isLoading, error, refetch: fetchRetirements };
}
