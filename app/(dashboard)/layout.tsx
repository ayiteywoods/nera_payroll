import Menu from '@/components/Menu'
import Navbar from '@/components/NavBar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-screen flex bg-gray-50'>
      {/* LEFT - Menu Sidebar */}
      <div className='w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-3'>
        <Menu />
      </div>
      
      {/* RIGHT - Main Content */}
      <div className='w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col'>
        <Navbar />
        {children}
      </div>
    </div>
  );
}