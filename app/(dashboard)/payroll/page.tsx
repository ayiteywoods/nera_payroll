"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";

// Sample payroll data
const initialPayrolls = [
  { id: "PAY001", month: "January 2024", period: "January 1 – January 31, 2024", totalEmployees: 84, totalGrossPay: 162400, totalDeductions: 18450, totalNetPay: 143950, status: "Completed", processedDate: "2024-01-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-01-27" },
  { id: "PAY002", month: "February 2024", period: "February 1 – February 29, 2024", totalEmployees: 85, totalGrossPay: 165200, totalDeductions: 18700, totalNetPay: 146500, status: "Completed", processedDate: "2024-02-27", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-02-26" },
  { id: "PAY003", month: "March 2024", period: "March 1 – March 31, 2024", totalEmployees: 86, totalGrossPay: 168900, totalDeductions: 19120, totalNetPay: 149780, status: "Completed", processedDate: "2024-03-29", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-03-28" },
];

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState(initialPayrolls);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [notification, setNotification] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Check for new payroll from session storage on mount
  useEffect(() => {
    const newPayrollData = sessionStorage.getItem('newPayroll');
    if (newPayrollData) {
      try {
        const newPayroll = JSON.parse(newPayrollData);
        setPayrolls(prev => [newPayroll, ...prev]);
        
        // Show success notification
        setNotification({
          type: 'success',
          title: 'Payroll Processed Successfully! ✓',
          message: `Payroll for ${newPayroll.totalEmployees} employees has been created and added to your list.`,
          payrollId: newPayroll.id
        });

        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setNotification(null);
        }, 5000);

        // Clear the session storage
        sessionStorage.removeItem('newPayroll');
      } catch (error) {
        console.error('Error processing new payroll:', error);
      }
    }
  }, []);

  // Filter payrolls by status
  const filteredPayrolls = filterStatus === "All" 
    ? payrolls 
    : payrolls.filter(p => p.status === filterStatus);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayrolls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayrolls = filteredPayrolls.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

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

  const handleFetchPayrollDetails = (payroll) => {
    setSelectedPayroll(payroll);
    setIsDetailModalOpen(true);
  };

  const handleDeletePayroll = () => {
    setPayrolls(payrolls.filter(p => p.id !== selectedPayroll.id));
    setIsDeleteModalOpen(false);
    setSelectedPayroll(null);
    
    setNotification({
      type: 'success',
      title: 'Payroll Deleted',
      message: `Payroll ${selectedPayroll.id} has been successfully deleted.`
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleApprovePayroll = (payrollId) => {
    setPayrolls(payrolls.map(p => 
      p.id === payrollId 
        ? { ...p, approvalStatus: "Approved", approvedBy: "Current User", approvedDate: new Date().toISOString().split('T')[0] }
        : p
    ));

    setNotification({
      type: 'success',
      title: 'Payroll Approved ✓',
      message: `Payroll ${payrollId} has been successfully approved.`
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      {/* Success Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 max-w-md rounded-2xl shadow-2xl p-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 ${
          notification.type === 'success' 
            ? 'bg-white border-2 border-green-500' 
            : 'bg-white border-2 border-red-500'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              notification.type === 'success'
                ? 'bg-green-100'
                : 'bg-red-100'
            }`}>
              {notification.type === 'success' ? (
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${
                notification.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {notification.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
              {notification.payrollId && (
                <p className="text-xs text-gray-500 mt-2 font-mono">ID: {notification.payrollId}</p>
              )}
            </div>
            <button
              onClick={() => setNotification(null)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-2">Payroll Management</h1>
            <p className="text-sm text-gray-600">Process, manage and approve employee payrolls</p>
          </div>
          <Link
            href="/payroll/create"
            className="px-5 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Process New Payroll
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 shadow-sm">
          <h3 className="text-sm font-medium text-black mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-black">1000</p>
          <p className="text-xs text-black mt-1">In system</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 shadow-sm">
          <h3 className="text-sm font-medium text-black mb-2">Total Payrolls</h3>
          <p className="text-3xl font-bold text-black">{payrolls.length}</p>
          <p className="text-xs text-black mt-1">Processed</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 shadow-sm">
          <h3 className="text-sm font-medium text-black mb-2">Total Deductions</h3>
          <p className="text-3xl font-bold text-black">₵32,180</p>
          <p className="text-xs text-black mt-1">This cycle</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 shadow-sm">
          <h3 className="text-sm font-medium text-black mb-2">Departments</h3>
          <p className="text-3xl font-bold text-black">10</p>
          <p className="text-xs text-black mt-1">Active</p>
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
        {/* Items per page selector */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredPayrolls.length)} of {filteredPayrolls.length} entries
          </div>
        </div>

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
              {currentPayrolls.map((payroll, index) => (
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

        {/* Pagination Controls */}
        {filteredPayrolls.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredPayrolls.length)} of {filteredPayrolls.length} entries
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold">Payroll Details - {selectedPayroll.id}</h2>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Month</p>
                  <p className="text-base font-semibold text-gray-900">{selectedPayroll.month}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Total Employees</p>
                  <p className="text-base font-semibold text-gray-900">{selectedPayroll.totalEmployees}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Gross Pay</p>
                  <p className="text-base font-semibold text-gray-900">₵ {selectedPayroll.totalGrossPay.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Net Pay</p>
                  <p className="text-base font-semibold text-[#2c4a6a]">₵ {selectedPayroll.totalNetPay.toLocaleString()}</p>
                </div>
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
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Payroll</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete payroll <strong>{selectedPayroll.id}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePayroll}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
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