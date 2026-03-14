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
  { month: "January 2026",  gross: 9700, deductions: 1455, net: 8245, status: "Paid" },
  { month: "December 2025", gross: 9700, deductions: 1455, net: 8245, status: "Paid" },
  { month: "November 2025", gross: 9700, deductions: 1455, net: 8245, status: "Paid" },
  { month: "October 2025",  gross: 9700, deductions: 1455, net: 8245, status: "Paid" },
  { month: "September 2025",gross: 9700, deductions: 1455, net: 8245, status: "Paid" },
];

const taxRecords = [
  { year: "2025", taxableIncome: 102000, taxPaid: 15300, taxRate: "15%", filingStatus: "Filed", filingDate: "2026-01-15", refundAmount: 0,   status: "Completed" },
  { year: "2024", taxableIncome: 96000,  taxPaid: 14400, taxRate: "15%", filingStatus: "Filed", filingDate: "2025-01-20", refundAmount: 0,   status: "Completed" },
  { year: "2023", taxableIncome: 90000,  taxPaid: 13500, taxRate: "15%", filingStatus: "Filed", filingDate: "2024-01-18", refundAmount: 250, status: "Completed" },
];

const ssnitRecords = [
  { month: "February 2026", employeeContribution: 467.50, employerContribution: 722.50, totalContribution: 1190, tier1: 935, tier2: 255, status: "Paid" },
  { month: "January 2026",  employeeContribution: 467.50, employerContribution: 722.50, totalContribution: 1190, tier1: 935, tier2: 255, status: "Paid" },
  { month: "December 2025", employeeContribution: 467.50, employerContribution: 722.50, totalContribution: 1190, tier1: 935, tier2: 255, status: "Paid" },
  { month: "November 2025", employeeContribution: 467.50, employerContribution: 722.50, totalContribution: 1190, tier1: 935, tier2: 255, status: "Paid" },
  { month: "October 2025",  employeeContribution: 467.50, employerContribution: 722.50, totalContribution: 1190, tier1: 935, tier2: 255, status: "Paid" },
];

const recruitmentTimeline = [
  { stage: "Application received",  date: "2020-01-15", status: "Completed", notes: "Applied via company career portal",                     duration: "1 day"    },
  { stage: "Resume screening",      date: "2020-01-16", status: "Completed", notes: "Passed initial screening — 5 years experience",          duration: "3 days"   },
  { stage: "Phone interview",       date: "2020-01-20", status: "Completed", notes: "Conducted by Sarah Johnson (HR)",                        duration: "30 mins", score: "9/10"      },
  { stage: "Technical assessment",  date: "2020-01-25", status: "Completed", notes: "Online coding challenge — Python & React",               duration: "2 hours", score: "95/100"    },
  { stage: "Panel interview",       date: "2020-02-01", status: "Completed", notes: "Met with Engineering team leads",                        duration: "1.5 hours",score: "Excellent" },
  { stage: "Reference check",       date: "2020-02-10", status: "Completed", notes: "3 professional references verified",                    duration: "5 days"   },
  { stage: "Background check",      date: "2020-02-15", status: "Completed", notes: "Criminal & employment history cleared",                 duration: "3 days"   },
  { stage: "Offer extended",        date: "2020-02-20", status: "Completed", notes: "Senior Software Engineer — GHS 8,500.00/month",         duration: "2 days"   },
  { stage: "Offer accepted",        date: "2020-02-22", status: "Completed", notes: "Accepted offer with start date Mar 1, 2020",            duration: "1 day"    },
  { stage: "Onboarding started",    date: "2020-03-01", status: "Completed", notes: "First day — orientation & equipment setup",             duration: "Ongoing"  },
];

const benefits = [
  { name: "Health insurance",          provider: "Ghana Health Insurance", coverage: "Individual + Spouse", premium: 450, employerPaid: 350, employeePaid: 100, status: "Active", effectiveDate: "2020-03-01" },
  { name: "Life insurance",            provider: "Enterprise Life",        coverage: "2x Annual Salary",    premium: 180, employerPaid: 180, employeePaid: 0,   status: "Active", effectiveDate: "2020-03-01" },
  { name: "Dental insurance",          provider: "Ghana Dental Care",      coverage: "Individual",          premium: 85,  employerPaid: 60,  employeePaid: 25,  status: "Active", effectiveDate: "2021-01-01" },
  { name: "Pension (Tier 2)",          provider: "Enterprise Trustees",    coverage: "Voluntary",           premium: 255, employerPaid: 0,   employeePaid: 255, status: "Active", effectiveDate: "2020-03-01" },
  { name: "Professional development",  provider: "Internal Budget",        coverage: "Annual allowance",    premium: 200, employerPaid: 200, employeePaid: 0,   status: "Active", effectiveDate: "2020-03-01" },
  { name: "Transportation allowance",  provider: "Monthly benefit",        coverage: "Fuel/Transport",      premium: 300, employerPaid: 300, employeePaid: 0,   status: "Active", effectiveDate: "2020-03-01" },
];

