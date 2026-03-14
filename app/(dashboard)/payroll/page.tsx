"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const initialPayrolls = [
  { id: "PAY001", month: "January 2024",  period: "January 1 – January 31, 2024",   totalEmployees: 84, totalGrossPay: 162400, totalDeductions: 18450, totalNetPay: 143950, status: "Completed",  processedDate: "2024-01-28", processedBy: "John Mensah",  approvalStatus: "Approved", approvedBy: "Sarah Johnson",  approvedDate: "2024-01-27" },
  { id: "PAY002", month: "February 2024", period: "February 1 – February 29, 2024", totalEmployees: 85, totalGrossPay: 165200, totalDeductions: 18700, totalNetPay: 146500, status: "Completed",  processedDate: "2024-02-27", processedBy: "Ama Serwaa",  approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-02-26" },
  { id: "PAY003", month: "March 2024",    period: "March 1 – March 31, 2024",       totalEmployees: 86, totalGrossPay: 168900, totalDeductions: 19120, totalNetPay: 149780, status: "Completed",  processedDate: "2024-03-29", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson",  approvedDate: "2024-03-28" },
  { id: "PAY004", month: "April 2024",    period: "April 1 – April 30, 2024",       totalEmployees: 87, totalGrossPay: 171600, totalDeductions: 19380, totalNetPay: 152220, status: "Processing", processedDate: "2024-04-28", processedBy: "David Asare", approvalStatus: "Pending",  approvedBy: null,            approvedDate: null         },
  { id: "PAY005", month: "May 2024",      period: "May 1 – May 31, 2024",           totalEmployees: 88, totalGrossPay: 174300, totalDeductions: 19640, totalNetPay: 154660, status: "Completed",  processedDate: "2024-05-29", processedBy: "Esi Owusu",   approvalStatus: "Approved", approvedBy: "Sarah Johnson",  approvedDate: "2024-05-28" },
];

// ── Exact same badge pattern as employee + recruitment pages ──────────────────
const statusColor = (s: string) =>
  s === "Completed" ? "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]"  :
  s === "Approved"  ? "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]"  :
  s === "Processing"? "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]"  :
  s === "Pending"   ? "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]"  :
  s === "Failed"    ? "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]"  :
  s === "Rejected"  ? "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]"  :
                      "bg-gray-100 text-gray-700 border-gray-200";

export default function PayrollPage() {
  const router = useRouter();
  const [payrolls, setPayrolls]           = useState(initialPayrolls);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notification, setNotification]   = useState(null);

  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedYear, setSelectedYear]   = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [sortBy, setSortBy]               = useState("date");
  const [currentPage, setCurrentPage]     = useState(1);
  const [itemsPerPage, setItemsPerPage]   = useState(20);
  const [viewMode, setViewMode]           = useState<"list" | "cards">("list");

  useEffect(() => {
    const raw = sessionStorage.getItem("newPayroll");
    if (!raw) return;
    try {
      const p = JSON.parse(raw);
      setPayrolls(prev => [p, ...prev]);
      setNotification({ type: "success", title: "Payroll processed successfully", message: `Payroll for ${p.totalEmployees} employees has been created.`, payrollId: p.id });
      setTimeout(() => setNotification(null), 5000);
      sessionStorage.removeItem("newPayroll");
    } catch {}
  }, []);

  const availableYears = useMemo(() =>
    [...new Set(payrolls.map(p => p.month.split(" ")[1]))].sort().reverse(), [payrolls]);

  const availableMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const filteredPayrolls = useMemo(() => {
    let r = [...payrolls];
    if (searchTerm)          r = r.filter(p => `${p.id} ${p.month} ${p.processedBy}`.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedStatus !== "All") r = r.filter(p => p.status === selectedStatus);
    if (selectedYear   !== "All") r = r.filter(p => p.month.includes(selectedYear));
    if (selectedMonth  !== "All") r = r.filter(p => p.month.startsWith(selectedMonth));
    if (sortBy === "date")        r.sort((a, b) => new Date(b.processedDate).getTime() - new Date(a.processedDate).getTime());
    if (sortBy === "amount")      r.sort((a, b) => b.totalNetPay - a.totalNetPay);
    if (sortBy === "employees")   r.sort((a, b) => b.totalEmployees - a.totalEmployees);
    return r;
  }, [payrolls, searchTerm, selectedStatus, selectedYear, selectedMonth, sortBy]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedStatus, selectedYear, selectedMonth, sortBy]);

  const totalPages    = Math.max(1, Math.ceil(filteredPayrolls.length / itemsPerPage));
  const startIndex    = (currentPage - 1) * itemsPerPage;
  const currentPayrolls = filteredPayrolls.slice(startIndex, startIndex + itemsPerPage);

  const pageNums = () => {
    const p: (number | string)[] = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) p.push(i); }
    else if (currentPage <= 4) { for (let i = 1; i <= 5; i++) p.push(i); p.push("..."); p.push(totalPages); }
    else if (currentPage >= totalPages - 3) { p.push(1); p.push("..."); for (let i = totalPages - 4; i <= totalPages; i++) p.push(i); }
    else { p.push(1); p.push("..."); for (let i = currentPage - 1; i <= currentPage + 1; i++) p.push(i); p.push("..."); p.push(totalPages); }
    return p;
  };

  const goTo = (n: number) => { setCurrentPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleDeletePayroll = () => {
    setPayrolls(payrolls.filter(p => p.id !== selectedPayroll.id));
    setIsDeleteModalOpen(false);
    setNotification({ type: "success", title: "Payroll deleted", message: `Payroll ${selectedPayroll.id} has been successfully deleted.` });
    setSelectedPayroll(null);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">

      {/* Notification toast */}
      {notification && (
        <div className="fixed top-6 right-6 max-w-md bg-white rounded-2xl shadow-2xl border-2 border-[#2c4a6a] p-5 z-[100] flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#d4e1ed] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#2c4a6a]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#1e3147]">{notification.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
            {notification.payrollId && <p className="text-xs text-gray-400 mt-1 font-mono">{notification.payrollId}</p>}
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-1">Payroll management</h1>
        <p className="text-sm text-gray-600">Process, manage and approve employee payrolls</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total employees", value: "1,000",                          sub: "In system"       },
          { label: "Total payrolls",  value: payrolls.length,                  sub: "Processed"       },
          { label: "Total deductions",value: "GHS 32,180",                     sub: "This cycle"      },
          { label: "Showing",         value: filteredPayrolls.length,           sub: "From filters"    },
        ].map(c => (
          <div key={c.label} className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5 text-white relative overflow-hidden transition-all hover:scale-[1.02]">
            <p className="text-xs text-white/80 mb-1 font-medium">{c.label}</p>
            <p className="text-3xl font-extrabold">{c.value}</p>
            <p className="text-xs text-white/60 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            <div className="relative flex-1 lg:max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search ID, month, processor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]" />
            </div>
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
            </select>
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="All">All Years</option>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="All">All Months</option>
              {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="employees">Sort by Employees</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button onClick={() => setViewMode("cards")}
                className={`p-2 rounded-md transition-all ${viewMode === "cards" ? "bg-white text-[#2c4a6a]" : "text-gray-500 hover:text-gray-700"}`} title="Card view">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white text-[#2c4a6a]" : "text-gray-500 hover:text-gray-700"}`} title="List view">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
            <Link href="/payroll/create"
              className="bg-[#2c4a6a] hover:bg-[#1e3147] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Process payroll
            </Link>
          </div>
        </div>
      </div>

      {/* Pagination top */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{startIndex + 1}</span>–<span className="font-semibold text-gray-900">{Math.min(startIndex + itemsPerPage, filteredPayrolls.length)}</span> of <span className="font-semibold text-gray-900">{filteredPayrolls.length}</span> payrolls
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show</span>
          <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
            {[10, 20, 50, 100].map(n => <option key={n}>{n}</option>)}
          </select>
          <span className="text-sm text-gray-500">per page</span>
        </div>
      </div>

      {/* ── List view ─────────────────────────────────────────────────────── */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Payroll ID","Period","Employees","Gross pay","Net pay","Status","Actions"].map((h, i) => (
                    <th key={h} className={`px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                      i === 2 ? "text-center" : i >= 3 && i <= 4 ? "text-right" : i === 6 ? "text-right" : "text-left"
                    }`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentPayrolls.map(payroll => (
                  <tr key={payroll.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {payroll.id.slice(-2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{payroll.id}</p>
                          <p className="text-xs text-gray-400">{payroll.month}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{payroll.period}</p>
                      <p className="text-xs text-gray-400">{payroll.processedDate}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#d4e1ed] text-[#2c4a6a] font-bold text-sm">
                        {payroll.totalEmployees}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">GHS {payroll.totalGrossPay.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <p className="text-sm font-bold text-[#2c4a6a]">GHS {payroll.totalNetPay.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Same badge style as employee page */}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(payroll.status)}`}>
                        {payroll.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Same icon button style as employee page */}
                        <button onClick={() => { sessionStorage.setItem("view_payroll_detail", JSON.stringify(payroll)); router.push("/payroll/detail"); }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="View">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        {payroll.approvalStatus === "Pending" && (
                          <button onClick={() => { sessionStorage.setItem("payroll_to_approve", JSON.stringify(payroll)); router.push("/payroll/approve"); }}
                            className="p-2 hover:bg-[#eef3f9] rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="Approve">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </button>
                        )}
                        <button onClick={() => { setSelectedPayroll(payroll); setIsDeleteModalOpen(true); }}
                          className="p-2 hover:bg-[#eef3f9] rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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

      {/* ── Cards view ────────────────────────────────────────────────────── */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
          {currentPayrolls.map(payroll => (
            <div key={payroll.id} className="bg-white rounded-2xl border border-gray-100 hover:border-[#c3d2e9] transition-all p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {payroll.id.slice(-2)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{payroll.id}</p>
                    <p className="text-xs text-gray-400">{payroll.month}</p>
                  </div>
                </div>
                {/* Same badge style as employee page */}
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 ${statusColor(payroll.status)}`}>
                  {payroll.status}
                </span>
              </div>

              <div className="space-y-1.5 mb-4 flex-1">
                <p className="text-sm font-medium text-gray-800">{payroll.period}</p>
                <p className="text-xs text-gray-500">{payroll.totalEmployees} employees</p>
                <p className="text-xs text-gray-400">Processed: {payroll.processedDate}</p>
                <p className="text-xs text-gray-400">By: {payroll.processedBy}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Gross pay</span>
                  <span className="font-semibold text-gray-900">GHS {payroll.totalGrossPay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Net pay</span>
                  <span className="font-bold text-[#2c4a6a]">GHS {payroll.totalNetPay.toLocaleString()}</span>
                </div>
              </div>

              {/* Same card button style as employee page */}
              <div className="flex gap-2">
                <button onClick={() => { sessionStorage.setItem("view_payroll_detail", JSON.stringify(payroll)); router.push("/payroll/detail"); }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#eef3f9] hover:bg-[#c3d2e9] text-[#2c4a6a] rounded-lg text-xs font-semibold transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  View
                </button>
                {payroll.approvalStatus === "Pending" ? (
                  <button onClick={() => { sessionStorage.setItem("payroll_to_approve", JSON.stringify(payroll)); router.push("/payroll/approve"); }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-lg text-xs font-semibold transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Approve
                  </button>
                ) : (
                  <button onClick={() => { setSelectedPayroll(payroll); setIsDeleteModalOpen(true); }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-lg text-xs font-semibold transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete
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
          <button onClick={() => { setSearchTerm(""); setSelectedStatus("All"); setSelectedYear("All"); setSelectedMonth("All"); }}
            className="text-[#2c4a6a] text-sm font-medium hover:underline">Clear filters</button>
        </div>
      )}

      {/* Pagination bottom */}
      {filteredPayrolls.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">Page <b>{currentPage}</b> of <b>{totalPages}</b></p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="hidden sm:flex gap-1">
              {pageNums().map((p, i) =>
                p === "..." ? <span key={i} className="w-9 flex items-center justify-center text-gray-400 text-sm">…</span> :
                <button key={p} onClick={() => goTo(p as number)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage === p ? "bg-[#2c4a6a] text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                  {p}
                </button>
              )}
            </div>
            <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm text-gray-500">Go to</span>
            <input type="number" min={1} max={totalPages} defaultValue={currentPage}
              onBlur={e => { const p = parseInt(e.target.value); if (p >= 1 && p <= totalPages) goTo(p); }}
              className="w-14 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]" />
          </div>
        </div>
      )}

      {/* Delete modal — navy style, no red */}
      {isDeleteModalOpen && selectedPayroll && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-base font-bold">Delete payroll</h2>
              <button onClick={() => setIsDeleteModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <div className="w-11 h-11 rounded-full bg-[#eef3f9] flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <p className="text-sm font-bold text-gray-900 text-center mb-1">Delete {selectedPayroll.id}?</p>
              <p className="text-xs text-gray-500 text-center mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleDeletePayroll}
                  className="flex-1 py-2.5 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-xl text-sm font-semibold transition-all">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}