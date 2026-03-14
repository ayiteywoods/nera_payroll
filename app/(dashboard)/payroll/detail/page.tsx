"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

// Status badge helpers — mirrors the rest of the app
const statusBadge = (s: string) => ({
  Completed:  { pill: "bg-[#2c4a6a]/10 text-[#2c4a6a] border border-[#2c4a6a]/25", dot: "bg-[#2c4a6a]" },
  Processing: { pill: "bg-[#6b8ca3]/10 text-[#6b8ca3] border border-[#6b8ca3]/25", dot: "bg-[#6b8ca3]" },
  Pending:    { pill: "bg-gray-100 text-gray-500 border border-gray-200",           dot: "bg-gray-400"  },
  Failed:     { pill: "bg-gray-200 text-gray-600 border border-gray-300",           dot: "bg-gray-500"  },
}[s] ?? { pill: "bg-gray-100 text-gray-600 border border-gray-200", dot: "bg-gray-400" });

const approvalBadge = (s: string) => ({
  Approved: { pill: "bg-[#2c4a6a]/10 text-[#2c4a6a] border border-[#2c4a6a]/25", dot: "bg-[#2c4a6a]" },
  Pending:  { pill: "bg-gray-100 text-gray-500 border border-gray-200",           dot: "bg-gray-400"  },
  Rejected: { pill: "bg-gray-200 text-gray-600 border border-gray-300",           dot: "bg-gray-500"  },
}[s] ?? { pill: "bg-gray-100 text-gray-600 border border-gray-200", dot: "bg-gray-400" });

const empStatusBadge = (s: string) => ({
  Active:     { pill: "bg-[#2c4a6a]/10 text-[#2c4a6a] border border-[#2c4a6a]/25", dot: "bg-[#2c4a6a]" },
  "On Leave": { pill: "bg-[#6b8ca3]/10 text-[#6b8ca3] border border-[#6b8ca3]/25", dot: "bg-[#6b8ca3]" },
  Suspended:  { pill: "bg-gray-200 text-gray-600 border border-gray-300",           dot: "bg-gray-500"  },
}[s] ?? { pill: "bg-gray-100 text-gray-600 border border-gray-200", dot: "bg-gray-400" });

// Deterministic employee generator seeded from payroll id
const ghNames = [
  "Kwame Boateng","Kofi Mensah","Yaw Asante","Ama Serwaa","Abena Osei",
  "Akosua Mensah","David Asare","Nana Owusu","Emmanuel Gyebi","Esi Owusu",
  "Victor Acquah","Frederick Boakye","Grace Mensah","Gifty Boakye","Hannah Asante",
  "Ibrahim Appiah","Joseph Mensah","Karim Osei","Leroy Mensah","Adwoa Asante",
  "Afua Boakye","Samuel Appiah","Gloria Asante","Heidi Mensah","Helen Asante",
  "Araba Owusu","Evans Amoah","Godwin Amponsah","Henry Otoo","Isaac Ampadu",
  "Kenneth Asibey","Leonard Adjei","Marlon Agyeman","Nathan Boakye","Obed Asante",
  "Patrick Mensah","Richard Okyere","Stephen Appiah","Vincent Owusu","Winston Gyebi",
  "Baba Issaka","Chidi Mensah","Daniel Boakye","Elijah Owusu","Faisal Mensah",
  "Adjoa Wiredu","Akua Frimpong","Yaa Danso","Kojo Acheampong","Fiifi Sarpong",
];
const depts     = ["Engineering","Sales","Finance","HR","Marketing","Operations","IT Support","Customer Service","Legal","Admin"];
const positions = ["Manager","Officer","Specialist","Executive","Coordinator","Lead","Developer","Analyst","Supervisor","Associate"];
const banks     = ["GCB Bank","Ecobank","Stanbic Bank","Fidelity Bank","Absa Bank","MTN MoMo"];

function seededRand(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return Math.abs(s) / 0x7fffffff; };
}

