"use client";
import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Monthly payroll data
const data = [
  { month: "MAY", payroll: 2650000, deductions: 292000, netPay: 2358000 },
  { month: "JUN", payroll: 2720000, deductions: 299200, netPay: 2420800 },
  { month: "JUL", payroll: 2795000, deductions: 307450, netPay: 2487550 },
  { month: "AUG", payroll: 2810000, deductions: 309100, netPay: 2500900 },
  { month: "SEP", payroll: 2825000, deductions: 310750, netPay: 2514250 },
  { month: "OCT", payroll: 2847500, deductions: 313225, netPay: 2534275 },
];

const PayrollChart = () => {
  const [activeView, setActiveView] = useState<"gross" | "net">("gross");

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ₵{(entry.value / 1000).toFixed(1)}K
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl w-full p-5 border border-gray-100 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">Payroll Cost by Month</h1>
          <p className="text-xs text-gray-500 mt-0.5">Overview of total spending over last 6 months</p>
        </div>
        <button className="text-xs text-[#2c4a6a] font-semibold hover:underline">
          View All
        </button>
      </div>

      {/* VIEW TOGGLE */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveView("gross")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeView === "gross"
              ? "bg-[#2c4a6a] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Gross Pay
        </button>
        <button
          onClick={() => setActiveView("net")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeView === "net"
              ? "bg-[#2c4a6a] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Net Pay
        </button>
      </div>

      {/* CHART */}
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `₵${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
            />
            {activeView === "gross" ? (
              <>
                <Bar 
                  dataKey="payroll" 
                  fill="#2c4a6a" 
                  radius={[8, 8, 0, 0]} 
                  name="Gross Pay"
                />
                <Bar 
                  dataKey="deductions" 
                  fill="#c3d2e9" 
                  radius={[8, 8, 0, 0]} 
                  name="Deductions"
                />
              </>
            ) : (
              <Bar 
                dataKey="netPay" 
                fill="#2c4a6a" 
                radius={[8, 8, 0, 0]} 
                name="Net Pay"
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Average</p>
          <p className="text-lg font-bold text-[#2c4a6a]">
            ₵{(data.reduce((sum, d) => sum + d.payroll, 0) / data.length / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Highest</p>
          <p className="text-lg font-bold text-[#2c4a6a]">
            ₵{(Math.max(...data.map(d => d.payroll)) / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Growth</p>
          <p className="text-lg font-bold text-[#2c4a6a]">↑ 7.5%</p>
        </div>
      </div>
    </div>
  );
};

export default PayrollChart;