
"use client";

import NotificationTab from "./notification-tab";
import { Menu } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

export default function Navigation() {
    const { openMobile } = useSidebar();
    return (
        <div className="flex justify-end items-center gap-1.5 md:gap-3 bg-white px-4 md:px-6 py-2 md:py-3">
          <NotificationTab />
          <Menu onClick={openMobile} size={22} className="md:hidden" />
        </div>
    )
}
