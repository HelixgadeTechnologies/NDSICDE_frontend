
import {
  House,
  ChartNoAxesCombined,
  FolderClosed,
  UsersRound,
  Radar,
  CircleDollarSign,
  Settings,
  ClipboardList,
  Gift,
  Cog,
} from "lucide-react";

export const topNavigations = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: House,
    },
    {
      name: "Strategic Objectives and KPIs",
      href: "/dashboard/strategic-objectives",
      icon: ChartNoAxesCombined,
    },
    {
      name: "Project Management",
      href: "/dashboard/proejct-management",
      icon: FolderClosed,
    },
    {
      name: "User Management",
      href: "/dashboard/user-management",
      icon: UsersRound,
    },
    {
      name: "Data Validation",
      href: "/dashboard/data-validation",
      icon: Radar,
    },
    {
      name: "Financial Reporting",
      href: "/dashboard/financial-reporting",
      icon: CircleDollarSign,
    },
    {
      name: "Performance Analytics & Reports",
      href: "/dashboard/performance",
      icon: Cog,
    },
    {
      name: "Organizational KPI",
      href: "/dashboard/organizational-kpi",
      icon: ClipboardList,
    },
  ];

  export const bottomNavigations = [
    {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
    {
        name: "Logout",
        href: "/login",
        icon: Gift,
    }
  ]
