"use client";

import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import Logo from "@/ui/logo-component";
import { useSidebar } from "@/context/SidebarContext";
import { Icon } from "@iconify/react";
import { useRoleStore } from "@/store/role-store";
import { getSidebarConfig, SidebarItem } from "@/lib/config/sidebarConfig";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BaseSidebarProps {
  className?: string;
}

export default function Sidebar({ className }: BaseSidebarProps) {
  const pathname = usePathname();
  const { mobileOpen, closeMobile } = useSidebar();
  const { user, logout } = useRoleStore();
  const [openDropdowns, setOpenDropdowns] = useState<Set<number>>(new Set());

  if (!user) return null;
  const sidebarConfig = getSidebarConfig(user.role, pathname);

  const handleItemClick = (
    item: SidebarItem,
    index: number,
    e: React.MouseEvent
  ) => {
    // If item is a header, do nothing
    if (item.isHeader) {
      e.preventDefault();
      return;
    }

    // If item has children, toggle dropdown
    if (item.children && item.children.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      
      setOpenDropdowns((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    }

    // Regular navigation for items without children
    closeMobile();
  };

  const handleChildClick = (child: SidebarItem) => {
    closeMobile();
    console.log(`Navigating to ${child.href}`);
  };

  // for active on settings
  const isSettingsActive = pathname.startsWith(`/settings`);

  const handleLogout = () => {
    logout();
    closeMobile();
    console.log("User logged out");
    redirect("/login");
  };

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
              // Special handling for project result dashboard to match any project ID
              const isActive =
                pathname === nav.href ||
                (pathname.startsWith(nav.href + "/") &&
                  !pathname.includes("/financial-dashboard") && !pathname.includes("/project-management/"));
              const isDropdownOpen = openDropdowns.has(index);
              const hasChildren = nav.children && nav.children.length > 0;

              // Render header differently
              if (nav.isHeader) {
                return (
                  <div
                    key={index}
                    className="h-9 w-full px-4 py-2 flex items-center gap-2 mt-4 mb-2"
                  >
                    <Icon
                      icon={nav.icon}
                      width={18}
                      height={18}
                      color="#404040"
                    />
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      {nav.name}
                    </span>
                  </div>
                );
              }

              return (
                <div key={index}>
                  {/* Main navigation item */}
                  {hasChildren ? (
                    // Render as div for items with children (no navigation)
                    <div
                      onClick={(e) => handleItemClick(nav, index, e)}
                      className={`h-11 w-full px-4 py-2 rounded-[4px] flex items-center gap-2 cursor-pointer ${
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
                      <span className="text-xs flex-1">{nav.name}</span>
                      <Icon
                        icon={
                          isDropdownOpen
                            ? "solar:alt-arrow-down-linear"
                            : "solar:alt-arrow-up-linear"
                        }
                        height={16}
                        width={16}
                        color={isActive ? "#D2091E" : "#737373"}
                      />
                    </div>
                  ) : (
                    // Render as Link for items without children (normal navigation)
                    <Link
                      href={nav.href}
                      onClick={() =>
                        handleItemClick(nav, index, {} as React.MouseEvent)
                      }
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
                  )}

                  {/* Children dropdown */}
                  {hasChildren && isDropdownOpen && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="ml-6 mt-1 space-y-1 overflow-y-scroll sidebar"
                      >
                        {nav.children!.map((child, childIndex) => {
                          const isChildActive = pathname.startsWith(child.href);
                          return (
                            <Link
                              key={childIndex}
                              href={child.href}
                              onClick={() => handleChildClick(child)}
                              className={`h-9 w-full px-3 py-1.5 rounded-[4px] flex items-center gap-2 text-xs ${
                                isChildActive
                                  ? "text-[#D2091E]"
                                  : "hover:bg-gray-50 text-gray-500"
                              }`}
                            >
                              {child.icon && (
                                <Icon
                                  icon={child.icon}
                                  width={16}
                                  height={16}
                                  color={isChildActive ? "#D2091E" : "#737373"}
                                />
                              )}
                              <span>{child.name}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-1">
            <Link
              href={`/settings`}
              className={`h-11 w-full px-4 py-2 rounded-[4px] flex items-center gap-2 ${
                isSettingsActive
                  ? "bg-[#FFECE5] text-[#D2091E]"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Icon
                icon={"bi:gear"}
                width={20}
                height={20}
                color={isSettingsActive ? "#D2091E" : "#737373"}
              />
              <span className="text-xs">Settings</span>
            </Link>
            <div
              onClick={handleLogout}
              className={`h-11 w-full px-4 py-2 rounded-[4px] flex items-center gap-2 hover:bg-[#FFECE5] hover:text-[#D2091E] text-gray-600 cursor-pointer`}
            >
              <Icon icon={"heroicons-solid:logout"} width={20} height={20} />
              <span className="text-xs">Logout</span>
            </div>
          </div>
        </section>
      </aside>
    </>
  );
}