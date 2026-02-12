// lib/context/projects-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// ============================================================================
// TYPES
// ============================================================================

export type ProjectType = {
  projectId: string;
  projectName: string;
  status: string;
  startDate: string;
  endDate: string;
  thematicAreasOrPillar: string;
  strategicObjective: {
    statement: string;
  };
  teamMember: Array<{
    fullName: string;
  }>;
};

export type ProjectsResponse = {
  data: ProjectType[];
  message?: string;
  success?: boolean;
};

export type ProjectOption = {
  label: string;
  value: string;
};

type ProjectsContextType = {
  projects: ProjectType[];
  projectOptions: ProjectOption[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: (showToasts?: boolean) => Promise<ProjectType[]>;
  refreshProjects: (showToasts?: boolean) => Promise<void>;
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Reusable function to fetch projects from the API
 * @returns Promise containing projects data
 * @throws Error if the request fails
 */
export const fetchProjectsAPI = async (): Promise<ProjectType[]> => {
  try {
    const response = await axios.get<ProjectsResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/managementAndStaff/projects`
    );

    // Validate response structure
    if (!response.data.data) {
      throw new Error("Invalid response format: missing data property");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching projects:", error);

    // Re-throw with more context
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch projects"
      );
    }

    throw new Error("Failed to fetch projects. Please try again.");
  }
};

/**
 * Fetch projects with optional error handling callback
 * @param onSuccess Callback for successful fetch
 * @param onError Callback for error handling
 */
export const fetchProjectsWithCallbacks = async (
  onSuccess?: (projects: ProjectType[]) => void,
  onError?: (error: Error) => void
): Promise<ProjectType[] | null> => {
  try {
    const projects = await fetchProjectsAPI();
    onSuccess?.(projects);
    return projects;
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    onError?.(errorObj);
    return null;
  }
};

/**
 * Transform projects data into dropdown options
 * @param projects Array of projects
 * @returns Array of options for dropdown component
 */
export const transformProjectsToOptions = (
  projects: ProjectType[]
): ProjectOption[] => {
  if (!projects || projects.length === 0) {
    return [];
  }

  return projects.map((project) => ({
    label: project.projectName,
    value: project.projectId,
  }));
};

// ============================================================================
// CONTEXT
// ============================================================================

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived state - project options for dropdowns
  const projectOptions = transformProjectsToOptions(projects);

  const fetchProjects = async (showToasts = false): Promise<ProjectType[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const projectsData = await fetchProjectsAPI();
      setProjects(projectsData);
      
      if (showToasts) {
        toast.success("Projects loaded successfully");
      }
      
      return projectsData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load projects";
      
      setError(errorMessage);
      
      if (showToasts) {
        toast.error(`Failed to load projects: ${errorMessage}`);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProjects = async (showToasts = false) => {
    await fetchProjects(showToasts);
  };

  // Load projects on mount
  useEffect(() => {
    fetchProjects(false);
  }, []);

  const value = {
    projects,
    projectOptions,
    isLoading,
    error,
    fetchProjects,
    refreshProjects,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useProjects() {
  const context = useContext(ProjectsContext);

  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }

  return context;
}