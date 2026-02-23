// app/(dashboard)/layout.tsx
import Menu from "@/components/Menu";
import Navbar from "@/components/NavBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">
      <div className="flex h-screen max-w-[100vw]">
        {/* Sidebar - Responsive widths */}
        <div className="hidden md:block md:w-16 lg:w-60 xl:w-64 flex-shrink-0 h-full overflow-y-auto p-2">
          <Menu />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Navbar */}
          <div className="flex-shrink-0 w-full">
            <Navbar />
          </div>

          {/* Page Content - Scrollable with proper constraints */}
          <div className="flex-1 overflow-x-hidden overflow-y-auto w-full">
            <div className="w-full max-w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}