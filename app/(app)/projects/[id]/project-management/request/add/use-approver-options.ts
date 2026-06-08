"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { ProjectTeamDetails } from "@/types/project-management-types";
import { RoleData } from "@/lib/api/roles";

/**
 * A group of "send to" options for a single TagInput.
 * - `options` are the labels rendered in the TagInput dropdown.
 * - `toId` maps a selected label back to the user id (what the backend wants).
 * - `toLabel` maps a stored user id back to its label (for the controlled value).
 */
export type ApproverOptionGroup = {
  options: string[];
  toId: Record<string, string>;
  toLabel: Record<string, string>;
};

/**
 * Build a TagInput-ready option group from the project's team members,
 * filtered to members whose role has the given approval `level` (1-5).
 * This is level-based rather than name-based so it works regardless of
 * what a role is called (e.g. "Senior Project Officer", "Programs Manager").
 */
const buildGroupByLevel = (
  members: ProjectTeamDetails[],
  roleNameToLevel: Record<string, number | null>,
  targetLevel: number,
): ApproverOptionGroup => {
  const group: ApproverOptionGroup = { options: [], toId: {}, toLabel: {} };

  members.forEach((m) => {
    if (!m.userId || !m.fullName) return;
    const roleName = m.role?.roleName || m.designation || "";
    const memberLevel = roleNameToLevel[roleName];
    if (memberLevel !== targetLevel) return;

    // Disambiguate same-named people by appending the role.
    const label = roleName ? `${m.fullName} (${roleName})` : m.fullName;

    group.options.push(label);
    group.toId[label] = m.userId;
    group.toLabel[m.userId] = label;
  });

  return group;
};

/**
 * Fetches the team members assigned to a project AND the global roles list
 * (which carries the `level` field per role), then exposes "send to" option
 * groups for the request form's approver TagInputs:
 *
 *   layer1  → sendTo  : all project team members whose role has level === 1
 *                        (e.g. Senior Project Officer, Programs Manager, …)
 *   layer3  → sendTo2 : all project team members whose role has level === 3
 *                        (e.g. Finance Officer, …)
 */
export function useApproverOptions(projectId: string) {
  const [members, setMembers] = useState<ProjectTeamDetails[]>([]);
  // Map of roleName → approval level (null = no approval rights)
  const [roleNameToLevel, setRoleNameToLevel] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    let active = true;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch both in parallel
        const [membersRes, rolesRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/team-members/project/${projectId}`,
            { headers },
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/settings/roles`,
            { headers },
          ),
        ]);

        if (!active) return;

        const membersData: ProjectTeamDetails[] = Array.isArray(membersRes.data?.data)
          ? membersRes.data.data
          : [];
        setMembers(membersData);

        // Build a roleName → level lookup from the roles list
        const rolesData: RoleData[] = Array.isArray(rolesRes.data?.data)
          ? rolesRes.data.data
          : [];
        const nameToLevel: Record<string, number | null> = {};
        rolesData.forEach((r) => {
          nameToLevel[r.roleName] = r.level ?? null;
        });
        setRoleNameToLevel(nameToLevel);
      } catch (error) {
        console.error("Error fetching project team or roles for approvers:", error);
        if (active) {
          setMembers([]);
          setRoleNameToLevel({});
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      active = false;
    };
  }, [projectId]);

  // Layer 1 approvers — any role with level === 1 (SPO, Programs Manager, etc.)
  const layer1 = useMemo(
    () => buildGroupByLevel(members, roleNameToLevel, 1),
    [members, roleNameToLevel],
  );

  // Layer 3 approvers — any role with level === 3 (Finance Officer, etc.)
  const layer3 = useMemo(
    () => buildGroupByLevel(members, roleNameToLevel, 3),
    [members, roleNameToLevel],
  );

  // Keep legacy aliases so existing consumers (form-one.tsx) don't break
  return { loading, spo: layer1, financeOfficer: layer3, layer1, layer3 };
}
