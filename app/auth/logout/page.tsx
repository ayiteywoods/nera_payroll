import Image from 'next/image'
import React from 'react'
import { HiEyeSlash, HiShieldCheck, HiUserCircle } from 'react-icons/hi2'

const Logoutpage = () => {
  return (
    <div className='min-h-screen'>

        {/* Her0 SEction  */}
    <div className='flex flex-col lg:flex-row min-h-screen'>
        {/** Left Side Background Image */}
    <div className='lg:w-1/2 relative h-64 lg:h-auto'>
    <Image 
     src="/image/login.jpg"
     alt ="Logout Backround"
     fill
     className='object-coveer'
     priority   
    />
    </div>
    

    {/**  RIGHT - LOGOUT FORM **/}
    <div className='lg:w-1/2 flex items-center justify-center p-8 lg:p-15 bg-gray-200'>
      <div className='max-w-xl mx-auto w-full'>
      <section className='bg-blue-50 p-14 rounded-lg m-6'>
        <h1 className='text-3xl mb-3 text-center'>Logout</h1>
        <p className='text-gray-400 text-sm mb-4'>
            You are about to logout. Are you sure
        </p>
      
       <form className='space-y-6'>

       <div className='relative flex items-center flex-1'>
          <HiUserCircle size={20} className='absolute left-3 text-gray-400' />
        <input 
           type='email'
           placeholder='Please enter your email'
           className='w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400'
        />    
      </div> 


      <div className='relative flex items-center gap-2'>

        <div className='relative flex items-center flex-1'>
           <HiEyeSlash size={20} className='absolute left-3 text-gray-400'/>
           <input
             type = "password"
             placeholder='*************'
             className='w-full px-4 py-2 rounded-lg border border-neutral-300
             focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400'           
           /> 
        </div>

        <div className='relative flex items-center flex-1'>
           <HiShieldCheck size={20} className='absolute left-3 text-gray-400'/>
           <input
             type = "password"
             placeholder='*************'
             className='w-full px-4 py-2 rounded-lg border border-neutral-300
             focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400'           
           /> 
        </div>

      </div>

       <button
         type='submit'
         className='w-full bg-[#153453] mb-4 text-gragit y-100 py-2 rounded-lg text-sm transition'
       >
         Logout
       </button>

       </form>
      
      </section>  
      </div>
   </div> 















    </div>

    </div>
  )
}

export default Logoutpage

