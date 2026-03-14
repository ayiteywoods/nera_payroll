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
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
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

    setTimeout(() => {
      const newRequest = {
        id: `LR${String(Math.floor(Math.random() * 9000) + 1000)}`,
        ...formData,
        totalDays: calculateTotalDays(),
        status: "Pending",
        appliedDate: new Date().toISOString().split('T')[0],
      };

      sessionStorage.setItem('newLeaveRequest', JSON.stringify(newRequest));
      setIsProcessing(false);
      setShowNotification(true);

      setTimeout(() => {
        router.push('/leave');
      }, 2000);
    }, 1500);
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 xl:p-8">

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2c4a6a] animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center">Submitting Request...</h3>
              <p className="text-gray-600 text-sm mt-2 text-center">Processing your leave request</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Overlay */}
      {showNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
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
              <p className="text-xs text-gray-500">Redirecting to leave management...</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-1">
          <Link href="/leave" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#153453]">Create Leave Request</h1>
            <p className="text-sm text-gray-600 mt-0.5">Submit a new leave request for approval</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LEFT COLUMN — spans 2/3 */}
          <div className="xl:col-span-2 flex flex-col gap-6">

            {/* Employee Information */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-[#153453] mb-5 pb-3 border-b border-gray-100">Employee Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Employee ID *</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    required
                    placeholder="Enter employee ID"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Employee Name *</label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                    required
                    placeholder="Enter full name"
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    required
                    className={`${inputClass} bg-white`}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Leave Details */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-[#153453] mb-5 pb-3 border-b border-gray-100">Leave Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Leave Type *</label>
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                    required
                    className={`${inputClass} bg-white`}
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Contact During Leave</label>
                  <input
                    type="text"
                    value={formData.contactDuringLeave}
                    onChange={(e) => setFormData({...formData, contactDuringLeave: e.target.value})}
                    placeholder="Phone or email"
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Reason for Leave *</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    required
                    rows={4}
                    placeholder="Please provide a detailed reason for your leave request"
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Handover Notes</label>
                  <input
                    type="text"
                    value={formData.handoverNotes}
                    onChange={(e) => setFormData({...formData, handoverNotes: e.target.value})}
                    placeholder="Work handover details"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — 1/3 */}
          <div className="flex flex-col gap-6">

            {/* Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-[#153453] mb-5 pb-3 border-b border-gray-100">Request Summary</h2>
              <div className="space-y-4">
                <div className="bg-[#1e3a52] rounded-xl p-5 text-white text-center">
                  <p className="text-xs text-white/70 mb-1">Total Days</p>
                  <p className="text-5xl font-bold text-white">{calculateTotalDays()}</p>
                  <p className="text-xs text-white/50 mt-1">working days</p>
                </div>
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Employee</span>
                    <span className="text-sm font-semibold text-gray-900 text-right max-w-[55%] truncate">
                      {formData.employeeName || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Department</span>
                    <span className="text-sm font-semibold text-gray-900">{formData.department || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Leave Type</span>
                    <span className="text-sm font-semibold text-gray-900">{formData.leaveType || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Start Date</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formData.startDate ? new Date(formData.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-500">End Date</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formData.endDate ? new Date(formData.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-sm font-bold text-[#153453] mb-3">Request Status</h2>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8eef4] text-[#4a6b8a] text-xs font-semibold border border-[#c3d2e9]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4a6b8a]"></span>
                Pending Approval
              </span>
              <p className="text-xs text-gray-400 mt-3">This request will be sent to your manager for review once submitted.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isProcessing || showNotification}
                className={`w-full px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  isProcessing || showNotification
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white hover:from-[#1e3147] hover:to-[#2c4a6a]'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Submit Request'}
              </button>
              <Link
                href="/leave"
                className="w-full px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}