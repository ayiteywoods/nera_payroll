"use client"
import React from 'react'
import { HiHome,HiOutlineChevronDoubleDown } from 'react-icons/hi2'

const Sidebar = () => {
  return (
    <aside className='w-64 h-screen bg-white rounded-r-2xl border-r border-gray-200 text-gray-600 py-4'>
        <div className='p-4 flex flex-row justify-between items-center'> 
             Home
            <div className="p-2 ">
              <HiOutlineChevronDoubleDown />
            </div>  
        </div>


        <div className='p-4 rounded-xl hover:bg-gray-100 cursor-pointer'>
          <HiHome className='inline mr-2' />
            Dashboard
        </div>
        <span className='p-4 font-bold '>Main Features</span>
        <div className='p-4 rounded-xl hover:bg-gray-100 cursor-pointer'>
          <ul className='space-y-1'>
            <li className='relative px-4 py-2 text-blue-900 font-semibold
               bg-teal-50 border-l-4 border-teal-600 rounded-r-full'>
                Employee Payroll
            </li>
          </ul>
        </div>    

    </aside>   
  )
}

export default Sidebar