function generatePayrollEmployees(payroll: any) {
  const count        = payroll.totalEmployees || 85;
  const grossPerHead = payroll.totalGrossPay / count;
  const rand         = seededRand(parseInt(payroll.id.replace(/\D/g, "") || "1") * 7919);

  return Array.from({ length: count }, (_, i) => {
    const name      = ghNames[i % ghNames.length];
    const dept      = depts[Math.floor(rand() * depts.length)];
    const pos       = positions[Math.floor(rand() * positions.length)];
    const base      = Math.round(grossPerHead * (0.7 + rand() * 0.6));
    const allowance = Math.round(base * (0.05 + rand() * 0.12));
    const bonus     = Math.round(base * (rand() > 0.6 ? rand() * 0.08 : 0));
    const gross     = base + allowance + bonus;
    const tax       = Math.round(gross * 0.075);
    const ssnit     = Math.round(gross * 0.055);
    const other     = Math.round(gross * (rand() * 0.02));
    const totalDeduct = tax + ssnit + other;
    const net       = gross - totalDeduct;
    const empStatus = rand() > 0.12 ? "Active" : rand() > 0.5 ? "On Leave" : "Active";
    const bank      = banks[Math.floor(rand() * banks.length)];
    const method    = rand() > 0.4 ? "Bank Transfer" : rand() > 0.5 ? "Mobile Money" : "Cheque";

    return {
      id: `EMP-GH-${String(i + 1).padStart(6, "0")}`,
      name, dept, pos, empStatus, bank, method,
      base, allowance, bonus, gross, tax, ssnit, other, totalDeduct, net,
    };
  });
}

type Tab = "overview" | "employees" | "deductions" | "departments";

