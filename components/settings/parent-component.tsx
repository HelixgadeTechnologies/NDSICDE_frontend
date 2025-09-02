// conditional parent component for settings

"use client";

import { useRoleStore } from "@/store/role-store";
import AdminSettingsComponent from "./admin-settings-component";
import GeneralSettings from "./all-users-settings";

export default function SettingsParentComponent() {
  const { user } = useRoleStore();

  return user?.role === "admin" ? (
    <AdminSettingsComponent />
  ) : (
    <GeneralSettings />
  );
}
