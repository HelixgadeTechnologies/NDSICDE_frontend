"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { ProjectTeamDetails } from "@/types/project-management-types";

type ProjectTeamContextType = {
  /** Raw team-member records for the current project. */
  teamMembers: ProjectTeamDetails[];
  /** Distinct member names — ready to drop into a TagInput's `options`. */
  responsiblePersonOptions: string[];
  isLoading: boolean;
  refetch: () => void;
};

const ProjectTeamContext = createContext<ProjectTeamContextType | undefined>(
  undefined,
);

/**
 * Loads a project's team members once and shares them with every descendant
 * (the project-management forms) so each "Responsible Person" input can offer
 * the same suggestions without refetching. Mounted in projects/[id]/layout.
 */
export function ProjectTeamProvider({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  const [teamMembers, setTeamMembers] = useState<ProjectTeamDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeam = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const token = getToken();
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/team-members/project/${projectId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined },
      );
      setTeamMembers(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error("Error fetching project team members:", error);
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const responsiblePersonOptions = useMemo(
    () =>
      Array.from(
        new Set(
          teamMembers
            .map((m) => m.fullName?.trim())
            .filter((name): name is string => !!name),
        ),
      ),
    [teamMembers],
  );

  const value = useMemo(
    () => ({
      teamMembers,
      responsiblePersonOptions,
      isLoading,
      refetch: fetchTeam,
    }),
    [teamMembers, responsiblePersonOptions, isLoading, fetchTeam],
  );

  return (
    <ProjectTeamContext.Provider value={value}>
      {children}
    </ProjectTeamContext.Provider>
  );
}

/**
 * Read the current project's team members. Returns empty defaults when used
 * outside a ProjectTeamProvider so forms degrade gracefully (no suggestions).
 */
export function useProjectTeam(): ProjectTeamContextType {
  const ctx = useContext(ProjectTeamContext);
  if (!ctx) {
    return {
      teamMembers: [],
      responsiblePersonOptions: [],
      isLoading: false,
      refetch: () => {},
    };
  }
  return ctx;
}
