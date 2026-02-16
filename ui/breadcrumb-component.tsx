"use client";

import { usePathname } from "next/navigation";
import { breadcrumbs } from "@/lib/config/breadcrumbs";
import Button from "@/ui/form/button";
import { useTeamMemberModal } from "@/utils/team-member-utility";
import AddTeamMember from "@/components/super-admin-components/user-management/add-team-member";
import DateRangePicker from "./form/date-range";
import DropDown from "./form/select-dropdown";
import { useStrategicObjectivesAndKPIsModal } from "@/utils/strategic-objective-kpi-utility";
import AddStrategicObjectiveModal from "@/components/super-admin-components/strategic-objectives-kpi/add-strategic-objective";
import { useRoleStore } from "@/store/role-store";

type Props = {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
};

// Utility to extract project ID from the pathname
const extractProjectId = (pathname: string): string | undefined => {
  const match = pathname.match(/\/projects\/(\d+)/);
  return match ? match[1] : undefined;
};

export default function Breadcrumb({ fallbackTitle = "" }: Props) {
  const pathname = usePathname();
  const { user } = useRoleStore();
  const projectId = extractProjectId(pathname);

  if (!user) return null;

  // Find matching breadcrumb
  const matched = breadcrumbs.find((item) => {
    // Convert [id] to actual project ID in regex
    let pattern = item.href;
    if (projectId) pattern = pattern.replace("[id]", projectId);
    const regex = new RegExp(`^${pattern}`);
    return regex.test(pathname);
  });

  const { setAddTeamMember, addTeamMember, handleAddUser } =
    useTeamMemberModal();

  const { setAddStrategicObjective, addStrategicObjective, handleAddSO } =
    useStrategicObjectivesAndKPIsModal();

  //for handle add team member
  const handleTeamMemberClose = () => {
    setAddTeamMember(false);
  };

  if (!user) {
    return null;
  }

  const higherLevels = ["super-admin", "admin"];

  const actionComponents: Record<string, React.ReactNode> = {
    "/dashboard": higherLevels.includes(user.role) && (
      <Button
        content="New Project"
        icon="si:add-fill"
        href="/dashboard/create-project"
      />
    ),
    "/strategic-objectives": (
      <>
        <Button
          onClick={handleAddSO}
          content="Add Strategic Objective"
          icon="si:add-fill"
        />
        {addStrategicObjective && (
          <AddStrategicObjectiveModal
            isOpen={addStrategicObjective}
            onClose={() => setAddStrategicObjective(false)}
          />
        )}
      </>
    ),
    "/user-management": (
      <>
        <Button
          onClick={handleAddUser}
          content="Add New Member"
          icon="si:add-fill"
        />
        {addTeamMember && (
          <AddTeamMember
            isOpen={addTeamMember}
            onClose={handleTeamMemberClose}
          />
        )}
      </>
    ),
    // "/financial-reporting": (
    //   <div className="w-107.5 flex items-center gap-4">
    //     <DateRangePicker label="Date Range" />
    //     <DropDown
    //       label="Projects"
    //       name="dropdown"
    //       options={[]}
    //       placeholder="All Projects"
    //       value=""
    //       onChange={() => {}}
    //     />
    //   </div>
    // ),
  };

  const hiddenRoutes = ["/dashboard/create-project", "/kpi-reporting/new-kpi"];

  return (
    <section
      className={`${hiddenRoutes.includes(pathname) ? "hidden" : ""} no-print`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-base md:text-[22px] text-[#242424]">
          {matched?.header || fallbackTitle}
        </h2>

        {/* Render matched action if available */}
        {matched?.href && actionComponents[matched.href] && (
          <div className="min-w-57">{actionComponents[matched.href]}</div>
        )}
      </div>
    </section>
  );
}