const deductions = [
  { name: "Paye tax",       amount: 1275, type: "Statutory", frequency: "Monthly", ytdAmount: 15300, description: "Pay As You Earn income tax"          },
  { name: "Ssnit Tier 1",   amount: 467.50, type: "Statutory", frequency: "Monthly", ytdAmount: 5610, description: "Social Security contribution (5.5%)" },
  { name: "Ssnit Tier 2",   amount: 255,  type: "Voluntary", frequency: "Monthly", ytdAmount: 3060, description: "Voluntary pension contribution"        },
  { name: "Health insurance",amount: 100, type: "Benefit",   frequency: "Monthly", ytdAmount: 1200, description: "Employee portion of health premium"   },
  { name: "Dental insurance",amount: 25,  type: "Benefit",   frequency: "Monthly", ytdAmount: 300,  description: "Employee portion of dental premium"   },
  { name: "Union dues",      amount: 50,  type: "Voluntary", frequency: "Monthly", ytdAmount: 600,  description: "Tech Workers Union membership"         },
];

const leaveRecords = [
  { type: "Annual leave", startDate: "2025-12-20", endDate: "2026-01-05", days: 12, status: "Approved", approvedBy: "Sarah Johnson", appliedDate: "2025-11-15", reason: "Christmas holiday with family" },
  { type: "Sick leave",   startDate: "2025-10-12", endDate: "2025-10-14", days: 3,  status: "Approved", approvedBy: "Sarah Johnson", appliedDate: "2025-10-12", reason: "Flu and fever", medicalCert: "Yes" },
  { type: "Annual leave", startDate: "2025-08-05", endDate: "2025-08-09", days: 5,  status: "Approved", approvedBy: "Sarah Johnson", appliedDate: "2025-07-10", reason: "Personal travel" },
  { type: "Casual leave", startDate: "2025-06-20", endDate: "2025-06-20", days: 1,  status: "Approved", approvedBy: "Sarah Johnson", appliedDate: "2025-06-19", reason: "Family emergency" },
  { type: "Annual leave", startDate: "2025-04-10", endDate: "2025-04-17", days: 6,  status: "Approved", approvedBy: "Sarah Johnson", appliedDate: "2025-03-05", reason: "Easter vacation" },
];

const leaveBalance = {
  annual:    { total: 21, used: 23, remaining: -2, carried: 0 },
  sick:      { total: 10, used: 5,  remaining: 5,  carried: 0 },
  casual:    { total: 5,  used: 1,  remaining: 4,  carried: 0 },
  maternity: { total: 0,  used: 0,  remaining: 0,  carried: 0 },
  paternity: { total: 7,  used: 0,  remaining: 7,  carried: 0 },
};

