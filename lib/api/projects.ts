// utils/api/projects-api.ts
import axios from "axios";

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

/**
 * Reusable function to fetch projects from the API
 * @returns Promise containing projects data
 * @throws Error if the request fails
 */
export const fetchProjects = async (): Promise<ProjectType[]> => {
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
    const projects = await fetchProjects();
    onSuccess?.(projects);
    return projects;
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    onError?.(errorObj);
    return null;
  }
};