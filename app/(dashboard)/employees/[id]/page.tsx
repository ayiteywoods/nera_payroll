"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const FALLBACK_EMPLOYEE = {
  id: "EMP0042",
  firstName: "Kwame", lastName: "Boateng", otherNames: "Asante",
  email: "kwame.boateng42@company.com", phone: "+233 24 456 7890",
  dateOfBirth: "1992-04-15", gender: "Male",
  residentialAddress: "14 Independence Ave, Accra, Ghana",
  profileImage: "/profiles/employee1.jpg",
  jobTitle: "Senior Software Engineer", department: "Engineering",
  employmentType: "Full-Time", hireDate: "2020-03-01",
  employmentStatus: "Active", basicSalary: 8500, salaryType: "Monthly",
  allowances: 1200, taxId: "TIN-GH-00293847", ssnit: "SSN-2948374",
  bankName: "GCB Bank", accountName: "Kwame Asante Boateng",
  accountNumber: "1234567890", paymentMethod: "Bank Transfer",
  emergencyContact: { name: "Ama Boateng", phone: "+233 20 987 6543", relationship: "Spouse" },
  resume: "kwame_boateng_cv.pdf", idDocument: "ghana_card.pdf",
  performanceScore: 98, tasksCompleted: 124, projectsCount: 8, yearsAtCompany: 5,
};

const generateAttendance = () => {
  const statuses = ["present", "present", "present", "present", "late", "absent", "onLeave"];
  const records = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    records.push({
      date: d.toISOString().split("T")[0],
      status,
      clockIn: status === "present" ? "08:" + String(Math.floor(Math.random() * 30) + 10).padStart(2, "0") + " AM"
        : status === "late" ? "09:" + String(Math.floor(Math.random() * 45) + 10).padStart(2, "0") + " AM"
          : "–",
      clockOut: status === "absent" || status === "onLeave" ? "–" : "05:" + String(Math.floor(Math.random() * 50) + 5).padStart(2, "0") + " PM",
    });
  }
  return records;
};

const payslips = [
  { month: "February 2026", gross: 9700, deductions: 1455, net: 8245, status: "Paid" },
  { month: "January 2026", gross: 9700, deductions: 1455, net: 8245, status: "Paid" },
  { month: "December 2025", gross: 9700, deductions: 1455, net: 8245, status: "Paid" },
  { month: "November 2025", gross: 9700, deductions: 1455, net: 8245, status: "Paid" },
  { month: "October 2025", gross: 9700, deductions: 1455, net: 8245, status: "Paid" },
  { month: "September 2025", gross: 9700, deductions: 1455, net: 8245, status: "Paid" },
];

const attendanceRecords = generateAttendance();

