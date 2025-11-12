import { UserRole } from "@/store/role-store";

export interface SidebarItem {
  id?: string;
  name: string;
  href: string;
  icon: string;
  children?: SidebarItem[];
  isHeader?: boolean; // New property to identify header items
  badge?: string;
}

export interface SidebarConfig {
  role: UserRole;
  items: SidebarItem[];
}

// Base items that appear in both contexts
const getBaseItems = (): SidebarItem[] => [
  {
    id: "dashboard",
    name: "Home",
    href: "/dashboard",
    icon: "lucide:home",
  },
  {
    id: "organizational-kpi",
    name: "Organizational KPI",
    href: "/organizational-kpi",
    icon: "carbon:result-new",
  },
];

const extractProjectId = (path: string): string | undefined => {
  const match = path.match(/\/projects\/(\d+)/);
  return match ? match[1] : undefined;
};

const getProjectDetailsItems = (projectId?: string): SidebarItem[] => {
  const pid = projectId ?? "1"; // fallback if none
  return [
     {
    id: "dashboard",
    name: "Home",
    href: "/dashboard",
    icon: "lucide:home",
  },
    {
      id: "project-details-header",
      name: "Project Details",
      href: "#",
      icon: "mdi:folder-outline",
      isHeader: true,
    },
    {
      id: "result-dashboard",
      name: "Project Result Dashboard",
      href: `/projects/${pid}`,
      icon: "carbon:result-old",
    },
    {
      id: "financial-dashboard",
      name: "Financial Dashboard",
      href: `/projects/${pid}/financial-dashboard`,
      icon: "carbon:financial-assets",
    },
    {
      id: "project-management",
      name: "Project Management",
      href: `/projects/${pid}/project-management`,
      icon: "iconoir:component",
      children: [
        {
          id: "project-team",
          name: "Project Team",
          href: `/projects/${pid}/project-management/team`,
          icon: "",
        },
        {
          id: "partner",
          name: "Partner",
          href: `/projects/${pid}/project-management/partner`,
          icon: "",
        },
        {
          id: "impact",
          name: "Impact",
          href: `/projects/${pid}/project-management/impact`,
          icon: "",
        },
        {
          id: "outcome",
          name: "Outcome",
          href: `/projects/${pid}/project-management/outcome`,
          icon: "",
        },
        {
          id: "output",
          name: "Output",
          href: `/projects/${pid}/project-management/output`,
          icon: "",
        },
        {
          id: "activity",
          name: "Activity",
          href: `/projects/${pid}/project-management/activity`,
          icon: "",
        },
        {
          id: "logical-framework",
          name: "Logical Framework",
          href: `/projects/${pid}/project-management/logical-framework`,
          icon: "",
        },
        {
          id: "request",
          name: "Request",
          href: `/projects/${pid}/project-management/request`,
          icon: "",
        },
      ],
    },
  ];
};


export const SIDEBAR_CONFIGS: Record<UserRole, SidebarConfig> = {
  "super-admin": {
    role: "super-admin",
    items: [
      {
        id: "dashboard",
        name: "Home",
        icon: "lucide:home",
        href: "/dashboard",
      },
      {
        id: "strategic-objectives",
        name: "Strategic Objectives and KPIs",
        href: "/strategic-objectives",
        icon: "fluent:arrow-growth-24-regular",
      },
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
        name: "Home",
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
        name: "Home",
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
        name: "Home",
        href: "/dashboard",
        icon: "lucide:home",
      },
      {
        id: "request-and-retirement",
        name: "Request and Retirement",
        href: "#",
        icon: "bi:people",
        children: [
          {
            id: "requests",
            name: "Requests",
            href: "/request-and-retirement/requests",
            icon: ""
          },
           {
            id: "retirements",
            name: "Retirements",
            href: "/request-and-retirement/retirements",
            icon: "",
            badge: "2"
          },
        ]
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
    role: "team-member",
    items: getBaseItems(),
  },

  admin: {
    role: "admin",
    items: [ ...getBaseItems(),  {
        id: "request-approvals",
        name: "Request and Retirement Approvals",
        href: "/request-approvals",
        icon: "mdi:approval",
      },],
  },
};

export const getSidebarConfig = (
  role: UserRole,
  currentPath: string
): SidebarConfig => {
  const baseConfig = SIDEBAR_CONFIGS[role];
  const projectId = extractProjectId(currentPath);

  const isProjectContext = currentPath.includes("/projects/");

  if (isProjectContext && ["admin", "super-admin", "team-member"].includes(role)) {
    return {
      ...baseConfig,
      items: getProjectDetailsItems(projectId),
    };
  }

  return baseConfig;
};
