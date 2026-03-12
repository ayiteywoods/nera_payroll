"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiEyeSlash, HiEye, HiUserCircle } from 'react-icons/hi2';

const Loginpage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      router.push('/admin');
    }, 2000);
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
                  <svg className="w-10 h-10 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Loading Text */}
              <h3 className="text-xl font-bold text-[#1e3147] mb-2">Signing you in...</h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Please wait while we verify your credentials
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

      {/* Hero Section */}
      <div className='flex flex-col lg:flex-row min-h-screen'>
        {/* Left Side - Background Image */}
        <div className='lg:w-1/2 relative h-64 lg:h-auto'>
          <Image
            src="/logo4.png"
            alt="Payroll Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* RIGHT – LOGIN FORM */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gray-200">
          <div className='max-w-xl mx-auto w-full'>
            <section className='bg-teal-50 p-14 rounded-lg m-6'>
              <h1 className="text-3xl mb-3 text-center font-bold text-[#1e3147]">Sign In</h1>
              <p className='text-gray-500 text-sm mb-6 text-center'>
                Welcome back, Log in and get started.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className='relative flex items-center flex-1'>
                  <HiEyeSlash size={20} className='absolute left-3 text-gray-400' />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="•••••••"
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

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      className="accent-[#2c4a6a] w-4 h-4"
                    />
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-all shadow-md"
                >
                  {isLoading ? 'Signing in...' : 'Login'}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  Forgot Password?{" "}
                  <Link href="/auth/resetpassword">
                    <span className="text-[#2c4a6a] font-medium cursor-pointer hover:underline">
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
  );
};

export default Loginpage;