"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AttendancePage() {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Attendance data by department
  const attendanceData = {
    All: {
      present: 1089,
      absent: 45,
      late: 55,
      onLeave: 58,
      total: 1247,
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
        // Add more employees as needed...
      ]
    },
    Engineering: {
      present: 312, absent: 12, late: 15, onLeave: 3, total: 342,
      details: [
        { name: "John Mensah", status: "present", time: "08:45 AM", dept: "Engineering", image: "/profiles/employee4.jpg" },
        { name: "Emmanuel Agyei", status: "present", time: "08:35 AM", dept: "Engineering", image: "/profiles/employee1.jpg" },
        { name: "Joseph Nkrumah", status: "late", time: "09:10 AM", dept: "Engineering", image: "/profiles/employee3.jpg" },
        { name: "Francis Boateng", status: "present", time: "08:10 AM", dept: "Engineering", image: "/profiles/employee2.jpg" },
      ]
    },
    Sales: {
      present: 195, absent: 8, late: 12, onLeave: 3, total: 218,
      details: [
        { name: "Kofi Boateng", status: "absent", time: "-", dept: "Sales", image: "/profiles/employee1.jpg" },
        { name: "Grace Appiah", status: "late", time: "09:20 AM", dept: "Sales", image: "/profiles/employee2.jpg" },
        { name: "Efua Mensah", status: "present", time: "08:50 AM", dept: "Sales", image: "/profiles/employee3.jpg" },
      ]
    },
    Marketing: {
      present: 140, absent: 6, late: 8, onLeave: 2, total: 156,
      details: [
        { name: "Kwame Owusu", status: "onLeave", time: "-", dept: "Marketing", image: "/profiles/employee1.jpg" },
        { name: "Akosua Frimpong", status: "present", time: "08:40 AM", dept: "Marketing", image: "/profiles/employee2.jpg" },
      ]
    },
    HR: {
      present: 78, absent: 4, late: 5, onLeave: 2, total: 89,
      details: [
        { name: "Ama Asante", status: "late", time: "09:15 AM", dept: "HR", image: "/profiles/employee3.jpg" },
        { name: "Yaa Asantewaa", status: "present", time: "08:25 AM", dept: "HR", image: "/profiles/employee2.jpg" },
      ]
    },
    Finance: {
      present: 110, absent: 5, late: 7, onLeave: 2, total: 124,
      details: [
        { name: "Abena Osei", status: "present", time: "08:30 AM", dept: "Finance", image: "/profiles/employee2.jpg" },
        { name: "Michael Mensah", status: "present", time: "08:15 AM", dept: "Finance", image: "/profiles/employee4.jpg" },
      ]
    },
    Operations: {
      present: 175, absent: 10, late: 8, onLeave: 5, total: 198,
      details: [
        { name: "Sarah Johnson", status: "present", time: "08:20 AM", dept: "Operations", image: "/profiles/employee3.jpg" },
        { name: "Samuel Adjei", status: "present", time: "08:30 AM", dept: "Operations", image: "/profiles/employee1.jpg" },
      ]
    },
  };

  const currentAttendance = attendanceData[selectedDepartment];

  // Filter employees based on search
  const filteredEmployees = currentAttendance.details.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case "present": return "bg-[#2c4a6a]/10 text-[#2c4a6a] border-[#2c4a6a]/30";
      case "absent": return "bg-gray-200 text-gray-700 border-gray-300";
      case "late": return "bg-[#6b8ca3]/10 text-[#6b8ca3] border-[#6b8ca3]/30";
      case "onLeave": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "present":
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
      case "absent":
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
      case "late":
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case "onLeave":
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#153453]">Attendance Overview</h1>
            <p className="text-sm text-gray-600 mt-1">Thursday, February 19, 2026 • {currentAttendance.total} Total Employees</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#2c4a6a]/10 to-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/30">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-[#2c4a6a] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Present</p>
          <p className="text-4xl font-bold text-gray-900">{currentAttendance.present}</p>
          <p className="text-xs text-gray-500 mt-2">{((currentAttendance.present / currentAttendance.total) * 100).toFixed(1)}% of total</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Absent</p>
          <p className="text-4xl font-bold text-gray-900">{currentAttendance.absent}</p>
          <p className="text-xs text-gray-500 mt-2">{((currentAttendance.absent / currentAttendance.total) * 100).toFixed(1)}% of total</p>
        </div>

        <div className="bg-gradient-to-br from-[#6b8ca3]/10 to-[#6b8ca3]/5 rounded-xl p-5 border border-[#6b8ca3]/30">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-[#6b8ca3] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Late</p>
          <p className="text-4xl font-bold text-gray-900">{currentAttendance.late}</p>
          <p className="text-xs text-gray-500 mt-2">{((currentAttendance.late / currentAttendance.total) * 100).toFixed(1)}% of total</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">On Leave</p>
          <p className="text-4xl font-bold text-gray-900">{currentAttendance.onLeave}</p>
          <p className="text-xs text-gray-500 mt-2">{((currentAttendance.onLeave / currentAttendance.total) * 100).toFixed(1)}% of total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] font-medium"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Employee Attendance</h2>
            <p className="text-sm text-gray-600 mt-1">Showing {filteredEmployees.length} employees</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all">
            Export Report
          </button>
        </div>

        <div className="space-y-3">
          {filteredEmployees.map((emp, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
              {/* Employee Image */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-white">
                <img
                  src={emp.image}
                  alt={emp.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Employee Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{emp.name}</h3>
                <p className="text-sm text-gray-500">{emp.dept}</p>
              </div>

              {/* Clock In Time */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{emp.time}</span>
              </div>

              {/* Status Badge */}
              <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border ${getStatusColor(emp.status)}`}>
                {getStatusIcon(emp.status)}
                {emp.status === 'onLeave' ? 'On Leave' : emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
              </span>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-sm">No employees found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}