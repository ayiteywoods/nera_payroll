import Image from 'next/image'
import React from 'react'
import { HiBriefcase, HiBuildingOffice, HiEnvelope, HiIdentification, HiMiniGlobeAlt, HiPhone, HiShieldCheck, HiUserCircle } from 'react-icons/hi2'

const Registerpage = () => {
  return (
    <div className = 'min-h-screen' >

       {/* Hero Section */}
    <div className=' flex flex-col lg:flex-row min-h-screen'>
      {/* Left side Background Image */}
    <div className='lg:w-1/2 relative h-64 lg:h-auto'>
      <Image
        src="/NeraApadminLogo.ong"
        alt = "Signup Background"
        fill
        className="object-cover"
        priority
     /> 
    </div>
      
      {/** RIGHT - SIGN UP FORM */}
      <div className='lg:w-1/2 flex items-center justify-center p-8 lg:p-15 bg-gray-200'>
        <div className='max-w-xl mx-auto w-full'>
        <section className='bg-teal-50 p-14 rounded-lg m-6'>
          <h1 className='text-3xl mb-3 text-center'>Employee SignUp</h1>
          <p className='text-gray-400 text-sm mb-4'>
            Add new employees here and manage their access to the system.
          </p>
      

          <form className = "space-y-6" >


          <div className='flex items-center gap-2'>   
          <div className='relative flex items-center flex-1'>
          <HiUserCircle size={20} className='absolute left-3 text-gray-400' />
           <input
           type='text'
           placeholder='Last_Name'
           className="w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400"
           />
          </div> 

          <div className='relative flex items-center flex-1'>
          <HiUserCircle size={20} className='absolute left-3 text-gray-400' />
           <input
           type='text'
           placeholder='First_Name'
           className="w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400"
           />
          </div> 
          </div> 
           


          <div className='flex items-center gap-2'>     
          <div className='relative flex items-center flex-1'>
          <HiUserCircle size={20} className='absolute left-3 text-gray-400' />
           <input
           type='text'
           placeholder='Maiden_Name'
           className="w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400"
           />
          </div> 

          <div className='relative flex items-center flex-1'>
          <HiUserCircle size={20} className='absolute left-3 text-gray-400' />
           <input
           type='text'
           placeholder='Other_Name'
           className="w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400"
           />
          </div> 

          </div> 

          <div className='flex items-center gap-2'>  

          <div className='relative flex items-center flex-1'>
          <HiPhone size={20} className='absolute left-3 text-gray-400' />
           <input
           type='tel'
           placeholder='Phone_Number'
           className="w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400"
           />
          </div> 

          <div className='relative flex items-center flex-1'>
          <HiEnvelope size={20} className='absolute left-3 text-gray-400' />
           <input
           type='text'
           placeholder='Email'
           className="w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400"
           />
          </div> 

          </div> 

        <div className='flex items-center gap-2'> 

          <div className='relative flex items-center flex-1'>
          <HiEnvelope size={20} className='absolute left-3 text-gray-400' />
           <input
           type='text'
           placeholder='Employment_Type'
           className=" w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400"
           />
          </div>

          <div className='relative flex items-center flex-1'>
          <HiBriefcase size={20} className='absolute left-3 text-gray-400' />
           <input
           type='text'
           placeholder='Job_Title'
           className=" w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400"
           />
          </div>                 
          </div>


          <div className='flex items-center gap-2'>

           <div className='relative flex items-center flex-1'>
          <HiIdentification size={20} className='absolute left-3 text-gray-400' />
           <input
           type='text'
           placeholder='Reporting_Manager'
           className=" w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400"
           />
          </div> 

          <div className='relative flex items-center flex-1'>
          <HiShieldCheck size={20} className='absolute left-3 text-gray-400' />
           <input
           type='text'
           placeholder='Grade'
           className=" w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400"
           />
          </div> 
          </div>



          <div className='flex items-center gap-2'>

          <div className='relative flex items-center flex-1'>
          <HiBuildingOffice size={20} className='absolute left-3 text-gray-400' />

          <select className="w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400">
            <option value="">Select Department</option>
            <option value="HR">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="IT">Information Technology</option>
           
            
          </select>
          </div> 

          <div className='relative flex items-center flex-1'>
          <HiMiniGlobeAlt size={20} className='absolute left-3 text-gray-400' />
           <input
           type='text'
           placeholder='Work_Location'
           className=" w-full px-4 py-2 rounded-lg border border-neutral-300
           focus:outline-none focus:ring-1 focus:ring-blue-300 pl-10 text-gray-400"
           />
          </div> 
          </div>
          
          <button 
            type='submit'
            className="w-full bg-[#153453] text-gray-100 py-2 rounded-lg text-sm transition"
            >  
            Submit 
          </button>

          </form>
        </section>
       </div>
      </div> 
    </div>
    </div>
  )
}

export default Registerpage