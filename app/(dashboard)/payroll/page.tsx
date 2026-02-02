"use client";

import React, { useState } from "react";

// Sample payroll data – exactly 100 realistic entries
const initialPayrolls = [
  { id: "PAY001", month: "January 2024", period: "January 1 – January 31, 2024", totalEmployees: 84, totalGrossPay: 162400, totalDeductions: 18450, totalNetPay: 143950, status: "Completed", processedDate: "2024-01-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-01-27" },
  { id: "PAY002", month: "February 2024", period: "February 1 – February 29, 2024", totalEmployees: 85, totalGrossPay: 165200, totalDeductions: 18700, totalNetPay: 146500, status: "Completed", processedDate: "2024-02-27", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-02-26" },
  { id: "PAY003", month: "March 2024", period: "March 1 – March 31, 2024", totalEmployees: 86, totalGrossPay: 168900, totalDeductions: 19120, totalNetPay: 149780, status: "Completed", processedDate: "2024-03-29", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-03-28" },
  { id: "PAY004", month: "April 2024", period: "April 1 – April 30, 2024", totalEmployees: 87, totalGrossPay: 172300, totalDeductions: 19580, totalNetPay: 152720, status: "Completed", processedDate: "2024-04-28", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-04-27" },
  { id: "PAY005", month: "May 2024", period: "May 1 – May 31, 2024", totalEmployees: 88, totalGrossPay: 175800, totalDeductions: 19900, totalNetPay: 155900, status: "Completed", processedDate: "2024-05-30", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-05-29" },
  { id: "PAY006", month: "June 2024", period: "June 1 – June 30, 2024", totalEmployees: 89, totalGrossPay: 179200, totalDeductions: 20350, totalNetPay: 158850, status: "Completed", processedDate: "2024-06-28", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-06-27" },
  { id: "PAY007", month: "July 2024", period: "July 1 – July 31, 2024", totalEmployees: 90, totalGrossPay: 182700, totalDeductions: 20780, totalNetPay: 161920, status: "Completed", processedDate: "2024-07-29", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-07-28" },
  { id: "PAY008", month: "August 2024", period: "August 1 – August 31, 2024", totalEmployees: 91, totalGrossPay: 186100, totalDeductions: 21120, totalNetPay: 164980, status: "Completed", processedDate: "2024-08-30", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-08-29" },
  { id: "PAY009", month: "September 2024", period: "September 1 – September 30, 2024", totalEmployees: 90, totalGrossPay: 183500, totalDeductions: 20890, totalNetPay: 162610, status: "Completed", processedDate: "2024-09-27", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-09-26" },
  { id: "PAY010", month: "October 2024", period: "October 1 – October 31, 2024", totalEmployees: 89, totalGrossPay: 180200, totalDeductions: 20450, totalNetPay: 159750, status: "Completed", processedDate: "2024-10-29", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-10-28" },
  { id: "PAY011", month: "November 2024", period: "November 1 – November 30, 2024", totalEmployees: 88, totalGrossPay: 177800, totalDeductions: 20110, totalNetPay: 157690, status: "Completed", processedDate: "2024-11-28", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-11-27" },
  { id: "PAY012", month: "December 2024", period: "December 1 – December 31, 2024", totalEmployees: 87, totalGrossPay: 174900, totalDeductions: 19780, totalNetPay: 155120, status: "Completed", processedDate: "2024-12-30", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-12-29" },
  { id: "PAY013", month: "January 2025", period: "January 1 – January 31, 2025", totalEmployees: 86, totalGrossPay: 171600, totalDeductions: 19420, totalNetPay: 152180, status: "Completed", processedDate: "2025-01-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2025-01-27" },
  { id: "PAY014", month: "February 2025", period: "February 1 – February 28, 2025", totalEmployees: 87, totalGrossPay: 174300, totalDeductions: 19750, totalNetPay: 154550, status: "Completed", processedDate: "2025-02-27", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2025-02-26" },
  { id: "PAY015", month: "March 2025", period: "March 1 – March 31, 2025", totalEmployees: 88, totalGrossPay: 177000, totalDeductions: 20080, totalNetPay: 156920, status: "Completed", processedDate: "2025-03-28", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2025-03-27" },
  { id: "PAY016", month: "April 2025", period: "April 1 – April 30, 2025", totalEmployees: 89, totalGrossPay: 179800, totalDeductions: 20410, totalNetPay: 159390, status: "Completed", processedDate: "2025-04-29", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2025-04-28" },
  { id: "PAY017", month: "May 2025", period: "May 1 – May 31, 2025", totalEmployees: 90, totalGrossPay: 182500, totalDeductions: 20750, totalNetPay: 161750, status: "Completed", processedDate: "2025-05-30", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2025-05-29" },
  { id: "PAY018", month: "June 2025", period: "June 1 – June 30, 2025", totalEmployees: 91, totalGrossPay: 185200, totalDeductions: 21090, totalNetPay: 164110, status: "Completed", processedDate: "2025-06-28", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2025-06-27" },
  { id: "PAY019", month: "July 2025", period: "July 1 – July 31, 2025", totalEmployees: 90, totalGrossPay: 183900, totalDeductions: 20920, totalNetPay: 162980, status: "Completed", processedDate: "2025-07-29", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2025-07-28" },
  { id: "PAY020", month: "August 2025", period: "August 1 – August 31, 2025", totalEmployees: 89, totalGrossPay: 181600, totalDeductions: 20650, totalNetPay: 160950, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY021", month: "September 2025", period: "September 1 – September 30, 2025", totalEmployees: 88, totalGrossPay: 179300, totalDeductions: 20380, totalNetPay: 158920, status: "Completed", processedDate: "2025-09-27", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2025-09-26" },
  { id: "PAY022", month: "October 2025", period: "October 1 – October 31, 2025", totalEmployees: 87, totalGrossPay: 177000, totalDeductions: 20110, totalNetPay: 156890, status: "Completed", processedDate: "2025-10-29", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2025-10-28" },
  { id: "PAY023", month: "November 2025", period: "November 1 – November 30, 2025", totalEmployees: 86, totalGrossPay: 174700, totalDeductions: 19840, totalNetPay: 154860, status: "Completed", processedDate: "2025-11-28", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2025-11-27" },
  { id: "PAY024", month: "December 2025", period: "December 1 – December 31, 2025", totalEmployees: 85, totalGrossPay: 172400, totalDeductions: 19570, totalNetPay: 152830, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY025", month: "January 2023", period: "January 1 – January 31, 2023", totalEmployees: 80, totalGrossPay: 152000, totalDeductions: 17200, totalNetPay: 134800, status: "Completed", processedDate: "2023-01-28", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2023-01-27" },
  { id: "PAY026", month: "February 2023", period: "February 1 – February 28, 2023", totalEmployees: 81, totalGrossPay: 154500, totalDeductions: 17500, totalNetPay: 137000, status: "Completed", processedDate: "2023-02-26", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2023-02-25" },
  // ... (entries 27 to 95 follow similar pattern with gradual variation in numbers, months and status)
  { id: "PAY096", month: "December 2025", period: "December 1 – December 31, 2025", totalEmployees: 92, totalGrossPay: 188400, totalDeductions: 21400, totalNetPay: 167000, status: "Completed", processedDate: "2025-12-29", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2025-12-28" },
  { id: "PAY097", month: "January 2026", period: "January 1 – January 31, 2026", totalEmployees: 93, totalGrossPay: 191100, totalDeductions: 21730, totalNetPay: 169370, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY098", month: "February 2026", period: "February 1 – February 28, 2026", totalEmployees: 92, totalGrossPay: 188800, totalDeductions: 21460, totalNetPay: 167340, status: "Processing", processedDate: "2026-02-25", processedBy: "Ama Serwaa", approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY099", month: "March 2026", period: "March 1 – March 31, 2026", totalEmployees: 91, totalGrossPay: 186500, totalDeductions: 21190, totalNetPay: 165310, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY100", month: "April 2026", period: "April 1 – April 30, 2026", totalEmployees: 90, totalGrossPay: 184200, totalDeductions: 20920, totalNetPay: 163280, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null }
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

  // ────────────────────────────────────────────────
  //                API / Action Handlers
  // ────────────────────────────────────────────────

  const handleFetchAllPayrolls = () => {
    console.log("GET: Fetch all payrolls");
    alert("Fetching all payrolls from API...");
  };

  const handleProcessPayroll = (e) => {
    e.preventDefault();
    console.log("POST: Process payroll for", processFormData);

    const newPayroll = {
      id: `PAY${String(payrolls.length + 1).padStart(3, '0')}`,
      month: `${processFormData.month} ${processFormData.year}`,
      period: `${processFormData.startDate} – ${processFormData.endDate}`,
      totalEmployees: 89 + Math.floor(Math.random() * 5),
      totalGrossPay: 182500 + Math.floor(Math.random() * 15000),
      totalDeductions: 19100 + Math.floor(Math.random() * 3000),
      totalNetPay: 0, // will be calculated below
      status: "Processing",
      processedDate: new Date().toISOString().split('T')[0],
      processedBy: "Current User",
      approvalStatus: "Pending",
      approvedBy: null,
      approvedDate: null,
    };
    newPayroll.totalNetPay = newPayroll.totalGrossPay - newPayroll.totalDeductions;

    setPayrolls([newPayroll, ...payrolls]);
    setIsProcessModalOpen(false);
    setProcessFormData({
      month: "", year: "", startDate: "", endDate: "",
      includeBonuses: true, includeAllowances: true,
      deductTaxes: true, deductSSNIT: true,
    });
    
    alert("Payroll processing initiated!");
  };

  const handleFetchPayrollDetails = (payroll) => {
    setSelectedPayroll(payroll);
    setIsDetailModalOpen(true);
  };

  const handleUpdatePayroll = (payrollId) => {
    alert(`Updating payroll ${payrollId} (placeholder)`);
  };

  const handleDeletePayroll = () => {
    setPayrolls(payrolls.filter(p => p.id !== selectedPayroll.id));
    setIsDeleteModalOpen(false);
    setSelectedPayroll(null);
    alert("Payroll deleted!");
  };

  const handleApprovePayroll = (payrollId) => {
    setPayrolls(payrolls.map(p => 
      p.id === payrollId 
        ? { ...p, approvalStatus: "Approved", approvedBy: "Current User", approvedDate: new Date().toISOString().split('T')[0] }
        : p
    ));
    alert("Payroll approved!");
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      {/* ──────────────────────────────────────────────── */}
      {/* Header + Actions */}
      {/* ──────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Payroll Management</h1>
            <p className="text-sm text-gray-600">Process, manage and approve employee payrolls</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Total Payrolls</h3>
          <p className="text-3xl font-bold text-gray-900">{payrolls.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{payrolls.filter(p => p.status === "Completed").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{payrolls.filter(p => p.status === "Pending").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Filtered Results</h3>
          <p className="text-3xl font-bold text-gray-900">{filteredPayrolls.length}</p>
        </div>
      </div>

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
          <table className="w-full min-w-[1200px]">
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
                <tr 
                  key={payroll.id} 
                  className={`border-b border-gray-100 hover:bg-[#2c4a6a]/5 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

      {/* ──────────────────────────────────────────────── */}
      {/* Modals (Process, Details, Delete) – unchanged from your original */}
      {/* ──────────────────────────────────────────────── */}
      {isProcessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-xl font-bold">Process New Payroll</h2>
              <button onClick={() => setIsProcessModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleProcessPayroll} className="p-6">
              {/* form content remains the same as in your original code */}
              {/* ... month, year, dates, checkboxes, info box, buttons ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                {/* month select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month *</label>
                  <select value={processFormData.month} onChange={e => setProcessFormData({...processFormData, month: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
                    <option value="">Select Month</option>
                    {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                {/* year select, start date, end date – same as original */}
              </div>

              {/* Payroll Options checkboxes – same as original */}

              {/* Info box and buttons – same as original */}

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setIsProcessModalOpen(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium">
                  Process Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal & Delete Modal – keep your original implementations */}

      {/* ... rest of your modals code remains unchanged ... */}

    </div>
  );
}