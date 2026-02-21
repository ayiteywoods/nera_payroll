"use client";

import React, { useState } from "react";

// Generate 1000 employee payslips
const generatePayslips = () => {
  const names = [
    "John Mensah", "Abena Osei", "Kwame Boateng", "Ama Asante", "Kofi Owusu",
    "Yaw Agyeman", "Akosua Frimpong", "Kwesi Darko", "Adjoa Amponsah", "Fiifi Atta",
    "Esi Badu", "Kojo Ansah", "Adwoa Sarpong", "Kwabena Manu", "Afua Opoku",
    "Yaa Kyei", "Kwaku Mensah", "Abena Adomako", "Kofi Asare", "Ama Boateng",
    "Kwame Ofori", "Akua Bonsu", "Yaw Frimpong", "Adjoa Owusu", "Kwesi Agyei",
    "Esi Appiah", "Kojo Baah", "Adwoa Konadu", "Kwabena Osei", "Afua Agyeman"
  ];
  
  const departments = ["Engineering", "HR", "Sales", "Finance", "Marketing", "Operations", "Support", "Management"];
  const positions = ["Senior Manager", "Manager", "Team Lead", "Senior Developer", "Developer", "Analyst", "Coordinator", "Assistant"];
  
  const payslips = [];
  
  for (let i = 1; i <= 1000; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const basicSalary = Math.floor(Math.random() * 5000) + 2000;
    const allowances = Math.floor(Math.random() * 1500) + 500;
    const grossPay = basicSalary + allowances;
    const deductions = Math.floor(grossPay * 0.15);
    const netPay = grossPay - deductions;
    const isPaid = Math.random() > 0.15;
    
    payslips.push({
      id: i,
      employeeId: `EMP${String(i).padStart(4, '0')}`,
      name: name,
      department: department,
      position: position,
      basicSalary: basicSalary,
      allowances: allowances,
      grossPay: grossPay,
      deductions: deductions,
      netPay: netPay,
      isPaid: isPaid,
      paymentDate: isPaid ? `2026-02-${String(Math.floor(Math.random() * 5) + 1).padStart(2, '0')}` : null,
      period: "February 2026",
      taxAmount: Math.floor(grossPay * 0.10),
      ssnitAmount: Math.floor(grossPay * 0.055),
      salaryHistory: Array.from({ length: 6 }, (_, index) => {
        const monthIndex = 1 - index;
        const month = monthIndex <= 0 ? (12 + monthIndex) : monthIndex;
        const year = monthIndex <= 0 ? 2025 : 2026;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const historicGross = Math.floor(grossPay * (0.95 + Math.random() * 0.1));
        const historicDeductions = Math.floor(historicGross * 0.15);
        
        return {
          month: `${monthNames[month - 1]} ${year}`,
          grossPay: historicGross,
          deductions: historicDeductions,
          netPay: historicGross - historicDeductions,
          isPaid: true,
        };
      }),
    });
  }
  
  return payslips;
};

