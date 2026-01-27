"use client";

import React from "react";
import PayrollCard from "@/src/app/components/PayrollCard";
import CountChart from "@/src/app/components/CountChart";
import PayrollSummary from "@/src/app/components/PayrollSummary";
import AttendanceActivity from "@/src/app/components/AttendanceActivity";
import AttendanceChart from "@/src/app/components/AttendanceChart";
import EventCalendar from "@/components/EventCalendar";

export default function AdminPage() {
  return (
    <div className="p-4 lg:p-6 flex flex-col lg:flex-row gap-6 lg:gap-8 bg-gray-50 min-h-screen">

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6 lg:gap-8">

        {/*  KPI CARDS  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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

          {/* Left – Count Chart + EventCalendar */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {/* CountChart */}
            <div className="rounded-2xl p-4 sm:p-5 flex-1 flex flex-col bg-white shadow-sm">
              <CountChart />
            </div>

            {/* EventCalendar below CountChart */}
            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm">
              <EventCalendar />
            </div>
          </div>

          {/* Right – Payroll Summary & Attendance */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">

            {/* Payroll Summary */}
            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm flex-1 flex flex-col">
              <PayrollSummary />
            </div>

            {/* Attendance Chart */}
            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm">
              <AttendanceChart />
            </div>

            {/* Attendance Activity */}
            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm">
              <AttendanceActivity />
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDEBAR ================= */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">

        {/* Compliance / Status */}
        <div className="rounded-2xl bg-[#fffcfc] p-5 shadow-sm ">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Compliance Status
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex justify-between">
              <span>PAYE</span>
              <span className="text-green-600  ">Submitted</span>
            </li>
            <li className="flex justify-between">
              <span>SSNIT</span>
              <span className="text-yellow-600 ">Pending</span>
            </li>
            <li className="flex justify-between">
              <span>Pension</span>
              <span className="text-green-600 ">Submitted</span>
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Quick Actions
          </h3>
          <div className="flex flex-col gap-3">
            <button className="w-full cursor: pointer bg-[#153453] text-white py-2 rounded-lg text-sm">
              Run Payroll
            </button>
            <button className="w-full bg-gray-100 py-2 rounded-lg text-sm">
              Generate Payslips
            </button>
            <button className="w-full  bg-gray-100 py-2 rounded-lg text-sm">
              Download Reports
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