export default function EmployeeProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [employee, setEmployee] = useState<any>(FALLBACK_EMPLOYEE);

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [suspendReason, setSuspendReason] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("nerapay_employee");
      if (stored) setEmployee(JSON.parse(stored));
    } catch { }
  }, []);

  const openEditModal = () => {
    setEditForm({ ...employee });
    setEditModalOpen(true);
  };

  const handleEditSave = () => {
    setEmployee({ ...editForm });
    try { sessionStorage.setItem("nerapay_employee", JSON.stringify(editForm)); } catch { }
    setEditModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSuspend = () => {
    const updated = {
      ...employee,
      employmentStatus: employee.employmentStatus === "Suspended" ? "Active" : "Suspended"
    };
    setEmployee(updated);
    try { sessionStorage.setItem("nerapay_employee", JSON.stringify(updated)); } catch { }
    setSuspendModalOpen(false);
    setSuspendReason("");
  };

  const handleDelete = () => {
    setDeleteModalOpen(false);
    window.location.href = "/employees";
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "attendance", label: "Attendance", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { id: "payroll", label: "Payroll", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "documents", label: "Documents", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]";
      case "On Leave": return "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]";
      case "Suspended": return "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getAttendanceColor = (status) => {
    switch (status) {
      case "present": return "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]";
      case "absent": return "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]";
      case "late": return "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]";
      case "onLeave": return "bg-[#eef3f9] text-[#5a7a9a] border-[#d4e1ed]";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const presentDays = attendanceRecords.filter(r => r.status === "present").length;
  const absentDays = attendanceRecords.filter(r => r.status === "absent").length;
  const lateDays = attendanceRecords.filter(r => r.status === "late").length;
  const leaveDays = attendanceRecords.filter(r => r.status === "onLeave").length;
  const totalDays = attendanceRecords.length;
  const attendanceRate = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white text-gray-900";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">

      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-6 right-6 z-[100] bg-[#2c4a6a] text-white px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">Employee profile updated successfully</span>
        </div>
      )}

      {/* Back breadcrumb */}
      <div className="mb-5">
        <Link href="/employees" className="inline-flex items-center gap-2 text-sm text-[#2c4a6a] hover:underline font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Employees
        </Link>
      </div>

      {/* Profile Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-100 mb-6">
        <div className="h-32 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] relative rounded-t-2xl">
          <div className="absolute inset-0 opacity-10 rounded-t-2xl"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          {/* Action buttons in banner */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={openEditModal}
              className="px-3 py-1.5 border border-white/30 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => setSuspendModalOpen(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border ${employee.employmentStatus === "Suspended"
                ? "bg-[#d4e1ed] hover:bg-[#a8c5db] text-[#2c4a6a] border-[#a8c5db]"
                : "bg-[#e8eef4] hover:bg-[#c3d2e9] text-[#4a6b8a] border-[#c3d2e9]"}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={employee.employmentStatus === "Suspended"
                  ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"} />
              </svg>
              {employee.employmentStatus === "Suspended" ? "Reinstate" : "Suspend"}
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="px-3 py-1.5 bg-[#bfcfde] hover:bg-[#96b3cc] rounded-lg text-xs font-medium text-[#1e3147] transition-colors flex items-center gap-1.5 border border-[#96b3cc]"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
            <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium text-white transition-colors flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 -mt-10 mb-5">
            <div className="w-20 h-20 rounded-xl border-4 border-white bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 z-10 relative overflow-hidden">
              <span className="text-2xl font-bold absolute inset-0 flex items-center justify-center">
                {employee.firstName?.[0]}{employee.lastName?.[0]}
              </span>
              <img src={employee.profileImage} alt={employee.firstName}
                className="w-full h-full object-cover absolute inset-0 z-10"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            </div>
            <div className="flex-1 min-w-0 pt-10 sm:pt-12">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-[#1e3147]">
                  {employee.firstName} {employee.otherNames} {employee.lastName}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(employee.employmentStatus)}`}>
                  {employee.employmentStatus}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium mb-2">{employee.jobTitle}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /></svg>
                  {employee.department}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {employee.email}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {employee.phone}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" /></svg>
                  {employee.id}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
            {[
              { label: "Years at Company", value: employee.yearsAtCompany, suffix: "yrs" },
              { label: "Performance Score", value: employee.performanceScore, suffix: "%" },
              { label: "Tasks Completed", value: employee.tasksCompleted, suffix: "" },
              { label: "Projects", value: employee.projectsCount, suffix: "" },
            ].map(stat => (
              <div key={stat.label} className="text-center py-2">
                <p className="text-2xl font-bold text-[#1e3147]">
                  {stat.value}<span className="text-sm font-medium text-gray-400 ml-0.5">{stat.suffix}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl border border-gray-100 mb-6">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all flex-shrink-0 whitespace-nowrap border-b-2 ${activeTab === tab.id
                ? "text-[#2c4a6a] border-[#2c4a6a] bg-[#f0f5fa]"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
          <div className="lg:col-span-2 space-y-6 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-[#1e3147] mb-5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: `${employee.firstName} ${employee.otherNames} ${employee.lastName}` },
                  { label: "Date of Birth", value: new Date(employee.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Gender", value: employee.gender },
                  { label: "Phone", value: employee.phone },
                  { label: "Email", value: employee.email },
                  { label: "Address", value: employee.residentialAddress },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-[#1e3147] mb-5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                Employment Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Employee ID", value: employee.id },
                  { label: "Job Title", value: employee.jobTitle },
                  { label: "Department", value: employee.department },
                  { label: "Employment Type", value: employee.employmentType },
                  { label: "Date of Hire", value: new Date(employee.hireDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Employment Status", value: employee.employmentStatus },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-[#1e3147] mb-5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                Bank & Payment Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Bank Name", value: employee.bankName },
                  { label: "Account Name", value: employee.accountName },
                  { label: "Account Number", value: "•••• •••• " + employee.accountNumber?.slice(-4) },
                  { label: "Payment Method", value: employee.paymentMethod },
                  { label: "Tax ID (TIN)", value: employee.taxId },
                  { label: "SSNIT", value: employee.ssnit },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl p-6 text-white">
              <p className="text-sm text-white/70 mb-1">Monthly Salary</p>
              <p className="text-4xl font-bold mb-1">₵{employee.basicSalary?.toLocaleString()}</p>
              <p className="text-xs text-white/60 mb-5">{employee.salaryType} · {employee.employmentType}</p>
              <div className="space-y-2 pt-4 border-t border-white/20">
                <div className="flex justify-between text-sm"><span className="text-white/70">Basic Salary</span><span className="font-semibold">₵{employee.basicSalary?.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/70">Allowances</span><span className="font-semibold text-white">+₵{employee.allowances?.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/70">Tax (PAYE ~15%)</span><span className="font-semibold text-white/80">-₵{Math.round(employee.basicSalary * 0.15).toLocaleString()}</span></div>
                <div className="flex justify-between text-sm pt-2 border-t border-white/20">
                  <span className="text-white font-semibold">Net Pay</span>
                  <span className="font-bold text-lg">₵{(employee.basicSalary + employee.allowances - Math.round(employee.basicSalary * 0.15)).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-[#1e3147] mb-4">Attendance (This Month)</h3>
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2c4a6a" strokeWidth="3"
                      strokeDasharray={`${attendanceRate} ${100 - attendanceRate}`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-[#1e3147]">{attendanceRate}%</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs flex-1 ml-4">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2c4a6a] inline-block"></span><span className="text-gray-600">Present <b>{presentDays}</b></span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1e3147] inline-block"></span><span className="text-gray-600">Absent <b>{absentDays}</b></span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#4a6b8a] inline-block"></span><span className="text-gray-600">Late <b>{lateDays}</b></span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#6a8aaa] inline-block"></span><span className="text-gray-600">Leave <b>{leaveDays}</b></span></div>
                </div>
              </div>
              <button onClick={() => setActiveTab("attendance")} className="w-full text-xs text-[#2c4a6a] font-medium hover:underline">View full attendance →</button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-[#1e3147] mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#e8eef4] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                Emergency Contact
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Name</span><span className="font-semibold text-gray-900">{employee.emergencyContact?.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Phone</span><span className="font-semibold text-gray-900">{employee.emergencyContact?.phone}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Relation</span><span className="font-semibold text-gray-900">{employee.emergencyContact?.relationship}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ATTENDANCE TAB ═══ */}
      {activeTab === "attendance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Present", value: presentDays, color: "bg-[#d4e1ed] border-[#a8c5db]", text: "text-[#2c4a6a]" },
              { label: "Absent", value: absentDays, color: "bg-[#bfcfde] border-[#96b3cc]", text: "text-[#1e3147]" },
              { label: "Late", value: lateDays, color: "bg-[#e8eef4] border-[#c3d2e9]", text: "text-[#4a6b8a]" },
              { label: "On Leave", value: leaveDays, color: "bg-[#eef3f9] border-[#d4e1ed]", text: "text-[#5a7a9a]" },
            ].map(c => (
              <div key={c.label} className={`rounded-xl p-5 border ${c.color}`}>
                <p className="text-xs font-medium text-gray-600 mb-2">{c.label}</p>
                <p className={`text-3xl font-bold ${c.text}`}>{c.value}</p>
                <p className="text-xs text-gray-500 mt-1">{totalDays ? Math.round((c.value / totalDays) * 100) : 0}% of working days</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1e3147]">Attendance Records</h2>
              <span className="text-sm text-gray-500">{attendanceRecords.length} working days</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{["Date", "Day", "Clock In", "Clock Out", "Status"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendanceRecords.map((rec, i) => {
                    const d = new Date(rec.date);
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3.5 text-sm font-medium text-gray-900">{d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td className="px-6 py-3.5 text-sm text-gray-500">{d.toLocaleDateString("en-GB", { weekday: "long" })}</td>
                        <td className="px-6 py-3.5 text-sm text-gray-700">{rec.clockIn}</td>
                        <td className="px-6 py-3.5 text-sm text-gray-700">{rec.clockOut}</td>
                        <td className="px-6 py-3.5">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getAttendanceColor(rec.status)}`}>
                            {rec.status === "onLeave" ? "On Leave" : rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ PAYROLL TAB ═══ */}
      {activeTab === "payroll" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl p-6 text-white">
              <p className="text-sm text-white/70 mb-1">Gross Monthly Pay</p>
              <p className="text-4xl font-bold mb-4">₵{(employee.basicSalary + employee.allowances).toLocaleString()}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/70">Basic Salary</span><span>₵{employee.basicSalary?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-white/70">Allowances</span><span>₵{employee.allowances?.toLocaleString()}</span></div>
              </div>
            </div>
            <div className="bg-[#e8eef4] border border-[#c3d2e9] rounded-2xl p-6">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Deductions</p>
              <p className="text-4xl font-bold text-[#1e3147] mb-4">₵{Math.round(employee.basicSalary * 0.15 + employee.basicSalary * 0.055).toLocaleString()}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">PAYE Tax (15%)</span><span className="text-[#2c4a6a] font-medium">₵{Math.round(employee.basicSalary * 0.15).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">SSNIT (5.5%)</span><span className="text-[#2c4a6a] font-medium">₵{Math.round(employee.basicSalary * 0.055).toLocaleString()}</span></div>
              </div>
            </div>
            <div className="bg-[#d4e1ed] border border-[#a8c5db] rounded-2xl p-6">
              <p className="text-sm font-medium text-gray-600 mb-1">Net Pay (Take Home)</p>
              <p className="text-4xl font-bold text-[#2c4a6a] mb-4">₵{(employee.basicSalary + employee.allowances - Math.round(employee.basicSalary * 0.15) - Math.round(employee.basicSalary * 0.055)).toLocaleString()}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Payment Method</span><span className="font-medium text-gray-700">{employee.paymentMethod}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-medium text-gray-700">{employee.bankName}</span></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-base font-bold text-[#1e3147]">Payslip History</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{["Period", "Gross Pay", "Deductions", "Net Pay", "Status", "Action"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payslips.map((p, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{p.month}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">₵{p.gross.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-[#2c4a6a]">-₵{p.deductions.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#1e3147]">₵{p.net.toLocaleString()}</td>
                      <td className="px-6 py-4"><span className="px-3 py-1 bg-[#d4e1ed] text-[#2c4a6a] border border-[#a8c5db] rounded-full text-xs font-semibold">{p.status}</span></td>
                      <td className="px-6 py-4">
                        <button className="text-xs text-[#2c4a6a] font-medium hover:underline flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DOCUMENTS TAB ═══ */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "Curriculum Vitae", file: employee.resume, icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", date: "Uploaded Mar 2020" },
              { name: "National ID / Ghana Card", file: employee.idDocument, icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5", date: "Uploaded Mar 2020" },
              { name: "Offer Letter", file: "offer_letter.pdf", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", date: "Uploaded Mar 2020" },
              { name: "Employment Contract", file: "contract.pdf", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", date: "Uploaded Mar 2020" },
              { name: "Tax Certificate", file: "tax_cert.pdf", icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z", date: "Uploaded Jan 2024" },
              { name: "Academic Certificate", file: "degree.pdf", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z", date: "Uploaded Mar 2020" },
            ].map(doc => (
              <div key={doc.name} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#c3d2e9] transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#eef3f9] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={doc.icon} /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{doc.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{doc.file}</p>
                    <p className="text-xs text-gray-400 mt-1">{doc.date}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button className="flex-1 px-3 py-2 bg-[#eef3f9] text-[#2c4a6a] rounded-lg text-xs font-medium hover:bg-[#c3d2e9] transition-colors flex items-center justify-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    View
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-xs font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all flex items-center justify-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border-2 border-dashed border-[#c3d2e9] p-10 text-center hover:border-[#2c4a6a] transition-colors cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-[#eef3f9] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Upload New Document</p>
            <p className="text-xs text-gray-500">PDF, DOC, or image files up to 10MB</p>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════ */}
      {/*  EDIT MODAL                                */}
      {/* ══════════════════════════════════════════ */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
            <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-white">Edit Employee</h2>
                <p className="text-sm text-white/70 mt-0.5">{employee.id} · {employee.firstName} {employee.lastName}</p>
              </div>
              <button onClick={() => setEditModalOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input className={inputClass} value={editForm.firstName || ""} onChange={e => setEditForm({ ...editForm, firstName: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Other Names</label>
                    <input className={inputClass} value={editForm.otherNames || ""} onChange={e => setEditForm({ ...editForm, otherNames: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input className={inputClass} value={editForm.lastName || ""} onChange={e => setEditForm({ ...editForm, lastName: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input type="date" className={inputClass} value={editForm.dateOfBirth || ""} onChange={e => setEditForm({ ...editForm, dateOfBirth: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select className={inputClass} value={editForm.gender || ""} onChange={e => setEditForm({ ...editForm, gender: e.target.value })}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input className={inputClass} value={editForm.phone || ""} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Email</label>
                    <input type="email" className={inputClass} value={editForm.email || ""} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                  </div>
                  <div className="sm:col-span-3">
                    <label className={labelClass}>Residential Address</label>
                    <input className={inputClass} value={editForm.residentialAddress || ""} onChange={e => setEditForm({ ...editForm, residentialAddress: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Employment Info */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Employment Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Job Title</label>
                    <input className={inputClass} value={editForm.jobTitle || ""} onChange={e => setEditForm({ ...editForm, jobTitle: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Department</label>
                    <select className={inputClass} value={editForm.department || ""} onChange={e => setEditForm({ ...editForm, department: e.target.value })}>
                      {["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations"].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Employment Type</label>
                    <select className={inputClass} value={editForm.employmentType || ""} onChange={e => setEditForm({ ...editForm, employmentType: e.target.value })}>
                      {["Full-Time", "Part-Time", "Contract", "Intern"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Employment Status</label>
                    <select className={inputClass} value={editForm.employmentStatus || ""} onChange={e => setEditForm({ ...editForm, employmentStatus: e.target.value })}>
                      {["Active", "On Leave", "Suspended", "Terminated"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Date of Hire</label>
                    <input type="date" className={inputClass} value={editForm.hireDate || ""} onChange={e => setEditForm({ ...editForm, hireDate: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Salary Type</label>
                    <select className={inputClass} value={editForm.salaryType || ""} onChange={e => setEditForm({ ...editForm, salaryType: e.target.value })}>
                      {["Monthly", "Weekly", "Daily", "Hourly"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Basic Salary (₵)</label>
                    <input type="number" className={inputClass} value={editForm.basicSalary || ""} onChange={e => setEditForm({ ...editForm, basicSalary: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className={labelClass}>Allowances (₵)</label>
                    <input type="number" className={inputClass} value={editForm.allowances || ""} onChange={e => setEditForm({ ...editForm, allowances: Number(e.target.value) })} />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Bank Info */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Bank & Payment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Bank Name</label>
                    <input className={inputClass} value={editForm.bankName || ""} onChange={e => setEditForm({ ...editForm, bankName: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Account Name</label>
                    <input className={inputClass} value={editForm.accountName || ""} onChange={e => setEditForm({ ...editForm, accountName: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Account Number</label>
                    <input className={inputClass} value={editForm.accountNumber || ""} onChange={e => setEditForm({ ...editForm, accountNumber: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Payment Method</label>
                    <select className={inputClass} value={editForm.paymentMethod || ""} onChange={e => setEditForm({ ...editForm, paymentMethod: e.target.value })}>
                      {["Bank Transfer", "Mobile Money", "Cash", "Cheque"].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Tax ID (TIN)</label>
                    <input className={inputClass} value={editForm.taxId || ""} onChange={e => setEditForm({ ...editForm, taxId: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>SSNIT</label>
                    <input className={inputClass} value={editForm.ssnit || ""} onChange={e => setEditForm({ ...editForm, ssnit: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Emergency Contact */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Emergency Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Contact Name</label>
                    <input className={inputClass} value={editForm.emergencyContact?.name || ""} onChange={e => setEditForm({ ...editForm, emergencyContact: { ...editForm.emergencyContact, name: e.target.value } })} />
                  </div>
                  <div>
                    <label className={labelClass}>Contact Phone</label>
                    <input className={inputClass} value={editForm.emergencyContact?.phone || ""} onChange={e => setEditForm({ ...editForm, emergencyContact: { ...editForm.emergencyContact, phone: e.target.value } })} />
                  </div>
                  <div>
                    <label className={labelClass}>Relationship</label>
                    <select className={inputClass} value={editForm.emergencyContact?.relationship || ""} onChange={e => setEditForm({ ...editForm, emergencyContact: { ...editForm.emergencyContact, relationship: e.target.value } })}>
                      {["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 flex-shrink-0">
              <button onClick={() => setEditModalOpen(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button onClick={handleEditSave} className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-xl text-sm font-semibold hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════ */}
      {/*  SUSPEND / REINSTATE MODAL                 */}
      {/* ══════════════════════════════════════════ */}
      {suspendModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 overflow-hidden">
            <div className={`px-6 py-5 ${employee.employmentStatus === "Suspended" ? "bg-gradient-to-r from-[#2c4a6a] to-[#1e3147]" : "bg-gradient-to-r from-[#4a6b8a] to-[#2c4a6a]"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={employee.employmentStatus === "Suspended"
                      ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"} />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {employee.employmentStatus === "Suspended" ? "Reinstate Employee" : "Suspend Employee"}
                  </h2>
                  <p className="text-sm text-white/80">{employee.firstName} {employee.lastName}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                {employee.employmentStatus === "Suspended"
                  ? "This will restore the employee's active status and reinstate their access to company systems."
                  : "This will temporarily suspend the employee's access and mark their status as Suspended."}
              </p>
              {employee.employmentStatus !== "Suspended" && (
                <div>
                  <label className={labelClass}>Reason for Suspension <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea rows={3} className={`${inputClass} resize-none`}
                    placeholder="e.g. Pending disciplinary review..."
                    value={suspendReason} onChange={e => setSuspendReason(e.target.value)} />
                </div>
              )}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setSuspendModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSuspend}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${employee.employmentStatus === "Suspended" ? "bg-[#2c4a6a] hover:bg-[#1e3147]" : "bg-[#4a6b8a] hover:bg-[#2c4a6a]"}`}>
                {employee.employmentStatus === "Suspended" ? "Yes, Reinstate" : "Yes, Suspend"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════ */}
      {/*  DELETE CONFIRMATION MODAL                 */}
      {/* ══════════════════════════════════════════ */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1e3147] to-[#2c4a6a] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Delete Employee</h2>
                  <p className="text-sm text-white/80">{employee.firstName} {employee.lastName} · {employee.id}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-[#e8eef4] border border-[#c3d2e9] rounded-xl p-4 mb-5">
                <p className="text-sm text-[#1e3147] font-medium">⚠️ This action cannot be undone</p>
                <p className="text-xs text-[#2c4a6a] mt-1">All employee data, payroll history, documents, and attendance records will be permanently deleted.</p>
              </div>
              <div>
                <label className={labelClass}>
                  Type <span className="font-bold text-[#2c4a6a]">{employee.id}</span> to confirm deletion
                </label>
                <input
                  className={`${inputClass} border-[#c3d2e9] focus:ring-[#2c4a6a]`}
                  placeholder={employee.id}
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                />
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => { setDeleteModalOpen(false); setDeleteConfirmText(""); }}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete}
                disabled={deleteConfirmText !== employee.id}
                className="flex-1 px-4 py-2.5 bg-[#2c4a6a] hover:bg-[#1e3147] disabled:bg-[#c3d2e9] disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white transition-all">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}