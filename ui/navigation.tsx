"use client";

import { useSidebar } from "@/context/SidebarContext";
// import NotificationTab from "@/ui/notification-tab";
import Avatar from "@/ui/avatar";
import { Icon } from "@iconify/react";
import { useRoleStore, getRoleDisplayName, User } from "@/store/role-store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const { user, isAuthenticated } = useRoleStore();
  const setIsAuth = useRoleStore.setState; // direct access to set
  const { openMobile } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    // get back the isAuthentication value from the sessional storage and set back in the store
    const parseIsAuthenticated: boolean = JSON.parse(
      sessionStorage.getItem("isAuthenticated") as string
    );

    const parseIsUsers: User = JSON.parse(
      sessionStorage.getItem("user") as string
    );

    const parseIsToken: string = sessionStorage.getItem("token") as string;

    setIsAuth({ isAuthenticated: parseIsAuthenticated });
    setIsAuth({ user: parseIsUsers });
    setIsAuth({ token: parseIsToken });

    // redirect if not authenticated
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }
  }, []);

  return (
    <header className="flex justify-between items-center bg-white px-2 md:pr-10 md:pl-5 py-3 border-b border-gray-200">
      <h2 className="text-lg md:text-2xl font-semibold text-[#242424]">
        {user?.role ? getRoleDisplayName(user.role) : "Dashboard"}
      </h2>
      <div className="flex justify-end items-center gap-1.5 md:gap-3">
        {/* <NotificationTab /> */}
        <div className="hidden md:flex justify-center items-center gap-3">
          <Avatar name={user?.name} />
          <div>
            <h3 className="font-medium text-gray-900 leading-5 text-xs">
              {user?.name}
            </h3>
            <p className="text-[#737373] text-[11px]">{user?.email}</p>
          </div>
          <Icon icon={"formkit:down"} height={18} width={18} />
        </div>
        <Icon
          icon={"famicons:menu"}
          onClick={openMobile}
          height={22}
          width={22}
          className="md:hidden"
        />
      </div>
    </header>
  );
}
