"use client";

import React, { useState } from "react";

// Sample leave data - replace with your API data
const initialLeaveRequests = [
  {
    id: "LR001",
    employeeId: "EMP001",
    employeeName: "John Mensah",
    department: "Engineering",
    leaveType: "Annual Leave",
    startDate: "2025-02-15",
    endDate: "2025-02-20",
    totalDays: 6,
    reason: "Family vacation",
    status: "Approved",
    appliedDate: "2025-01-28",
    approvedBy: "Sarah Johnson",
    approvedDate: "2025-01-29",
  },
  {
    id: "LR002",
    employeeId: "EMP002",
    employeeName: "Abena Osei",
    department: "HR",
    leaveType: "Sick Leave",
    startDate: "2025-02-05",
    endDate: "2025-02-07",
    totalDays: 3,
    reason: "Medical appointment and recovery",
    status: "Pending",
    appliedDate: "2025-02-03",
    approvedBy: null,
    approvedDate: null,
  },
  {
    id: "LR003",
    employeeId: "EMP003",
    employeeName: "Kwame Boateng",
    department: "Sales",
    leaveType: "Annual Leave",
    startDate: "2025-03-10",
    endDate: "2025-03-15",
    totalDays: 6,
    reason: "Personal matters",
    status: "Pending",
    appliedDate: "2025-01-30",
    approvedBy: null,
    approvedDate: null,
  },
  {
    id: "LR004",
    employeeId: "EMP005",
    employeeName: "Kofi Owusu",
    department: "Management",
    leaveType: "Emergency Leave",
    startDate: "2025-02-01",
    endDate: "2025-02-02",
    totalDays: 2,
    reason: "Family emergency",
    status: "Approved",
    appliedDate: "2025-01-31",
    approvedBy: "Sarah Johnson",
    approvedDate: "2025-01-31",
  },
  {
    id: "LR005",
    employeeId: "EMP004",
    employeeName: "Ama Asante",
    department: "Engineering",
    leaveType: "Maternity Leave",
    startDate: "2025-03-01",
    endDate: "2025-05-31",
    totalDays: 92,
    reason: "Maternity leave",
    status: "Rejected",
    appliedDate: "2025-01-25",
    approvedBy: "Sarah Johnson",
    approvedDate: "2025-01-27",
    rejectionReason: "Insufficient notice period",
  },
];

