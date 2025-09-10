"use client";

import { usePathname } from "next/navigation";
import { breadcrumbs } from "@/lib/config/breadcrumbs";
import Button from "@/ui/form/button";
import { useTeamMemberModal } from "@/utils/team-member-utility";
import AddTeamMember from "@/components/admin-components/user-management/add-team-member";
import DateRangePicker from "./form/date-range";
import DropDown from "./form/select-dropdown";
import { useStrategicObjectivesAndKPIsModal } from "@/utils/strategic-objective-kpi-utility";
import AddStrategicObjectiveModal from "@/components/admin-components/strategic-objectives-kpi/add-strategic-objective";

type Props = {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
};

export default function Breadcrumb({ fallbackTitle = "" }: Props) {
  const pathname = usePathname();

  const matched = breadcrumbs.find((item) =>
    // pathname.startsWith(item.href.replace(/\[.*?\]/, ""))
    pathname.includes(item.href)
  );

  const { setAddTeamMember, addTeamMember, handleAddUser } =
    useTeamMemberModal();

  const { setAddStrategicObjective, addStrategicObjective, handleAddSO } =
    useStrategicObjectivesAndKPIsModal();

  //for handle add team member
  const handleTeamMemberClose = () => {
    setAddTeamMember(false);
  };

  const actionComponents: Record<string, React.ReactNode> = {
    "/dashboard": (
      <Button
        content="New Project"
        icon="cil:plus"
        href="/dashboard/create-project"
      />
    ),
    "/strategic-objectives": (
      <>
        <Button
          onClick={handleAddSO}
          content="Add New Member"
          icon="cil:plus"
        />
        {addStrategicObjective && (
          <AddStrategicObjectiveModal
            isOpen={addStrategicObjective}
            onClose={() => setAddStrategicObjective(false)}
          />
        )}
      </>
    ),
    // "/admin/project-management": (
    //   <Button
    //     content="New Project"
    //     icon="cil:plus"
    //     href="/admin/project-management/create-project"
    //   />
    // ),
    "/user-management": (
      <>
        <Button
          onClick={handleAddUser}
          content="Add New Member"
          icon="cil:plus"
        />
        {addTeamMember && (
          <AddTeamMember
            isOpen={addTeamMember}
            onClose={handleTeamMemberClose}
          />
        )}
      </>
    ),
    "/data-validation": (
      <Button content="Date Range" icon="stash:data-date-light" />
    ),
    "/financial-reporting": (
      <div className="w-[430px] flex items-center gap-4">
        <DateRangePicker label="Date Range" />
        <DropDown
          label="Projects"
          name="dropdown"
          options={[]}
          placeholder="All Projects"
          value=""
          onChange={() => {}}
        />
      </div>
    ),
    "/performance-analytics": (
      <div className="w-[430px] flex items-center gap-4">
        <DateRangePicker label="Date Range" />
        <DropDown
          label="Projects"
          name="dropdown"
          options={[]}
          placeholder="All Projects"
          value=""
          onChange={() => {}}
        />
      </div>
    ),
    "/project-management/team": (
      <Button
      content="Add Team Member"
      icon="cil:plus"
      href="/project-management/team/create"
      />
    )
  };

  const hiddenRoutes = [
    "/project-management/create-project",
    "/kpi-reporting/new-kpi",
  ];

  return (
    <section className={`${hiddenRoutes.includes(pathname) ? "hidden" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-base md:text-[22px] text-[#242424]">
          {matched?.header || fallbackTitle}
        </h2>

        {/* Render matched action if available */}
        {matched?.href && actionComponents[matched.href] && (
          <div className="min-w-[228px]">{actionComponents[matched.href]}</div>
        )}
      </div>
    </section>
  );
}
