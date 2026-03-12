"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiUserCircle, HiArrowLeft } from 'react-icons/hi2';

const ResetPasswordPage = () => {
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('code');
    }, 1500);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 1500);
  };

  return (
    <div className='min-h-screen'>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#2c4a6a] border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-[#1e3147] mb-2">Processing...</h3>
              <p className="text-sm text-gray-500 text-center">Please wait a moment</p>
            </div>
          </div>
        </div>
      )}

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

        {/* Right Side - Reset Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gray-200">
          <div className='max-w-xl mx-auto w-full'>
            <section className='bg-teal-50 p-14 rounded-lg m-6'>
              {/* Back Button */}
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#2c4a6a] hover:underline font-medium mb-6">
                <HiArrowLeft size={16} />
                Back to Login
              </Link>

              {/* STEP 1: Enter Email */}
              {step === 'email' && (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <h1 className="text-3xl mb-3 font-bold text-[#1e3147]">Reset Password</h1>
                    <p className='text-gray-500 text-sm mb-6'>
                      Enter your email address and we'll send you a verification code to reset your password.
                    </p>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className='relative flex items-center flex-1'>
                      <HiUserCircle size={20} className='absolute left-3 text-gray-400' />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-neutral-300
                         focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent pl-10 text-gray-700"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-all shadow-md"
                    >
                      Send Verification Code
                    </button>
                  </form>
                </>
              )}

              {/* STEP 2: Enter Verification Code */}
              {step === 'code' && (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h1 className="text-3xl mb-3 font-bold text-[#1e3147]">Enter Code</h1>
                    <p className='text-gray-500 text-sm mb-2'>
                      We've sent a 6-digit verification code to
                    </p>
                    <p className='text-[#2c4a6a] text-sm font-semibold mb-6'>{email}</p>
                  </div>

                  <form onSubmit={handleCodeSubmit} className="space-y-6">
                    {/* 6-Digit Code Input */}
                    <div className="flex gap-2 justify-center mb-6">
                      {code.map((digit, index) => (
                        <input
                          key={index}
                          id={`code-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeChange(index, e.target.value)}
                          className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent text-[#1e3147]"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || code.some(d => !d)}
                      className="w-full bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-all shadow-md"
                    >
                      Verify Code
                    </button>

                    <p className="text-sm text-gray-500 text-center">
                      Didn't receive the code?{" "}
                      <button type="button" className="text-[#2c4a6a] font-medium hover:underline">
                        Resend Code
                      </button>
                    </p>
                  </form>
                </>
              )}

              {/* STEP 3: Success */}
              {step === 'success' && (
                <>
                  <div className="text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h1 className="text-3xl mb-3 font-bold text-[#1e3147]">Password Reset Sent!</h1>
                    <p className='text-gray-500 text-sm mb-8'>
                      We've sent password reset instructions to your email address. Please check your inbox and follow the link to create a new password.
                    </p>

                    <div className="bg-[#d4e1ed] border border-[#a8c5db] rounded-xl p-4 mb-6">
                      <p className="text-sm text-[#2c4a6a] font-medium mb-1">
                        ✓ Verification code confirmed
                      </p>
                      <p className="text-xs text-gray-600">
                        Check your email for the password reset link
                      </p>
                    </div>

                    <Link href="/">
                      <button className="w-full bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white py-2.5 rounded-lg text-sm font-medium transition-all shadow-md">
                        Back to Login
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;