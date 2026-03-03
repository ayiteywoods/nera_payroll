"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { HiEyeSlash, HiEye, HiShieldCheck, HiUserCircle } from 'react-icons/hi2';

const LogoutPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col lg:flex-row min-h-screen'>
        {/** Left Side Background Image */}
        <div className='lg:w-1/2 relative h-64 lg:h-auto'>
          <Image 
            src="/Nerasol.png"
            alt="Logout Background"
            fill
            className='object-cover'
            priority   
          />
          <div className="absolute inset-0 bg-[#2c4a6a]/80">
            <div className="flex flex-col justify-center items-center h-full text-white p-8">
              <div className="max-w-md text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                    <HiShieldCheck className="w-10 h-10" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">Secure Session Management</h2>
                <p className="text-white/80 mb-6">
                  Your security is our priority. We require verification before logging you out to ensure account safety.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                    <HiShieldCheck className="w-6 h-6 mb-2 mx-auto" />
                    <p className="font-semibold">Encrypted</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                    <HiShieldCheck className="w-6 h-6 mb-2 mx-auto" />
                    <p className="font-semibold">Protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/** RIGHT - LOGOUT FORM **/}
        <div className='lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gray-50'>
          <div className='max-w-xl mx-auto w-full'>
            
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200 text-center">
              <h2 className="text-2xl font-bold text-[#2c4a6a]">Neraadmin</h2>
            </div>

            <section className='bg-white p-8 rounded-2xl shadow-lg border border-gray-200'>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#2c4a6a] flex items-center justify-center mx-auto mb-4">
                  <HiShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h1 className='text-2xl font-bold text-gray-900 mb-2'>Secure Logout</h1>
                <p className='text-gray-600 text-sm'>
                  Verify your identity to complete logout
                </p>
              </div>

              <form className='space-y-5'>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className='relative flex items-center'>
                    <HiUserCircle size={20} className='absolute left-3 text-gray-400' />
                    <input 
                      type='email'
                      placeholder='natkwakye77@gmail.com'
                      className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] pl-10 text-gray-700 bg-gray-50'
                    />    
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className='relative flex items-center'>
                      <HiEyeSlash size={20} className='absolute left-3 text-gray-400'/>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder='*************'
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] pl-10 pr-10 text-gray-700 bg-gray-50'           
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <HiEye size={20} /> : <HiEyeSlash size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Security PIN</label>
                    <div className='relative flex items-center'>
                      <HiShieldCheck size={20} className='absolute left-3 text-gray-400'/>
                      <input
                        type={showPin ? "text" : "password"}
                        placeholder='Enter PIN'
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] pl-10 pr-10 text-gray-700 bg-gray-50'           
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPin ? <HiEye size={20} /> : <HiEyeSlash size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="rememberDevice"
                    className="w-4 h-4 text-[#2c4a6a] bg-gray-100 border-gray-300 rounded focus:ring-[#2c4a6a] focus:ring-2"
                  />
                  <label htmlFor="rememberDevice" className="text-sm text-gray-700 cursor-pointer">
                    Don't ask for verification on this device for 30 days
                  </label>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <div className="text-amber-600 text-xl flex-shrink-0">⚠️</div>
                  <div className="text-sm">
                    <p className="font-semibold text-amber-900 mb-1">Security Notice</p>
                    <p className="text-amber-700">
                      Logging out will end your current session and require re-authentication to access your account again.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/auth/login"> 
                    <button
                      type='button'
                      className='w-full bg-[#2c4a6a] hover:bg-[#1e3147] text-white py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2'
                    >
                      <HiShieldCheck className="w-5 h-5" />
                      Secure Logout
                    </button>
                  </Link>

                  <Link href="/auth/login">
                    <button
                      type="button"
                      className='w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium transition-all hover:bg-gray-50'
                    >
                      Quick Logout (Skip Verification)
                    </button>
                  </Link>

                  <Link href="/dashboard">
                    <button
                      type="button"
                      className='w-full bg-gray-100 text-gray-700 py-3 rounded-lg text-sm font-medium transition-all hover:bg-gray-200'
                    >
                      Cancel & Return to Dashboard
                    </button>
                  </Link>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <Link href="/auth/login" className="text-[#2c4a6a] hover:underline font-medium">
                    Back to Login
                  </Link>
                  <Link href="/support" className="text-gray-600 hover:text-gray-900">
                    Need Help?
                  </Link>
                </div>
              </div>
            </section>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                🔒 Your session is secured with 256-bit encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;