// conditional parent component for settings

"use client";

import { useRoleStore } from "@/store/role-store";
import SuperAdminSettingsComponent from "./admin-settings-component";
import GeneralSettings from "./all-users-settings";

export default function SettingsParentComponent() {
  const { user } = useRoleStore();

  return user?.role === "super-admin" ? (
    <SuperAdminSettingsComponent />
  ) : (
    <GeneralSettings />
  );
}
