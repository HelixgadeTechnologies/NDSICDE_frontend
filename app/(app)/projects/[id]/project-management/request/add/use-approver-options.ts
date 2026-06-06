"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { ProjectTeamDetails } from "@/types/project-management-types";

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

// Build a TagInput-ready option group from the project's team members,
// filtered to the given role name(s) (matched against role.roleName/designation).
const buildGroup = (
  members: ProjectTeamDetails[],
  roleNames: string[],
): ApproverOptionGroup => {
  const wanted = roleNames.map((r) => r.toLowerCase());
  const group: ApproverOptionGroup = { options: [], toId: {}, toLabel: {} };

  members.forEach((m) => {
    const memberRole = (m.role?.roleName || m.designation || "").toLowerCase();
    if (!wanted.includes(memberRole) || !m.userId || !m.fullName) return;

    // Disambiguate same-named people by appending the role.
    const label = m.role?.roleName
      ? `${m.fullName} (${m.role.roleName})`
      : m.fullName;

    group.options.push(label);
    group.toId[label] = m.userId;
    group.toLabel[m.userId] = label;
  });

  return group;
};

/**
 * Fetches the team members assigned to a project and exposes "send to" option
 * groups for the request form's approver TagInputs (SPO → layer 1 approver,
 * Finance Officer → layer 3 approver).
 */
export function useApproverOptions(projectId: string) {
  const [members, setMembers] = useState<ProjectTeamDetails[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    let active = true;

    const fetchMembers = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/team-members/project/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = res.data?.data ?? [];
        if (active) setMembers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching project team for approvers:", error);
        if (active) setMembers([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchMembers();
    return () => {
      active = false;
    };
  }, [projectId]);

  const spo = useMemo(
    () => buildGroup(members, ["Senior Project Officer"]),
    [members],
  );
  const financeOfficer = useMemo(
    () => buildGroup(members, ["Finance Officer"]),
    [members],
  );

  return { loading, spo, financeOfficer };
}
