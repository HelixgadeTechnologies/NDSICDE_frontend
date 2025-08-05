import { UserRole } from "@/store/role-store";

export interface RoutePermission {
  path: string;
  allowedRoles: UserRole[];
  exact?: boolean;
}

export const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Admin routes
  { path: "/admin/dashboard", allowedRoles: ["admin"] },
  { path: "/admin/strategic-objectives", allowedRoles: ["admin"] },
  { path: "/admin/project-management", allowedRoles: ["admin"] },
  { path: "/admin/user-management", allowedRoles: ["admin"] },
  { path: "/admin/data-validation", allowedRoles: ["admin"] },
  { path: "/admin/user-management", allowedRoles: ["admin"] },
  { path: "/admin/performance-analytics", allowedRoles: ["admin"] },
  { path: "/admin/settings", allowedRoles: ["admin"] },

  // Partner routes
  { path: "/partners", allowedRoles: ["partners"] },
  { path: "/partners/dashboard", allowedRoles: ["partners"] },
  { path: "/partners/kpi-reporting", allowedRoles: ["partners"] },
  { path: "/partners/settings", allowedRoles: ["partners"] },

  // Manager routes
  { path: "/management/dashboard", allowedRoles: ["management"] },
  { path: "/management/organizational-kpi", allowedRoles: ["management"] },
  { path: "/management/view-reports", allowedRoles: ["management"] },
  { path: "/management/settings", allowedRoles: ["management"] },

  { path: "/r-managers/dashboard", allowedRoles: ["r-managers"] },
  { path: "/r-managers/organizational-kpi", allowedRoles: ["r-managers"] },
  { path: "/r-managers/request-and-retirement", allowedRoles: ["r-managers"] },
  { path: "/r-managers/settings", allowedRoles: ["r-managers"] },
];

export function canUserAccessRoute(
  userRole: UserRole | null,
  pathname: string
): boolean {
  if (!userRole) return false;

  const permission = ROUTE_PERMISSIONS.find((p) =>
    p.exact ? p.path === pathname : pathname.startsWith(p.path)
  );

  if (!permission) return true; // Allow access to routes not explicitly protected

  return permission.allowedRoles.includes(userRole);
}

export function getDefaultRouteForRole(role: UserRole): string {
  return `/${role}/dashboard`;
}

export function redirectToRoleBasedRoute(role: UserRole): string {
  return getDefaultRouteForRole(role);
}
