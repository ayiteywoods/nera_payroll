"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PayrollDetailsPage() {
  const router = useRouter();
  const [payroll, setPayroll] = useState(null);
  const [activeTab, setActiveTab] = useState<"overview" | "employees" | "deductions" | "approvals">("overview");

  // Sample employee data for the payroll
  const [payrollEmployees] = useState([
    { id: "EMP-GH-000001", name: "Kwame Boateng", department: "Engineering", position: "Manager", basicSalary: 5200, allowances: 800, tax: 450, ssnit: 312, netPay: 5238 },
    { id: "EMP-GH-000002", name: "Ama Serwaa", department: "Sales", position: "Executive", basicSalary: 4800, allowances: 600, tax: 405, ssnit: 288, netPay: 4707 },
    { id: "EMP-GH-000003", name: "Kofi Mensah", department: "Finance", position: "Analyst", basicSalary: 4500, allowances: 500, tax: 375, ssnit: 270, netPay: 4355 },
    { id: "EMP-GH-000004", name: "Abena Osei", department: "HR", position: "Officer", basicSalary: 4200, allowances: 450, tax: 348, ssnit: 252, netPay: 4050 },
    { id: "EMP-GH-000005", name: "Yaw Asante", department: "Marketing", position: "Specialist", basicSalary: 4600, allowances: 550, tax: 386, ssnit: 276, netPay: 4488 },
  ]);

  useEffect(() => {
    // Get payroll data from sessionStorage
    const payrollData = sessionStorage.getItem('selected_payroll');
    if (payrollData) {
      setPayroll(JSON.parse(payrollData));
    } else {
      router.push('/payroll');
    }
  }, []);

  if (!payroll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2c4a6a] animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading payroll details...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "bg-[#2c4a6a]/10 text-[#2c4a6a] border-[#2c4a6a]/30";
      case "Pending": return "bg-gray-100 text-gray-700 border-gray-200";
      case "Processing": return "bg-[#6b8ca3]/10 text-[#6b8ca3] border-[#6b8ca3]/30";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getApprovalColor = (status) => {
    switch(status) {
      case "Approved": return "bg-[#2c4a6a]/10 text-[#2c4a6a]";
      case "Pending": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/payroll" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#153453]">Payroll Details</h1>
            <p className="text-sm text-gray-600 mt-1">Complete breakdown of payroll {payroll.id}</p>
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{payroll.id}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payroll.status)}`}>
                {payroll.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getApprovalColor(payroll.approvalStatus)}`}>
                {payroll.approvalStatus}
              </span>
            </div>
            <p className="text-white/80 text-sm">{payroll.month}</p>
            <p className="text-white/60 text-xs mt-1">{payroll.period}</p>
          </div>
          <div className="flex gap-3">
            {payroll.approvalStatus === "Pending" && (
              <button
                onClick={() => {
                  sessionStorage.setItem('payroll_to_approve', JSON.stringify(payroll));
                  router.push('/payroll/approve');
                }}
                className="px-5 py-2.5 bg-white text-[#2c4a6a] rounded-lg text-sm font-medium hover:bg-white/90 transition-all"
              >
                Approve Now
              </button>
            )}
            <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
              Download Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-white/70 text-xs mb-1">Total Employees</p>
            <p className="text-2xl font-bold text-white">{payroll.totalEmployees}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-white/70 text-xs mb-1">Gross Pay</p>
            <p className="text-2xl font-bold text-white">₵{payroll.totalGrossPay.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-white/70 text-xs mb-1">Deductions</p>
            <p className="text-2xl font-bold text-white/70">₵{payroll.totalDeductions.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-white/70 text-xs mb-1">Net Pay</p>
            <p className="text-2xl font-bold text-white">₵{payroll.totalNetPay.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 mb-6">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex gap-6 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { id: "employees", label: "Employees", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
              { id: "deductions", label: "Deductions", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
              { id: "approvals", label: "Approvals", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#2c4a6a]/10 text-[#2c4a6a]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payroll Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Payroll ID</p>
                    <p className="font-semibold text-gray-900">{payroll.id}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Period</p>
                    <p className="font-semibold text-gray-900">{payroll.period}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Processed Date</p>
                    <p className="font-semibold text-gray-900">{payroll.processedDate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Processed By</p>
                    <p className="font-semibold text-gray-900">{payroll.processedBy}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Breakdown</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Total Employees</span>
                      <span className="text-xl font-bold text-gray-900">{payroll.totalEmployees}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Gross Salary</span>
                      <span className="text-xl font-bold text-gray-900">₵{payroll.totalGrossPay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Total Deductions</span>
                      <span className="text-xl font-bold text-gray-700">₵{payroll.totalDeductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-900 font-semibold">Net Pay</span>
                      <span className="text-2xl font-bold text-[#2c4a6a]">₵{payroll.totalNetPay.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Deduction Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Income Tax</p>
                    <p className="text-xl font-bold text-gray-900">₵{Math.round(payroll.totalDeductions * 0.6).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">~{((payroll.totalDeductions * 0.6 / payroll.totalGrossPay) * 100).toFixed(1)}% of gross</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">SSNIT</p>
                    <p className="text-xl font-bold text-gray-900">₵{Math.round(payroll.totalDeductions * 0.4).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">~{((payroll.totalDeductions * 0.4 / payroll.totalGrossPay) * 100).toFixed(1)}% of gross</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Total Rate</p>
                    <p className="text-xl font-bold text-gray-900">{((payroll.totalDeductions / payroll.totalGrossPay) * 100).toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 mt-1">Combined deduction rate</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employees Tab */}
          {activeTab === "employees" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Employee Breakdown</h3>
                <p className="text-sm text-gray-600">{payrollEmployees.length} employees in this payroll</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Department</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Basic Salary</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Allowances</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Deductions</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Net Pay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payrollEmployees.map(emp => (
                      <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                            <p className="text-xs text-gray-500">{emp.id}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm text-gray-900">{emp.department}</p>
                            <p className="text-xs text-gray-500">{emp.position}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="text-sm font-semibold text-gray-900">₵{emp.basicSalary.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="text-sm text-gray-900">₵{emp.allowances.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="text-sm text-gray-700">₵{(emp.tax + emp.ssnit).toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="text-sm font-bold text-[#2c4a6a]">₵{emp.netPay.toLocaleString()}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Deductions Tab */}
          {activeTab === "deductions" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Deduction Details</h3>
                <div className="space-y-4">
                  {payrollEmployees.map(emp => (
                    <div key={emp.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.id} • {emp.department}</p>
                        </div>
                        <p className="text-lg font-bold text-gray-700">₵{(emp.tax + emp.ssnit).toLocaleString()}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Income Tax</p>
                          <p className="text-sm font-semibold text-gray-900">₵{emp.tax.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">SSNIT</p>
                          <p className="text-sm font-semibold text-gray-900">₵{emp.ssnit.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Rate</p>
                          <p className="text-sm font-semibold text-gray-900">{(((emp.tax + emp.ssnit) / (emp.basicSalary + emp.allowances)) * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Approvals Tab */}
          {activeTab === "approvals" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Approval Status</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      payroll.approvalStatus === "Approved" ? "bg-[#2c4a6a]/10" : "bg-gray-200"
                    }`}>
                      <svg className={`w-6 h-6 ${payroll.approvalStatus === "Approved" ? "text-[#2c4a6a]" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">Approval Status</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getApprovalColor(payroll.approvalStatus)}`}>
                          {payroll.approvalStatus}
                        </span>
                      </div>
                      {payroll.approvalStatus === "Approved" ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Approved By</p>
                              <p className="font-semibold text-gray-900">{payroll.approvedBy || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Approved Date</p>
                              <p className="font-semibold text-gray-900">{payroll.approvedDate || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">This payroll is awaiting approval from an authorized person.</p>
                      )}
                    </div>
                  </div>

                  {payroll.approvalStatus === "Pending" && (
                    <button
                      onClick={() => {
                        sessionStorage.setItem('payroll_to_approve', JSON.stringify(payroll));
                        router.push('/payroll/approve');
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all"
                    >
                      Approve This Payroll
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Processing History</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2c4a6a]/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#2c4a6a]"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Payroll Processed</p>
                      <p className="text-xs text-gray-500">{payroll.processedDate} by {payroll.processedBy}</p>
                    </div>
                  </div>
                  {payroll.approvalStatus === "Approved" && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2c4a6a]/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-[#2c4a6a]"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">Payroll Approved</p>
                        <p className="text-xs text-gray-500">{payroll.approvedDate} by {payroll.approvedBy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}