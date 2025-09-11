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
  "super-admin": {
    role: "super-admin",
    items: [
      {
        id: "dashboard",
        name: "Project Management Dashboard",
        icon: "lucide:home",
        href: "/dashboard",
      },
      {
        id: "strategic-objectives",
        name: "Strategic Objectives and KPIs",
        href: "/strategic-objectives",
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
        href: "/user-management",
        icon: "bi:people",
      },
      {
        id: "data-validation",
        name: "Request and Retirement Manager",
        href: "/data-validation",
        icon: "fluent:radar-checkmark-20-regular",
      },
      {
        id: "financial-reporting",
        name: "Financial Reporting",
        href: "/financial-reporting",
        icon: "solar:money-bag-linear",
      },
      {
        id: "performance-analytics",
        name: "Project Performance Dashboard",
        href: "/performance-analytics",
        icon: "bi:gear",
      },
      {
        id: "organizational-kpi",
        name: "Org KPI Dashboard",
        href: "/organizational-kpi",
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
        href: "/dashboard",
        icon: "lucide:home",
      },
      {
        id: "kpi-reporting",
        name: "KPI Reporting",
        href: "/kpi-reporting",
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
        href: "/dashboard",
        icon: "lucide:home",
      },
      {
        id: "reports-and-comments",
        name: "View Reports & Comments",
        href: "/reports-and-comments",
        icon: "fluent-mdl2:c-r-m-report",
      },
      {
        id: "organizational-kpi",
        name: "Organizational KPI",
        href: "/organizational-kpi",
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
        href: "/dashboard",
        icon: "lucide:home",
      },
      {
        id: "request-and-retirement",
        name: "Request and Retirement",
        href: "/request-and-retirement",
        icon: "bi:people",
      },
      {
        id: "organizational-kpi",
        name: "Organizational KPI",
        href: "/organizational-kpi",
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
        href: "/dashboard",
        icon: "lucide:home",
      },
      {
        id: "project-management",
        name: "Project Management",
        href: "/project-management/team",
        icon: "iconoir:component",
        children: [
          {
            id: "project-team",
            name: "Project Team",
            href: "/project-management/team",
            icon: "",
          },
          {
            id: "partner",
            name: "Partner",
            href: "/project-management/partners",
            icon: "",
          },
          {
            id: "impact",
            name: "Impact",
            href: "/project-management/impact",
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
            href: "/project-management/output",
            icon: "",
          },
          {
            id: "activity",
            name: "Activity",
            href: "/project-management/activity",
            icon: "",
          },
          {
            id: "logical-framework",
            name: "Logical Framework",
            href: "/project-management/logical-framework",
            icon: "",
          },
          {
            id: "request",
            name: "Request",
            href: "/project-management/request",
            icon: "",
          },
        ],
      },
      {
        id: "result-dashboard",
        name: "Result Dashboard",
        href: "/result-dashboard",
        icon: "carbon:result-old",
      },
      {
        id: "organizational-kpi",
        name: "Organizational KPI",
        href: "/organizational-kpi",
        icon: "carbon:result-new",
      },
      {
        id: "financial-dashboard",
        name: "Financial Dashboard",
        href: "/financial-dashboard",
        icon: "carbon:financial-assets",
      },
    ],
  },
  "admin": {
    role: "admin",
    items: [
      {
        id: "dashboard",
        name: "Dashboard",
        href: "/dashboard",
        icon: "lucide:home",
      },
      {
        id: "project-management",
        name: "Project Management",
        href: "/project-management/team",
        icon: "iconoir:component",
        children: [
          {
            id: "project-team",
            name: "Project Team",
            href: "/project-management/team",
            icon: "",
          },
          {
            id: "partner",
            name: "Partner",
            href: "/project-management/partners",
            icon: "",
          },
          {
            id: "impact",
            name: "Impact",
            href: "/project-management/impact",
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
            href: "/project-management/output",
            icon: "",
          },
          {
            id: "activity",
            name: "Activity",
            href: "/project-management/activity",
            icon: "",
          },
          {
            id: "logical-framework",
            name: "Logical Framework",
            href: "/project-management/logical-framework",
            icon: "",
          },
          {
            id: "request",
            name: "Request",
            href: "/project-management/request",
            icon: "",
          },
        ],
      },
      {
        id: "request-approvals",
        name: "Request Approvals",
        href: "/team-member/request-approvals",
        icon: "mdi:approval",
      },
      {
        id: "result-dashboard",
        name: "Result Dashboard",
        href: "/result-dashboard",
        icon: "carbon:result-old",
      },
      {
        id: "organizational-kpi",
        name: "Organizational KPI",
        href: "/organizational-kpi",
        icon: "carbon:result-new",
      },
      {
        id: "financial-dashboard",
        name: "Financial Dashboard",
        href: "/financial-dashboard",
        icon: "carbon:financial-assets",
      },
    ],
  }
};

export const getSidebarConfig = (role: UserRole): SidebarConfig => {
  return SIDEBAR_CONFIGS[role];
};
