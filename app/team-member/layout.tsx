"use client";

import Sidebar from "@/ui/sidebar";
import Navigation from "@/ui/navigation";
import Breadcrumb from "@/ui/breadcrumb-component";
import { useRoleStore } from "@/store/role-store";
import Loading from "../loading";

export default function TeamMemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isAuthenticated } = useRoleStore();

  // show loading or redirect
  if (!isAuthenticated || user?.role !== "team-member") {
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
