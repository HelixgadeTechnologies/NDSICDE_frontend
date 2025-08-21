"use client";

import Sidebar from "@/ui/sidebar";
import Navigation from "@/ui/navigation";
import Breadcrumb from "@/ui/breadcrumb-component";
// import { useRouter } from "next/navigation";
import { useRoleStore } from "@/store/role-store";
// import { useEffect } from "react";
import Loading from "../loading";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const router = useRouter();
  const { user, isAuthenticated } = useRoleStore();
  //const setIsAuth = useRoleStore.setState; // direct access to set

  // useEffect(() => {
  //   // get back the isAuthentication value from the sessional storage and set back in the store
  //   const parseIsAuthenticated: boolean = JSON.parse(
  //     sessionStorage.getItem("isAuthenticated") as string
  //   );

  //   setIsAuth({ isAuthenticated: parseIsAuthenticated });

  //   // redirect if not authenticated
  //   if (!isAuthenticated) {
  //     router.push("/login");
  //     return;
  //   }

  //   // redirect if not an admin
  //   if (user?.role !== "admin") {
  //     router.push(`/${user?.role}/dashboard`);
  //     return;
  //   }
  // }, [isAuthenticated, user, router, setIsAuth]);

  // show loading or redirect
  if (!isAuthenticated || user?.role !== "admin") {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-64 flex-none transition-all duration-300 ease-in-out">
        <Sidebar />
      </div>

      {/* Main content */}
      <section className="flex-grow flex flex-col overflow-hidden">
        <Navigation />
        <div className="flex-grow overflow-y-auto p-6 bg-white">
          <Breadcrumb />
          {children}
        </div>
      </section>
    </div>
  );
}
