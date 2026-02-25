"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";

export default function AttendancePage() {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "list">("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const openAttendanceModal = async () => {
    const attendanceUrl = `https://nerapay.com/attendance/checkin/${new Date().toISOString().split('T')[0]}`;
    try {
      const qrUrl = await QRCode.toDataURL(attendanceUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#2c4a6a',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrUrl);
      setShowQRModal(true);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], `attendance-qr-${new Date().toISOString().split('T')[0]}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'Attendance QR Code',
          text: `Scan this QR code to mark attendance for ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`,
          files: [file],
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      const attendanceUrl = `https://nerapay.com/attendance/checkin/${new Date().toISOString().split('T')[0]}`;
      navigator.clipboard.writeText(attendanceUrl);
      alert('Link copied to clipboard!');
    }
  };

  const attendanceData = {
    All: {
      present: 1089, absent: 45, late: 55, onLeave: 58, total: 1247,
      details: [
        { name: "John Mensah", status: "present", time: "08:45 AM", dept: "Engineering", image: "/profiles/employee4.jpg" },
        { name: "Ama Asante", status: "late", time: "09:15 AM", dept: "HR", image: "/profiles/employee3.jpg" },
        { name: "Kofi Boateng", status: "absent", time: "-", dept: "Sales", image: "/profiles/employee1.jpg" },
        { name: "Abena Osei", status: "present", time: "08:30 AM", dept: "Finance", image: "/profiles/employee2.jpg" },
        { name: "Kwame Owusu", status: "onLeave", time: "-", dept: "Marketing", image: "/profiles/employee1.jpg" },
        { name: "Sarah Johnson", status: "present", time: "08:20 AM", dept: "Operations", image: "/profiles/employee3.jpg" },
        { name: "Emmanuel Agyei", status: "present", time: "08:35 AM", dept: "Engineering", image: "/profiles/employee4.jpg" },
        { name: "Grace Appiah", status: "late", time: "09:20 AM", dept: "Sales", image: "/profiles/employee2.jpg" },
        { name: "Michael Mensah", status: "present", time: "08:15 AM", dept: "Finance", image: "/profiles/employee4.jpg" },
        { name: "Yaa Asantewaa", status: "present", time: "08:25 AM", dept: "HR", image: "/profiles/employee3.jpg" },
        { name: "Kwesi Adom", status: "absent", time: "-", dept: "Operations", image: "/profiles/employee1.jpg" },
        { name: "Akosua Frimpong", status: "present", time: "08:40 AM", dept: "Marketing", image: "/profiles/employee2.jpg" },
        { name: "Joseph Nkrumah", status: "late", time: "09:10 AM", dept: "Engineering", image: "/profiles/employee3.jpg" },
        { name: "Efua Mensah", status: "present", time: "08:50 AM", dept: "Sales", image: "/profiles/employee3.jpg" },
        { name: "Daniel Osei", status: "onLeave", time: "-", dept: "Finance", image: "/profiles/employee1.jpg" },
      ]
    },
    Engineering: { present: 312, absent: 12, late: 15, onLeave: 3, total: 342, details: [] },
    Sales: { present: 195, absent: 8, late: 12, onLeave: 3, total: 218, details: [] },
    Marketing: { present: 140, absent: 6, late: 8, onLeave: 2, total: 156, details: [] },
    HR: { present: 78, absent: 4, late: 5, onLeave: 2, total: 89, details: [] },
    Finance: { present: 110, absent: 5, late: 7, onLeave: 2, total: 124, details: [] },
    Operations: { present: 175, absent: 10, late: 8, onLeave: 5, total: 198, details: [] },
  };

  const currentAttendance = attendanceData[selectedDepartment];

  const filteredEmployees = currentAttendance.details.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.dept.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const visible = filteredEmployees.slice(startIdx, startIdx + itemsPerPage);

  const pageNums = () => {
    const p: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) p.push(i);
    } else if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) p.push(i);
      p.push("...");
      p.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      p.push(1);
      p.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) p.push(i);
    } else {
      p.push(1);
      p.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) p.push(i);
      p.push("...");
      p.push(totalPages);
    }
    return p;
  };

  const goTo = (n: number) => {
    setCurrentPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const statusColor = (s: string) =>
    s === "present" ? "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]" :
    s === "absent" ? "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]" :
    s === "late" ? "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]" :
    s === "onLeave" ? "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]" :
    "bg-gray-100 text-gray-700 border-gray-200";

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name[0] + (name[1] || '');
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-1">Attendance</h1>
        <p className="text-sm text-gray-600">Track and manage employee attendance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Employees", value: currentAttendance.total, sub: "All in system" },
          { label: "Present", value: currentAttendance.present, sub: "Currently present" },
          { label: "Absent", value: currentAttendance.absent, sub: "Not checked in" },
          { label: "Showing", value: filteredEmployees.length, sub: "From current filters" },
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
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search name, ID, email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="onLeave">On Leave</option>
            </select>
            <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option>Sort by Name</option>
              <option>Sort by Time</option>
              <option>Sort by Status</option>
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
            <button
              onClick={openAttendanceModal}
              className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Take Attendance
            </button>
          </div>
        </div>
      </div>

      {/* Pagination top */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{startIdx + 1}</span>–<span className="font-semibold text-gray-900">{Math.min(startIdx + itemsPerPage, filteredEmployees.length)}</span> of <span className="font-semibold text-gray-900">{filteredEmployees.length}</span> employees
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show</span>
          <select
            value={itemsPerPage}
            onChange={e => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
          >
            {[10, 20, 50, 100].map(n => <option key={n}>{n}</option>)}
          </select>
          <span className="text-sm text-gray-500">per page</span>
        </div>
      </div>

      {/* CARDS VIEW */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
          {visible.map((emp, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-100 hover:border-[#c3d2e9] hover:shadow-md transition-all p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-base flex-shrink-0 overflow-hidden relative">
                    <Image
                      src={emp.image}
                      alt={`${emp.name}'s profile`}
                      fill
                      className="object-cover"
                    />
                    <span className="text-base font-bold z-10">{getInitials(emp.name)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{emp.name}</p>
                    <p className="text-xs text-gray-400">EMP{String(index + 1).padStart(4, '0')}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 ${statusColor(emp.status)}`}>
                  {emp.status === 'onLeave' ? 'On Leave' : emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                </span>
              </div>
              <div className="space-y-1.5 mb-4 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{emp.dept}</p>
                <p className="text-xs text-gray-500">Check-in: {emp.time}</p>
                <p className="text-xs text-gray-400 truncate">{emp.name.toLowerCase().replace(' ', '.')}@company.com</p>
                <p className="text-xs text-gray-400">+233 XX XXX XXXX</p>
                <p className="text-xs text-gray-400">Status: {emp.status === 'onLeave' ? 'On Leave' : emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}</p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Clock In Time</p>
                  <p className="text-base font-bold text-[#2c4a6a]">{emp.time}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-[#eef3f9] hover:bg-[#c3d2e9] text-[#2c4a6a] rounded-lg text-xs font-semibold transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-xs font-semibold transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                </div>
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map((emp, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden relative">
                          <Image
                            src={emp.image}
                            alt={`${emp.name}'s profile`}
                            fill
                            className="object-cover"
                          />
                          <span className="text-sm font-bold z-10">{getInitials(emp.name)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-400">EMP{String(index + 1).padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{emp.time}</p>
                      <p className="text-xs text-gray-400">Check-in time</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{emp.dept}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 truncate max-w-[200px]">{emp.name.toLowerCase().replace(' ', '.')}@company.com</p>
                      <p className="text-xs text-gray-400">+233 XX XXX XXXX</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(emp.status)}`}>
                        {emp.status === 'onLeave' ? 'On Leave' : emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="View">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-[#eef3f9] rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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

      {/* Pagination bottom */}
      {filteredEmployees.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">Page <b>{currentPage}</b> of <b>{totalPages}</b></p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="hidden sm:flex gap-1">
              {pageNums().map((p, i) =>
                p === "..." ? (
                  <span key={i} className="w-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goTo(p as number)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage === p ? "bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm text-gray-500">Go to</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              defaultValue={currentPage}
              onBlur={e => {
                const p = parseInt(e.target.value);
                if (p >= 1 && p <= totalPages) goTo(p);
              }}
              className="w-14 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
            />
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredEmployees.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <svg className="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-800 font-semibold mb-2">No employees found</p>
          <p className="text-gray-500 text-sm mb-4">Adjust your filters or search term</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDepartment("All");
              setStatusFilter("all");
            }}
            className="text-[#2c4a6a] text-sm font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* QR Modal - Enhanced with Download & Share */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md shadow-2xl">
            <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold">Take Attendance</h2>
                <p className="text-sm text-white/70 mt-1">Scan QR code to check in</p>
              </div>
              <button onClick={() => setShowQRModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {/* QR Code Display */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 mb-4 border-2 border-dashed border-gray-200">
                <Image src={qrCodeUrl} alt="QR Code" width={300} height={300} className="w-full rounded-lg" />
              </div>
              
              {/* Info Box */}
              <div className="bg-[#2c4a6a]/10 border border-[#2c4a6a]/30 rounded-lg p-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="bg-[#2c4a6a] rounded-full p-1.5 flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-1">How to use this QR code</p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Employees can scan this QR code with their phone camera to quickly mark their attendance for today. The code is valid for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = `attendance-qr-${new Date().toISOString().split('T')[0]}.png`;
                    link.href = qrCodeUrl;
                    link.click();
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={shareQRCode}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>

              {/* Alternative: Print option */}
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  printWindow?.document.write(`
                    <html>
                      <head>
                        <title>Attendance QR Code - ${new Date().toLocaleDateString()}</title>
                        <style>
                          body { 
                            font-family: Arial, sans-serif; 
                            display: flex; 
                            flex-direction: column; 
                            align-items: center; 
                            justify-content: center; 
                            min-height: 100vh;
                            margin: 0;
                            padding: 20px;
                          }
                          h1 { color: #2c4a6a; margin-bottom: 10px; }
                          p { color: #666; margin-bottom: 20px; }
                          img { max-width: 400px; border: 2px solid #2c4a6a; padding: 20px; border-radius: 10px; }
                        </style>
                      </head>
                      <body>
                        <h1>Daily Attendance QR Code</h1>
                        <p>${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <img src="${qrCodeUrl}" alt="Attendance QR Code" />
                        <p style="margin-top: 20px; font-size: 14px;">Scan this code to mark your attendance</p>
                      </body>
                    </html>
                  `);
                  printWindow?.document.close();
                  printWindow?.print();
                }}
                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}