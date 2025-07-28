"use client";

import { usePathname } from "next/navigation";
import { breadcrumbs } from "@/lib/config/breadcrumbs";
import Button from "@/ui/form/button";
import { useTeamMemberModal } from "@/utils/team-member-utility";
import AddTeamMember from "@/components/user-management/add-team-member";
import DateRangePicker from "./form/date-range";
import DropDown from "./form/select-dropdown";
import { useStrategicObjectivesAndKPIsModal } from "@/utils/strategic-objective-kpi-utility";
import AddStrategicObjectiveModal from "@/components/strategic-objectives-kpi/add-strategic-objective";

type Props = {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
};

export default function Breadcrumb({
  fallbackTitle = "",
}: Props) {
  const pathname = usePathname();

  const matched = breadcrumbs.find((item) =>
    // pathname.startsWith(item.href.replace(/\[.*?\]/, ""))
    pathname.includes(item.href)
  );

  const {
    setAddTeamMember,
    addTeamMember,
    handleAddUser,
  } = useTeamMemberModal();

  const {
    setAddStrategicObjective,
    addStrategicObjective,
    handleAddSO,
  } = useStrategicObjectivesAndKPIsModal();

  const actionComponents: Record<string, React.ReactNode> = {
    "/admin/dashboard": (
      <Button content="New Project" icon="cil:plus" />
    ),
    "/admin/strategic-objectives": (
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
    "/admin/project-management": (
      <Button content="New Project" icon="cil:plus" href="/admin/create-project" />
    ),
    "/admin/user-management": (
      <>
        <Button
          onClick={handleAddUser}
          content="Add New Member"
          icon="cil:plus"
        />
        {addTeamMember && (
          <AddTeamMember
            isOpen={addTeamMember}
            onClose={() => setAddTeamMember(false)}
          />
        )}
      </>
    ),
    "/admin/data-validation": (
      <Button content="Date Range" icon="stash:data-date-light" />
    ),
    "/admin/financial-reporting": (
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
    "/admin/performance-analytics": (
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
  };

  return (
    <section>
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
