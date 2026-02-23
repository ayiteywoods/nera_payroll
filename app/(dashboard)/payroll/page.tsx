"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Sample payroll data
const initialPayrolls = [
  { id: "PAY001", month: "January 2024", period: "January 1 – January 31, 2024", totalEmployees: 84, totalGrossPay: 162400, totalDeductions: 18450, totalNetPay: 143950, status: "Completed", processedDate: "2024-01-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-01-27" },
  { id: "PAY002", month: "February 2024", period: "February 1 – February 29, 2024", totalEmployees: 85, totalGrossPay: 165200, totalDeductions: 18700, totalNetPay: 146500, status: "Completed", processedDate: "2024-02-27", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-02-26" },
  { id: "PAY003", month: "March 2024", period: "March 1 – March 31, 2024", totalEmployees: 86, totalGrossPay: 168900, totalDeductions: 19120, totalNetPay: 149780, status: "Completed", processedDate: "2024-03-29", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-03-28" },
  { id: "PAY004", month: "April 2024", period: "April 1 – April 30, 2024", totalEmployees: 87, totalGrossPay: 171600, totalDeductions: 19380, totalNetPay: 152220, status: "Processing", processedDate: "2024-04-28", processedBy: "David Asare", approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY005", month: "May 2024", period: "May 1 – May 31, 2024", totalEmployees: 88, totalGrossPay: 174300, totalDeductions: 19640, totalNetPay: 154660, status: "Completed", processedDate: "2024-05-29", processedBy: "Esi Owusu", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-05-28" },
];

export default function PayrollPage() {
  const router = useRouter();
  const [payrolls, setPayrolls] = useState(initialPayrolls);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // View mode state
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");

  // Check for new payroll from session storage on mount
  useEffect(() => {
    const newPayrollData = sessionStorage.getItem('newPayroll');
    if (newPayrollData) {
      try {
        const newPayroll = JSON.parse(newPayrollData);
        setPayrolls(prev => [newPayroll, ...prev]);
        
        setNotification({
          type: 'success',
          title: 'Payroll Processed Successfully! ✓',
          message: `Payroll for ${newPayroll.totalEmployees} employees has been created and added to your list.`,
          payrollId: newPayroll.id
        });

        setTimeout(() => {
          setNotification(null);
        }, 5000);

        sessionStorage.removeItem('newPayroll');
      } catch (error) {
        console.error('Error processing new payroll:', error);
      }
    }
  }, []);

  // Get unique years and months
  const availableYears = useMemo(() => {
    const years = [...new Set(payrolls.map(p => p.month.split(' ')[1]))].sort().reverse();
    return years;
  }, [payrolls]);

  const availableMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Filter and search payrolls
  const filteredPayrolls = useMemo(() => {
    let filtered = [...payrolls];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.processedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== "All") {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    // Year filter
    if (selectedYear !== "All") {
      filtered = filtered.filter(p => p.month.includes(selectedYear));
    }

    // Month filter
    if (selectedMonth !== "All") {
      filtered = filtered.filter(p => p.month.startsWith(selectedMonth));
    }

    // Sorting
    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.processedDate).getTime() - new Date(a.processedDate).getTime());
    } else if (sortBy === "amount") {
      filtered.sort((a, b) => b.totalNetPay - a.totalNetPay);
    } else if (sortBy === "employees") {
      filtered.sort((a, b) => b.totalEmployees - a.totalEmployees);
    }

    return filtered;
  }, [payrolls, searchTerm, selectedStatus, selectedYear, selectedMonth, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayrolls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayrolls = filteredPayrolls.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedYear, selectedMonth, sortBy]);

  const pageNums = () => {
    const p: (number|string)[] = [];
    if (totalPages <= 7) { 
      for (let i=1; i<=totalPages; i++) p.push(i); 
    } else if (currentPage <= 4) { 
      for (let i=1; i<=5; i++) p.push(i); 
      p.push("..."); 
      p.push(totalPages); 
    } else if (currentPage >= totalPages-3) { 
      p.push(1); 
      p.push("..."); 
      for (let i=totalPages-4; i<=totalPages; i++) p.push(i); 
    } else { 
      p.push(1); 
      p.push("..."); 
      for (let i=currentPage-1; i<=currentPage+1; i++) p.push(i); 
      p.push("..."); 
      p.push(totalPages); 
    }
    return p;
  };

  const goTo = (n: number) => { 
    setCurrentPage(n); 
    window.scrollTo({top:0, behavior:"smooth"}); 
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "bg-[#2c4a6a]/10 text-[#2c4a6a] border-[#2c4a6a]/30";
      case "Pending": return "bg-gray-100 text-gray-700 border-gray-200";
      case "Processing": return "bg-[#6b8ca3]/10 text-[#6b8ca3] border-[#6b8ca3]/30";
      case "Failed": return "bg-gray-200 text-gray-600 border-gray-300";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getApprovalColor = (status) => {
    switch(status) {
      case "Approved": return "bg-[#2c4a6a]/10 text-[#2c4a6a]";
      case "Pending": return "bg-gray-100 text-gray-700";
      case "Rejected": return "bg-gray-200 text-gray-600";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleFetchPayrollDetails = (payroll) => {
    sessionStorage.setItem('selected_payroll', JSON.stringify(payroll));
    router.push('/payroll/detail');
  };

  const handleApproveClick = (payroll) => {
    sessionStorage.setItem('payroll_to_approve', JSON.stringify(payroll));
    router.push('/payroll/approve');
  };

  const handleDeletePayroll = () => {
    setPayrolls(payrolls.filter(p => p.id !== selectedPayroll.id));
    setIsDeleteModalOpen(false);
    
    setNotification({
      type: 'success',
      title: 'Payroll Deleted',
      message: `Payroll ${selectedPayroll.id} has been successfully deleted.`
    });
    
    setSelectedPayroll(null);
    setTimeout(() => setNotification(null), 3000);
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

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Success Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 max-w-md rounded-2xl shadow-2xl p-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 ${
          notification.type === 'success' 
            ? 'bg-white border-2 border-[#2c4a6a]' 
            : 'bg-white border-2 border-gray-400'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              notification.type === 'success' ? 'bg-[#2c4a6a]/10' : 'bg-gray-100'
            }`}>
              {notification.type === 'success' ? (
                <svg className="w-6 h-6 text-[#2c4a6a]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${notification.type === 'success' ? 'text-[#2c4a6a]' : 'text-gray-700'}`}>
                {notification.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
              {notification.payrollId && (
                <p className="text-xs text-gray-500 mt-2 font-mono">ID: {notification.payrollId}</p>
              )}
            </div>
            <button onClick={() => setNotification(null)} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-1">Payroll Management</h1>
        <p className="text-sm text-gray-600">Process, manage and approve employee payrolls</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
          <p className="text-xs text-white/70 mb-1">Total Employees</p>
          <p className="text-3xl font-bold text-white">1000</p>
          <p className="text-xs text-white/50 mt-1">In system</p>
        </div>
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
          <p className="text-xs text-white/70 mb-1">Total Payrolls</p>
          <p className="text-3xl font-bold text-white">{payrolls.length}</p>
          <p className="text-xs text-white/50 mt-1">Processed</p>
        </div>
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
          <p className="text-xs text-white/70 mb-1">Total Deductions</p>
          <p className="text-3xl font-bold text-white">GHS 32,180</p>
          <p className="text-xs text-white/50 mt-1">This cycle</p>
        </div>
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
          <p className="text-xs text-white/70 mb-1">Showing</p>
          <p className="text-3xl font-bold text-white">{filteredPayrolls.length}</p>
          <p className="text-xs text-white/50 mt-1">From filters</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            <div className="relative flex-1 lg:max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Search ID, month, processor..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"/>
            </div>
            <select value={selectedStatus} onChange={e=>setSelectedStatus(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
            </select>
            <select value={selectedYear} onChange={e=>setSelectedYear(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="All">All Years</option>
              {availableYears.map(y=><option key={y} value={y}>{y}</option>)}
            </select>
            <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="All">All Months</option>
              {availableMonths.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="employees">Sort by Employees</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded-md transition-all ${viewMode === "cards" ? "bg-white text-[#2c4a6a] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                title="Card View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white text-[#2c4a6a] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                title="List View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <Link
              href="/payroll/create"
              className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Process Payroll
            </Link>
          </div>
        </div>
      </div>

      {/* Pagination top */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{startIndex+1}</span>–<span className="font-semibold text-gray-900">{Math.min(startIndex+itemsPerPage,filteredPayrolls.length)}</span> of <span className="font-semibold text-gray-900">{filteredPayrolls.length}</span> payrolls
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show</span>
          <select value={itemsPerPage} onChange={e=>{setItemsPerPage(Number(e.target.value));setCurrentPage(1);}} className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
            {[10,20,50,100].map(n=><option key={n}>{n}</option>)}
          </select>
          <span className="text-sm text-gray-500">per page</span>
        </div>
      </div>

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payroll ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Employees</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Gross Pay</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Pay</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentPayrolls.map((payroll, index) => (
                  <tr key={payroll.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{payroll.period}</p>
                      <p className="text-xs text-gray-500">{payroll.processedDate}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2c4a6a]/10 text-[#2c4a6a] font-bold text-sm">
                        {payroll.totalEmployees}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-semibold text-gray-900">GHS {payroll.totalGrossPay.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-base font-bold text-[#2c4a6a]">GHS {payroll.totalNetPay.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(payroll.status)}`}>
                        {payroll.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => {
                          sessionStorage.setItem('view_payroll_detail', JSON.stringify(payroll));
                          router.push('/payroll/detail');
                        }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Detail">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                        {payroll.approvalStatus === "Pending" && (
                          <button onClick={() => {
                            sessionStorage.setItem('payroll_to_approve', JSON.stringify(payroll));
                            router.push('/payroll/approve');
                          }} className="p-2 hover:bg-[#2c4a6a]/10 rounded-lg transition-colors" title="Approve">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        <button onClick={() => { setSelectedPayroll(payroll); setIsDeleteModalOpen(true); }} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      )}

      {/* CARDS VIEW */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
          {currentPayrolls.map(payroll => (
            <div key={payroll.id} className="bg-white rounded-2xl border border-gray-100 hover:border-[#c3d2e9] hover:shadow-md transition-all p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-base">
                    {payroll.id.slice(-2)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{payroll.id}</p>
                    <p className="text-xs text-gray-400">{payroll.month}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusColor(payroll.status)}`}>
                  {payroll.status}
                </span>
              </div>

              <div className="space-y-1.5 mb-4 flex-1">
                <p className="text-sm font-medium text-gray-800">{payroll.period}</p>
                <p className="text-xs text-gray-500">{payroll.totalEmployees} Employees</p>
                <p className="text-xs text-gray-400">Processed: {payroll.processedDate}</p>
                <p className="text-xs text-gray-400">By: {payroll.processedBy}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Gross Pay:</span>
                  <span className="font-semibold text-gray-900">₵{payroll.totalGrossPay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Net Pay:</span>
                  <span className="font-bold text-[#2c4a6a]">₵{payroll.totalNetPay.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button onClick={() => {
                  sessionStorage.setItem('view_payroll_detail', JSON.stringify(payroll));
                  router.push('/payroll/detail');
                }} className="flex-1 px-3 py-2 bg-[#eef3f9] hover:bg-[#c3d2e9] text-[#2c4a6a] rounded-lg text-xs font-semibold transition-colors">
                  View Details
                </button>
                {payroll.approvalStatus === "Pending" && (
                  <button onClick={() => {
                    sessionStorage.setItem('payroll_to_approve', JSON.stringify(payroll));
                    router.push('/payroll/approve');
                  }} className="px-3 py-2 bg-[#2c4a6a]/10 hover:bg-[#2c4a6a]/20 text-[#2c4a6a] rounded-lg text-xs font-semibold transition-colors">
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredPayrolls.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <svg className="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-800 font-semibold mb-2">No payrolls found</p>
          <p className="text-gray-500 text-sm mb-4">Adjust your filters or search term</p>
          <button onClick={()=>{setSearchTerm("");setSelectedStatus("All");setSelectedYear("All");setSelectedMonth("All");}} className="text-[#2c4a6a] text-sm font-medium hover:underline">Clear filters</button>
        </div>
      )}

      {/* Pagination bottom */}
      {filteredPayrolls.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">Page <b>{currentPage}</b> of <b>{totalPages}</b></p>
          <div className="flex items-center gap-1.5">
            <button onClick={()=>goTo(currentPage-1)} disabled={currentPage===1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div className="hidden sm:flex gap-1">
              {pageNums().map((p,i)=>
                p==="..." ? <span key={i} className="w-9 flex items-center justify-center text-gray-400 text-sm">…</span> :
                <button key={p} onClick={()=>goTo(p as number)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage===p?"bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white":"text-gray-700 hover:bg-gray-100"}`}>
                  {p}
                </button>
              )}
            </div>
            <button onClick={()=>goTo(currentPage+1)} disabled={currentPage===totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      )}

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
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDeletePayroll} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
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