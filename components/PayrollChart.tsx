"use client";
import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// ─── Data ─────────────────────────────────────────────────────────────────────
const data = [
  { month: "MAY", payroll: 2650000, deductions: 292000, netPay: 2358000 },
  { month: "JUN", payroll: 2720000, deductions: 299200, netPay: 2420800 },
  { month: "JUL", payroll: 2795000, deductions: 307450, netPay: 2487550 },
  { month: "AUG", payroll: 2810000, deductions: 309100, netPay: 2500900 },
  { month: "SEP", payroll: 2825000, deductions: 310750, netPay: 2514250 },
  { month: "OCT", payroll: 2847500, deductions: 313225, netPay: 2534275 },
];

// ─── Design tokens (mirrors dashboard) ───────────────────────────────────────
const T = {
  sectionTitle: "text-base font-semibold tracking-tight text-gray-900",
  caption:      "text-xs text-gray-500 leading-tight",
  strong:       "text-sm font-semibold text-gray-900",
};

// ─── Custom tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-200 min-w-[140px]">
      <p className={T.strong + " mb-2"}>{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className={T.caption} style={{ color: entry.color }}>{entry.name}</span>
          <span className="text-xs font-semibold text-gray-800">
            GHS {(entry.value / 1000).toFixed(1)}K
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Custom legend ─────────────────────────────────────────────────────────────
const CustomLegend = ({ payload }) => (
  <div className="flex items-center justify-center gap-5 pt-3">
    {payload?.map((entry, i) => (
      <div key={i} className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.color }} />
        <span className="text-xs text-gray-500 font-medium">{entry.value}</span>
      </div>
    ))}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
const PayrollChart = () => {
  const [activeView, setActiveView] = useState("gross");

  const avg     = data.reduce((s, d) => s + d.payroll, 0) / data.length;
  const highest = Math.max(...data.map(d => d.payroll));
  const growth  = (((data.at(-1).payroll - data[0].payroll) / data[0].payroll) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col h-full">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className={T.sectionTitle}>Payroll Cost by Month</h2>
          <p className={T.caption + " mt-0.5"}>Overview of total spending · last 6 months</p>
        </div>
        <button className="text-xs font-semibold text-[#2c4a6a] hover:text-[#1e3147] transition-colors tracking-wide uppercase">
          View all
        </button>
      </div>

      {/* ── Toggle ─────────────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 mb-5 p-1 bg-gray-100 rounded-xl w-fit">
        {[
          { key: "gross", label: "Gross Pay" },
          { key: "net",   label: "Net Pay"   },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setActiveView(key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === key
                ? "bg-[#2c4a6a] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Chart ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `₵${(v / 1000).toFixed(0)}K`}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb", radius: 8 }} />
            <Legend content={<CustomLegend />} />

            {activeView === "gross" ? (
              <>
                <Bar dataKey="payroll"    fill="#2c4a6a" radius={[6, 6, 0, 0]} name="Gross Pay"  maxBarSize={36} />
                <Bar dataKey="deductions" fill="#c3d2e9" radius={[6, 6, 0, 0]} name="Deductions" maxBarSize={36} />
              </>
            ) : (
              <Bar dataKey="netPay" fill="#2c4a6a" radius={[6, 6, 0, 0]} name="Net Pay" maxBarSize={36} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Summary stats ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-gray-100">
        {[
          { label: "Average",  value: `GHS ${(avg / 1000).toFixed(0)}K`     },
          { label: "Highest",  value: `GHS ${(highest / 1000).toFixed(0)}K` },
          { label: "Growth",   value: `↑ ${growth}%`                        },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className={T.caption + " mb-1"}>{label}</p>
            <p className="text-base font-bold text-[#2c4a6a] leading-tight">{value}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default PayrollChart;