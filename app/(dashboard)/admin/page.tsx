"use client";

import React from "react";
import PayrollCard from "@/components/PayrollCard";
import CountChart from "@/components/CountChart";
import PayrollSummary from "@/components/PayrollSummary";
import AttendanceChart from "@/components/AttendanceChart";
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";

export default function AdminPage() {
  const handleRefresh = () => {
    console.log("Refreshing dashboard data...");
    alert("Refreshing dashboard data...");
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      
      {/* ==================== HEADER ==================== */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Overview of payroll, attendance, and system activities</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ==================== 4 CARDS AT TOP ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <PayrollCard
          period="March 2025"
          title="Total Payroll"
          amount="₵ 125,430"
          subtitle="Net salaries paid"
          footer="Processed on 28th March"
        />
        <PayrollCard
          title="Staff Paid"
          amount={87}
          subtitle="Employees"
          footer="All departments"
        />
        <PayrollCard
          title="Total Deductions"
          amount="₵ 18,200"
          subtitle="Tax & SSNIT"
          footer="Auto-calculated"
        />
        <PayrollCard
          title="Average Salary"
          amount="₵ 1,440"
          subtitle="Per employee"
          footer="Current payroll cycle"
        />
      </div>

      {/* ==================== MAIN CONTENT GRID ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - Main Content (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Payroll Summary - Full Width */}
          <div className="rounded-2xl bg-white p-5 xl:p-6 shadow-sm">
            <PayrollSummary />
          </div>

          {/* Attendance Chart - Full Width */}
          <div className="rounded-2xl bg-white p-5 xl:p-6 shadow-sm">
            <AttendanceChart />
          </div>

          {/* CountChart - Full Width or keep it smaller if needed */}
          <div className="rounded-2xl bg-white p-5 xl:p-6 shadow-sm">
            <CountChart />
          </div>

          {/* Additional Chart Area (Placeholder for Future) */}
          <div className="rounded-2xl bg-white p-5 xl:p-6 shadow-sm min-h-[350px]">
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm font-medium">Additional Chart</p>
                <p className="text-xs mt-1">Finance Chart / Department Breakdown / Payroll Trends</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (1/3) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick Actions */}
          <div className="rounded-2xl bg-white p-5 xl:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <button className="w-full cursor-pointer bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white py-3 rounded-lg text-sm font-medium transition-all shadow-sm">
                Run Payroll
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 transition-colors py-3 rounded-lg text-sm font-medium">
                Generate Payslips
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 transition-colors py-3 rounded-lg text-sm font-medium">
                Download Reports
              </button>
            </div>
          </div>

          {/* Event Calendar */}
          <div className="rounded-2xl bg-white p-5 xl:p-6 shadow-sm">
            <EventCalendar />
          </div>

          {/* Announcements */}
          <div className="rounded-2xl bg-white p-5 xl:p-6 shadow-sm">
            <Announcements />
          </div>

          {/* Compliance Status */}
          <div className="rounded-2xl bg-gradient-to-br from-[#2c4a6a]/5 to-[#1e3147]/5 p-5 xl:p-6 shadow-sm border border-[#2c4a6a]/10">
            <h3 className="text-sm font-semibold text-[#2c4a6a] mb-4">Compliance Status</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center py-2 border-b border-[#2c4a6a]/10">
                <span className="text-gray-700 font-medium">PAYE</span>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submitted
                </span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-[#2c4a6a]/10">
                <span className="text-gray-700 font-medium">SSNIT</span>
                <span className="text-yellow-600 font-semibold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pending
                </span>
              </li>
              <li className="flex justify-between items-center py-2">
                <span className="text-gray-700 font-medium">Pension</span>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submitted
                </span>
              </li>
            </ul>
          </div>

          {/* Recent Transactions (Placeholder) */}
          <div className="rounded-2xl bg-white p-5 xl:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Payroll Processed</p>
                  <p className="text-xs text-gray-500 mt-1">March 2025 completed</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">3 New Employees</p>
                  <p className="text-xs text-gray-500 mt-1">Added to system</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">5 Leave Requests</p>
                  <p className="text-xs text-gray-500 mt-1">Pending approval</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}