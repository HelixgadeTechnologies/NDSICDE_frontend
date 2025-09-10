"use client";

import Sidebar from "@/ui/sidebar";
import Navigation from "@/ui/navigation";
import Breadcrumb from "@/ui/breadcrumb-component";
import { useRoleStore } from "@/store/role-store";
import Loading from "../loading";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AllUserSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isAuthenticated } = useRoleStore();
  const router = useRouter();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Give time for the store to rehydrate from storage
    const timer = setTimeout(() => {
      setHasCheckedAuth(true);
      if (!isAuthenticated && !user) {
        router.push("/login");
      }
    }, 100); // Small delay to allow state rehydration

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  // Show loading while checking authentication or while store is loading
  if (!hasCheckedAuth) {
    return <Loading />;
  }

  // If not authenticated after check, show loading while redirect happens
  if (!isAuthenticated || !user) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="w-64 flex-none transition-all duration-300 ease-in-out">
        <Sidebar />
      </div>
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