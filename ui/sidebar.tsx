"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/ui/logo-component";
import { useSidebar } from "@/context/SidebarContext";
import { Icon } from "@iconify/react";
import { useRoleStore } from "@/store/role-store";
import { getSidebarConfig, SidebarItem } from "@/lib/config/sidebarConfig";

interface BaseSidebarProps {
  className?: string;
}

export default function Sidebar({ className }: BaseSidebarProps) {
  const pathname = usePathname();
  const { mobileOpen, closeMobile } = useSidebar();
  const { user, logout } = useRoleStore();

  if (!user) return null;
  const sidebarConfig = getSidebarConfig(user.role);

  const handleItemClick = (item: SidebarItem) => {
    // Add any click handling logic here
    closeMobile();
    console.log(`Navigating to ${item.href}`);
  };

  // for active on settings
  const isActive = pathname.startsWith(`/${user.role}/settings`);

  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobile}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 flex flex-col items-start p-4 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-all duration-300 ease-in-out ${className}`}
      >
        <Link href="/dashboard" className="flex justify-start mt-2.5">
          <Logo />
        </Link>

        {/* top navigations */}
        <section className="flex flex-col justify-between h-full w-full mt-10">
          <div className="space-y-1 border-b border-gray-200 pb-2">
            {sidebarConfig.items.map((nav, index) => {
              const isActive = pathname.startsWith(nav.href);

              return (
                <Link
                  key={index}
                  href={nav.href}
                  onClick={() => handleItemClick(nav)}
                  className={`h-11 w-full px-4 py-2 rounded-[4px] flex items-center gap-2 ${
                    isActive
                      ? "bg-[#FFECE5] text-[#D2091E]"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <Icon
                    icon={nav.icon}
                    width={20}
                    height={20}
                    color={isActive ? "#D2091E" : "#737373"}
                  />
                  <span className="text-xs">{nav.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <Link
              href={`/${user.role}/settings`}
              className={`h-11 w-full px-4 py-2 rounded-[4px] flex items-center gap-2 ${
                isActive
                  ? "bg-[#FFECE5] text-[#D2091E]"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Icon
                icon={"bi:gear"}
                width={20}
                height={20}
                color={isActive ? "#D2091E" : "#737373"}
              />
              <span className="text-xs">Settings</span>
            </Link>
            <div
              onClick={logout}
              className={`h-11 w-full px-4 py-2 rounded-[4px] flex items-center gap-2 hover:bg-[#FFECE5] hover:text-[#D2091E] text-gray-600 cursor-pointer`}
            >
              <Icon
                icon={"heroicons-solid:logout"}
                width={20}
                height={20}
                color={"#737373"}
              />
              <span className="text-xs">Logout</span>
            </div>
          </div>
        </section>
      </aside>
    </>
  );
}
