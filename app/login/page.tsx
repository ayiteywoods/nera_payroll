import Image from 'next/image'
import Link from 'next/link'
import { HiEyeSlash, HiUserCircle } from 'react-icons/hi2'



const Loginpage = () => {
 

  return (
 <div className='min-h-screen'>

    {/* Hero Section */}
    <div className='flex flex-col lg:flex-row min-h-screen'>
    {/* Left Side - Background Image */}
    <div className='lg:w-1/2 relative h-64 lg:h-auto'>
       <Image
       src="/image/bank.jpg"
       alt="Payroll Background"
       fill
       className="object-cover  "
       priority
        
      />
    </div>
 

   
     {/* RIGHT – LOGIN FORM */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gray-200">
      <div className='max-w-xl mx-auto w-full'>
      <section className='bg-teal-50 p-8 rounded-lg m-6'>    
        <h1 className="text-3xl font-semibold mb-2">Sign In</h1>
          <p className="text-sm text-gray-500 mb-8 ">
            Don’t have an account?{" "}
            <Link href="/signup">
              <span className="text-teal-500 cursor-pointer hover:underline float-right">
                Create account
              </span>
            </Link>
          </p>
          <form className="space-y-6">
            <div className='relative flex items-center' >
              <HiUserCircle size={20} className='absolute left-3 text-gray-400'/> 
              <input
                type="email"
                placeholder="Please enter your email"
                className="w-full px-4 py-2 rounded-lg border border-neutral-300
                 focus:outline-none focus:ring-2 focus:ring-teal-400 pr-4 pl-10"
              />
              
            </div>

            <div className='relative flex items-center'>
             <HiEyeSlash size={20} className='absolute left-3 text-gray-400'/> 
              <input
                type="password"
                placeholder="•••••••"
                className="w-full px-4 py-2 rounded-lg border border-neutral-300
                 focus:outline-none focus:ring-2 focus:ring-teal-400 pr-4 pl-10"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-teal-500" />
                Remember me
              </label>
            </div>
          <Link href="/dashboard">
            <button
              type="submit"
              className="w-full bg-teal-400 hover:bg-teal-600 text-white py-2 rounded-lg font-medium transition"
            >
              Login
            </button>
          </Link>  
          </form>
         </section> 
        </div>
      </div>

    </div>
        

  </div>


 
  )
}

export default Loginpage