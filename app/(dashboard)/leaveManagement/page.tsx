"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface LeaveRequest {
  id: string;
  employeeId: string;
  profileImage: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: string;
  appliedDate: string;
  approvedBy: string | null;
  approvedDate: string | null;
}

const generateLeaveRequests = () => {
  const names = [
    "John Mensah", "Abena Osei", "Kwame Boateng", "Ama Asante", "Kofi Owusu",
    "Yaw Agyeman", "Akosua Frimpong", "Kwesi Darko", "Adjoa Amponsah", "Fiifi Atta",
    "Esi Badu", "Kojo Ansah", "Adwoa Sarpong", "Kwabena Manu", "Afua Opoku",
    "Yaa Kyei", "Kwaku Mensah", "Abena Adomako", "Kofi Asare", "Ama Boateng",
    "Kwame Ofori", "Akua Bonsu", "Yaw Frimpong", "Adjoa Owusu", "Kwesi Agyei",
    "Esi Appiah", "Kojo Baah", "Adwoa Konadu", "Kwabena Osei", "Afua Agyeman"
  ];
  const departments = ["Engineering", "HR", "Sales", "Management", "Support", "Finance", "Marketing", "Operations"];
  const leaveTypes  = ["Annual Leave", "Sick Leave", "Emergency Leave", "Maternity Leave", "Paternity Leave", "Unpaid Leave"];
  const statuses    = ["Approved", "Pending", "Rejected"];
  const requests    = [];

  for (let i = 1; i <= 1000; i++) {
    const name       = names[Math.floor(Math.random() * names.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const leaveType  = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
    const status     = statuses[Math.floor(Math.random() * statuses.length)];
    const startMonth = Math.floor(Math.random() * 12) + 1;
    const startDay   = Math.floor(Math.random() * 28) + 1;
    const totalDays  = Math.floor(Math.random() * 20) + 1;
    const startDate  = `2025-${String(startMonth).padStart(2,'0')}-${String(startDay).padStart(2,'0')}`;
    const endDate    = `2025-${String(startMonth).padStart(2,'0')}-${String(startDay + totalDays).padStart(2,'0')}`;

    requests.push({
      id: `LR${String(i).padStart(4,'0')}`,
      employeeId: `EMP${String(i).padStart(4,'0')}`,
      profileImage: `/profiles/employee${(i % 4) + 1}.jpg`,
      employeeName: name,
      department,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason: ["Family vacation","Medical appointment","Personal matters","Family emergency","Wedding ceremony","House relocation"][Math.floor(Math.random()*6)],
      status,
      appliedDate: `2025-${String(startMonth).padStart(2,'0')}-${String(Math.max(1,startDay-3)).padStart(2,'0')}`,
      approvedBy:   status !== "Pending" ? ["Sarah Johnson","Michael Owusu","Peter Adu"][Math.floor(Math.random()*3)] : null,
      approvedDate: status !== "Pending" ? `2025-${String(startMonth).padStart(2,'0')}-${String(Math.max(1,startDay-1)).padStart(2,'0')}` : null,
    });
  }
  return requests;
};

const initialLeaveRequests = generateLeaveRequests();

export default function LeaveManagementPage() {
  const [leaveRequests, setLeaveRequests]         = useState(initialLeaveRequests);
  const [filteredRequests, setFilteredRequests]   = useState(initialLeaveRequests);
  const [selectedRequest, setSelectedRequest]     = useState<LeaveRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalStatus, setModalStatus]             = useState<string>("");   // local status inside modal
  const [filterStatus, setFilterStatus]           = useState("All");
  const [filterType, setFilterType]               = useState("All");
  const [searchTerm, setSearchTerm]               = useState("");
  const [notification, setNotification]           = useState<{ type: string; message: string } | null>(null);
  const [sortBy, setSortBy]                       = useState("date");
  const [viewMode, setViewMode]                   = useState<"cards" | "list">("list");
  const [currentPage, setCurrentPage]             = useState(1);
  const [itemsPerPage, setItemsPerPage]           = useState(20);

  const leaveTypes   = ["Annual Leave","Sick Leave","Emergency Leave","Maternity Leave","Paternity Leave","Unpaid Leave"];
  const STATUSES     = ["All","Approved","Pending","Rejected"];
  const ALL_STATUSES = ["Pending","Approved","Rejected"];

  useEffect(() => {
    const newLeaveData = sessionStorage.getItem('newLeaveRequest');
    if (newLeaveData) {
      try {
        const newRequest = JSON.parse(newLeaveData);
        setLeaveRequests(prev => [newRequest, ...prev]);
        showNotification('success', `Request for ${newRequest.totalDays} days has been created successfully.`);
        sessionStorage.removeItem('newLeaveRequest');
      } catch (error) {
        console.error('Error processing new leave request:', error);
      }
    }
  }, []);

  useEffect(() => {
    let result = [...leaveRequests];
    if (searchTerm)             result = result.filter(req => req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || req.id.toLowerCase().includes(searchTerm.toLowerCase()) || req.employeeId.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus !== "All") result = result.filter(req => req.status === filterStatus);
    if (filterType   !== "All") result = result.filter(req => req.leaveType === filterType);
    if (sortBy === "date") result.sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    if (sortBy === "name") result.sort((a,b) => a.employeeName.localeCompare(b.employeeName));
    if (sortBy === "days") result.sort((a,b) => b.totalDays - a.totalDays);
    setFilteredRequests(result);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterType, sortBy, leaveRequests]);

  const totalPages      = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex      = (currentPage - 1) * itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const showNotification = (type: string, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Open view modal and seed local status picker
  const openView = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setModalStatus(request.status);
    setIsDetailModalOpen(true);
  };

  const openDelete = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsDeleteModalOpen(true);
  };

  // Save status change from modal
  const handleSaveStatus = () => {
    if (!selectedRequest || modalStatus === selectedRequest.status) {
      setIsDetailModalOpen(false);
      return;
    }
    const updated = {
      ...selectedRequest,
      status: modalStatus,
      approvedBy:   modalStatus !== "Pending" ? "Current User" : null,
      approvedDate: modalStatus !== "Pending" ? new Date().toISOString().split('T')[0] : null,
    };
    setLeaveRequests(prev => prev.map(r => r.id === selectedRequest.id ? updated : r));
    setSelectedRequest(updated);
    setIsDetailModalOpen(false);
    showNotification('success', `Status updated to "${modalStatus}" successfully.`);
  };

  const handleDeleteRequest = () => {
    if (!selectedRequest) return;
    setLeaveRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    setIsDeleteModalOpen(false);
    if (isDetailModalOpen) setIsDetailModalOpen(false);
    setSelectedRequest(null);
    showNotification('success', `Leave request ${selectedRequest.id} has been deleted.`);
  };

  const handleApprove = (requestId: string) => {
    setLeaveRequests(prev => prev.map(r =>
      r.id === requestId ? { ...r, status: "Approved", approvedBy: "Current User", approvedDate: new Date().toISOString().split('T')[0] } : r
    ));
    showNotification('success', 'Leave request approved successfully.');
  };

  const handleReject = (requestId: string) => {
    setLeaveRequests(prev => prev.map(r =>
      r.id === requestId ? { ...r, status: "Rejected", approvedBy: "Current User", approvedDate: new Date().toISOString().split('T')[0] } : r
    ));
    showNotification('success', 'Leave request rejected.');
  };

  const pageNums = () => {
    const p: (number|string)[] = [];
    if (totalPages <= 7) { for (let i=1;i<=totalPages;i++) p.push(i); }
    else if (currentPage <= 4) { for (let i=1;i<=5;i++) p.push(i); p.push("..."); p.push(totalPages); }
    else if (currentPage >= totalPages-3) { p.push(1); p.push("..."); for (let i=totalPages-4;i<=totalPages;i++) p.push(i); }
    else { p.push(1); p.push("..."); for (let i=currentPage-1;i<=currentPage+1;i++) p.push(i); p.push("..."); p.push(totalPages); }
    return p;
  };

  const goTo = (n: number) => { setCurrentPage(n); window.scrollTo({top:0,behavior:"smooth"}); };

  const statusColors = {
    Approved: "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]",
    Pending:  "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]",
    Rejected: "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]",
  };

  const getStatusColor = (status: string) => statusColors[status as keyof typeof statusColors] ?? "bg-gray-100 text-gray-700 border-gray-200";

  // ─── Reusable action buttons ───────────────────────────────────────────────
  const ActionButtons = ({ request, compact = false }: { request: LeaveRequest; compact?: boolean }) => (
    <div className={`flex items-center gap-2 ${compact ? "justify-end" : "flex-wrap"}`}>
      {/* View */}
      <button
        onClick={() => openView(request)}
        title="View details"
        className={`${compact ? "p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-[#2c4a6a]" : "flex items-center gap-1.5 px-3 py-2 bg-[#eef3f9] hover:bg-[#c3d2e9] text-[#2c4a6a] rounded-lg text-xs font-semibold"} transition-colors`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        {!compact && <span>View</span>}
      </button>

      {/* Approve — Pending only */}
      {request.status === "Pending" && (
        <button
          onClick={() => handleApprove(request.id)}
          title="Approve"
          className={`${compact ? "p-2 hover:bg-[#d4e1ed] rounded-lg text-gray-600 hover:text-[#2c4a6a]" : "flex items-center gap-1.5 px-3 py-2 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-lg text-xs font-semibold"} transition-colors`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
          {!compact && <span>Approve</span>}
        </button>
      )}

      {/* Reject — Pending only */}
      {request.status === "Pending" && (
        <button
          onClick={() => handleReject(request.id)}
          title="Reject"
          className={`${compact ? "p-2 hover:bg-[#bfcfde] rounded-lg text-gray-600 hover:text-[#1e3147]" : "flex items-center gap-1.5 px-3 py-2 bg-[#bfcfde] hover:bg-[#96b3cc] text-[#1e3147] rounded-lg text-xs font-semibold"} transition-colors`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
          {!compact && <span>Reject</span>}
        </button>
      )}

      {/* Delete */}
      <button
        onClick={() => openDelete(request)}
        title="Delete"
        className={`${compact ? "p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500" : "flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-lg text-xs font-semibold"} transition-colors`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        {!compact && <span>Delete</span>}
      </button>
    </div>
  );

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">

      {/* Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] bg-[#2c4a6a] text-white px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-1">Leave Management</h1>
        <p className="text-sm text-gray-600">Manage employee leave requests and approvals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Requests", value: leaveRequests.length,                                  sub: "All time generated"   },
          { label: "Approved",       value: leaveRequests.filter(r=>r.status==="Approved").length, sub: "Confirmed requests"   },
          { label: "Pending",        value: leaveRequests.filter(r=>r.status==="Pending").length,  sub: "Awaiting approval"    },
          { label: "Showing",        value: filteredRequests.length,                               sub: "From current filters" },
        ].map(c => (
          <div key={c.label} className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5 hover:scale-[1.02] transition-all">
            <p className="text-xs text-white/70 mb-1 font-medium">{c.label}</p>
            <p className="text-3xl font-extrabold text-white">{c.value.toLocaleString()}</p>
            <p className="text-xs text-white/50 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            <div className="relative flex-1 lg:max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" placeholder="Search name, ID..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"/>
            </div>
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              {STATUSES.map(s=><option key={s} value={s}>{s==="All"?"All Status":s}</option>)}
            </select>
            <select value={filterType} onChange={e=>setFilterType(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="All">All Leave Types</option>
              {leaveTypes.map(type=><option key={type} value={type}>{type}</option>)}
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="days">Sort by Days</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button onClick={()=>setViewMode("cards")} className={`p-2 rounded-md transition-all ${viewMode==="cards"?"bg-white text-[#2c4a6a] shadow-sm":"text-gray-500 hover:text-gray-700"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              </button>
              <button onClick={()=>setViewMode("list")} className={`p-2 rounded-md transition-all ${viewMode==="list"?"bg-white text-[#2c4a6a] shadow-sm":"text-gray-500 hover:text-gray-700"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
            </div>
            <Link href="/leaveManagement/createleave">
              <button className="bg-[#2c4a6a] hover:bg-[#1e3147] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                Create Leave
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Pagination top */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{startIndex+1}</span>–
          <span className="font-semibold text-gray-900">{Math.min(startIndex+itemsPerPage,filteredRequests.length)}</span> of{" "}
          <span className="font-semibold text-gray-900">{filteredRequests.length}</span> requests
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show</span>
          <select value={itemsPerPage} onChange={e=>{setItemsPerPage(Number(e.target.value));setCurrentPage(1);}} className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
            {[10,20,50,100].map(n=><option key={n}>{n}</option>)}
          </select>
          <span className="text-sm text-gray-500">per page</span>
        </div>
      </div>

      {/* CARDS VIEW */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
          {currentRequests.map(request => (
            <div key={request.id} className="bg-white rounded-2xl border border-gray-100 hover:border-[#c3d2e9] hover:shadow-md transition-all p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex-shrink-0 overflow-hidden relative">
                    <Image src={request.profileImage} alt={request.employeeName} fill className="object-cover"/>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{request.employeeName}</p>
                    <p className="text-xs text-gray-400">{request.employeeId}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 ${getStatusColor(request.status)}`}>{request.status}</span>
              </div>
              <div className="space-y-1.5 mb-4 flex-1">
                <p className="text-sm font-medium text-gray-800">{request.leaveType}</p>
                <p className="text-xs text-gray-500">{request.department}</p>
                <p className="text-xs text-gray-400">{request.startDate} → {request.endDate}</p>
                <p className="text-xs text-gray-400 italic truncate">"{request.reason}"</p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-0.5">Total Days</p>
                    <p className="text-base font-bold text-[#2c4a6a]">{request.totalDays} days</p>
                  </div>
                </div>
                <ActionButtons request={request} compact={false} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentRequests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex-shrink-0 overflow-hidden relative">
                          <Image src={request.profileImage} alt={request.employeeName} fill className="object-cover"/>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{request.employeeName}</p>
                          <p className="text-xs text-gray-400">{request.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{request.leaveType}</p>
                      <p className="text-xs text-gray-400">{request.department}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{request.startDate}</p>
                      <p className="text-xs text-gray-400">to {request.endDate}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-bold text-[#2c4a6a]">{request.totalDays} days</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>{request.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionButtons request={request} compact={true} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              {pageNums().map((p, i) =>
                p === "..."
                  ? <span key={`ellipsis-${i}`} className="w-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                  : <button key={`page-${p}`} onClick={()=>goTo(p as number)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage===p?"bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white":"text-gray-700 hover:bg-gray-100"}`}>{p}</button>
              )}
            </div>
            <button onClick={()=>goTo(currentPage+1)} disabled={currentPage===totalPages} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm text-gray-500">Go to</span>
            <input type="number" min={1} max={totalPages} defaultValue={currentPage}
              onBlur={e=>{const p=parseInt(e.target.value);if(p>=1&&p<=totalPages)goTo(p);}}
              className="w-14 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"/>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <svg className="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p className="text-gray-800 font-semibold mb-2">No leave requests found</p>
          <p className="text-gray-500 text-sm mb-4">Adjust your filters or search term</p>
          <button onClick={()=>{setSearchTerm("");setFilterStatus("All");setFilterType("All");}} className="text-[#2c4a6a] text-sm font-medium hover:underline">Clear filters</button>
        </div>
      )}

      {/* ══ VIEW / DETAIL MODAL ═══════════════════════════════════════════════ */}
      {isDetailModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-lg shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0 ring-2 ring-white/30">
                  <Image src={selectedRequest.profileImage} alt={selectedRequest.employeeName} fill className="object-cover"/>
                </div>
                <div>
                  <p className="text-base font-bold text-white leading-tight">{selectedRequest.employeeName}</p>
                  <p className="text-xs text-white/60">{selectedRequest.id} · {selectedRequest.employeeId}</p>
                </div>
              </div>
              <button onClick={()=>setIsDetailModalOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Department",  value: selectedRequest.department  },
                  { label: "Leave Type",  value: selectedRequest.leaveType   },
                  { label: "Start Date",  value: selectedRequest.startDate   },
                  { label: "End Date",    value: selectedRequest.endDate     },
                  { label: "Applied On",  value: selectedRequest.appliedDate },
                  { label: "Total Days",  value: `${selectedRequest.totalDays} days` },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
                <div className="col-span-2 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-0.5">Reason</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedRequest.reason}</p>
                </div>
              </div>

              {/* ── Status updater ── */}
              <div className="border border-[#c3d2e9] rounded-xl p-4 bg-[#f4f8fb]">
                <p className="text-xs font-bold text-[#2c4a6a] uppercase tracking-wider mb-3">Update Status</p>
                <div className="flex gap-2">
                  {ALL_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => setModalStatus(s)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        modalStatus === s
                          ? s === "Approved"
                            ? "bg-[#2c4a6a] text-white border-[#2c4a6a]"
                            : s === "Rejected"
                            ? "bg-[#1e3147] text-white border-[#1e3147]"
                            : "bg-[#6b8ca3] text-white border-[#6b8ca3]"
                          : "bg-white text-gray-500 border-gray-200 hover:border-[#a8c5db] hover:text-[#2c4a6a]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {modalStatus !== selectedRequest.status && (
                  <p className="text-xs text-[#4a6b8a] mt-2.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Status will change from <span className="font-semibold">{selectedRequest.status}</span> to <span className="font-semibold">{modalStatus}</span>
                  </p>
                )}
              </div>

              {/* Approval info if set */}
              {selectedRequest.approvedBy && (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span>
                    {selectedRequest.status === "Rejected" ? "Rejected" : "Approved"} by{" "}
                    <span className="font-semibold text-gray-700">{selectedRequest.approvedBy}</span> on {selectedRequest.approvedDate}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
              <button
                onClick={() => { setIsDetailModalOpen(false); openDelete(selectedRequest); }}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-xl text-sm font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveStatus}
                  disabled={modalStatus === selectedRequest.status}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM MODAL ══════════════════════════════════════════════ */}
      {isDeleteModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-[#1e3147] to-[#2c4a6a] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Delete Request</h2>
                  <p className="text-sm text-white/70">{selectedRequest.id}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-[#e8eef4] border border-[#c3d2e9] rounded-xl p-4 mb-5">
                <p className="text-sm text-[#1e3147] font-medium">⚠️ This action cannot be undone</p>
                <p className="text-xs text-[#2c4a6a] mt-1">The leave request will be permanently deleted.</p>
              </div>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete the leave request for{" "}
                <span className="font-semibold text-gray-900">{selectedRequest.employeeName}</span>?
                This covers <span className="font-semibold">{selectedRequest.totalDays} days</span> of {selectedRequest.leaveType}.
              </p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={()=>{setIsDeleteModalOpen(false);setSelectedRequest(null);}}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDeleteRequest}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:opacity-90 rounded-xl text-sm font-semibold text-white transition-all">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}