"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { topNavigations, bottomNavigations } from "@/lib/config/sidebar";
import Logo from "@/components/logo-component";
import { useSidebar } from "@/context/SidebarContext";
import {Icon } from "@iconify/react";

export default function Sidebar() {
  const pathname = usePathname();
  const { mobileOpen, closeMobile } = useSidebar();

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
        } md:translate-x-0 transition-all duration-300 ease-in-out`}
      >
        <Link href="/dashboard" className="flex justify-start mt-2.5">
          <Logo/>
        </Link>

        {/* top navigations */}
        <section className="flex flex-col justify-between h-full w-full mt-10">
          <div className="space-y-1 border-b border-gray-200 pb-2">
            {topNavigations.map((nav, index) => {
              const isActive = pathname.startsWith(nav.href);

              return (
                <Link
                  key={index}
                  href={nav.href}
                  onClick={closeMobile}
                  className={`h-11 w-full px-4 py-2 rounded-[4px] flex items-center gap-2 ${
                    isActive
                      ? "bg-[#FFECE5] text-[#D2091E]"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <Icon icon={nav.icon} width={20} height={20} color={isActive ? "#D2091E" : "#737373"} />
                  <span className="text-xs">{nav.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            {bottomNavigations.map((nav, index) => {
              const isActive = pathname.startsWith(nav.href);

              return (
                <Link
                  key={index}
                  href={nav.href}
                  className={`h-11 w-full px-4 py-2 rounded-[4px] flex items-center gap-2 ${
                    isActive
                      ? "bg-[#FFECE5] text-[#D2091E]"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                    <Icon icon={nav.icon} width={20} height={20} color={isActive ? "#D2091E" : "#737373"} />
                  <span className="text-xs">{nav.name}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </aside>
    </>
  );
}