export default function PayrollDetailPage() {
  const router = useRouter();
  const [payroll, setPayroll]     = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [search, setSearch]       = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [page, setPage]           = useState(1);
  const perPage = 20;

  useEffect(() => {
    const raw = sessionStorage.getItem("view_payroll_detail") || sessionStorage.getItem("selected_payroll");
    if (raw) {
      const p = JSON.parse(raw);
      setPayroll(p);
      setEmployees(generatePayrollEmployees(p));
    }
  }, []);

  const uniqueDepts = useMemo(() =>
    ["All", ...Array.from(new Set(employees.map(e => e.dept)))], [employees]);

  const filtered = useMemo(() => {
    let r = [...employees];
    if (search) r = r.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase())
    );
    if (deptFilter !== "All") r = r.filter(e => e.dept === deptFilter);
    return r;
  }, [employees, search, deptFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible    = filtered.slice((page - 1) * perPage, page * perPage);

  const deptBreakdown = useMemo(() => {
    const map: Record<string, { count: number; gross: number; net: number; deduct: number }> = {};
    employees.forEach(e => {
      if (!map[e.dept]) map[e.dept] = { count: 0, gross: 0, net: 0, deduct: 0 };
      map[e.dept].count++;
      map[e.dept].gross  += e.gross;
      map[e.dept].net    += e.net;
      map[e.dept].deduct += e.totalDeduct;
    });
    return Object.entries(map).sort((a, b) => b[1].gross - a[1].gross);
  }, [employees]);

  const totals = useMemo(() => ({
    tax:   employees.reduce((s, e) => s + e.tax,         0),
    ssnit: employees.reduce((s, e) => s + e.ssnit,       0),
    other: employees.reduce((s, e) => s + e.other,       0),
    total: employees.reduce((s, e) => s + e.totalDeduct, 0),
    gross: employees.reduce((s, e) => s + e.gross,       0),
    net:   employees.reduce((s, e) => s + e.net,         0),
    bonus: employees.reduce((s, e) => s + e.bonus,       0),
    allow: employees.reduce((s, e) => s + e.allowance,   0),
    base:  employees.reduce((s, e) => s + e.base,        0),
  }), [employees]);

  if (!payroll) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#2c4a6a]/20 border-t-[#2c4a6a] animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading payroll details…</p>
      </div>
    </div>
  );

  const sb = statusBadge(payroll.status);
  const ab = approvalBadge(payroll.approvalStatus);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "overview",    label: "Overview",    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { key: "employees",   label: "Employees",   icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { key: "deductions",  label: "Deductions",  icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" },
    { key: "departments", label: "Departments", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 xl:p-8 overflow-x-hidden">

      {/* Header */}
   
<div className="flex items-center gap-4 mb-6">
  <button
    onClick={() => router.back()}
    className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
  >
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
  <div>
    <p className="text-xs text-gray-400 font-normal">Payroll management</p>
    <h1 className="text-2xl md:text-3xl font-bold text-[#153453] tracking-tight">
      Payroll detail — {payroll.id}
    </h1>
  </div>
</div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 mb-5 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                activeTab === t.key
                  ? "border-[#2c4a6a] text-[#2c4a6a] bg-[#2c4a6a]/5"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
              </svg>
              {t.label}
              {t.key === "employees" && (
                <span className="ml-1 bg-[#2c4a6a]/10 text-[#2c4a6a] text-xs font-bold px-2 py-0.5 rounded-full">
                  {payroll.totalEmployees}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Overview tab */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total gross pay",  value: `GHS ${totals.gross.toLocaleString()}`,  sub: "Before deductions" },
              { label: "Total deductions", value: `GHS ${totals.total.toLocaleString()}`,  sub: `${((totals.total / totals.gross) * 100).toFixed(1)}% of gross` },
              { label: "Total net pay",    value: `GHS ${totals.net.toLocaleString()}`,    sub: "Disbursed amount" },
              { label: "Employees",        value: employees.length.toLocaleString(),        sub: "Included in payroll" },
            ].map((c, i) => (
              <div key={c.label} className={`rounded-2xl p-5 text-white transition-all hover:scale-[1.02] ${
                i % 2 === 0
                  ? "bg-gradient-to-br from-[#2c4a6a] to-[#1e3147]"
                  : "bg-gradient-to-br from-[#3d5a7c] to-[#2c4a6a]"
              }`}>
                <p className="text-xs text-white/60 font-medium mb-2">{c.label}</p>
                <p className="text-2xl font-bold leading-tight">{c.value}</p>
                <p className="text-xs text-white/50 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Pay composition */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-5">Pay composition</h3>
              <div className="space-y-4">
                {[
                  { label: "Base salary", value: totals.base,  pct: (totals.base  / totals.gross) * 100 },
                  { label: "Allowances",  value: totals.allow, pct: (totals.allow / totals.gross) * 100 },
                  { label: "Bonuses",     value: totals.bonus, pct: (totals.bonus / totals.gross) * 100 },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-600">{r.label}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900">GHS {r.value.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 ml-2">{r.pct.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#2c4a6a] to-[#3d5a7c] rounded-full"
                        style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-100 flex justify-between">
                  <span className="text-sm font-semibold text-gray-900">Total gross</span>
                  <span className="text-sm font-bold text-[#2c4a6a]">GHS {totals.gross.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deduction breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-5">Deduction breakdown</h3>
              <div className="space-y-4">
                {[
                  { label: "Income tax",       value: totals.tax,   pct: (totals.tax   / totals.total) * 100, color: "from-[#1e3147] to-[#2c4a6a]" },
                  { label: "Ssnit",            value: totals.ssnit, pct: (totals.ssnit / totals.total) * 100, color: "from-[#2c4a6a] to-[#3d5a7c]" },
                  { label: "Other deductions", value: totals.other, pct: (totals.other / totals.total) * 100, color: "from-[#6b8ca3] to-[#8da9be]" },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-600">{r.label}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900">GHS {r.value.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 ml-2">{r.pct.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${r.color} rounded-full`}
                        style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-100 flex justify-between">
                  <span className="text-sm font-semibold text-gray-900">Total deductions</span>
                  <span className="text-sm font-bold text-[#2c4a6a]">GHS {totals.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payroll info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-5">Payroll information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Payroll id",      value: payroll.id },
                { label: "Period",          value: payroll.period },
                { label: "Month",           value: payroll.month },
                { label: "Processed date",  value: payroll.processedDate },
                { label: "Processed by",    value: payroll.processedBy },
                { label: "Status",          value: payroll.status },
                { label: "Approval status", value: payroll.approvalStatus },
                { label: "Approved by",     value: payroll.approvedBy || "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Employees tab */}
      {activeTab === "employees" && (
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
              <div className="relative flex-1 lg:max-w-xs">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Search by name or ID…" value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]" />
              </div>
              <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1); }}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
                {uniqueDepts.map(d => <option key={d} value={d}>{d === "All" ? "All departments" : d}</option>)}
              </select>
            </div>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              <span className="font-semibold text-gray-900">{filtered.length}</span> employees
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Employee","Department","Base salary","Allowances","Bonuses","Gross pay","Deductions","Net pay","Status"].map((h, i) => (
                      <th key={h} className={`px-5 py-3.5 text-xs font-semibold text-gray-500 ${
                        i === 0 ? "text-left" : i >= 2 && i <= 7 ? "text-right" : "text-center"
                      }`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visible.map(emp => {
                    const esb = empStatusBadge(emp.empStatus);
                    return (
                      <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {emp.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                              <p className="text-xs text-gray-400">{emp.id} · {emp.pos}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">{emp.dept}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap text-sm text-gray-700 font-medium">GHS {emp.base.toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap text-sm text-gray-600">GHS {emp.allowance.toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap text-sm text-gray-600">
                          {emp.bonus > 0 ? `GHS ${emp.bonus.toLocaleString()}` : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">GHS {emp.gross.toLocaleString()}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <span className="text-sm text-gray-600">GHS {emp.totalDeduct.toLocaleString()}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <span className="text-sm font-bold text-[#2c4a6a]">GHS {emp.net.toLocaleString()}</span>
                        </td>
                        <td className="px-5 py-3.5 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${esb.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${esb.dot}`} />
                            {emp.empStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">Page <b>{page}</b> of <b>{totalPages}</b></p>
              <div className="flex gap-1.5">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let n = i + 1;
                  if (totalPages > 5 && page > 3) n = page - 2 + i;
                  if (n > totalPages) return null;
                  return (
                    <button key={n} onClick={() => setPage(n)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                        page === n ? "bg-[#2c4a6a] text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}>
                      {n}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Deductions tab */}
      {activeTab === "deductions" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Income tax",       value: totals.tax,   pct: (totals.tax   / totals.gross) * 100, note: "7.5% of gross", dark: true  },
              { label: "Ssnit",            value: totals.ssnit, pct: (totals.ssnit / totals.gross) * 100, note: "5.5% of gross", dark: false },
              { label: "Other deductions", value: totals.other, pct: (totals.other / totals.gross) * 100, note: "Miscellaneous", dark: true  },
            ].map(c => (
              <div key={c.label} className={`rounded-2xl p-5 text-white ${
                c.dark ? "bg-gradient-to-br from-[#2c4a6a] to-[#1e3147]" : "bg-gradient-to-br from-[#3d5a7c] to-[#2c4a6a]"
              }`}>
                <p className="text-xs text-white/60 font-medium mb-2">{c.label}</p>
                <p className="text-2xl font-bold">GHS {c.value.toLocaleString()}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-white/50">{c.note}</p>
                  <p className="text-xs font-semibold text-white/70">{c.pct.toFixed(2)}%</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Per-employee deductions</h3>
              <p className="text-xs text-gray-400">{employees.length} employees</p>
            </div>
            <div className="overflow-x-auto max-h-[540px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                  <tr>
                    {["Employee","Dept","Gross pay","Income tax","Ssnit","Other","Total deducted","Net pay"].map((h, i) => (
                      <th key={h} className={`px-5 py-3 text-xs font-semibold text-gray-500 ${i === 0 ? "text-left" : "text-right"}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap">
                        <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-400">{emp.id}</p>
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap text-xs text-gray-500">{emp.dept}</td>
                      <td className="px-5 py-3 text-right whitespace-nowrap text-sm font-medium text-gray-800">GHS {emp.gross.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right whitespace-nowrap text-sm text-gray-600">GHS {emp.tax.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right whitespace-nowrap text-sm text-gray-600">GHS {emp.ssnit.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right whitespace-nowrap text-sm text-gray-600">
                        {emp.other > 0 ? `GHS ${emp.other.toLocaleString()}` : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap text-sm font-semibold text-gray-800">GHS {emp.totalDeduct.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <span className="text-sm font-bold text-[#2c4a6a]">GHS {emp.net.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-200 sticky bottom-0">
                  <tr>
                    <td className="px-5 py-3 text-sm font-bold text-gray-900" colSpan={2}>Totals</td>
                    <td className="px-5 py-3 text-right text-sm font-bold text-gray-900">GHS {totals.gross.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-sm font-bold text-gray-900">GHS {totals.tax.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-sm font-bold text-gray-900">GHS {totals.ssnit.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-sm font-bold text-gray-900">GHS {totals.other.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-sm font-bold text-gray-900">GHS {totals.total.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-sm font-bold text-[#2c4a6a]">GHS {totals.net.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Departments tab */}
      {activeTab === "departments" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {deptBreakdown.map(([dept, stats]) => {
              const netPct     = (stats.net   / stats.gross) * 100;
              const grossShare = (stats.gross / totals.gross) * 100;
              return (
                <div key={dept} className="bg-white rounded-2xl border border-gray-100 hover:border-[#c3d2e9] transition-all p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-sm">
                        {dept.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{dept}</p>
                        <p className="text-xs text-gray-400">{stats.count} employees</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#2c4a6a] bg-[#2c4a6a]/10 px-2.5 py-1 rounded-full">
                      {grossShare.toFixed(1)}%
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {[
                      { label: "Gross pay",  value: stats.gross  },
                      { label: "Deductions", value: stats.deduct },
                      { label: "Net pay",    value: stats.net    },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between text-xs">
                        <span className="text-gray-500">{r.label}</span>
                        <span className="font-semibold text-gray-800">GHS {r.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Net pay ratio</span>
                      <span>{netPct.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#2c4a6a] to-[#3d5a7c] rounded-full"
                        style={{ width: `${netPct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Department summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Department","Employees","Gross pay","Deductions","Net pay","% of total"].map((h, i) => (
                      <th key={h} className={`px-6 py-3.5 text-xs font-semibold text-gray-500 ${i === 0 ? "text-left" : "text-right"}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deptBreakdown.map(([dept, stats]) => (
                    <tr key={dept} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-xs">
                            {dept.slice(0, 2)}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{dept}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2c4a6a]/10 text-[#2c4a6a] font-bold text-xs">
                          {stats.count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-800 whitespace-nowrap">GHS {stats.gross.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-sm text-gray-600 whitespace-nowrap">GHS {stats.deduct.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className="text-sm font-bold text-[#2c4a6a]">GHS {stats.net.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className="text-xs font-semibold text-gray-500">
                          {((stats.gross / totals.gross) * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                  <tr>
                    <td className="px-6 py-3.5 text-sm font-bold text-gray-900">Total</td>
                    <td className="px-6 py-3.5 text-right text-sm font-bold text-gray-900">{employees.length}</td>
                    <td className="px-6 py-3.5 text-right text-sm font-bold text-gray-900">GHS {totals.gross.toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-right text-sm font-bold text-gray-900">GHS {totals.total.toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-right text-sm font-bold text-[#2c4a6a]">GHS {totals.net.toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-right text-sm font-bold text-gray-900">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}