"use client";

<<<<<<< HEAD
import { useState, useMemo } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Download, Loader2 } from "lucide-react";
import PayrollCard from "@/components/PayrollCard"; // adjust path as needed
=======
import React, { useState } from "react";
>>>>>>> 745027874d68ba5e1d3623a3e80d05b5e45084b3

// Sample payroll data - replace with your API data
const initialPayrolls = [
  {
    id: "PAY001",
    month: "March 2025",
    period: "March 1 - March 31, 2025",
    totalEmployees: 87,
    totalGrossPay: 175430,
    totalDeductions: 18200,
    totalNetPay: 157230,
    status: "Completed",
    processedDate: "2025-03-28",
    processedBy: "John Mensah",
    approvalStatus: "Approved",
    approvedBy: "Sarah Johnson",
    approvedDate: "2025-03-27",
  },
  {
    id: "PAY002",
    month: "February 2025",
    period: "February 1 - February 28, 2025",
    totalEmployees: 85,
    totalGrossPay: 168900,
    totalDeductions: 17500,
    totalNetPay: 151400,
    status: "Completed",
    processedDate: "2025-02-28",
    processedBy: "John Mensah",
    approvalStatus: "Approved",
    approvedBy: "Sarah Johnson",
    approvedDate: "2025-02-27",
  },
  {
    id: "PAY003",
    month: "April 2025",
    period: "April 1 - April 30, 2025",
    totalEmployees: 89,
    totalGrossPay: 182500,
    totalDeductions: 19100,
    totalNetPay: 163400,
    status: "Pending",
    processedDate: null,
    processedBy: null,
    approvalStatus: "Pending",
    approvedBy: null,
    approvedDate: null,
  },
];

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState(initialPayrolls);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  // Process Payroll Form State
  const [processFormData, setProcessFormData] = useState({
    month: "",
    year: "",
    startDate: "",
    endDate: "",
    includeBonuses: true,
    includeAllowances: true,
    deductTaxes: true,
    deductSSNIT: true,
  });

  // Filter payrolls by status
  const filteredPayrolls = filterStatus === "All" 
    ? payrolls 
    : payrolls.filter(p => p.status === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "bg-green-100 text-green-700 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Failed": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getApprovalColor = (status) => {
    switch(status) {
      case "Approved": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // API Functions (Replace with actual API calls)
  const handleFetchAllPayrolls = () => {
    console.log("GET: Fetch all payrolls");
    // API call: GET /api/payrolls
    alert("Fetching all payrolls from API...");
  };

  const handleProcessPayroll = (e) => {
    e.preventDefault();
    console.log("POST: Process payroll for", processFormData);
    // API call: POST /api/payrolls/process
    
    const newPayroll = {
      id: `PAY${String(payrolls.length + 1).padStart(3, '0')}`,
      month: `${processFormData.month} ${processFormData.year}`,
      period: `${processFormData.startDate} - ${processFormData.endDate}`,
      totalEmployees: 89,
      totalGrossPay: 182500,
      totalDeductions: 19100,
      totalNetPay: 163400,
      status: "Processing",
      processedDate: new Date().toISOString().split('T')[0],
      processedBy: "Current User",
      approvalStatus: "Pending",
      approvedBy: null,
      approvedDate: null,
    };

    setPayrolls([newPayroll, ...payrolls]);
    setIsProcessModalOpen(false);
    setProcessFormData({
      month: "", year: "", startDate: "", endDate: "",
      includeBonuses: true, includeAllowances: true,
      deductTaxes: true, deductSSNIT: true,
    });
    
    alert("Payroll processing initiated successfully!");
  };

  const handleFetchPayrollDetails = (payroll) => {
    console.log("GET: Fetch details for payroll", payroll.id);
    // API call: GET /api/payrolls/:id
    setSelectedPayroll(payroll);
    setIsDetailModalOpen(true);
  };

  const handleUpdatePayroll = (payrollId) => {
    console.log("POST: Update payroll", payrollId);
    // API call: POST /api/payrolls/:id/update
    alert(`Updating payroll ${payrollId}...`);
  };

  const handleDeletePayroll = () => {
    console.log("DELETE: Delete payroll", selectedPayroll.id);
    // API call: DELETE /api/payrolls/:id
    
    setPayrolls(payrolls.filter(p => p.id !== selectedPayroll.id));
    setIsDeleteModalOpen(false);
    setSelectedPayroll(null);
    alert("Payroll deleted successfully!");
  };

  const handleApprovePayroll = (payrollId) => {
    console.log("POST: Approve payroll", payrollId);
    // API call: POST /api/payrolls/:id/approve
    
    setPayrolls(payrolls.map(p => 
      p.id === payrollId 
        ? { ...p, approvalStatus: "Approved", approvedBy: "Current User", approvedDate: new Date().toISOString().split('T')[0] }
        : p
    ));
    alert("Payroll approved successfully!");
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header – smaller */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#153361]">
            Payroll Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Salaries, deductions & payments • {new Date().toLocaleDateString("en-GB")}
          </p>
        </div>

        {/* Payroll Cards – unchanged internally, just tighter spacing */}
        <div className="mb-10 flex flex-nowrap gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300/50 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-x-visible">
          <PayrollCard
            period="This Month"
            title="Total Payroll"
            amount={formatGHS(totalNet)}
            subtitle="Net after deductions"
            footer="Ready for bank upload"
          />
          <PayrollCard
            period="Active Staff"
            title="Team Size"
            amount={enrichedPayroll.length}
            subtitle="Full-time employees"
            footer="All contracts current"
          />
          <PayrollCard
            period="Pending"
            title="Payments Due"
            amount={pendingCount}
            subtitle="Awaiting approval"
            footer="Process before EOM"
          />
          <PayrollCard
            period="Processed"
            title="Paid This Cycle"
            amount={paidThisPeriod}
            subtitle="Successful transfers"
            footer="Confirmed by finance"
          />
        </div>

        {/* Search + Actions – smaller */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name or role..."
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#153361]/70 focus:ring-1 focus:ring-[#153361]/20 outline-none shadow-sm transition"
            />
=======
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Payroll Management</h1>
            <p className="text-sm text-gray-600">Process, manage and approve employee payrolls</p>
>>>>>>> 745027874d68ba5e1d3623a3e80d05b5e45084b3
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleFetchAllPayrolls}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => setIsProcessModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Process New Payroll
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Using Your UI Colors */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">All Records</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Payrolls</h3>
          <p className="text-3xl font-bold mb-1">{payrolls.length}</p>
          <p className="text-xs opacity-75">All time records</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            Complete history
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#6b8ca3] to-[#4a6b82] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Current Status</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Completed</h3>
          <p className="text-3xl font-bold mb-1">{payrolls.filter(p => p.status === "Completed").length}</p>
          <p className="text-xs opacity-75">Successfully processed</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            Finalized payrolls
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#8ba3b8] to-[#6b8ca3] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Awaiting Action</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Pending</h3>
          <p className="text-3xl font-bold mb-1">{payrolls.filter(p => p.status === "Pending").length}</p>
          <p className="text-xs opacity-75">Awaiting approval</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            Requires attention
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#a4b9cc] to-[#8ba3b8] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">March 2025</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">This Month</h3>
          <p className="text-3xl font-bold mb-1">₵ 157,230</p>
          <p className="text-xs opacity-75">Net salaries paid</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            Total disbursed
          </div>
        </div>
      </div> */}

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-1.5 mb-6 inline-flex gap-1">
        {["All", "Completed", "Pending", "Processing"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === status
                ? "bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#2c4a6a]/5 to-[#1e3147]/5 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Payroll ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Period</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Employees</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Gross Pay</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Deductions</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Net Pay</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Status</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Approval</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayrolls.map((payroll, index) => (
                <tr key={payroll.id} className={`border-b border-gray-100 hover:bg-[#2c4a6a]/5 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-xs">
                        {payroll.id.slice(-2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{payroll.id}</p>
                        <p className="text-xs text-gray-500">{payroll.month}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900">{payroll.period}</p>
                    {payroll.processedDate && (
                      <p className="text-xs text-gray-500 mt-1">Processed: {payroll.processedDate}</p>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#6b8ca3]/20 text-[#2c4a6a] font-bold text-sm">
                      {payroll.totalEmployees}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <p className="text-sm font-semibold text-gray-900">₵ {payroll.totalGrossPay.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <p className="text-sm font-semibold text-red-600">₵ {payroll.totalDeductions.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <p className="text-base font-bold text-[#2c4a6a]">₵ {payroll.totalNetPay.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(payroll.status)}`}>
                      {payroll.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${getApprovalColor(payroll.approvalStatus)}`}>
                      {payroll.approvalStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleFetchPayrollDetails(payroll)}
                        className="p-2 hover:bg-[#6b8ca3]/10 rounded-lg transition-colors group"
                        title="View Details"
                      >
                        <svg className="w-5 h-5 text-[#6b8ca3] group-hover:text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleUpdatePayroll(payroll.id)}
                        className="p-2 hover:bg-[#6b8ca3]/10 rounded-lg transition-colors group"
                        title="Update"
                      >
                        <svg className="w-5 h-5 text-[#6b8ca3] group-hover:text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {payroll.approvalStatus === "Pending" && (
                        <button
                          onClick={() => handleApprovePayroll(payroll.id)}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                          title="Approve"
                        >
                          <svg className="w-5 h-5 text-[#6b8ca3] group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedPayroll(payroll);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Delete"
                      >
                        <svg className="w-5 h-5 text-[#6b8ca3] group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPayrolls.length === 0 && (
          <div className="py-16 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No payrolls found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filter or process a new payroll</p>
            <button
              onClick={() => setFilterStatus("All")}
              className="text-[#2c4a6a] hover:underline text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Process Payroll Modal */}
      {isProcessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold">Process New Payroll</h2>
              <button
                onClick={() => setIsProcessModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleProcessPayroll} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month *</label>
                  <select
                    value={processFormData.month}
                    onChange={(e) => setProcessFormData({...processFormData, month: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
                  >
                    <option value="">Select Month</option>
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <select
                    value={processFormData.year}
                    onChange={(e) => setProcessFormData({...processFormData, year: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
                  >
                    <option value="">Select Year</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={processFormData.startDate}
                    onChange={(e) => setProcessFormData({...processFormData, startDate: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={processFormData.endDate}
                    onChange={(e) => setProcessFormData({...processFormData, endDate: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#2c4a6a] mb-3">Payroll Options</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-[#2c4a6a]/5 rounded-lg cursor-pointer hover:bg-[#2c4a6a]/10 transition-colors border border-[#2c4a6a]/10">
                    <input
                      type="checkbox"
                      checked={processFormData.includeBonuses}
                      onChange={(e) => setProcessFormData({...processFormData, includeBonuses: e.target.checked})}
                      className="w-5 h-5 text-[#2c4a6a] rounded focus:ring-2 focus:ring-[#2c4a6a]"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Include Bonuses</p>
                      <p className="text-xs text-gray-500">Add performance and other bonuses to payroll</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-[#2c4a6a]/5 rounded-lg cursor-pointer hover:bg-[#2c4a6a]/10 transition-colors border border-[#2c4a6a]/10">
                    <input
                      type="checkbox"
                      checked={processFormData.includeAllowances}
                      onChange={(e) => setProcessFormData({...processFormData, includeAllowances: e.target.checked})}
                      className="w-5 h-5 text-[#2c4a6a] rounded focus:ring-2 focus:ring-[#2c4a6a]"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Include Allowances</p>
                      <p className="text-xs text-gray-500">Add housing, transport and other allowances</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-[#2c4a6a]/5 rounded-lg cursor-pointer hover:bg-[#2c4a6a]/10 transition-colors border border-[#2c4a6a]/10">
                    <input
                      type="checkbox"
                      checked={processFormData.deductTaxes}
                      onChange={(e) => setProcessFormData({...processFormData, deductTaxes: e.target.checked})}
                      className="w-5 h-5 text-[#2c4a6a] rounded focus:ring-2 focus:ring-[#2c4a6a]"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Deduct Taxes (PAYE)</p>
                      <p className="text-xs text-gray-500">Calculate and deduct income tax</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-[#2c4a6a]/5 rounded-lg cursor-pointer hover:bg-[#2c4a6a]/10 transition-colors border border-[#2c4a6a]/10">
                    <input
                      type="checkbox"
                      checked={processFormData.deductSSNIT}
                      onChange={(e) => setProcessFormData({...processFormData, deductSSNIT: e.target.checked})}
                      className="w-5 h-5 text-[#2c4a6a] rounded focus:ring-2 focus:ring-[#2c4a6a]"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Deduct SSNIT</p>
                      <p className="text-xs text-gray-500">Calculate and deduct social security contributions</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Before Processing</p>
                    <p className="text-xs text-blue-700 mt-1">Ensure all employee data is updated and attendance records are complete. This process cannot be undone.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsProcessModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                  Process Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payroll Details Modal */}
      {isDetailModalOpen && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold">{selectedPayroll.id} - Details</h2>
                <p className="text-sm opacity-90">{selectedPayroll.month}</p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <p className="text-xs font-medium text-green-700 mb-1">Gross Pay</p>
                  <p className="text-2xl font-bold text-green-900">₵ {selectedPayroll.totalGrossPay.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-200">
                  <p className="text-xs font-medium text-red-700 mb-1">Deductions</p>
                  <p className="text-2xl font-bold text-red-900">₵ {selectedPayroll.totalDeductions.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-[#6b8ca3]/10 to-[#4a6b82]/10 rounded-xl p-4 border border-[#6b8ca3]/30">
                  <p className="text-xs font-medium text-[#2c4a6a] mb-1">Net Pay</p>
                  <p className="text-2xl font-bold text-[#2c4a6a]">₵ {selectedPayroll.totalNetPay.toLocaleString()}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="bg-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/10">
                  <h3 className="text-sm font-semibold text-[#2c4a6a] mb-3">Payroll Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Period</p>
                      <p className="font-medium text-gray-900">{selectedPayroll.period}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Employees</p>
                      <p className="font-medium text-gray-900">{selectedPayroll.totalEmployees}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedPayroll.status)}`}>
                        {selectedPayroll.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600">Approval Status</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getApprovalColor(selectedPayroll.approvalStatus)}`}>
                        {selectedPayroll.approvalStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedPayroll.processedDate && (
                  <div className="bg-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/10">
                    <h3 className="text-sm font-semibold text-[#2c4a6a] mb-3">Processing Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Processed Date</p>
                        <p className="font-medium text-gray-900">{selectedPayroll.processedDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Processed By</p>
                        <p className="font-medium text-gray-900">{selectedPayroll.processedBy}</p>
                      </div>
                      {selectedPayroll.approvedDate && (
                        <>
                          <div>
                            <p className="text-gray-600">Approved Date</p>
                            <p className="font-medium text-gray-900">{selectedPayroll.approvedDate}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Approved By</p>
                            <p className="font-medium text-gray-900">{selectedPayroll.approvedBy}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all">
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Payroll?</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete payroll <span className="font-semibold">{selectedPayroll.id}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedPayroll(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePayroll}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}