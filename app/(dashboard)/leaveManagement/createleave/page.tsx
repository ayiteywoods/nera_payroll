"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateLeaveRequestPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    department: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    contactDuringLeave: "",
    handoverNotes: "",
  });

  const leaveTypes = ["Annual Leave", "Sick Leave", "Emergency Leave", "Maternity Leave", "Paternity Leave", "Unpaid Leave"];
  const departments = ["Engineering", "Management", "Sales", "HR", "Support", "Finance", "Marketing", "Operations"];

  const calculateTotalDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return days > 0 ? days : 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.employeeName || !formData.department || !formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
      alert("Please fill in all required fields!");
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const newRequest = {
        id: `LR${String(Math.floor(Math.random() * 9000) + 1000)}`,
        employeeId: formData.employeeId,
        employeeName: formData.employeeName,
        department: formData.department,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalDays: calculateTotalDays(),
        reason: formData.reason,
        contactDuringLeave: formData.contactDuringLeave,
        handoverNotes: formData.handoverNotes,
        status: "Pending",
        appliedDate: new Date().toISOString().split('T')[0],
      };

      // Store in session storage
      sessionStorage.setItem('newLeaveRequest', JSON.stringify(newRequest));

      setIsProcessing(false);
      setShowNotification(true);

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        router.push('/leave');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 xl:p-8">
      {/* Processing Notification */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2c4a6a] animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center">Submitting Request...</h3>
              <p className="text-gray-600 text-sm mt-2 text-center">
                Processing your leave request
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#2c4a6a]/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#2c4a6a]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#2c4a6a] mb-2">✓ Done!</h3>
              <p className="text-gray-900 font-semibold mb-1">Leave Request Submitted</p>
              <p className="text-gray-600 text-sm mb-4">
                Your request for {calculateTotalDays()} days has been submitted successfully
              </p>
              <p className="text-xs text-gray-500">
                Redirecting to leave management...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Link href="/leave" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#153453]">Create Leave Request</h1>
              <p className="text-sm text-gray-600 mt-1">Submit a new leave request for approval</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Employee Information Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-[#153453] mb-5">Employee Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                required
                placeholder="Enter employee ID"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name *</label>
              <input
                type="text"
                value={formData.employeeName}
                onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                required
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Leave Details Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-[#153453] mb-5">Leave Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
              <select
                value={formData.leaveType}
                onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white"
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Days</label>
              <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50">
                <span className="font-bold text-[#2c4a6a] text-lg">{calculateTotalDays()} days</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Leave *</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                required
                rows={4}
                placeholder="Please provide a detailed reason for your leave request"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact During Leave</label>
              <input
                type="text"
                value={formData.contactDuringLeave}
                onChange={(e) => setFormData({...formData, contactDuringLeave: e.target.value})}
                placeholder="Phone or email"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Handover Notes</label>
              <input
                type="text"
                value={formData.handoverNotes}
                onChange={(e) => setFormData({...formData, handoverNotes: e.target.value})}
                placeholder="Work handover details"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/leave"
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isProcessing || showNotification}
            className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
              isProcessing || showNotification
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white hover:from-[#1e3147] hover:to-[#2c4a6a]'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}