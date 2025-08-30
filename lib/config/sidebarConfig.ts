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
        name: "Project Management Dashboard",
        icon: "lucide:home",
        href: "/admin/dashboard",
      },
      {
        id: "strategic-objectives",
        name: "Strategic Objectives and KPIs",
        href: "/admin/strategic-objectives",
        icon: "fluent:arrow-growth-24-regular",
      },
      // {
      //   id: "project-management",
      //   name: "Project Management",
      //   href: "/admin/project-management",
      //   icon: "iconoir:folder",
      // },
      {
        id: "user-management",
        name: "User Management",
        href: "/admin/user-management",
        icon: "bi:people",
      },
      {
        id: "data-validation",
        name: "Request and Retirement Manager",
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
        name: "Project Performance Dashboard",
        href: "/admin/performance-analytics",
        icon: "bi:gear",
      },
      {
        id: "organizational-kpi",
        name: "Org KPI Dashboard",
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

  "r-managers": {
    role: "r-managers",
    items: [
      {
        id: "dashboard",
        name: "Dashboard",
        href: "/r-managers/dashboard",
        icon: "lucide:home",
      },
      {
        id: "request-and-retirement",
        name: "Request and Retirement",
        href: "/r-managers/request-and-retirement",
        icon: "bi:people",
      },
      {
        id: "organizational-kpi",
        name: "Organizational KPI",
        href: "/r-managers/organizational-kpi",
        icon: "carbon:result-new",
      },
    ],
  },

  "team-member": {
    role:  "team-member",
    items: [
      {
        id: "dashboard",
        name: "Dashboard",
        href: "/team-member/dashboard",
        icon: "lucide:home",
      },
      {
        id: "project-management",
        name: "Project Management",
        href: "/team-member/project-management",
        icon: "iconoir:component",
        children: [
          {
            id: "project-team",
            name: "Project Team",
            href: "/team-member/project-management/project-team",
            icon: "",
          },
          {
            id: "partner",
            name: "Partner",
            href: "/team-member/project-management/partner",
            icon: "",
          },
          {
            id: "impact",
            name: "Impact",
            href: "/team-member/project-management/impact",
            icon: "",
          },
          {
            id: "outcome",
            name: "Outcome",
            href: "/team-member/project-management/outcome",
            icon: "",
          },
          {
            id: "output",
            name: "Output",
            href: "/team-member/project-management/output",
            icon: "",
          },
          {
            id: "activity",
            name: "Activity",
            href: "/team-member/project-management/activity",
            icon: "",
          },
          {
            id: "logical-framework",
            name: "Logical Framework",
            href: "/team-member/project-management/logical-framework",
            icon: "",
          },
          {
            id: "request",
            name: "Request",
            href: "/team-member/project-management/request",
            icon: "",
          },
        ],
      },
      // {
      //   id: "request-approvals",
      //   name: "Request Approvals",
      //   href: "/team-member/request-approvals",
      //   icon: "mdi:approval",
      // },
      {
        id: "result-dashboard",
        name: "Result Dashboard",
        href: "/team-member/result-dashboard",
        icon: "carbon:result-old",
      },
      {
        id: "organizational-kpi",
        name: "Organizational KPI",
        href: "/team-member/organizational-kpi",
        icon: "carbon:result-new",
      },
      {
        id: "financial-dashboard",
        name: "Financial Dashboard",
        href: "/team-member/financial-dashboard",
        icon: "carbon:financial-assets",
      },
    ],
  }
};

export const getSidebarConfig = (role: UserRole): SidebarConfig => {
  return SIDEBAR_CONFIGS[role];
};
