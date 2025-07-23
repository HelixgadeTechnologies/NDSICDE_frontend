"use client";

import AddTeamMember from "@/components/user-management/add-team-member";
import DateRangePicker from "@/ui/form/date-range";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import { useTeamMemberModal } from "@/utils/team-member-utility";

export const routeActions = {
  "/admin/dashboard": () => (
    <Button content="New Project" icon="cil:plus" />
  ),
  "/admin/strategic-objectives": () => (
    <Button content="Add Strategic Objective" icon="cil:plus" />
  ),
  "/admin/project-management": () => (
    <Button content="New Project" icon="cil:plus" />
  ),
  "/admin/user-management": () => {
    const { setAddTeamMember, addTeamMember, handleAddUser } = useTeamMemberModal();

    return (
      <>
        <Button
          content="Add New Member"
          icon="cil:plus"
          onClick={handleAddUser}
        />
        {addTeamMember && (
          <AddTeamMember
            isOpen={addTeamMember}
            onClose={() => setAddTeamMember(false)}
          />
        )}
      </>
    );
  },
  "/admin/data-validation": () => (
    <Button content="Date Range" icon="stash:data-date-light" />
  ),
  "/admin/financial-reporting": () => (
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
  "/admin/performance-analytics": () => (
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
