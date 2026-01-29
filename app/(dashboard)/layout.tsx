import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import Menu from '@/components/Menu'
import Navbar from '@/components/NavBar';
<<<<<<< HEAD

=======
>>>>>>> 745027874d68ba5e1d3623a3e80d05b5e45084b3
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
      <div className='h-screen flex'>
        {/* left */}
        <div className='w-[14%] md:w[8%] lg:w-[16%] xl:w-[14%] p-4'>
          <Link  href="/" className='flex items-center justify-center lg:justify-start  gap-2'>
          <Image src = "/navbar-logo.png" alt='logo' height={32} width={32}></Image>
          <span className='hidden lg:block font-extrabold text-blue-950          text-2xl'>NeraPay</span>
          </Link>
          <Menu/>
        </div>
        {/* right */}
        <div className='w-[86%] md:[92%] lg:w-[88%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col '>
          <Navbar/>
          {children}
        </div>
      </div>
   
  );
}
