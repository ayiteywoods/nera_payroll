import Menu from "@/components/Menu";
import Navbar from "@/components/NavBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="flex h-screen w-full">

        {/* Sidebar */}
        <div className="hidden md:block md:w-16 lg:w-56 xl:w-60 flex-shrink-0 h-full overflow-y-auto">
          <Menu />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full">

          {/* Navbar */}
          <div className="w-full">
            <Navbar />
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto w-full">
            <div className="px-4 sm:px-5 lg:px-6 py-6 w-full">
              {children}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}