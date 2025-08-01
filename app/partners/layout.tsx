"use client";

import Sidebar from "@/ui/sidebar";
import Navigation from "@/ui/navigation";
import Breadcrumb from "@/ui/breadcrumb-component";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/store/role-store";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();
  const { user, isAuthenticated } = useRoleStore();

  useEffect(() => {
    // redirect if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
      return
    }

    // redirect if not an partners
    if (user?.role !== "partners") {
      router.push(`/${user?.role}/dashboard`)
      return
    }
  }, [isAuthenticated, user, router])

    // show loading or redirect
    if (!isAuthenticated || user?.role !== 'partners') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      )
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