export default function PayslipReportPage() {
  const [payslips, setPayslips] = useState(generatePayslips());
  const [filteredPayslips, setFilteredPayslips] = useState(payslips);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");

  const departments = ["All", "Engineering", "HR", "Sales", "Finance", "Marketing", "Operations", "Support", "Management"];

  // Filter logic
  React.useEffect(() => {
    let result = [...payslips];

    if (searchTerm) {
      result = result.filter(payslip => 
        payslip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payslip.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDepartment !== "All") {
      result = result.filter(payslip => payslip.department === filterDepartment);
    }

    if (filterPaymentStatus !== "All") {
      result = result.filter(payslip => 
        filterPaymentStatus === "Paid" ? payslip.isPaid : !payslip.isPaid
      );
    }

    setFilteredPayslips(result);
    setCurrentPage(1);
  }, [searchTerm, filterDepartment, filterPaymentStatus, payslips]);

  const totalPages = Math.ceil(filteredPayslips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayslips = filteredPayslips.slice(startIndex, startIndex + itemsPerPage);

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

  const handleViewDetails = (payslip) => {
    setSelectedPayslip(payslip);
    setIsDetailModalOpen(true);
  };

  const handleMarkAsPaid = (payslipId) => {
    setPayslips(payslips.map(p => 
      p.id === payslipId 
        ? { ...p, isPaid: true, paymentDate: new Date().toISOString().split('T')[0] }
        : p
    ));
  };

  const totalGrossPay = filteredPayslips.reduce((sum, p) => sum + p.grossPay, 0);
  const totalNetPay = filteredPayslips.reduce((sum, p) => sum + p.netPay, 0);
  const paidCount = filteredPayslips.filter(p => p.isPaid).length;
  const unpaidCount = filteredPayslips.filter(p => !p.isPaid).length;

  const statusColor = (isPaid: boolean) =>
    isPaid ? "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]" : "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]";

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-1">Payslip Reports</h1>
        <p className="text-sm text-gray-600">View, manage and export employee payslips</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Employees", value: filteredPayslips.length, sub: "In current view" },
          { label: "Paid", value: paidCount, sub: `${((paidCount / filteredPayslips.length) * 100).toFixed(1)}% completed` },
          { label: "Unpaid", value: unpaidCount, sub: "Pending payment" },
          { label: "Total Net Pay", value: `₵${(totalNetPay / 1000).toFixed(1)}K`, sub: "After deductions" },
        ].map(c => (
          <div key={c.label} className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
            <p className="text-xs text-white/70 mb-1">{c.label}</p>
            <p className="text-3xl font-bold text-white">{c.value.toLocaleString()}</p>
            <p className="text-xs text-white/50 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            <div className="relative flex-1 lg:max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Search name, ID..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"/>
            </div>
            <select value={filterDepartment} onChange={e=>setFilterDepartment(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              {departments.map(d=><option key={d} value={d}>{d==="All"?"All Departments":d}</option>)}
            </select>
            <select value={filterPaymentStatus} onChange={e=>setFilterPaymentStatus(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded-md transition-all ${viewMode === "cards" ? "bg-white text-[#2c4a6a] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white text-[#2c4a6a] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <button onClick={() => alert("Exporting...")} className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Pagination top */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{startIndex+1}</span>–<span className="font-semibold text-gray-900">{Math.min(startIndex+itemsPerPage,filteredPayslips.length)}</span> of <span className="font-semibold text-gray-900">{filteredPayslips.length}</span> payslips
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
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Gross Pay</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Net Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentPayslips.map(payslip => (
                  <tr key={payslip.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {payslip.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{payslip.name}</p>
                          <p className="text-xs text-gray-400">{payslip.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{payslip.position}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-gray-900">{payslip.department}</p></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <p className="text-sm font-semibold text-gray-900">₵{payslip.grossPay.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <p className="text-sm font-bold text-[#2c4a6a]">₵{payslip.netPay.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(payslip.isPaid)}`}>
                        {payslip.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={()=>handleViewDetails(payslip)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="View">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                        {!payslip.isPaid && (
                          <button onClick={()=>handleMarkAsPaid(payslip.id)} className="p-2 hover:bg-[#eef3f9] rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="Mark Paid">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          </button>
                        )}
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
          {currentPayslips.map(payslip => (
            <div key={payslip.id} className="bg-white rounded-2xl border border-gray-100 hover:border-[#c3d2e9] hover:shadow-md transition-all p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-base">
                    {payslip.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{payslip.name}</p>
                    <p className="text-xs text-gray-400">{payslip.employeeId}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 ${statusColor(payslip.isPaid)}`}>
                  {payslip.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              <div className="space-y-1.5 mb-4 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{payslip.position}</p>
                <p className="text-xs text-gray-500">{payslip.department}</p>
                <p className="text-xs text-gray-400">Basic: ₵{payslip.basicSalary.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Allowances: ₵{payslip.allowances.toLocaleString()}</p>
                {payslip.isPaid && payslip.paymentDate && (
                  <p className="text-xs text-gray-400">Paid: {new Date(payslip.paymentDate).toLocaleDateString()}</p>
                )}
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Net Pay</p>
                  <p className="text-base font-bold text-[#2c4a6a]">₵{payslip.netPay.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>handleViewDetails(payslip)} className="flex items-center gap-1.5 px-3 py-2 bg-[#eef3f9] hover:bg-[#c3d2e9] text-[#2c4a6a] rounded-lg text-xs font-semibold transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    View
                  </button>
                  {!payslip.isPaid && (
                    <button onClick={()=>handleMarkAsPaid(payslip.id)} className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-xs font-semibold transition-all">
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredPayslips.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <svg className="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p className="text-gray-800 font-semibold mb-2">No payslips found</p>
          <p className="text-gray-500 text-sm mb-4">Adjust your filters or search term</p>
          <button onClick={()=>{setSearchTerm("");setFilterDepartment("All");setFilterPaymentStatus("All");}} className="text-[#2c4a6a] text-sm font-medium hover:underline">Clear filters</button>
        </div>
      )}

      {/* Pagination bottom */}
      {filteredPayslips.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">Page <b>{currentPage}</b> of <b>{totalPages}</b></p>
          <div className="flex items-center gap-1.5">
            <button onClick={()=>goTo(currentPage-1)} disabled={currentPage===1} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div className="hidden sm:flex gap-1">
              {pageNums().map((p,i)=> p==="..." ? <span key={i} className="w-9 flex items-center justify-center text-gray-400 text-sm">…</span> :
                <button key={p} onClick={()=>goTo(p as number)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage===p?"bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white":"text-gray-700 hover:bg-gray-100"}`}>{p}</button>
              )}
            </div>
            <button onClick={()=>goTo(currentPage+1)} disabled={currentPage===totalPages} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm text-gray-500">Go to</span>
            <input type="number" min={1} max={totalPages} defaultValue={currentPage} onBlur={e=>{const p=parseInt(e.target.value);if(p>=1&&p<=totalPages)goTo(p);}}
              className="w-14 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"/>
          </div>
        </div>
      )}

      {/* Detail Modal with Salary History Analysis */}
      {isDetailModalOpen && selectedPayslip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold">Payslip Analysis</h2>
                <p className="text-sm opacity-90">{selectedPayslip.employeeId} - {selectedPayslip.period}</p>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Employee Info */}
              <div className="bg-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/10">
                <h3 className="text-sm font-semibold text-[#2c4a6a] mb-3">Employee Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><p className="text-gray-600">Name</p><p className="font-medium text-gray-900">{selectedPayslip.name}</p></div>
                  <div><p className="text-gray-600">Employee ID</p><p className="font-medium text-gray-900">{selectedPayslip.employeeId}</p></div>
                  <div><p className="text-gray-600">Department</p><p className="font-medium text-gray-900">{selectedPayslip.department}</p></div>
                  <div><p className="text-gray-600">Position</p><p className="font-medium text-gray-900">{selectedPayslip.position}</p></div>
                </div>
              </div>

              {/* Current Month Breakdown */}
              <div className="bg-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/10">
                <h3 className="text-sm font-semibold text-[#2c4a6a] mb-3">Current Month - {selectedPayslip.period}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b"><span className="text-sm text-gray-600">Basic Salary</span><span className="text-sm font-semibold">₵{selectedPayslip.basicSalary.toLocaleString()}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-sm text-gray-600">Allowances</span><span className="text-sm font-semibold">₵{selectedPayslip.allowances.toLocaleString()}</span></div>
                  <div className="flex justify-between py-2 border-b bg-blue-50 px-3 rounded"><span className="text-sm font-medium">Gross Pay</span><span className="text-base font-bold text-[#2c4a6a]">₵{selectedPayslip.grossPay.toLocaleString()}</span></div>
                  <div className="flex justify-between py-2 border-b text-red-600"><span className="text-sm">Tax (10%)</span><span className="text-sm font-semibold">- ₵{selectedPayslip.taxAmount.toLocaleString()}</span></div>
                  <div className="flex justify-between py-2 border-b text-red-600"><span className="text-sm">SSNIT (5.5%)</span><span className="text-sm font-semibold">- ₵{selectedPayslip.ssnitAmount.toLocaleString()}</span></div>
                  <div className="flex justify-between py-2 border-b text-red-600"><span className="text-sm">Other</span><span className="text-sm font-semibold">- ₵{(selectedPayslip.deductions-selectedPayslip.taxAmount-selectedPayslip.ssnitAmount).toLocaleString()}</span></div>
                  <div className="flex justify-between py-3 bg-green-50 px-3 rounded"><span className="text-base font-bold">Net Pay</span><span className="text-xl font-bold text-green-600">₵{selectedPayslip.netPay.toLocaleString()}</span></div>
                </div>
              </div>

              {/* Salary History Table */}
              <div className="bg-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/10">
                <h3 className="text-sm font-semibold text-[#2c4a6a] mb-4">6-Month Salary History</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Period</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Gross</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Deductions</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Net</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedPayslip.salaryHistory.map((h,i)=>(
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">{h.month}</td>
                          <td className="px-4 py-3 text-sm text-right">₵{h.grossPay.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-right text-red-600">₵{h.deductions.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">₵{h.netPay.toLocaleString()}</td>
                          <td className="px-4 py-3 text-center"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Paid</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <div className="text-center"><p className="text-xs text-gray-500 mb-1">Avg Gross</p><p className="text-sm font-bold">₵{Math.round(selectedPayslip.salaryHistory.reduce((s,h)=>s+h.grossPay,0)/6).toLocaleString()}</p></div>
                  <div className="text-center"><p className="text-xs text-gray-500 mb-1">Avg Deductions</p><p className="text-sm font-bold text-red-600">₵{Math.round(selectedPayslip.salaryHistory.reduce((s,h)=>s+h.deductions,0)/6).toLocaleString()}</p></div>
                  <div className="text-center"><p className="text-xs text-gray-500 mb-1">Avg Net</p><p className="text-sm font-bold text-green-600">₵{Math.round(selectedPayslip.salaryHistory.reduce((s,h)=>s+h.netPay,0)/6).toLocaleString()}</p></div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end p-6 border-t">
              <button onClick={() => setIsDetailModalOpen(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Close</button>
              <button onClick={()=>alert("Downloading PDF...")} className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all">Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}