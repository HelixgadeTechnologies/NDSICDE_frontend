import Sidebar from "@/ui/sidebar";
import Navigation from "@/ui/navigation";
import Breadcrumb from "@/ui/breadcrumb-component";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
