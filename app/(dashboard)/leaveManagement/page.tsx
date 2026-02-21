"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Generate 1000 sample leave requests
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
  const leaveTypes = ["Annual Leave", "Sick Leave", "Emergency Leave", "Maternity Leave", "Paternity Leave", "Unpaid Leave"];
  const statuses = ["Approved", "Pending", "Rejected"];
  
  const requests = [];
  
  for (let i = 1; i <= 1000; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const startMonth = Math.floor(Math.random() * 12) + 1;
    const startDay = Math.floor(Math.random() * 28) + 1;
    const totalDays = Math.floor(Math.random() * 20) + 1;
    
    const startDate = `2025-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
    const endDay = startDay + totalDays;
    const endDate = `2025-${String(startMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;
    
    requests.push({
      id: `LR${String(i).padStart(4, '0')}`,
      employeeId: `EMP${String(i).padStart(4, '0')}`,
      employeeName: name,
      department: department,
      leaveType: leaveType,
      startDate: startDate,
      endDate: endDate,
      totalDays: totalDays,
      reason: ["Family vacation", "Medical appointment", "Personal matters", "Family emergency", "Wedding ceremony", "House relocation"][Math.floor(Math.random() * 6)],
      status: status,
      appliedDate: `2025-${String(startMonth).padStart(2, '0')}-${String(Math.max(1, startDay - 3)).padStart(2, '0')}`,
      approvedBy: status !== "Pending" ? ["Sarah Johnson", "Michael Owusu", "Peter Adu"][Math.floor(Math.random() * 3)] : null,
      approvedDate: status !== "Pending" ? `2025-${String(startMonth).padStart(2, '0')}-${String(Math.max(1, startDay - 1)).padStart(2, '0')}` : null,
    });
  }
  
  return requests;
};

const initialLeaveRequests = generateLeaveRequests();

export default function LeaveManagementPage() {
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [filteredRequests, setFilteredRequests] = useState(initialLeaveRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const leaveTypes = ["Annual Leave", "Sick Leave", "Emergency Leave", "Maternity Leave", "Paternity Leave", "Unpaid Leave"];

  // Check for new leave request from session storage
  useEffect(() => {
    const newLeaveData = sessionStorage.getItem('newLeaveRequest');
    if (newLeaveData) {
      try {
        const newRequest = JSON.parse(newLeaveData);
        setLeaveRequests(prev => [newRequest, ...prev]);
        
        setNotification({
          type: 'success',
          title: 'Leave Request Submitted ✓',
          message: `Request for ${newRequest.totalDays} days has been created successfully.`,
        });

        setTimeout(() => setNotification(null), 5000);
        sessionStorage.removeItem('newLeaveRequest');
      } catch (error) {
        console.error('Error processing new leave request:', error);
      }
    }
  }, []);

  // Filter logic
  React.useEffect(() => {
    let result = [...leaveRequests];

    if (searchTerm) {
      result = result.filter(req => 
        req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "All") {
      result = result.filter(req => req.status === filterStatus);
    }

    if (filterType !== "All") {
      result = result.filter(req => req.leaveType === filterType);
    }

    setFilteredRequests(result);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterType, leaveRequests]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch(status) {
      case "Approved": return "bg-[#2c4a6a]/10 text-[#2c4a6a] border-[#2c4a6a]/30";
      case "Pending": return "bg-gray-100 text-gray-700 border-gray-200";
      case "Rejected": return "bg-gray-200 text-gray-600 border-gray-300";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getLeaveTypeIcon = (type) => {
    switch(type) {
      case "Annual Leave":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />;
      case "Sick Leave":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />;
      case "Emergency Leave":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />;
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
    }
  };

  const handleGetDetails = (request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleDeleteRequest = () => {
    setLeaveRequests(leaveRequests.filter(req => req.id !== selectedRequest.id));
    setIsDeleteModalOpen(false);
    setSelectedRequest(null);
    
    setNotification({
      type: 'success',
      title: 'Request Deleted',
      message: `Leave request ${selectedRequest.id} has been deleted.`,
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApproveRequest = (requestId) => {
    setLeaveRequests(leaveRequests.map(req => 
      req.id === requestId 
        ? { ...req, status: "Approved", approvedBy: "Current User", approvedDate: new Date().toISOString().split('T')[0] }
        : req
    ));
    
    setNotification({
      type: 'success',
      title: 'Request Approved ✓',
      message: `Leave request has been approved successfully.`,
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRejectRequest = (requestId) => {
    setLeaveRequests(leaveRequests.map(req => 
      req.id === requestId 
        ? { ...req, status: "Rejected", approvedBy: "Current User", approvedDate: new Date().toISOString().split('T')[0] }
        : req
    ));
    
    setNotification({
      type: 'success',
      title: 'Request Rejected',
      message: `Leave request has been rejected.`,
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      
      {/* Notification */}
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
              <svg className="w-6 h-6 text-[#2c4a6a]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-[#2c4a6a]">{notification.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-2">Leave Management</h1>
            <p className="text-sm text-gray-600">Manage employee leave requests and approvals</p>
          </div>
          <Link
            href="/leaveManagement/createleave"
            className="px-5 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Leave Request
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
          <h3 className="text-sm font-medium text-white/70 mb-2">Total Requests</h3>
          <p className="text-2xl md:text-3xl font-bold text-white">{leaveRequests.length}</p>
          <p className="text-xs text-white/50 mt-1">All time generated</p>
        </div>

        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
          <h3 className="text-sm font-medium text-white/70 mb-2">Approved Leaves</h3>
          <p className="text-2xl md:text-3xl font-bold text-white">{leaveRequests.filter(r => r.status === "Approved").length}</p>
          <p className="text-xs text-white/50 mt-1">Confirmed requests</p>
        </div>

        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
          <h3 className="text-sm font-medium text-white/70 mb-2">Pending Review</h3>
          <p className="text-2xl md:text-3xl font-bold text-white">{leaveRequests.filter(r => r.status === "Pending").length}</p>
          <p className="text-xs text-white/50 mt-1">Awaiting approval</p>
        </div>

        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
          <h3 className="text-sm font-medium text-white/70 mb-2">Rejected</h3>
          <p className="text-2xl md:text-3xl font-bold text-white">{leaveRequests.filter(r => r.status === "Rejected").length}</p>
          <p className="text-xs text-white/50 mt-1">Declined requests</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          
          {/* Search */}
          <div className="relative flex-1 w-full lg:max-w-xs">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? "bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Leave Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white"
          >
            <option value="All">All Leave Types</option>
            {leaveTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leave Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        {currentRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow p-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-semibold text-lg">
                  {request.employeeName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{request.employeeName}</h3>
                  <p className="text-xs text-gray-500">{request.employeeId} • {request.department}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>

            {/* Leave Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-[#2c4a6a]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {getLeaveTypeIcon(request.leaveType)}
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Leave Type</p>
                  <p className="font-medium text-gray-900">{request.leaveType}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-[#2c4a6a]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900">{request.startDate} to {request.endDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-[#2c4a6a]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Total Days</p>
                  <p className="font-bold text-[#2c4a6a] text-lg">{request.totalDays} days</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Reason</p>
                <p className="text-sm text-gray-700">{request.reason}</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={() => handleGetDetails(request)}
                  className="p-2 hover:bg-[#2c4a6a]/10 rounded-lg transition-colors"
                  title="View Details"
                >
                  <svg className="w-5 h-5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <Link
                  href="/leaveManagement/leaveHistory"
                  className="p-2 hover:bg-[#2c4a6a]/10 rounded-lg transition-colors"
                  title="View History"
                >
                  <svg className="w-5 h-5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
                <button
                  onClick={() => {
                    setSelectedRequest(request);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              {request.status === "Pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveRequest(request.id)}
                    className="px-3 py-1.5 bg-[#2c4a6a]/10 hover:bg-[#2c4a6a]/20 text-[#2c4a6a] rounded-lg text-xs font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No leave requests found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or create a new request</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("All");
              setFilterType("All");
            }}
            className="text-[#2c4a6a] hover:underline text-sm font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
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

      {/* Details Modal */}
      {isDetailModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold">Leave Request Details</h2>
                <p className="text-sm opacity-90">{selectedRequest.id}</p>
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

            <div className="p-6 space-y-5">
              <div className="bg-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/10">
                <h3 className="text-sm font-semibold text-[#2c4a6a] mb-3">Employee Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{selectedRequest.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Employee ID</p>
                    <p className="font-medium text-gray-900">{selectedRequest.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Department</p>
                    <p className="font-medium text-gray-900">{selectedRequest.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/10">
                <h3 className="text-sm font-semibold text-[#2c4a6a] mb-3">Leave Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Leave Type</p>
                    <p className="font-medium text-gray-900">{selectedRequest.leaveType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Days</p>
                    <p className="font-bold text-[#2c4a6a] text-lg">{selectedRequest.totalDays} days</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Start Date</p>
                    <p className="font-medium text-gray-900">{selectedRequest.startDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">End Date</p>
                    <p className="font-medium text-gray-900">{selectedRequest.endDate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 mb-1">Reason</p>
                    <p className="font-medium text-gray-900">{selectedRequest.reason}</p>
                  </div>
                </div>
              </div>

              {selectedRequest.approvedBy && (
                <div className="bg-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/10">
                  <h3 className="text-sm font-semibold text-[#2c4a6a] mb-3">Approval Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Approved/Rejected By</p>
                      <p className="font-medium text-gray-900">{selectedRequest.approvedBy}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-medium text-gray-900">{selectedRequest.approvedDate}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end p-6 border-t">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Leave Request?</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete leave request <span className="font-semibold">{selectedRequest.id}</span> for {selectedRequest.employeeName}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedRequest(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRequest}
                  className="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
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