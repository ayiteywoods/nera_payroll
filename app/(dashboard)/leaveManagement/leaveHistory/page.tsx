"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

// Generate sample leave history for an employee
const generateEmployeeLeaveHistory = (employeeId: string, employeeName: string) => {
  const leaveTypes = ["Annual Leave", "Sick Leave", "Emergency Leave", "Maternity Leave", "Paternity Leave", "Unpaid Leave"];
  const statuses = ["Approved", "Pending", "Rejected"];
  const reasons = ["Family vacation", "Medical appointment", "Personal matters", "Family emergency", "Wedding ceremony", "House relocation", "Medical treatment", "Child care", "Home renovation"];
  
  const history = [];
  
  // Generate requests from 2020 to 2025
  for (let year = 2020; year <= 2025; year++) {
    const requestsInYear = Math.floor(Math.random() * 8) + 3; // 3-10 requests per year
    
    for (let i = 0; i < requestsInYear; i++) {
      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      const totalDays = Math.floor(Math.random() * 15) + 1;
      const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
      const status = year < 2025 ? statuses[Math.floor(Math.random() * 2)] : statuses[Math.floor(Math.random() * statuses.length)]; // More approved in past years
      
      const startDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const endDay = day + totalDays;
      const endMonth = endDay > 28 ? month + 1 : month;
      const endDate = `${year}-${String(endMonth).padStart(2, '0')}-${String(endDay > 28 ? endDay - 28 : endDay).padStart(2, '0')}`;
      
      history.push({
        id: `LR${year}${String(month).padStart(2, '0')}${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
        employeeId: employeeId,
        employeeName: employeeName,
        department: "Engineering",
        leaveType: leaveType,
        startDate: startDate,
        endDate: endDate,
        totalDays: totalDays,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        status: status,
        appliedDate: `${year}-${String(month).padStart(2, '0')}-${String(Math.max(1, day - 5)).padStart(2, '0')}`,
        approvedBy: status !== "Pending" ? ["Sarah Johnson", "Michael Owusu", "Peter Adu"][Math.floor(Math.random() * 3)] : null,
        approvedDate: status !== "Pending" ? `${year}-${String(month).padStart(2, '0')}-${String(Math.max(1, day - 2)).padStart(2, '0')}` : null,
        year: year
      });
    }
  }
  
  return history.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
};

export default function EmployeeLeaveHistoryPage() {
  // Sample employee data - in real app, this would come from route params or props
  const employeeData = {
    id: "EMP0042",
    name: "Kwame Boateng",
    department: "Engineering",
    position: "Senior Developer",
    joinDate: "2019-03-15",
    profileImage: "/profiles/employee1.jpg"
  };

  const [leaveHistory] = useState(generateEmployeeLeaveHistory(employeeData.id, employeeData.name));
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Get unique years
  const availableYears = useMemo(() => {
    const years = [...new Set(leaveHistory.map(req => req.year))].sort().reverse();
    return years;
  }, [leaveHistory]);

  const leaveTypes = ["Annual Leave", "Sick Leave", "Emergency Leave", "Maternity Leave", "Paternity Leave", "Unpaid Leave"];

  // Filter requests
  const filteredRequests = useMemo(() => {
    let filtered = [...leaveHistory];

    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedYear !== "All") {
      filtered = filtered.filter(req => req.year === parseInt(selectedYear));
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter(req => req.status === selectedStatus);
    }

    if (selectedType !== "All") {
      filtered = filtered.filter(req => req.leaveType === selectedType);
    }

    return filtered;
  }, [leaveHistory, searchTerm, selectedYear, selectedStatus, selectedType]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedYear, selectedStatus, selectedType]);

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
      case "Approved": return "bg-[#2c4a6a]/10 text-[#2c4a6a] border-[#2c4a6a]/30";
      case "Pending": return "bg-gray-100 text-gray-700 border-gray-200";
      case "Rejected": return "bg-gray-200 text-gray-600 border-gray-300";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDays = leaveHistory.filter(r => r.status === "Approved").reduce((sum, r) => sum + r.totalDays, 0);
    const thisYear = leaveHistory.filter(r => r.year === new Date().getFullYear());
    const thisYearApproved = thisYear.filter(r => r.status === "Approved");
    const thisYearDays = thisYearApproved.reduce((sum, r) => sum + r.totalDays, 0);
    
    return {
      totalRequests: leaveHistory.length,
      totalApproved: leaveHistory.filter(r => r.status === "Approved").length,
      totalDays: totalDays,
      thisYearDays: thisYearDays,
      pending: leaveHistory.filter(r => r.status === "Pending").length
    };
  }, [leaveHistory]);

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/leave" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#153453]">Leave History</h1>
            <p className="text-sm text-gray-600 mt-1">Complete leave record for {employeeData.name}</p>
          </div>
        </div>

        {/* Employee Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
              <img src={employeeData.profileImage} alt="" className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              <span>KB</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">{employeeData.name}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                <span>{employeeData.id}</span>
                <span>•</span>
                <span>{employeeData.position}</span>
                <span>•</span>
                <span>{employeeData.department}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Joined</p>
              <p className="text-sm font-semibold text-gray-900">{new Date(employeeData.joinDate).toLocaleDateString("en-GB", {day: "numeric", month: "short", year: "numeric"})}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
          <p className="text-xs text-white/70 mb-1">Total Requests</p>
          <p className="text-3xl font-bold text-white">{stats.totalRequests}</p>
          <p className="text-xs text-white/50 mt-1">All time</p>
        </div>
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
          <p className="text-xs text-white/70 mb-1">Approved</p>
          <p className="text-3xl font-bold text-white">{stats.totalApproved}</p>
          <p className="text-xs text-white/50 mt-1">Confirmed</p>
        </div>
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
          <p className="text-xs text-white/70 mb-1">Total Days</p>
          <p className="text-3xl font-bold text-white">{stats.totalDays}</p>
          <p className="text-xs text-white/50 mt-1">Leave taken</p>
        </div>
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
          <p className="text-xs text-white/70 mb-1">This Year</p>
          <p className="text-3xl font-bold text-white">{stats.thisYearDays}</p>
          <p className="text-xs text-white/50 mt-1">Days in 2025</p>
        </div>
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
          <p className="text-xs text-white/70 mb-1">Showing</p>
          <p className="text-3xl font-bold text-white">{filteredRequests.length}</p>
          <p className="text-xs text-white/50 mt-1">From filters</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            <div className="relative flex-1 lg:max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Search ID, type, reason..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"/>
            </div>
            <select value={selectedYear} onChange={e=>setSelectedYear(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="All">All Years</option>
              {availableYears.map(y=><option key={y} value={y}>{y}</option>)}
            </select>
            <select value={selectedStatus} onChange={e=>setSelectedStatus(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="All">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select value={selectedType} onChange={e=>setSelectedType(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="All">All Types</option>
              {leaveTypes.map(t=><option key={t} value={t}>{t}</option>)}
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
          </div>
        </div>
      </div>

      {/* Pagination top */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{startIndex+1}</span>–<span className="font-semibold text-gray-900">{Math.min(startIndex+itemsPerPage,filteredRequests.length)}</span> of <span className="font-semibold text-gray-900">{filteredRequests.length}</span> requests
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Period</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Applied</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentRequests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">{req.id}</p>
                      <p className="text-xs text-gray-500">{req.year}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{req.leaveType}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{req.startDate} to {req.endDate}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2c4a6a]/10 text-[#2c4a6a] font-bold text-sm">
                        {req.totalDays}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{req.appliedDate}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button onClick={() => { setSelectedRequest(req); setIsDetailModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
          {currentRequests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 hover:border-[#c3d2e9] hover:shadow-md transition-all p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{req.id}</p>
                  <p className="text-xs text-gray-400">{req.year}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusColor(req.status)}`}>
                  {req.status}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-gray-800">{req.leaveType}</p>
                <p className="text-xs text-gray-500">{req.startDate} to {req.endDate}</p>
                <p className="text-xs text-gray-400">Applied: {req.appliedDate}</p>
                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-1">Reason:</p>
                  <p className="text-xs text-gray-700">{req.reason}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Total Days</p>
                  <p className="text-base font-bold text-[#2c4a6a]">{req.totalDays} days</p>
                </div>
                <button onClick={() => { setSelectedRequest(req); setIsDetailModalOpen(true); }} className="px-3 py-2 bg-[#eef3f9] hover:bg-[#c3d2e9] text-[#2c4a6a] rounded-lg text-xs font-semibold transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <svg className="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-800 font-semibold mb-2">No leave requests found</p>
          <p className="text-gray-500 text-sm mb-4">Adjust your filters or search term</p>
          <button onClick={()=>{setSearchTerm("");setSelectedYear("All");setSelectedStatus("All");setSelectedType("All");}} className="text-[#2c4a6a] text-sm font-medium hover:underline">Clear filters</button>
        </div>
      )}

      {/* Pagination bottom */}
      {filteredRequests.length > 0 && (
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
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold">Leave Request Details</h2>
                <p className="text-sm opacity-90">{selectedRequest.id}</p>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/10">
                <h3 className="text-sm font-semibold text-[#2c4a6a] mb-3">Leave Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-600">Leave Type</p><p className="font-medium text-gray-900">{selectedRequest.leaveType}</p></div>
                  <div><p className="text-gray-600">Total Days</p><p className="font-bold text-[#2c4a6a] text-lg">{selectedRequest.totalDays} days</p></div>
                  <div><p className="text-gray-600">Start Date</p><p className="font-medium text-gray-900">{selectedRequest.startDate}</p></div>
                  <div><p className="text-gray-600">End Date</p><p className="font-medium text-gray-900">{selectedRequest.endDate}</p></div>
                  <div><p className="text-gray-600">Status</p><span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedRequest.status)}`}>{selectedRequest.status}</span></div>
                  <div><p className="text-gray-600">Applied Date</p><p className="font-medium text-gray-900">{selectedRequest.appliedDate}</p></div>
                  <div className="col-span-2"><p className="text-gray-600 mb-1">Reason</p><p className="font-medium text-gray-900">{selectedRequest.reason}</p></div>
                </div>
              </div>
              {selectedRequest.approvedBy && (
                <div className="bg-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/10">
                  <h3 className="text-sm font-semibold text-[#2c4a6a] mb-3">Approval Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-gray-600">{selectedRequest.status === "Rejected" ? "Rejected By" : "Approved By"}</p><p className="font-medium text-gray-900">{selectedRequest.approvedBy}</p></div>
                    <div><p className="text-gray-600">Date</p><p className="font-medium text-gray-900">{selectedRequest.approvedDate}</p></div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end p-6 border-t">
              <button onClick={() => setIsDetailModalOpen(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}