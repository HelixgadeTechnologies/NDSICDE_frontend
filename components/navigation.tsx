
"use client";

import { useSidebar } from "@/context/SidebarContext";
import NotificationTab from "@/components/notification-tab";
import Avatar from "@/ui/avatar";
import { Icon } from "@iconify/react";

export default function Navigation() {
    const { openMobile } = useSidebar();
    return (
        <header className="flex justify-between items-center bg-white px-2 md:px-10 py-3 border-b border-gray-200">
        <h2 className="text-lg md:text-2xl font-semibold text-[#242424]">Dashboard</h2>
        <div className="flex justify-end items-center gap-1.5 md:gap-3">
          <NotificationTab />
          <div className="hidden md:flex justify-center items-center gap-3">
            <Avatar name="Super Admin" />
            <div>
                <h3 className="font-medium text-gray-900 leading-5 text-xs">Super Admin</h3>
                <p className="text-[#737373] text-[11px]">admin@sdn.org</p>
            </div>
            <Icon icon={"formkit:down"} height={18} width={18}/>
          </div>
          <Icon icon={"famicons:menu"} onClick={openMobile} height={22} width={22} className="md:hidden" />
        </div>
        </header>
    )
}
