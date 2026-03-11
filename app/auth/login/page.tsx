"use client"

import Image from 'next/image'
import Link from 'next/link'
import { HiEyeSlash, HiUserCircle } from 'react-icons/hi2'
import { loginAction } from '@/app/_lib/actions/login'
import { useActionState } from 'react'


const Loginpage = () => {
  const [state, action, isPending] = useActionState(loginAction , undefined)  

  return (
 <div className='min-h-screen'>

    {/* Hero Section */}
    <div className='flex flex-col lg:flex-row min-h-screen'>

    {/* Left Side - Background Image */}
    <div className='lg:w-1/2 relative h-64 lg:h-auto'>
       <Image
       src="/Neradmin.png"
       alt="Payroll Background"
       fill
       className="object-cover  "
       priority
        
      />
    </div>
 

   
     {/* RIGHT – LOGIN FORM */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gray-200">
      <div className='max-w-xl mx-auto w-full'>
      <section className='bg-teal-50 p-14 rounded-lg m-6'>    
        <h1 className="text-3xl mb-3 text-center">Sign In</h1>
        <p className='text-gray-500 text-sm mb-4 text-center'>
            Welcome back, Log in and get started.
          </p>

          {/* General Error Message */}

            {state?.message && (
              <p className=" text-red-700 text-sm text-center rounded mb-4">
                {state.message}
              </p>
            )}
    
          <form action={action} className="space-y-6">
            
            <div className='relative flex items-center flex-1'>
              <HiUserCircle size={20} className='absolute left-3 text-gray-400'/> 
              <input
                type="email"
                name='email'
                placeholder="Please enter your email"
                className="w-full px-4 py-2 rounded-lg border border-neutral-300
                 focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400"
              />              
            </div>

            {/* Email error message */}
            {state?.errors?.email && (
              <p className="text-red-700 text-xs mt-1 pl-1">
                {state.errors.email[0]}
              </p>
            )}

            <div className='relative flex items-center flex-1'>
             <HiEyeSlash size={20} className='absolute left-3 text-gray-400'/> 
              <input
                type="password"
                name='password'
                placeholder="•••••••"
                className="w-full px-4 py-2 rounded-lg border border-neutral-300
                 focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10"
              />
            </div>

            {/* Password error message */}
            {state?.errors?.password && (
              <p className="text-red-700 text-xs mt-1 pl-1">
                {state.errors.password[0]}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" className="accent-[#153453]" />
                Remember me
              </label>
            </div>

            {/* Submit Button */}
           <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#153453] mb-4 text-gray-100 py-2 rounded-lg text-sm transition"
            >
              {isPending ? "Loggin in..." : "Login"}
            </button>
          

          <p className="text-sm text-gray-500 mb-4 text-center ">
            Forgot Password?{" "}
            <Link href="/reset">
              <span className="text-[#153453] cursor-pointer hover:underline">
                Reset Password
              </span>
            </Link>
          </p> 

          </form>
         </section> 
        </div>
      </div>

    </div>
        

  </div>


 
  )
}

export default Loginpage