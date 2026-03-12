"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { HiEyeSlash, HiEye, HiShieldCheck, HiUserCircle } from 'react-icons/hi2';

const LogoutPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    pin: '',
    rememberDevice: false
  });

  const handleSecureLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      window.location.href = '/auth/signin';
    }, 2000);
  };

  const handleQuickLogout = () => {
    window.location.href = '/auth/signin';
  };

  return (
    <div className='min-h-screen'>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex flex-col items-center">
              {/* Animated Logo/Spinner */}
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#2c4a6a] border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <HiShieldCheck className="w-10 h-10 text-[#2c4a6a]" />
                </div>
              </div>

              {/* Loading Text */}
              <h3 className="text-xl font-bold text-[#1e3147] mb-2">Logging you out...</h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Please wait while we securely end your session
              </p>

              {/* Progress Dots */}
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[#2c4a6a] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#2c4a6a] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#2c4a6a] animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='flex flex-col lg:flex-row min-h-screen'>
        {/* Left Side - Background Image */}
        <div className='lg:w-1/2 relative h-64 lg:h-auto'>
          <Image
            src="/logo4.png"
            alt="Logout Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* RIGHT – LOGOUT FORM */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gray-200">
          <div className='max-w-xl mx-auto w-full'>
            <section className='bg-teal-50 p-14 rounded-lg m-6'>
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] flex items-center justify-center">
                  <HiShieldCheck className="w-8 h-8 text-white" />
                </div>
              </div>

              <h1 className="text-3xl mb-3 text-center font-bold text-[#1e3147]">Secure Logout</h1>
              <p className='text-gray-500 text-sm mb-6 text-center'>
                Verify your identity to complete logout
              </p>

              <form onSubmit={handleSecureLogout} className="space-y-6">
                <div className='relative flex items-center flex-1'>
                  <HiUserCircle size={20} className='absolute left-3 text-gray-400' />
                  <input
                    type="email"
                    placeholder="Please enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300
                     focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent pl-10 text-gray-700"
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='relative flex items-center flex-1'>
                    <HiEyeSlash size={20} className='absolute left-3 text-gray-400' />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-neutral-300
                       focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent pl-10 pr-10 text-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <HiEye size={20} /> : <HiEyeSlash size={20} />}
                    </button>
                  </div>

                  <div className='relative flex items-center flex-1'>
                    <HiShieldCheck size={20} className='absolute left-3 text-gray-400' />
                    <input
                      type={showPin ? "text" : "password"}
                      placeholder="Security PIN"
                      value={formData.pin}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-neutral-300
                       focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent pl-10 pr-10 text-gray-700"
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

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberDevice}
                      onChange={(e) => setFormData({ ...formData, rememberDevice: e.target.checked })}
                      className="accent-[#2c4a6a] w-4 h-4"
                    />
                    Don't ask for 30 days
                  </label>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-amber-600 text-lg flex-shrink-0">⚠️</div>
                    <div className="text-sm">
                      <p className="font-semibold text-amber-900 mb-1">Security Notice</p>
                      <p className="text-amber-700">
                        Logging out will end your current session and require re-authentication to access your account again.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <HiShieldCheck className="w-5 h-5" />
                  {isLoading ? 'Logging out...' : 'Secure Logout'}
                </button>

                <button
                  type="button"
                  onClick={handleQuickLogout}
                  disabled={isLoading}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Quick Logout (Skip Verification)
                </button>

                <Link href="/admin">
                  <button
                    type="button"
                    disabled={isLoading}
                    className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel & Return to Dashboard
                  </button>
                </Link>

                <p className="text-sm text-gray-500 text-center">
                  Need Help?{" "}
                  <Link href="/support">
                    <span className="text-[#2c4a6a] font-medium cursor-pointer hover:underline">
                      Contact Support
                    </span>
                  </Link>
                </p>
              </form>
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