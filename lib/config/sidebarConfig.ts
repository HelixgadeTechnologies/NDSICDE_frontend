import { UserRole } from "@/store/role-store";

export interface SidebarItem {
  id?: string;
  name: string;
  href: string;
  icon: string;
  children?: SidebarItem[];
}

export interface SidebarConfig {
  role: UserRole;
  items: SidebarItem[];
}

export const SIDEBAR_CONFIGS: Record<UserRole, SidebarConfig> = {
  admin: {
    role: "admin",
    items: [
      {
        id: "dashboard",
        name: "Dashboard",
        icon: "lucide:home",
        href: "/admin/dashboard",
      },
      {
        id: "strategic-objectives",
        name: "Strategic Objectives and KPIs",
        href: "/admin/strategic-objectives",
        icon: "fluent:arrow-growth-24-regular",
      },
      {
        id: "project-management",
        name: "Project Management",
        href: "/admin/project-management",
        icon: "iconoir:folder",
      },
      {
        id: "user-management",
        name: "User Management",
        href: "/admin/user-management",
        icon: "bi:people",
      },
      {
        id: "data-validation",
        name: "Data Validation",
        href: "/admin/data-validation",
        icon: "fluent:radar-checkmark-20-regular",
      },
      {
        id: "financial-reporting",
        name: "Financial Reporting",
        href: "/admin/financial-reporting",
        icon: "solar:money-bag-linear",
      },
      {
        id: "performance-analytics",
        name: "Performance Analytics & Reports",
        href: "/admin/performance-analytics",
        icon: "bi:gear",
      },
      {
        id: "organizational-kpi",
        name: "Organizational KPI",
        href: "/admin/organizational-kpi",
        icon: "carbon:result-new",
      },
    ],
  },

  partners: {
    role: "partners",
    items: [
      {
        id: "dashboard",
        name: "Dashboard",
        href: "/partners/dashboard",
        icon: "lucide:home",
      },
      {
        id: "kpi-reporting",
        name: "KPI Reporting",
        href: "/partners/kpi-reporting",
        icon: "fluent-mdl2:c-r-m-report",
      },
    ],
  },

  management: {
    role: "management",
    items: [
      {
        id: "dashboard",
        name: "Dashboard",
        href: "/management/dashboard",
        icon: "lucide:home",
      },
      {
        id: "reports-and-comments",
        name: "View Reports & Comments",
        href: "/management/reports-and-comments",
        icon: "fluent-mdl2:c-r-m-report",
      },
      {
        id: "organizational-kpi",
        name: "Organizational KPI",
        href: "/management/organizational-kpi",
        icon: "carbon:result-new",
      },
    ],
  },

  "retirement-managers": {
    role: "retirement-managers",
    items: [
      {
        id: "dashboard",
        name: "Dashboard",
        href: "/retirement-managers/dashboard",
        icon: "lucide:home",
      },
      {
        id: "request-and-retirement",
        name: "Request and Retirement",
        href: "/retirement-managers/request",
        icon: "bi:people",
      },
      {
        id: "organizational-kpi",
        name: "Organizational KPI",
        href: "/retirement-managers/organizational-kpi",
        icon: "carbon:result-new",
      },
    ],
  },
};

export const getSidebarConfig = (role: UserRole): SidebarConfig => {
  return SIDEBAR_CONFIGS[role];
};
