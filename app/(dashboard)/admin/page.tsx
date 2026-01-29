"use client";

import React from "react";
import PayrollCard from "@/components/PayrollCard";
import CountChart from "@/components/CountChart";
import PayrollSummary from "@/components/PayrollSummary";
import AttendanceActivity from "@/components/AttendanceActivity";
import AttendanceChart from "@/components/AttendanceChart";
import EventCalendar from "@/components/EventCalendar";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* ==================== HEADER – always on top ==================== */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Manage your workforce and employee information
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* ==================== MAIN CONTENT (left + center) ==================== */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6 lg:gap-8 order-2 lg:order-1">
          {/* KPI CARDS – right after header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            <PayrollCard
              period="March 2025"
              title="Total Payroll"
              amount="₵ 125,430"
              subtitle="Net salaries paid"
              footer="Processed on 28th March"
            />
            <PayrollCard
              title="Employees Paid"
              amount={87}
              subtitle="Active staff"
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
              footer="Current cycle"
            />
          </div>

          {/* ================= CHARTS & ACTIVITY ================= */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left column – CountChart + Calendar */}
            <div className="w-full lg:w-1/3 flex flex-col gap-5">
              <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm flex-1">
                <CountChart />
              </div>
              <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm">
                <EventCalendar />
              </div>
            </div>

            {/* Right column – Payroll Summary + Attendance */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm flex-1">
                <PayrollSummary />
              </div>
              <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm">
                <AttendanceChart />
              </div>
              <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm">
                <AttendanceActivity />
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 order-1 lg:order-2">
          {/* Compliance Status */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Compliance Status</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center">
                <span className="text-gray-700">PAYE</span>
                <span className="text-green-600 font-medium">Submitted</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">SSNIT</span>
                <span className="text-yellow-600 font-medium">Pending</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Pension</span>
                <span className="text-green-600 font-medium">Submitted</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <button className="w-full bg-[#153453] hover:bg-[#0f2a45] text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                Run Payroll
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm font-medium transition-colors">
                Generate Payslips
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm font-medium transition-colors">
                Download Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}