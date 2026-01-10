"use client";

import Sidebar from "@/ui/sidebar";
import Navigation from "@/ui/navigation";
import Breadcrumb from "@/ui/breadcrumb-component";
import { useRoleStore } from "@/store/role-store";
import Loading from "../loading";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

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
    <>
    <Toaster position="top-right"/>
      <div className="flex min-h-screen flex-col md:flex-row">
        <div className="w-64 flex-none transition-all duration-300 ease-in-out no-print">
          <Sidebar />
        </div>
        <section className="grow flex flex-col overflow-hidden">
          <Navigation />
          <div className="grow overflow-y-auto p-6 bg-white custom-scrollbar">
            <Breadcrumb />
            {children}
          </div>
        </section>
      </div>
    </>
  );
}