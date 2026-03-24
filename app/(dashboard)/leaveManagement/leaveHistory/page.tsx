"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function LeaveHistoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [request, setRequest]           = useState<any>(null);
  const [notFound, setNotFound]         = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    // Read the request stored by the list page
    const stored = sessionStorage.getItem(`leaveRequest_${id}`);
    if (stored) {
      setRequest(JSON.parse(stored));
    } else {
      setNotFound(true);
    }
  }, [id]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApprove = () => {
    const updated = { ...request, status: "Approved", approvedBy: "Current User", approvedDate: new Date().toISOString().split('T')[0] };
    setRequest(updated);
    sessionStorage.setItem(`leaveRequest_${id}`, JSON.stringify(updated));
    showNotification("Leave request approved successfully.");
  };

  const handleReject = () => {
    const updated = { ...request, status: "Rejected", approvedBy: "Current User", approvedDate: new Date().toISOString().split('T')[0] };
    setRequest(updated);
    sessionStorage.setItem(`leaveRequest_${id}`, JSON.stringify(updated));
    showNotification("Leave request rejected.");
  };

  const handleDelete = () => {
    sessionStorage.removeItem(`leaveRequest_${id}`);
    router.push("/leaveManagement");
  };

  const getStatusColor = (status: string) => ({
    Approved: "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]",
    Pending:  "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]",
    Rejected: "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]",
  }[status] ?? "bg-gray-100 text-gray-700 border-gray-200");

  const getStatusIcon = (status: string) => {
    if (status === "Approved") return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    );
    if (status === "Rejected") return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    );
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    );
  };

  // ── Timeline steps ─────────────────────────────────────────────────────────
  const timelineSteps = request ? [
    { label: "Leave Applied",   date: request.appliedDate,  done: true,                               icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { label: "Under Review",    date: request.appliedDate,  done: true,                               icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
    { label: request.status === "Rejected" ? "Rejected" : "Approved", date: request.approvedDate ?? "-", done: request.status !== "Pending", icon: request.status === "Rejected" ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7" },
    { label: "Leave Start",     date: request.startDate,    done: request.status === "Approved",      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Leave End",       date: request.endDate,      done: request.status === "Approved",      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  ] : [];

  // ── Loading / not found states ─────────────────────────────────────────────
  if (notFound) return (
    <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md w-full">
        <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p className="text-lg font-bold text-gray-800 mb-2">Request not found</p>
        <p className="text-sm text-gray-500 mb-6">This leave request may have been deleted or the link is invalid.</p>
        <Link href="/leaveManagement">
          <button className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
            Back to Leave Management
          </button>
        </Link>
      </div>
    </div>
  );

  if (!request) return (
    <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#2c4a6a] border-t-transparent rounded-full animate-spin"/>
        <p className="text-sm text-gray-500 font-medium">Loading request…</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">

      {/* Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] bg-[#2c4a6a] text-white px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* ── Breadcrumb + back ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/leaveManagement" className="text-[#2c4a6a] hover:underline font-medium flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Leave Management
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-500">Leave History</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700 font-semibold">{request.id}</span>
      </div>

      {/* ── Hero card ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl p-6 mb-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden relative ring-4 ring-white/20 flex-shrink-0">
              <Image src={request.profileImage} alt={request.employeeName} fill className="object-cover"/>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">{request.employeeName}</h1>
              <p className="text-white/70 text-sm mt-0.5">{request.employeeId} · {request.department}</p>
              <p className="text-white/60 text-xs mt-1">{request.leaveType}</p>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
              {getStatusIcon(request.status)}
              {request.status}
            </div>
            <p className="text-white/60 text-xs">Request ID: {request.id}</p>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-white/10">
          {[
            { label: "Total Days",  value: `${request.totalDays} days` },
            { label: "Start Date",  value: request.startDate           },
            { label: "End Date",    value: request.endDate             },
          ].map(item => (
            <div key={item.label}>
              <p className="text-white/50 text-xs font-medium mb-1">{item.label}</p>
              <p className="text-white font-bold text-base leading-tight">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Left: details */}
        <div className="lg:col-span-2 space-y-5">

          {/* Employee & leave info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Leave Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Full Name",     value: request.employeeName  },
                { label: "Employee ID",   value: request.employeeId    },
                { label: "Department",    value: request.department    },
                { label: "Leave Type",    value: request.leaveType     },
                { label: "Applied Date",  value: request.appliedDate   },
                { label: "Total Days",    value: `${request.totalDays} days` },
                { label: "Start Date",    value: request.startDate     },
                { label: "End Date",      value: request.endDate       },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1 font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                </div>
              ))}
              <div className="col-span-2 bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1 font-medium">Reason for Leave</p>
                <p className="text-sm font-semibold text-gray-900">{request.reason}</p>
              </div>
            </div>
          </div>

          {/* Approval info — shown when not pending */}
          {request.approvedBy && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">
                {request.status === "Rejected" ? "Rejection" : "Approval"} Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1 font-medium">{request.status === "Rejected" ? "Rejected By" : "Approved By"}</p>
                  <p className="text-sm font-semibold text-gray-900">{request.approvedBy}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1 font-medium">Date</p>
                  <p className="text-sm font-semibold text-gray-900">{request.approvedDate}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: timeline + actions */}
        <div className="space-y-5">

          {/* Status timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-5 uppercase tracking-wider">Request Timeline</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100"/>
              <div className="space-y-5">
                {timelineSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${
                      step.done
                        ? "bg-[#2c4a6a] border-[#2c4a6a]"
                        : "bg-white border-gray-200"
                    }`}>
                      <svg className={`w-3.5 h-3.5 ${step.done ? "text-white" : "text-gray-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon}/>
                      </svg>
                    </div>
                    <div className="flex-1 pb-1">
                      <p className={`text-sm font-semibold leading-tight ${step.done ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                      <p className={`text-xs mt-0.5 ${step.done ? "text-gray-500" : "text-gray-300"}`}>{step.date ?? "-"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Actions</h2>
            <div className="space-y-3">
              {request.status === "Pending" && (
                <>
                  <button
                    onClick={handleApprove}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:opacity-90 text-white rounded-xl text-sm font-semibold transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                    Approve Request
                  </button>
                  <button
                    onClick={handleReject}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#bfcfde] hover:bg-[#96b3cc] text-[#1e3147] rounded-xl text-sm font-semibold transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    Reject Request
                  </button>
                </>
              )}
              {request.status !== "Pending" && (
                <div className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  <span>This request has been {request.status.toLowerCase()}</span>
                </div>
              )}
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl text-sm font-semibold transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete Request
              </button>
              <Link href="/leaveManagement" className="block">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                  Back to List
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ── Delete confirm modal ───────────────────────────────────────────── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-[#1e3147] to-[#2c4a6a] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Delete Request</h2>
                  <p className="text-sm text-white/70">{request.id}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-[#e8eef4] border border-[#c3d2e9] rounded-xl p-4 mb-5">
                <p className="text-sm text-[#1e3147] font-medium">⚠️ This action cannot be undone</p>
                <p className="text-xs text-[#2c4a6a] mt-1">You will be redirected to Leave Management after deletion.</p>
              </div>
              <p className="text-sm text-gray-600">
                Delete leave request for <span className="font-semibold text-gray-900">{request.employeeName}</span>?
                This covers <span className="font-semibold">{request.totalDays} days</span> of {request.leaveType}.
              </p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}