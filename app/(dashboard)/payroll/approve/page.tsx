"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PayrollApprovalAuthPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [payroll, setPayroll] = useState(null);
  const [step, setStep] = useState<"position" | "camera" | "confirm">("position");
  const [position, setPosition] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Get payroll data from sessionStorage
    const payrollData = sessionStorage.getItem('payroll_to_approve');
    if (payrollData) {
      setPayroll(JSON.parse(payrollData));
    } else {
      router.push('/payroll');
    }
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStep("camera");
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please ensure you've granted camera permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        
        // Stop camera
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        setStep("confirm");
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleApprove = async () => {
    setIsApproving(true);

    // Simulate approval process
    setTimeout(() => {
      // Update payroll in storage
      const payrollsData = sessionStorage.getItem('payrolls');
      if (payrollsData) {
        const payrolls = JSON.parse(payrollsData);
        const updatedPayrolls = payrolls.map(p => 
          p.id === payroll.id 
            ? { 
                ...p, 
                approvalStatus: "Approved", 
                approvedBy: position,
                approvedDate: new Date().toISOString().split('T')[0],
                approverImage: capturedImage
              }
            : p
        );
        sessionStorage.setItem('payrolls', JSON.stringify(updatedPayrolls));
      }

      sessionStorage.removeItem('payroll_to_approve');
      setIsApproving(false);
      setShowSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/payroll');
      }, 3000);
    }, 2000);
  };

  if (!payroll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2c4a6a] animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading payroll data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 xl:p-8">
      {/* Approving Loading Screen */}
      {isApproving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2c4a6a] animate-spin"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Approving Payroll...</h3>
              <p className="text-gray-600 text-sm text-center">
                Verifying credentials and processing approval
              </p>
              <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#2c4a6a]/10 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-[#2c4a6a]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-[#2c4a6a] mb-3">✓ Approved!</h3>
              <p className="text-gray-900 font-semibold mb-2">Payroll Successfully Approved</p>
              <p className="text-gray-600 text-sm mb-1">
                Payroll {payroll.id} has been approved
              </p>
              <p className="text-gray-500 text-xs mt-4">
                Redirecting to payroll management...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.push('/payroll')} 
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#153453]">Approve Payroll</h1>
            <p className="text-sm text-gray-600 mt-1">Authenticate your identity to approve payroll {payroll.id}</p>
          </div>
        </div>

        {/* Payroll Summary Card */}
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl p-6 text-white mb-8">
          <h3 className="text-lg font-bold mb-4">Payroll Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-white/70 text-xs mb-1">Period</p>
              <p className="font-semibold">{payroll.month}</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">Employees</p>
              <p className="text-2xl font-bold">{payroll.totalEmployees}</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">Gross Pay</p>
              <p className="text-xl font-bold">₵{payroll.totalGrossPay.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">Net Pay</p>
              <p className="text-xl font-bold">₵{payroll.totalNetPay.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Steps */}
      <div className="max-w-4xl mx-auto">
        {/* Step 1: Position Input */}
        {step === "position" && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#2c4a6a]/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 1: Verify Position</h2>
                <p className="text-gray-600 text-sm">Enter your job title or position to authenticate</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Position *</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g., Finance Manager, HR Director, CEO"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  />
                </div>

                <button
                  onClick={startCamera}
                  disabled={!position.trim()}
                  className={`w-full px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                    position.trim()
                      ? 'bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white hover:from-[#1e3147] hover:to-[#2c4a6a]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue to Photo Verification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Camera */}
        {step === "camera" && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#2c4a6a]/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Photo Verification</h2>
                <p className="text-gray-600 text-sm">Take a photo to verify your identity</p>
              </div>

              <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full"
                  style={{ maxHeight: '400px' }}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (stream) {
                      stream.getTracks().forEach(track => track.stop());
                    }
                    setStep("position");
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={capturePhoto}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all"
                >
                  Capture Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === "confirm" && capturedImage && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#2c4a6a]/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 3: Confirm Approval</h2>
                <p className="text-gray-600 text-sm">Review your information and approve the payroll</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Your Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Position</p>
                      <p className="font-semibold text-gray-900">{position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Date</p>
                      <p className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Captured Photo</p>
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <img src={capturedImage} alt="Captured" className="w-full" style={{ maxHeight: '300px', objectFit: 'contain' }} />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={retakePhoto}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Retake Photo
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all"
                  >
                    Approve Payroll
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}