const fmt = (n: number) => `GHS ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const totalTaxPaid    = taxRecords.reduce((s, r) => s + r.taxPaid, 0);
const totalSSNIT      = ssnitRecords.reduce((s, r) => s + r.totalContribution, 0);
const totalBenefitCost = benefits.reduce((s, b) => s + b.premium, 0);
const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);

const attendanceRecords = generateAttendance();

// Status badge helpers — same pattern as payroll detail page
const statusBadge = (s: string) => ({
  Active:    { pill: "bg-[#2c4a6a]/10 text-[#2c4a6a] border border-[#2c4a6a]/25", dot: "bg-[#2c4a6a]" },
  "On Leave":{ pill: "bg-[#6b8ca3]/10 text-[#6b8ca3] border border-[#6b8ca3]/25", dot: "bg-[#6b8ca3]" },
  Suspended: { pill: "bg-gray-200 text-gray-600 border border-gray-300",           dot: "bg-gray-500"  },
}[s] ?? { pill: "bg-gray-100 text-gray-600 border border-gray-200", dot: "bg-gray-400" });

const approvalBadge = (s: string) => ({
  Approved: { pill: "bg-[#2c4a6a]/10 text-[#2c4a6a] border border-[#2c4a6a]/25", dot: "bg-[#2c4a6a]" },
  Pending:  { pill: "bg-gray-100 text-gray-500 border border-gray-200",           dot: "bg-gray-400"  },
  Rejected: { pill: "bg-gray-200 text-gray-600 border border-gray-300",           dot: "bg-gray-500"  },
}[s] ?? { pill: "bg-gray-100 text-gray-600 border border-gray-200", dot: "bg-gray-400" });

const attendanceBadge = (s: string) => ({
  present:  { pill: "bg-[#2c4a6a]/10 text-[#2c4a6a] border border-[#2c4a6a]/25", dot: "bg-[#2c4a6a]" },
  late:     { pill: "bg-[#6b8ca3]/10 text-[#6b8ca3] border border-[#6b8ca3]/25", dot: "bg-[#6b8ca3]" },
  absent:   { pill: "bg-gray-200 text-gray-600 border border-gray-300",           dot: "bg-gray-500"  },
  onLeave:  { pill: "bg-gray-100 text-gray-500 border border-gray-200",           dot: "bg-gray-400"  },
}[s] ?? { pill: "bg-gray-100 text-gray-600 border border-gray-200", dot: "bg-gray-400" });

export default function EmployeeProfilePage() {
  const [activeTab, setActiveTab]           = useState("overview");
  const [employee, setEmployee]             = useState<any>(FALLBACK_EMPLOYEE);
  const [imageError, setImageError]         = useState(false);
  const [editModalOpen, setEditModalOpen]   = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [editForm, setEditForm]             = useState<any>({});
  const [suspendReason, setSuspendReason]   = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [saveSuccess, setSaveSuccess]       = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("nerapay_employee");
      if (stored) setEmployee(JSON.parse(stored));
    } catch { }
  }, []);

  const openEditModal = () => { setEditForm({ ...employee }); setEditModalOpen(true); };

  const handleEditSave = () => {
    setEmployee({ ...editForm });
    try { sessionStorage.setItem("nerapay_employee", JSON.stringify(editForm)); } catch { }
    setEditModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSuspend = () => {
    const updated = { ...employee, employmentStatus: employee.employmentStatus === "Suspended" ? "Active" : "Suspended" };
    setEmployee(updated);
    try { sessionStorage.setItem("nerapay_employee", JSON.stringify(updated)); } catch { }
    setSuspendModalOpen(false);
    setSuspendReason("");
  };

  const handleDelete = () => { setDeleteModalOpen(false); window.location.href = "/employees"; };

  const tabs = [
    { id: "overview",    label: "Overview",    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "attendance",  label: "Attendance",  icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { id: "payroll",     label: "Payroll",     icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "tax",         label: "Tax & Ssnit", icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" },
    { id: "benefits",    label: "Benefits",    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { id: "leave",       label: "Leave",       icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { id: "recruitment", label: "Recruitment", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { id: "documents",   label: "Documents",   icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  ];

  const presentDays    = attendanceRecords.filter(r => r.status === "present").length;
  const absentDays     = attendanceRecords.filter(r => r.status === "absent").length;
  const lateDays       = attendanceRecords.filter(r => r.status === "late").length;
  const leaveDays      = attendanceRecords.filter(r => r.status === "onLeave").length;
  const totalDays      = attendanceRecords.length;
  const attendanceRate = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white text-gray-900";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  const sb = statusBadge(employee.employmentStatus);

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">

      {/* Success toast */}
      {saveSuccess && (
        <div className="fixed top-6 right-6 z-[100] bg-[#2c4a6a] text-white px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">Employee profile updated successfully</span>
        </div>
      )}

      {/* Header */}
   
<div className="flex items-center gap-4 mb-6">
  <Link
    href="/employees"
    className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
  >
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </Link>
  <div>
    <p className="text-xs text-gray-400 font-normal">Employee management</p>
    <h1 className="text-2xl md:text-3xl font-bold text-[#153453] tracking-tight">
      Employee profile — {employee.id}
    </h1>
  </div>
</div>

      {/* Profile hero card */}
      <div className="bg-white rounded-2xl border border-gray-100 mb-6">
        <div className="h-32 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] relative rounded-t-2xl">
          <div className="absolute inset-0 opacity-10 rounded-t-2xl"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={openEditModal}
              className="px-3 py-1.5 border border-white/30 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button onClick={() => setSuspendModalOpen(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border ${
                employee.employmentStatus === "Suspended"
                  ? "bg-[#d4e1ed] hover:bg-[#a8c5db] text-[#2c4a6a] border-[#a8c5db]"
                  : "bg-[#e8eef4] hover:bg-[#c3d2e9] text-[#4a6b8a] border-[#c3d2e9]"
              }`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                  employee.employmentStatus === "Suspended"
                    ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                } />
              </svg>
              {employee.employmentStatus === "Suspended" ? "Reinstate" : "Suspend"}
            </button>
            <button onClick={() => setDeleteModalOpen(true)}
              className="px-3 py-1.5 bg-[#bfcfde] hover:bg-[#96b3cc] rounded-lg text-xs font-medium text-[#1e3147] transition-colors flex items-center gap-1.5 border border-[#96b3cc]">
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
            <div className="w-20 h-20 rounded-xl border-4 border-white shadow-lg flex-shrink-0 relative overflow-hidden bg-white">
              {!imageError && employee.profileImage ? (
                <img src={employee.profileImage} alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-full h-full object-cover" onError={() => setImageError(true)} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white text-2xl font-bold">
                  {employee.firstName?.[0]}{employee.lastName?.[0]}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-10 sm:pt-12">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-[#1e3147]">
                  {employee.firstName} {employee.otherNames} {employee.lastName}
                </h1>
                {/* Updated badge — dot + pill, matches payroll pages */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sb.pill}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sb.dot}`} />
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
              { label: "Years at company",    value: employee.yearsAtCompany,    suffix: "yrs" },
              { label: "Performance score",   value: employee.performanceScore,  suffix: "%"   },
              { label: "Tasks completed",     value: employee.tasksCompleted,    suffix: ""    },
              { label: "Projects",            value: employee.projectsCount,     suffix: ""    },
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

      {/* Tab navigation */}
      <div className="bg-white rounded-2xl border border-gray-100 mb-6">
        <div className="flex overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-all flex-shrink-0 whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "text-[#2c4a6a] border-[#2c4a6a] bg-[#2c4a6a]/5"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
              }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Overview tab ─────────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {[
              {
                title: "Personal information",
                icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                fields: [
                  { label: "Full name",       value: `${employee.firstName} ${employee.otherNames} ${employee.lastName}` },
                  { label: "Date of birth",   value: new Date(employee.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Gender",          value: employee.gender },
                  { label: "Phone",           value: employee.phone },
                  { label: "Email",           value: employee.email },
                  { label: "Address",         value: employee.residentialAddress },
                ],
              },
              {
                title: "Employment details",
                icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                fields: [
                  { label: "Employee id",       value: employee.id },
                  { label: "Job title",         value: employee.jobTitle },
                  { label: "Department",        value: employee.department },
                  { label: "Employment type",   value: employee.employmentType },
                  { label: "Date of hire",      value: new Date(employee.hireDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Employment status", value: employee.employmentStatus },
                ],
              },
              {
                title: "Bank & payment details",
                icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
                fields: [
                  { label: "Bank name",       value: employee.bankName },
                  { label: "Account name",    value: employee.accountName },
                  { label: "Account number",  value: "•••• •••• " + employee.accountNumber?.slice(-4) },
                  { label: "Payment method",  value: employee.paymentMethod },
                  { label: "Tax id (TIN)",    value: employee.taxId },
                  { label: "Ssnit",           value: employee.ssnit },
                ],
              },
            ].map(section => (
              <div key={section.title} className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-base font-bold text-[#1e3147] mb-5 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} />
                    </svg>
                  </div>
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.fields.map(item => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-1">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {/* Salary card */}
            <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl p-6 text-white">
              <p className="text-sm text-white/70 mb-1">Monthly salary</p>
              <p className="text-4xl font-bold mb-1">GHS {employee.basicSalary?.toLocaleString()}</p>
              <p className="text-xs text-white/60 mb-5">{employee.salaryType} · {employee.employmentType}</p>
              <div className="space-y-2 pt-4 border-t border-white/20">
                <div className="flex justify-between text-sm"><span className="text-white/70">Basic salary</span><span className="font-semibold">GHS {employee.basicSalary?.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/70">Allowances</span><span className="font-semibold">+GHS {employee.allowances?.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/70">Tax (PAYE ~15%)</span><span className="font-semibold text-white/80">-GHS {Math.round(employee.basicSalary * 0.15).toLocaleString()}</span></div>
                <div className="flex justify-between text-sm pt-2 border-t border-white/20">
                  <span className="text-white font-semibold">Net pay</span>
                  <span className="font-bold text-lg">GHS {(employee.basicSalary + employee.allowances - Math.round(employee.basicSalary * 0.15)).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Attendance mini */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-[#1e3147] mb-4">Attendance (this month)</h3>
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
                  {[
                    { label: "Present", val: presentDays, color: "bg-[#2c4a6a]" },
                    { label: "Absent",  val: absentDays,  color: "bg-[#1e3147]" },
                    { label: "Late",    val: lateDays,    color: "bg-[#6b8ca3]" },
                    { label: "Leave",   val: leaveDays,   color: "bg-gray-400"  },
                  ].map(r => (
                    <div key={r.label} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${r.color}`} />
                      <span className="text-gray-600">{r.label} <b>{r.val}</b></span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setActiveTab("attendance")} className="w-full text-xs text-[#2c4a6a] font-medium hover:underline">
                View full attendance →
              </button>
            </div>

            {/* Emergency contact */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-[#1e3147] mb-4">Emergency contact</h3>
              <div className="space-y-2">
                {[
                  { label: "Name",     value: employee.emergencyContact?.name },
                  { label: "Phone",    value: employee.emergencyContact?.phone },
                  { label: "Relation", value: employee.emergencyContact?.relationship },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{r.label}</span>
                    <span className="font-semibold text-gray-900">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Attendance tab ───────────────────────────────────────────────── */}
      {activeTab === "attendance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Present",  value: presentDays, dark: true  },
              { label: "Absent",   value: absentDays,  dark: false },
              { label: "Late",     value: lateDays,    dark: true  },
              { label: "On leave", value: leaveDays,   dark: false },
            ].map(c => (
              <div key={c.label} className={`rounded-2xl p-5 text-white transition-all hover:scale-[1.02] ${
                c.dark ? "bg-gradient-to-br from-[#2c4a6a] to-[#1e3147]" : "bg-gradient-to-br from-[#3d5a7c] to-[#2c4a6a]"
              }`}>
                <p className="text-xs text-white/60 font-medium mb-2">{c.label}</p>
                <p className="text-3xl font-bold">{c.value}</p>
                <p className="text-xs text-white/50 mt-1">{totalDays ? Math.round((c.value / totalDays) * 100) : 0}% of working days</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1e3147]">Attendance records</h2>
              <span className="text-sm text-gray-500">{attendanceRecords.length} working days</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Date","Day","Clock in","Clock out","Status"].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendanceRecords.map((rec, i) => {
                    const d = new Date(rec.date);
                    const ab = attendanceBadge(rec.status);
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3.5 text-sm font-medium text-gray-900">{d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td className="px-6 py-3.5 text-sm text-gray-500">{d.toLocaleDateString("en-GB", { weekday: "long" })}</td>
                        <td className="px-6 py-3.5 text-sm text-gray-700">{rec.clockIn}</td>
                        <td className="px-6 py-3.5 text-sm text-gray-700">{rec.clockOut}</td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${ab.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ab.dot}`} />
                            {rec.status === "onLeave" ? "On leave" : rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
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

      {/* ── Payroll tab ──────────────────────────────────────────────────── */}
      {activeTab === "payroll" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                label: "Gross monthly pay",
                value: `GHS ${(employee.basicSalary + employee.allowances).toLocaleString()}`,
                rows: [
                  { label: "Basic salary", value: `GHS ${employee.basicSalary?.toLocaleString()}` },
                  { label: "Allowances",   value: `GHS ${employee.allowances?.toLocaleString()}` },
                ],
                dark: true,
              },
              {
                label: "Total deductions",
                value: `GHS ${Math.round(employee.basicSalary * 0.15 + employee.basicSalary * 0.055).toLocaleString()}`,
                rows: [
                  { label: "PAYE tax (15%)", value: `GHS ${Math.round(employee.basicSalary * 0.15).toLocaleString()}` },
                  { label: "Ssnit (5.5%)",   value: `GHS ${Math.round(employee.basicSalary * 0.055).toLocaleString()}` },
                ],
                dark: false,
              },
              {
                label: "Net pay (take home)",
                value: `GHS ${(employee.basicSalary + employee.allowances - Math.round(employee.basicSalary * 0.15) - Math.round(employee.basicSalary * 0.055)).toLocaleString()}`,
                rows: [
                  { label: "Payment method", value: employee.paymentMethod },
                  { label: "Bank",           value: employee.bankName },
                ],
                dark: true,
              },
            ].map(c => (
              <div key={c.label} className={`rounded-2xl p-6 text-white ${
                c.dark ? "bg-gradient-to-br from-[#2c4a6a] to-[#1e3147]" : "bg-gradient-to-br from-[#3d5a7c] to-[#2c4a6a]"
              }`}>
                <p className="text-xs text-white/60 font-medium mb-1">{c.label}</p>
                <p className="text-3xl font-bold mb-4">{c.value}</p>
                <div className="space-y-2 text-sm">
                  {c.rows.map(r => (
                    <div key={r.label} className="flex justify-between">
                      <span className="text-white/70">{r.label}</span>
                      <span className="font-medium">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#1e3147]">Payslip history</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Period","Gross pay","Deductions","Net pay","Status","Action"].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payslips.map((p, i) => {
                    const pb = approvalBadge(p.status === "Paid" ? "Approved" : "Pending");
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{p.month}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">GHS {p.gross.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">-GHS {p.deductions.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm font-bold text-[#2c4a6a]">GHS {p.net.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${pb.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${pb.dot}`} />
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-xs text-[#2c4a6a] font-medium hover:underline flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download
                          </button>
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

      {/* ── Benefits tab ─────────────────────────────────────────────────── */}
      {activeTab === "benefits" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total benefits",   value: fmt(totalBenefitCost),                                          sub: "Monthly value",        dark: true  },
              { label: "Employer paid",    value: fmt(benefits.reduce((s, b) => s + b.employerPaid, 0)),          sub: "Company contribution", dark: false },
              { label: "Employee paid",    value: fmt(benefits.reduce((s, b) => s + b.employeePaid, 0)),          sub: "Your contribution",    dark: true  },
              { label: "Active benefits",  value: String(benefits.filter(b => b.status === "Active").length),     sub: "Current enrollments",  dark: false },
            ].map(c => (
              <div key={c.label} className={`rounded-2xl p-5 text-white transition-all hover:scale-[1.02] ${
                c.dark ? "bg-gradient-to-br from-[#2c4a6a] to-[#1e3147]" : "bg-gradient-to-br from-[#3d5a7c] to-[#2c4a6a]"
              }`}>
                <p className="text-xs text-white/60 font-medium mb-2">{c.label}</p>
                <p className="text-2xl font-bold leading-tight">{c.value}</p>
                <p className="text-xs text-white/50 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#1e3147] mb-5">Active benefits</h2>
            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-[#2c4a6a]/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">{benefit.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{benefit.provider} · {benefit.coverage}</p>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        benefit.status === "Active"
                          ? "bg-[#2c4a6a]/10 text-[#2c4a6a] border-[#2c4a6a]/25"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${benefit.status === "Active" ? "bg-[#2c4a6a]" : "bg-gray-400"}`} />
                        {benefit.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Monthly premium</p>
                      <p className="text-2xl font-bold text-[#2c4a6a]">{fmt(benefit.premium)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <div><p className="text-xs text-gray-500 mb-1">Employer pays</p><p className="text-sm font-bold text-[#2c4a6a]">{fmt(benefit.employerPaid)}</p></div>
                    <div><p className="text-xs text-gray-500 mb-1">Employee pays</p><p className="text-sm font-bold text-gray-700">{fmt(benefit.employeePaid)}</p></div>
                    <div><p className="text-xs text-gray-500 mb-1">Effective date</p><p className="text-sm font-medium text-gray-700">{new Date(benefit.effectiveDate).toLocaleDateString("en-GB")}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#1e3147]">Monthly deductions</h2>
              <p className="text-sm text-gray-500 mt-1">Total: {fmt(totalDeductions)}/month</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Deduction","Type","Amount","Frequency","Ytd amount","Description"].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deductions.map((ded, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{ded.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          ded.type === "Statutory" ? "bg-[#2c4a6a]/10 text-[#2c4a6a] border-[#2c4a6a]/25" :
                          ded.type === "Benefit"   ? "bg-[#6b8ca3]/10 text-[#6b8ca3] border-[#6b8ca3]/25" :
                                                     "bg-gray-100 text-gray-500 border-gray-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            ded.type === "Statutory" ? "bg-[#2c4a6a]" : ded.type === "Benefit" ? "bg-[#6b8ca3]" : "bg-gray-400"
                          }`} />
                          {ded.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#2c4a6a]">{fmt(ded.amount)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{ded.frequency}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">{fmt(ded.ytdAmount)}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{ded.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Leave tab ────────────────────────────────────────────────────── */}
      {activeTab === "leave" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(leaveBalance).map(([type, data], i) => (
              <div key={type} className={`rounded-2xl p-5 text-white transition-all hover:scale-[1.02] ${
                i % 2 === 0 ? "bg-gradient-to-br from-[#2c4a6a] to-[#1e3147]" : "bg-gradient-to-br from-[#3d5a7c] to-[#2c4a6a]"
              }`}>
                <p className="text-xs text-white/60 font-medium mb-2 capitalize">{type} leave</p>
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-3xl font-bold">{data.remaining}</p>
                    <p className="text-xs text-white/50">days left</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white/70">{data.used}/{data.total}</p>
                    <p className="text-xs text-white/50">used</p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white/70 rounded-full"
                    style={{ width: `${data.total ? Math.min((data.used / data.total) * 100, 100) : 0}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total leave taken",  value: leaveRecords.reduce((s, r) => s + r.days, 0), sub: "days this year"      },
              { label: "Leave requests",     value: leaveRecords.length,                           sub: "total applications" },
              { label: "Approval rate",      value: "100%",                                        sub: "all approved"       },
              { label: "Avg leave duration", value: Math.round(leaveRecords.reduce((s, r) => s + r.days, 0) / leaveRecords.length), sub: "days per request" },
            ].map((c, i) => (
              <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-500 font-medium mb-2">{c.label}</p>
                <p className="text-3xl font-bold text-[#1e3147]">{c.value}</p>
                <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#1e3147]">Leave history</h2>
                <p className="text-sm text-gray-500 mt-1">{leaveRecords.length} records</p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all">
                Request leave
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Leave type","Start date","End date","Days","Status","Approved by","Applied date","Reason","Medical cert"].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaveRecords.map((leave, i) => {
                    const lb = approvalBadge(leave.status);
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{leave.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{new Date(leave.startDate).toLocaleDateString("en-GB")}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{new Date(leave.endDate).toLocaleDateString("en-GB")}</td>
                        <td className="px-6 py-4 text-sm font-bold text-[#2c4a6a]">{leave.days} days</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${lb.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${lb.dot}`} />
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{leave.approvedBy}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(leave.appliedDate).toLocaleDateString("en-GB")}</td>
                        <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">{leave.reason}</td>
                        <td className="px-6 py-4 text-xs">
                          {leave.medicalCert && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border bg-[#2c4a6a]/10 text-[#2c4a6a] border-[#2c4a6a]/25">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2c4a6a]" />
                              Yes
                            </span>
                          )}
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

      {/* ── Recruitment tab ──────────────────────────────────────────────── */}
      {activeTab === "recruitment" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl p-8 text-white">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Recruitment journey</h2>
                <p className="text-white/70">Complete hiring timeline from application to onboarding</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60 mb-1">Total duration</p>
                <p className="text-3xl font-bold">45 days</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Application date",  value: "Jan 15, 2020" },
                { label: "Hire date",         value: "Mar 1, 2020"  },
                { label: "Stages completed",  value: `${recruitmentTimeline.length}/10` },
                { label: "Overall score",     value: "Excellent"    },
              ].map(c => (
                <div key={c.label} className="bg-white/10 rounded-xl p-4">
                  <p className="text-xs text-white/60 mb-1">{c.label}</p>
                  <p className="text-lg font-bold">{c.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-base font-bold text-[#1e3147] mb-8">Hiring timeline</h2>
            <div className="space-y-6">
              {recruitmentTimeline.map((stage, index) => (
                <div key={index} className="relative pl-8">
                  {index < recruitmentTimeline.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-[#c3d2e9]" />
                  )}
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center border-4 border-white shadow-lg">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-[#2c4a6a]/30 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">{stage.stage}</h3>
                        <p className="text-xs text-gray-500">{new Date(stage.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {stage.score && (
                          <span className="px-2.5 py-1 bg-[#2c4a6a]/10 text-[#2c4a6a] border border-[#2c4a6a]/25 rounded-lg text-xs font-bold">
                            {stage.score}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border bg-[#2c4a6a]/10 text-[#2c4a6a] border-[#2c4a6a]/25">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2c4a6a]" />
                          {stage.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{stage.notes}</p>
                    <p className="text-xs text-gray-400">Duration: {stage.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-[#1e3147] mb-4">Assessment scores</h3>
              <div className="space-y-3">
                {recruitmentTimeline.filter(s => s.score).map((stage, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{stage.stage}</span>
                    <span className="text-sm font-bold text-[#2c4a6a]">{stage.score}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-[#1e3147] mb-4">Hiring details</h3>
              <div className="space-y-3">
                {[
                  { label: "Position offered",  value: "Senior Software Engineer" },
                  { label: "Starting salary",   value: `${fmt(8500)}/month` },
                  { label: "Department",        value: "Engineering" },
                  { label: "Employment type",   value: "Full-Time" },
                  { label: "Hired by",          value: "HR Team" },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{r.label}</span>
                    <span className="font-semibold text-gray-900">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tax & Ssnit tab ──────────────────────────────────────────────── */}
      {activeTab === "tax" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Total tax paid (all time)",    value: fmt(totalTaxPaid), sub: `${taxRecords.length} years on record`, dark: true  },
              { label: "Total Ssnit contributions",    value: fmt(totalSSNIT),   sub: "Employee + Employer",                  dark: false },
              { label: "Average tax rate",             value: "15%",             sub: "Standard PAYE rate",                   dark: true  },
            ].map(c => (
              <div key={c.label} className={`rounded-2xl p-6 text-white transition-all hover:scale-[1.02] ${
                c.dark ? "bg-gradient-to-br from-[#2c4a6a] to-[#1e3147]" : "bg-gradient-to-br from-[#3d5a7c] to-[#2c4a6a]"
              }`}>
                <p className="text-xs text-white/60 font-medium mb-2">{c.label}</p>
                <p className="text-3xl font-bold leading-tight">{c.value}</p>
                <p className="text-xs text-white/50 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1e3147]">Tax filing history</h2>
              <button className="text-xs text-[#2c4a6a] font-medium hover:underline flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download tax report
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Tax year","Taxable income","Tax paid","Tax rate","Filing status","Filing date","Refund/balance","Status","Action"].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {taxRecords.map((rec, i) => {
                    const rb = approvalBadge("Approved");
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{rec.year}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">{fmt(rec.taxableIncome)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-[#2c4a6a]">{fmt(rec.taxPaid)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{rec.taxRate}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${rb.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${rb.dot}`} />
                            {rec.filingStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(rec.filingDate).toLocaleDateString("en-GB")}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#2c4a6a]">
                          {rec.refundAmount > 0 ? `+${fmt(rec.refundAmount)}` : fmt(0)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${rb.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${rb.dot}`} />
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-xs text-[#2c4a6a] font-medium hover:underline flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Certificate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1e3147]">Ssnit contribution history</h2>
              <button className="text-xs text-[#2c4a6a] font-medium hover:underline flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download statement
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Month","Employee contribution","Employer contribution","Total contribution","Tier 1 (pension)","Tier 2 (voluntary)","Status","Action"].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ssnitRecords.map((rec, i) => {
                    const rb = approvalBadge("Approved");
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{rec.month}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#2c4a6a]">{fmt(rec.employeeContribution)}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#6b8ca3]">{fmt(rec.employerContribution)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{fmt(rec.totalContribution)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{fmt(rec.tier1)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{fmt(rec.tier2)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${rb.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${rb.dot}`} />
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-xs text-[#2c4a6a] font-medium hover:underline">Download</button>
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

      {/* ── Documents tab ────────────────────────────────────────────────── */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "Curriculum vitae",      file: employee.resume,         icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", date: "Uploaded Mar 2020" },
              { name: "National id / Ghana card",file: employee.idDocument,   icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5", date: "Uploaded Mar 2020" },
              { name: "Offer letter",          file: "offer_letter.pdf",      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", date: "Uploaded Mar 2020" },
              { name: "Employment contract",   file: "contract.pdf",          icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", date: "Uploaded Mar 2020" },
              { name: "Tax certificate",       file: "tax_cert.pdf",          icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z", date: "Uploaded Jan 2024" },
              { name: "Academic certificate",  file: "degree.pdf",            icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z", date: "Uploaded Mar 2020" },
            ].map(doc => (
              <div key={doc.name} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#c3d2e9] transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#eef3f9] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={doc.icon} />
                    </svg>
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
              <svg className="w-7 h-7 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Upload new document</p>
            <p className="text-xs text-gray-500">PDF, DOC, or image files up to 10MB</p>
          </div>
        </div>
      )}

      {/* ── Edit modal ───────────────────────────────────────────────────── */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
            <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-white">Edit employee</h2>
                <p className="text-sm text-white/70 mt-0.5">{employee.id} · {employee.firstName} {employee.lastName}</p>
              </div>
              <button onClick={() => setEditModalOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {[
                {
                  title: "Personal information",
                  fields: [
                    { label: "First name",   col: 1, render: () => <input className={inputClass} value={editForm.firstName || ""} onChange={e => setEditForm({ ...editForm, firstName: e.target.value })} /> },
                    { label: "Other names",  col: 1, render: () => <input className={inputClass} value={editForm.otherNames || ""} onChange={e => setEditForm({ ...editForm, otherNames: e.target.value })} /> },
                    { label: "Last name",    col: 1, render: () => <input className={inputClass} value={editForm.lastName || ""} onChange={e => setEditForm({ ...editForm, lastName: e.target.value })} /> },
                    { label: "Date of birth",col: 1, render: () => <input type="date" className={inputClass} value={editForm.dateOfBirth || ""} onChange={e => setEditForm({ ...editForm, dateOfBirth: e.target.value })} /> },
                    { label: "Gender",       col: 1, render: () => <select className={inputClass} value={editForm.gender || ""} onChange={e => setEditForm({ ...editForm, gender: e.target.value })}><option>Male</option><option>Female</option><option>Other</option></select> },
                    { label: "Phone",        col: 1, render: () => <input className={inputClass} value={editForm.phone || ""} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} /> },
                    { label: "Email",        col: 2, render: () => <input type="email" className={inputClass} value={editForm.email || ""} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /> },
                    { label: "Address",      col: 3, render: () => <input className={inputClass} value={editForm.residentialAddress || ""} onChange={e => setEditForm({ ...editForm, residentialAddress: e.target.value })} /> },
                  ],
                  cols: 3,
                },
                {
                  title: "Employment details",
                  fields: [
                    { label: "Job title",         col: 1, render: () => <input className={inputClass} value={editForm.jobTitle || ""} onChange={e => setEditForm({ ...editForm, jobTitle: e.target.value })} /> },
                    { label: "Department",        col: 1, render: () => <select className={inputClass} value={editForm.department || ""} onChange={e => setEditForm({ ...editForm, department: e.target.value })}>{["Engineering","Sales","Marketing","HR","Finance","Operations"].map(d => <option key={d}>{d}</option>)}</select> },
                    { label: "Employment type",   col: 1, render: () => <select className={inputClass} value={editForm.employmentType || ""} onChange={e => setEditForm({ ...editForm, employmentType: e.target.value })}>{["Full-Time","Part-Time","Contract","Intern"].map(t => <option key={t}>{t}</option>)}</select> },
                    { label: "Employment status", col: 1, render: () => <select className={inputClass} value={editForm.employmentStatus || ""} onChange={e => setEditForm({ ...editForm, employmentStatus: e.target.value })}>{["Active","On Leave","Suspended","Terminated"].map(s => <option key={s}>{s}</option>)}</select> },
                    { label: "Date of hire",      col: 1, render: () => <input type="date" className={inputClass} value={editForm.hireDate || ""} onChange={e => setEditForm({ ...editForm, hireDate: e.target.value })} /> },
                    { label: "Salary type",       col: 1, render: () => <select className={inputClass} value={editForm.salaryType || ""} onChange={e => setEditForm({ ...editForm, salaryType: e.target.value })}>{["Monthly","Weekly","Daily","Hourly"].map(s => <option key={s}>{s}</option>)}</select> },
                    { label: "Basic salary (GHS)",col: 1, render: () => <input type="number" className={inputClass} value={editForm.basicSalary || ""} onChange={e => setEditForm({ ...editForm, basicSalary: Number(e.target.value) })} /> },
                    { label: "Allowances (GHS)",  col: 1, render: () => <input type="number" className={inputClass} value={editForm.allowances || ""} onChange={e => setEditForm({ ...editForm, allowances: Number(e.target.value) })} /> },
                  ],
                  cols: 2,
                },
                {
                  title: "Bank & payment",
                  fields: [
                    { label: "Bank name",       col: 1, render: () => <input className={inputClass} value={editForm.bankName || ""} onChange={e => setEditForm({ ...editForm, bankName: e.target.value })} /> },
                    { label: "Account name",    col: 1, render: () => <input className={inputClass} value={editForm.accountName || ""} onChange={e => setEditForm({ ...editForm, accountName: e.target.value })} /> },
                    { label: "Account number",  col: 1, render: () => <input className={inputClass} value={editForm.accountNumber || ""} onChange={e => setEditForm({ ...editForm, accountNumber: e.target.value })} /> },
                    { label: "Payment method",  col: 1, render: () => <select className={inputClass} value={editForm.paymentMethod || ""} onChange={e => setEditForm({ ...editForm, paymentMethod: e.target.value })}>{["Bank Transfer","Mobile Money","Cash","Cheque"].map(m => <option key={m}>{m}</option>)}</select> },
                    { label: "Tax id (TIN)",    col: 1, render: () => <input className={inputClass} value={editForm.taxId || ""} onChange={e => setEditForm({ ...editForm, taxId: e.target.value })} /> },
                    { label: "Ssnit",           col: 1, render: () => <input className={inputClass} value={editForm.ssnit || ""} onChange={e => setEditForm({ ...editForm, ssnit: e.target.value })} /> },
                  ],
                  cols: 2,
                },
                {
                  title: "Emergency contact",
                  fields: [
                    { label: "Contact name",  col: 1, render: () => <input className={inputClass} value={editForm.emergencyContact?.name || ""} onChange={e => setEditForm({ ...editForm, emergencyContact: { ...editForm.emergencyContact, name: e.target.value } })} /> },
                    { label: "Contact phone", col: 1, render: () => <input className={inputClass} value={editForm.emergencyContact?.phone || ""} onChange={e => setEditForm({ ...editForm, emergencyContact: { ...editForm.emergencyContact, phone: e.target.value } })} /> },
                    { label: "Relationship",  col: 1, render: () => <select className={inputClass} value={editForm.emergencyContact?.relationship || ""} onChange={e => setEditForm({ ...editForm, emergencyContact: { ...editForm.emergencyContact, relationship: e.target.value } })}>{["Spouse","Parent","Sibling","Child","Friend","Other"].map(r => <option key={r}>{r}</option>)}</select> },
                  ],
                  cols: 3,
                },
              ].map((section, si) => (
                <div key={si}>
                  {si > 0 && <div className="border-t border-gray-100 mb-6" />}
                  <h3 className="text-xs font-semibold text-gray-400 mb-3">{section.title}</h3>
                  <div className={`grid grid-cols-1 sm:grid-cols-${section.cols} gap-4`}>
                    {section.fields.map(f => (
                      <div key={f.label} className={f.col > 1 ? `sm:col-span-${f.col}` : ""}>
                        <label className={labelClass}>{f.label}</label>
                        {f.render()}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 flex-shrink-0">
              <button onClick={() => setEditModalOpen(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button onClick={handleEditSave} className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-xl text-sm font-semibold hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Suspend / Reinstate modal ────────────────────────────────────── */}
      {suspendModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 overflow-hidden">
            <div className={`px-6 py-5 ${employee.employmentStatus === "Suspended" ? "bg-gradient-to-r from-[#2c4a6a] to-[#1e3147]" : "bg-gradient-to-r from-[#4a6b8a] to-[#2c4a6a]"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                      employee.employmentStatus === "Suspended"
                        ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    } />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {employee.employmentStatus === "Suspended" ? "Reinstate employee" : "Suspend employee"}
                  </h2>
                  <p className="text-sm text-white/80">{employee.firstName} {employee.lastName}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                {employee.employmentStatus === "Suspended"
                  ? "This will restore the employee's active status and reinstate their access to company systems."
                  : "This will temporarily suspend the employee's access and mark their status as suspended."}
              </p>
              {employee.employmentStatus !== "Suspended" && (
                <div>
                  <label className={labelClass}>Reason for suspension <span className="text-gray-400 font-normal">(optional)</span></label>
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
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
                  employee.employmentStatus === "Suspended" ? "bg-[#2c4a6a] hover:bg-[#1e3147]" : "bg-[#4a6b8a] hover:bg-[#2c4a6a]"
                }`}>
                {employee.employmentStatus === "Suspended" ? "Yes, reinstate" : "Yes, suspend"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete modal ─────────────────────────────────────────────────── */}
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
                  <h2 className="text-lg font-bold text-white">Delete employee</h2>
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
                <input className={`${inputClass} border-[#c3d2e9]`}
                  placeholder={employee.id}
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)} />
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
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}