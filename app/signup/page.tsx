import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { HiEnvelope, HiEyeSlash, HiPhone, HiUserCircle } from 'react-icons/hi2'

const Registerpage = () => {
  return (
    <div className = 'min-h-screen' >

       {/* Hero Section */}
    <div className=' flex flex-col lg:flex-row min-h-screen'>
      {/* Left side Background Image */}
    <div className=' lg:w-1/2 relative h-64 lg:h-auto'>
      <Image
        src="/image/bank.jpg"
        alt = "Signup Background"
        fill
        className="object-cover"
        priority
     /> 
    </div>
      
      {/** RIGHT - SIGN UP FORM */}
      <div className='lg:w-1/2 flex items-center justify-center p-8 lg:p-15 bg-gray-200'>
        <div className='max-w-xl mx-auto w-full'>
        <section className='bg-teal-50 p-8 rounded-lg m-6'>
          <h1 className='text-3xl font-semibold mb-3 text-center'>Register</h1>
          <p className='text-gray-400 text-sm mb-4'>
            Create a new account to get started and enjoy seamless acess to our features.
          </p>
      

          <form className = "space-y-6" >
          <div className='relative flex items-center'>
          <HiUserCircle size={20} className='absolute left-3 text-gray-400' />
           <input
           type='text'
           placeholder='Name '
           className="w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-2 focus:ring-teal-400 pl-10"
           />
          </div> 

        <div className='flex items-center gap-2'> 

          <div className='relative flex items-center flex-1'>
          <HiEnvelope size={20} className='absolute left-3 text-gray-400' />
           <input
           type='email'
           placeholder='Email '
           className=" w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-2 focus:ring-teal-400 pl-10"
           />
          </div>


          <div className='relative flex items-center flex-1'>
          <HiEyeSlash size={20} className='absolute left-3 text-gray-400' />
           <input
           type='password'
           placeholder='•••••••'
           className=" w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-2 focus:ring-teal-400 pl-10"
           />
          </div>          
          </div>


          <div className='flex items-center gap-2'>

          <div className='relative flex items-center flex-1'>
          <HiPhone size={20} className='absolute left-3 text-gray-400' />
           <input
           type='tel'
           placeholder='Telephone Number'
           className=" w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-2 focus:ring-teal-400 pl-10"
           />
          </div> 

          <div className='relative flex items-center flex-1'>
          <HiUserCircle size={20} className='absolute left-3 text-gray-400' />
           <input
           type='text'
           placeholder='Employee Position '
           className="w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-2 focus:ring-teal-400 pl-10"
           />  
          </div>
          </div>
          
           <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-teal-500" />
                I Agree With The Terms And Conditions   
              </label>
            </div>
          <button 
            type='submit'
            className="w-full bg-teal-400 hover:bg-teal-600 text-white py-2 rounded-lg font-medium transition"
            >  
            Submit 
          </button>

           <p className='text-sm text-gray-500 mb-4 text-center'> 
            Already have an account?{" "}
          <Link href="/login">
          <span className="text-teal-500 cursor-pointer hover:underline">
            Sign In
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

export default Registerpage