export default function LeaveManagementPage() {
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [filteredRequests, setFilteredRequests] = useState(initialLeaveRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state for new leave request
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
  const departments = ["All", "Engineering", "Management", "Sales", "HR", "Support"];

  // Filter logic
  React.useEffect(() => {
    let result = [...leaveRequests];

    // Search filter
    if (searchTerm) {
      result = result.filter(req => 
        req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "All") {
      result = result.filter(req => req.status === filterStatus);
    }

    // Type filter
    if (filterType !== "All") {
      result = result.filter(req => req.leaveType === filterType);
    }

    setFilteredRequests(result);
  }, [searchTerm, filterStatus, filterType, leaveRequests]);

  const getStatusColor = (status) => {
    switch(status) {
      case "Approved": return "bg-green-100 text-green-700 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Rejected": return "bg-red-100 text-red-700 border-red-200";
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

  // API Functions
  const handleFetchAllRequests = () => {
    console.log("GET: Fetch all leave requests");
    alert("Fetching all leave requests from API...");
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    console.log("POST: Create new leave request", formData);
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const newRequest = {
      id: `LR${String(leaveRequests.length + 1).padStart(3, '0')}`,
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      department: formData.department,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalDays: totalDays,
      reason: formData.reason,
      status: "Pending",
      appliedDate: new Date().toISOString().split('T')[0],
      approvedBy: null,
      approvedDate: null,
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    setIsCreateModalOpen(false);
    setFormData({
      employeeId: "", employeeName: "", department: "", leaveType: "",
      startDate: "", endDate: "", reason: "", contactDuringLeave: "", handoverNotes: "",
    });
    
    alert("Leave request created successfully!");
  };

  const handleGetDetails = (request) => {
    console.log("GET: Get details of leave request", request.id);
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleUpdateRequest = (requestId) => {
    console.log("POST: Update leave request", requestId);
    alert(`Updating leave request ${requestId}...`);
  };

  const handleDeleteRequest = () => {
    console.log("DELETE: Delete leave request", selectedRequest.id);
    setLeaveRequests(leaveRequests.filter(req => req.id !== selectedRequest.id));
    setIsDeleteModalOpen(false);
    setSelectedRequest(null);
    alert("Leave request deleted successfully!");
  };

  const handleApproveRequest = (requestId) => {
    setLeaveRequests(leaveRequests.map(req => 
      req.id === requestId 
        ? { ...req, status: "Approved", approvedBy: "Current User", approvedDate: new Date().toISOString().split('T')[0] }
        : req
    ));
    alert("Leave request approved!");
  };

  const handleRejectRequest = (requestId) => {
    const reason = prompt("Please enter rejection reason:");
    if (reason) {
      setLeaveRequests(leaveRequests.map(req => 
        req.id === requestId 
          ? { ...req, status: "Rejected", approvedBy: "Current User", approvedDate: new Date().toISOString().split('T')[0], rejectionReason: reason }
          : req
      ));
      alert("Leave request rejected!");
    }
  };

  const calculateTotalDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Leave Management</h1>
            <p className="text-sm text-gray-600">Manage employee leave requests and approvals</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleFetchAllRequests}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Leave Request
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Total</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">All Requests</h3>
          <p className="text-3xl font-bold mb-1">{leaveRequests.length}</p>
          <p className="text-xs opacity-75">Total leave requests</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            Complete history
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#6b8ca3] to-[#4a6b82] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Approved</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Approved Leaves</h3>
          <p className="text-3xl font-bold mb-1">{leaveRequests.filter(r => r.status === "Approved").length}</p>
          <p className="text-xs opacity-75">Confirmed requests</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            Successfully approved
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#8ba3b8] to-[#6b8ca3] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Pending</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Pending Review</h3>
          <p className="text-3xl font-bold mb-1">{leaveRequests.filter(r => r.status === "Pending").length}</p>
          <p className="text-xs opacity-75">Awaiting approval</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            Requires action
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#a4b9cc] to-[#8ba3b8] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Rejected</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Rejected</h3>
          <p className="text-3xl font-bold mb-1">{leaveRequests.filter(r => r.status === "Rejected").length}</p>
          <p className="text-xs opacity-75">Declined requests</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            Not approved
          </div>
        </div>
      </div> */}

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 mb-6">
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
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
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
          >
            <option value="All">All Leave Types</option>
            {leaveTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leave Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100"
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
                <div className="w-8 h-8 rounded-lg bg-[#6b8ca3]/10 flex items-center justify-center">
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
                <div className="w-8 h-8 rounded-lg bg-[#6b8ca3]/10 flex items-center justify-center">
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
                <div className="w-8 h-8 rounded-lg bg-[#6b8ca3]/10 flex items-center justify-center">
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
                  className="p-2 hover:bg-[#6b8ca3]/10 rounded-lg transition-colors group"
                  title="View Details"
                >
                  <svg className="w-5 h-5 text-[#6b8ca3] group-hover:text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleUpdateRequest(request.id)}
                  className="p-2 hover:bg-[#6b8ca3]/10 rounded-lg transition-colors group"
                  title="Edit"
                >
                  <svg className="w-5 h-5 text-[#6b8ca3] group-hover:text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setSelectedRequest(request);
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
              
              {request.status === "Pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveRequest(request.id)}
                    className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
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
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
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

      {/* Create Leave Request Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold">Create Leave Request</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-6">
              <div className="space-y-6">
                {/* Employee Information */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2c4a6a] mb-4">Employee Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
                      <input
                        type="text"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name *</label>
                      <input
                        type="text"
                        value={formData.employeeName}
                        onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
                      >
                        <option value="">Select Department</option>
                        {departments.filter(d => d !== "All").map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Leave Details */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2c4a6a] mb-4">Leave Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
                      <select
                        value={formData.leaveType}
                        onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
                      >
                        <option value="">Select Leave Type</option>
                        {leaveTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Days</label>
                      <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50">
                        <span className="font-bold text-[#2c4a6a]">{calculateTotalDays()} days</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Leave *</label>
                      <textarea
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        required
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact During Leave</label>
                      <input
                        type="text"
                        value={formData.contactDuringLeave}
                        onChange={(e) => setFormData({...formData, contactDuringLeave: e.target.value})}
                        placeholder="Phone or email"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Handover Notes</label>
                      <input
                        type="text"
                        value={formData.handoverNotes}
                        onChange={(e) => setFormData({...formData, handoverNotes: e.target.value})}
                        placeholder="Work handover details"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                  Submit Request
                </button>
              </div>
            </form>
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
              {/* Employee Info */}
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

              {/* Leave Details */}
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

              {/* Approval Info */}
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
                    {selectedRequest.rejectionReason && (
                      <div className="col-span-2">
                        <p className="text-gray-600 mb-1">Rejection Reason</p>
                        <p className="font-medium text-red-700">{selectedRequest.rejectionReason}</p>
                      </div>
                    )}
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
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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