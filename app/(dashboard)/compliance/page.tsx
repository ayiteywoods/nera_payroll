"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TaxBracket {
  id: string;
  minIncome: number;
  maxIncome: number | null;
  rate: number;
  personalRelief: number;
}
interface SSNITConfig { employeeRate: number; employerRate: number }
interface Employee {
  id: string; name: string; department: string;
  grossSalary: number; tin: string; ssnitNumber: string;
  personalRelief: number; taxRelief: boolean;
}
interface Payment {
  id: string; type: "PAYE" | "SSNIT"; amount: number;
  date: string; reference: string; status: "Paid" | "Pending";
}
interface PayrollResult {
  employeeId: string; employeeName: string; department: string;
  grossSalary: number; ssnitEmployee: number; ssnitEmployer: number;
  taxableIncome: number; paye: number; netSalary: number;
}

// ─── Initial Data ─────────────────────────────────────────────────────────────
const INIT_BRACKETS: TaxBracket[] = [
  { id: "b1", minIncome: 0,    maxIncome: 402,   rate: 0,    personalRelief: 0   },
  { id: "b2", minIncome: 402,  maxIncome: 510,   rate: 5,    personalRelief: 200 },
  { id: "b3", minIncome: 510,  maxIncome: 880,   rate: 10,   personalRelief: 200 },
  { id: "b4", minIncome: 880,  maxIncome: 2083,  rate: 17.5, personalRelief: 200 },
  { id: "b5", minIncome: 2083, maxIncome: 3307,  rate: 25,   personalRelief: 200 },
  { id: "b6", minIncome: 3307, maxIncome: null,  rate: 30,   personalRelief: 200 },
];
const INIT_SSNIT: SSNITConfig = { employeeRate: 5.5, employerRate: 13 };
const INIT_EMPLOYEES: Employee[] = [
  { id:"E001", name:"Kwame Asante",    department:"Engineering", grossSalary:8500,  tin:"TIN-GH-10234567", ssnitNumber:"SSN-1234567", personalRelief:200, taxRelief:true  },
  { id:"E002", name:"Abena Mensah",    department:"HR",          grossSalary:6200,  tin:"TIN-GH-20345678", ssnitNumber:"SSN-2345678", personalRelief:200, taxRelief:true  },
  { id:"E003", name:"Yaw Boateng",     department:"Sales",       grossSalary:4800,  tin:"TIN-GH-30456789", ssnitNumber:"SSN-3456789", personalRelief:200, taxRelief:false },
  { id:"E004", name:"Akosua Frimpong", department:"Finance",     grossSalary:10200, tin:"TIN-GH-40567890", ssnitNumber:"SSN-4567890", personalRelief:200, taxRelief:true  },
  { id:"E005", name:"Kofi Oppong",     department:"Engineering", grossSalary:5600,  tin:"TIN-GH-50678901", ssnitNumber:"SSN-5678901", personalRelief:200, taxRelief:true  },
  { id:"E006", name:"Ama Darkwah",     department:"Marketing",   grossSalary:3800,  tin:"TIN-GH-60789012", ssnitNumber:"SSN-6789012", personalRelief:200, taxRelief:false },
];
const INIT_PAYMENTS: Payment[] = [
  { id:"P001", type:"PAYE",  amount:12450, date:"2026-01-31", reference:"GRA-2026-01-001",   status:"Paid"    },
  { id:"P002", type:"SSNIT", amount:8920,  date:"2026-01-31", reference:"SSNIT-2026-01-001", status:"Paid"    },
  { id:"P003", type:"PAYE",  amount:13120, date:"2026-02-28", reference:"GRA-2026-02-001",   status:"Paid"    },
  { id:"P004", type:"SSNIT", amount:9100,  date:"2026-02-28", reference:"SSNIT-2026-02-001", status:"Paid"    },
  { id:"P005", type:"PAYE",  amount:12890, date:"2026-03-14", reference:"GRA-2026-03-001",   status:"Pending" },
  { id:"P006", type:"SSNIT", amount:8950,  date:"2026-03-14", reference:"SSNIT-2026-03-001", status:"Pending" },
];
const MONTHLY_TREND = [
  { month:"Oct", paye:11800, ssnit:8400 },
  { month:"Nov", paye:12100, ssnit:8600 },
  { month:"Dec", paye:12450, ssnit:8920 },
  { month:"Jan", paye:13120, ssnit:9100 },
  { month:"Feb", paye:12890, ssnit:8950 },
];
const DEPARTMENTS = ["Engineering","HR","Sales","Finance","Marketing","Operations","Management","Support"];

// ─── Utilities ────────────────────────────────────────────────────────────────
function calcPAYE(taxable: number, brackets: TaxBracket[]): number {
  let tax = 0;
  const sorted = [...brackets].sort((a, b) => a.minIncome - b.minIncome);
  for (const b of sorted) {
    if (taxable <= b.minIncome) break;
    const upper = b.maxIncome ?? Infinity;
    const slice = Math.min(taxable, upper) - b.minIncome;
    if (slice > 0) tax += slice * (b.rate / 100);
  }
  return Math.max(0, tax);
}
function calcPayroll(e: Employee, s: SSNITConfig, b: TaxBracket[]): PayrollResult {
  const ssnitEmp  = e.grossSalary * (s.employeeRate / 100);
  const ssnitEmpr = e.grossSalary * (s.employerRate / 100);
  const relief    = e.taxRelief ? e.personalRelief : 0;
  const taxable   = Math.max(0, e.grossSalary - ssnitEmp - relief);
  const paye      = calcPAYE(taxable, b);
  return {
    employeeId: e.id, employeeName: e.name, department: e.department,
    grossSalary: e.grossSalary, ssnitEmployee: ssnitEmp, ssnitEmployer: ssnitEmpr,
    taxableIncome: taxable, paye, netSalary: e.grossSalary - ssnitEmp - paye,
  };
}
const ghs  = (n: number) => `GHS ${n.toLocaleString("en-GH",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const ghsK = (n: number) => `GHS ${n >= 1000 ? (n/1000).toFixed(1)+"k" : n.toFixed(0)}`;
const initials = (name: string) => name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();

// ─── Shared UI ────────────────────────────────────────────────────────────────
const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white";
const labelCls = "block text-xs font-medium text-gray-600 mb-1.5";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5 text-white relative overflow-hidden transition-all hover:scale-[1.02]">
      <p className="text-xs text-white/80 mb-1 font-medium">{label}</p>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      {sub && <p className="text-xs text-white/60 mt-1">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string,string> = {
    "Paid":    "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]",
    "Pending": "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]",
    "Active":  "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]",
    "No":      "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]",
  };
  return <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cls[status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>{status}</span>;
}

function SectionCard({ title, subtitle, children, action }: { title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-[#153453]">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#2c4a6a] text-white px-6 py-4 rounded-t-2xl flex justify-between items-center z-10">
          <h3 className="font-bold text-base">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="bg-[#2c4a6a] hover:bg-[#1e3147] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
      </svg>
      {label}
    </button>
  );
}

// ─── Tax Preview Calculator ───────────────────────────────────────────────────
function TaxPreview({ brackets, ssnit }: { brackets: TaxBracket[]; ssnit: SSNITConfig }) {
  const [salary, setSalary] = useState(5000);
  const ssnitEmp   = salary * (ssnit.employeeRate / 100);
  const taxable    = Math.max(0, salary - ssnitEmp - 200);
  const paye       = calcPAYE(taxable, brackets);
  const net        = salary - ssnitEmp - paye;
  const rows = [
    { label: "Gross Salary",          value: salary,    highlight: false },
    { label: `SSNIT (${ssnit.employeeRate}%)`, value: -ssnitEmp,  highlight: false },
    { label: "Personal Relief",       value: -200,      highlight: false },
    { label: "Taxable Income",        value: taxable,   highlight: true  },
    { label: "PAYE Tax",              value: -paye,     highlight: false },
    { label: "Net Salary",            value: net,       highlight: true  },
  ];
  return (
    <div>
      <div className="mb-4">
        <label className={labelCls}>Gross Salary (GHS)</label>
        <input type="range" min={500} max={25000} step={100} value={salary}
          onChange={e => setSalary(Number(e.target.value))}
          className="w-full accent-[#2c4a6a]" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>500</span>
          <span className="font-bold text-[#2c4a6a] text-sm">{ghs(salary)}</span>
          <span>25,000</span>
        </div>
      </div>
      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.label} className={`flex justify-between items-center py-2 px-3 rounded-lg ${r.highlight ? "bg-[#eef3f9]" : ""}`}>
            <span className={`text-xs ${r.highlight ? "font-bold text-[#153453]" : "text-gray-500"}`}>{r.label}</span>
            <span className={`text-sm font-bold ${r.value < 0 ? "text-[#1e3147]" : r.highlight ? "text-[#2c4a6a]" : "text-gray-800"}`}>
              {r.value < 0 ? `– ${ghs(Math.abs(r.value))}` : ghs(r.value)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 mb-1">Effective Tax Rate</p>
        <p className="text-xl font-extrabold text-[#2c4a6a]">
          {salary > 0 ? ((paye / salary) * 100).toFixed(1) : 0}%
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type Tab = "dashboard" | "tax" | "ssnit" | "employees" | "payroll" | "payments";

export default function TaxSSNITPage() {
  const [tab, setTab]           = useState<Tab>("dashboard");
  const [brackets, setBrackets] = useState<TaxBracket[]>(INIT_BRACKETS);
  const [ssnit, setSsnit]       = useState<SSNITConfig>(INIT_SSNIT);
  const [employees, setEmps]    = useState<Employee[]>(INIT_EMPLOYEES);
  const [payments, setPays]     = useState<Payment[]>(INIT_PAYMENTS);

  // Bracket modal state
  const [showBM, setShowBM]     = useState(false);
  const [editB, setEditB]       = useState<TaxBracket | null>(null);
  const [bForm, setBForm]       = useState({ minIncome:"", maxIncome:"", rate:"", personalRelief:"200" });

  // Employee modal state
  const [showEM, setShowEM]     = useState(false);
  const [editE, setEditE]       = useState<Employee | null>(null);
  const [eForm, setEForm]       = useState({ name:"", department:"", grossSalary:"", tin:"", ssnitNumber:"", personalRelief:"200", taxRelief:true });
  const [eErrors, setEErrors]   = useState<Record<string,string>>({});

  // Payment modal state
  const [showPM, setShowPM]     = useState(false);
  const [pForm, setPForm]       = useState({ type:"PAYE", amount:"", date:"", reference:"", status:"Pending" });
  const [pErrors, setPErrors]   = useState<Record<string,string>>({});

  // ── Computed ──
  const payroll = useMemo(() => employees.map(e => calcPayroll(e, ssnit, brackets)), [employees, ssnit, brackets]);
  const totalPAYE    = payroll.reduce((s,r) => s+r.paye, 0);
  const totalSSNITEm = payroll.reduce((s,r) => s+r.ssnitEmployee, 0);
  const totalSSNITEr = payroll.reduce((s,r) => s+r.ssnitEmployer, 0);
  const totalGross   = payroll.reduce((s,r) => s+r.grossSalary, 0);
  const totalNet     = payroll.reduce((s,r) => s+r.netSalary, 0);

  const deptData = useMemo(() => {
    const m: Record<string,{paye:number,ssnit:number}> = {};
    payroll.forEach(r => {
      if (!m[r.department]) m[r.department] = { paye:0, ssnit:0 };
      m[r.department].paye  += r.paye;
      m[r.department].ssnit += r.ssnitEmployee;
    });
    return Object.entries(m).map(([dept,v]) => ({ dept, paye:+v.paye.toFixed(0), ssnit:+v.ssnit.toFixed(0) }));
  }, [payroll]);

  const pieData = [
    { name:"Net Salary",  value:+totalNet.toFixed(0)      },
    { name:"PAYE",        value:+totalPAYE.toFixed(0)     },
    { name:"SSNIT (Emp)", value:+totalSSNITEm.toFixed(0)  },
  ];
  const PIE_COLS = ["#2c4a6a","#5a8fc4","#9ecde8"];

  const trendData = [...MONTHLY_TREND, { month:"Mar", paye:+totalPAYE.toFixed(0), ssnit:+totalSSNITEm.toFixed(0) }];

  // ── Bracket CRUD ──
  const openAddB = () => { setEditB(null); setBForm({minIncome:"",maxIncome:"",rate:"",personalRelief:"200"}); setShowBM(true); };
  const openEditB = (b: TaxBracket) => { setEditB(b); setBForm({minIncome:String(b.minIncome),maxIncome:b.maxIncome!=null?String(b.maxIncome):"",rate:String(b.rate),personalRelief:String(b.personalRelief)}); setShowBM(true); };
  const saveB = () => {
    const nb: TaxBracket = { id:editB?editB.id:`b${Date.now()}`, minIncome:Number(bForm.minIncome), maxIncome:bForm.maxIncome===""?null:Number(bForm.maxIncome), rate:Number(bForm.rate), personalRelief:Number(bForm.personalRelief) };
    setBrackets(p => editB ? p.map(b => b.id===editB.id?nb:b) : [...p,nb]);
    setShowBM(false);
  };
  const delB = (id: string) => setBrackets(p => p.filter(b => b.id!==id));

  // ── Employee CRUD ──
  const openAddE = () => { setEditE(null); setEForm({name:"",department:"",grossSalary:"",tin:"",ssnitNumber:"",personalRelief:"200",taxRelief:true}); setEErrors({}); setShowEM(true); };
  const openEditE = (e: Employee) => { setEditE(e); setEForm({name:e.name,department:e.department,grossSalary:String(e.grossSalary),tin:e.tin,ssnitNumber:e.ssnitNumber,personalRelief:String(e.personalRelief),taxRelief:e.taxRelief}); setEErrors({}); setShowEM(true); };
  const saveE = () => {
    const errs: Record<string,string> = {};
    if (!eForm.name)         errs.name = "Name is required";
    if (!eForm.department)   errs.department = "Department is required";
    if (!eForm.grossSalary)  errs.grossSalary = "Salary is required";
    if (!eForm.tin)          errs.tin = "TIN is required for GRA compliance";
    if (!eForm.ssnitNumber)  errs.ssnitNumber = "SSNIT number is required";
    if (Object.keys(errs).length) { setEErrors(errs); return; }
    const ne: Employee = { id:editE?editE.id:`E${String(employees.length+1).padStart(3,"0")}`, name:eForm.name, department:eForm.department, grossSalary:Number(eForm.grossSalary), tin:eForm.tin, ssnitNumber:eForm.ssnitNumber, personalRelief:Number(eForm.personalRelief), taxRelief:eForm.taxRelief };
    setEmps(p => editE ? p.map(e => e.id===editE.id?ne:e) : [...p,ne]);
    setShowEM(false);
  };

  // ── Payment CRUD ──
  const savePay = () => {
    const errs: Record<string,string> = {};
    if (!pForm.amount)    errs.amount = "Amount is required";
    if (!pForm.date)      errs.date = "Date is required";
    if (!pForm.reference) errs.reference = "Reference number is required";
    if (Object.keys(errs).length) { setPErrors(errs); return; }
    const np: Payment = { id:`P${String(payments.length+1).padStart(3,"0")}`, type:pForm.type as "PAYE"|"SSNIT", amount:Number(pForm.amount), date:pForm.date, reference:pForm.reference, status:pForm.status as "Paid"|"Pending" };
    setPays(p => [...p,np]);
    setShowPM(false);
    setPForm({type:"PAYE",amount:"",date:"",reference:"",status:"Pending"});
    setPErrors({});
  };

  // ── Export stub ──
  const handleExport = (fmt: string) => alert(`${fmt} export — connect to your backend API endpoint to generate this report.`);

  const TABS: { id: Tab; label: string }[] = [
    { id:"dashboard", label:"Dashboard"   },
    { id:"tax",       label:"Tax (PAYE)"  },
    { id:"ssnit",     label:"SSNIT"       },
    { id:"employees", label:"Employees"   },
    { id:"payroll",   label:"Payroll"     },
    { id:"payments",  label:"Payments"    },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-1">Tax & SSNIT Compliance</h1>
        <p className="text-sm text-gray-600">Ghana Revenue Authority (GRA) PAYE · Social Security and National Insurance Trust (SSNIT)</p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total PAYE (Month)"    value={ghsK(totalPAYE)}    sub={`${employees.length} employees processed`} />
        <StatCard label="SSNIT Employee Total"  value={ghsK(totalSSNITEm)} sub={`${ssnit.employeeRate}% contribution rate`} />
        <StatCard label="SSNIT Employer Total"  value={ghsK(totalSSNITEr)} sub={`${ssnit.employerRate}% employer rate`} />
        <StatCard label="Gross Payroll"         value={ghsK(totalGross)}   sub={`Net: ${ghsK(totalNet)}`} />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 p-1.5 mb-5 flex flex-wrap gap-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab===t.id ? "bg-[#2c4a6a] text-white" : "text-gray-600 hover:bg-gray-50"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════ DASHBOARD ═══════════════════════════ */}
      {tab === "dashboard" && (
        <div className="space-y-6">

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Bar chart */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-[#153453] mb-1">PAYE & SSNIT by Department</h2>
              <p className="text-xs text-gray-500 mb-4">Monthly deductions per department</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deptData} margin={{top:4,right:8,left:0,bottom:4}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                  <XAxis dataKey="dept" tick={{fontSize:11}} />
                  <YAxis tick={{fontSize:11}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v:number) => ghs(v)} />
                  <Bar dataKey="paye"  name="PAYE"        fill="#2c4a6a" radius={[4,4,0,0]} />
                  <Bar dataKey="ssnit" name="SSNIT (Emp)" fill="#5a8fc4" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-5 mt-2">
                {[{c:"#2c4a6a",l:"PAYE"},{c:"#5a8fc4",l:"SSNIT (Employee)"}].map(x => (
                  <span key={x.l} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded" style={{background:x.c}}></span>{x.l}
                  </span>
                ))}
              </div>
            </div>

            {/* Pie */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-[#153453] mb-1">Payroll Composition</h2>
              <p className="text-xs text-gray-500 mb-3">How gross salary is split</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={75} dataKey="value"
                    label={({percent}) => `${(percent*100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((_,i) => <Cell key={i} fill={PIE_COLS[i]}/>)}
                  </Pie>
                  <Tooltip formatter={(v:number)=>ghs(v)}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map((d,i) => (
                  <div key={d.name} className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{background:PIE_COLS[i]}}></span>
                      <span className="text-gray-500">{d.name}</span>
                    </span>
                    <span className="font-semibold text-gray-800">{ghs(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trend + Compliance status */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-[#153453] mb-1">6-Month Compliance Trend</h2>
              <p className="text-xs text-gray-500 mb-4">Historical PAYE and SSNIT deductions</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData} margin={{top:4,right:8,left:0,bottom:4}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                  <XAxis dataKey="month" tick={{fontSize:11}}/>
                  <YAxis tick={{fontSize:11}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                  <Tooltip formatter={(v:number)=>ghs(v)}/>
                  <Line type="monotone" dataKey="paye"  name="PAYE"  stroke="#2c4a6a" strokeWidth={2} dot={{r:4,fill:"#2c4a6a"}}/>
                  <Line type="monotone" dataKey="ssnit" name="SSNIT" stroke="#5a8fc4" strokeWidth={2} dot={{r:4,fill:"#5a8fc4"}}/>
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-5 mt-2">
                {[{c:"#2c4a6a",l:"PAYE"},{c:"#5a8fc4",l:"SSNIT"}].map(x => (
                  <span key={x.l} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded" style={{background:x.c}}></span>{x.l}
                  </span>
                ))}
              </div>
            </div>

            {/* Compliance Status */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-[#153453] mb-4">Compliance Status</h2>
              <div className="space-y-3">
                {[
                  { label:"TIN Coverage",        ok: employees.every(e=>e.tin),          val:`${employees.filter(e=>e.tin).length}/${employees.length} employees` },
                  { label:"SSNIT Coverage",       ok: employees.every(e=>e.ssnitNumber),  val:`${employees.filter(e=>e.ssnitNumber).length}/${employees.length} employees` },
                  { label:"Pending Payments",     ok: payments.filter(p=>p.status==="Pending").length===0, val:`${payments.filter(p=>p.status==="Pending").length} outstanding` },
                  { label:"Tax Brackets Set",     ok: brackets.length >= 3,               val:`${brackets.length} brackets configured` },
                  { label:"SSNIT Rate (Ghana)",   ok: (ssnit.employeeRate+ssnit.employerRate)===18.5, val:`${(ssnit.employeeRate+ssnit.employerRate).toFixed(1)}% total` },
                ].map(item => (
                  <div key={item.label} className={`flex items-start gap-3 p-3 rounded-xl border ${item.ok ? "bg-[#eef3f9] border-[#a8c5db]" : "bg-[#e8eef4] border-[#c3d2e9]"}`}>
                    <span className={`mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${item.ok ? "bg-[#eef3f9]0" : "bg-[#4a6b8a]"}`}>
                      {item.ok ? "✓" : "!"}
                    </span>
                    <div>
                      <p className={`text-xs font-semibold ${item.ok ? "text-[#153453]" : "text-[#153453]"}`}>{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ TAX BRACKETS ═══════════════════════════ */}
      {tab === "tax" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <SectionCard
              title="PAYE Tax Brackets"
              subtitle="GRA progressive tax schedule — monthly income (GHS)"
              action={<AddBtn onClick={openAddB} label="Add Bracket"/>}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Min Income","Max Income","Tax Rate","Personal Relief","Actions"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[...brackets].sort((a,b)=>a.minIncome-b.minIncome).map(b => (
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-sm text-gray-800">GHS {b.minIncome.toLocaleString()}</td>
                        <td className="px-5 py-3 text-sm text-gray-800">{b.maxIncome != null ? `GHS ${b.maxIncome.toLocaleString()}` : <span className="text-gray-400 italic">Unlimited</span>}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${b.rate === 0 ? "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]" : "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]"}`}>
                            {b.rate}%
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-800">GHS {b.personalRelief.toLocaleString()}</td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEditB(b)} className="p-1.5 hover:bg-[#eef3f9] rounded-lg text-gray-500 hover:text-[#2c4a6a] transition-colors" title="Edit">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </button>
                            <button onClick={() => delB(b.id)} className="p-1.5 hover:bg-[#eef3f9] rounded-lg text-gray-500 hover:text-[#1e3147] transition-colors" title="Delete">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#153453] mb-1">Live PAYE Calculator</h2>
            <p className="text-xs text-gray-500 mb-4">Drag to preview tax for any salary</p>
            <TaxPreview brackets={brackets} ssnit={ssnit}/>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ SSNIT ═══════════════════════════ */}
      {tab === "ssnit" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Config */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#153453] mb-1">SSNIT Contribution Rates</h2>
            <p className="text-xs text-gray-500 mb-5">Social Security and National Insurance Trust — Ghana standard: 5.5% + 13% = 18.5%</p>
            <div className="space-y-5">
              {([
                { key:"employeeRate", label:"Employee Contribution Rate (%)", note:"Deducted from employee gross salary" },
                { key:"employerRate", label:"Employer Contribution Rate (%)", note:"Paid additionally by the employer — not deducted from employee" },
              ] as const).map(f => (
                <div key={f.key}>
                  <label className={labelCls}>{f.label}</label>
                  <input type="number" step="0.01" min="0" max="50"
                    value={ssnit[f.key]}
                    onChange={e => { const v=Number(e.target.value); if(v>=0&&v<=50) setSsnit(p=>({...p,[f.key]:v})); }}
                    className={inputCls}
                  />
                  <p className="text-xs text-gray-400 mt-1">{f.note}</p>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Rate</span>
                  <span className="font-extrabold text-[#2c4a6a]">{(ssnit.employeeRate+ssnit.employerRate).toFixed(2)}%</span>
                </div>
                {(ssnit.employeeRate+ssnit.employerRate).toFixed(2) !== "18.50" && (
                  <div className="flex items-start gap-2 p-3 bg-[#e8eef4] border border-[#c3d2e9] rounded-lg">
                    <span className="text-[#4a6b8a] text-sm">⚠</span>
                    <p className="text-xs text-[#153453]">Ghana standard is 18.5%. Current total: {(ssnit.employeeRate+ssnit.employerRate).toFixed(2)}%</p>
                  </div>
                )}
                {(ssnit.employeeRate+ssnit.employerRate).toFixed(2) === "18.50" && (
                  <div className="flex items-start gap-2 p-3 bg-[#eef3f9] border border-[#a8c5db] rounded-lg">
                    <span className="text-[#2c4a6a] text-sm">✓</span>
                    <p className="text-xs text-[#2c4a6a]">Rates comply with Ghana SSNIT standard (18.5%)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Per-employee SSNIT summary */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#153453]">SSNIT Contribution Summary</h2>
              <p className="text-xs text-gray-500 mt-0.5">Per-employee breakdown this month</p>
            </div>
            <div className="divide-y divide-gray-100">
              {payroll.map(r => (
                <div key={r.employeeId} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2c4a6a] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {initials(r.employeeName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{r.employeeName}</p>
                      <p className="text-xs text-gray-400">{r.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#2c4a6a]">{ghs(r.ssnitEmployee)}</p>
                    <p className="text-xs text-gray-400">Employer: {ghs(r.ssnitEmployer)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200 space-y-1">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-700">Total Employee SSNIT</span>
                <span className="text-[#2c4a6a]">{ghs(totalSSNITEm)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-700">Total Employer SSNIT</span>
                <span className="text-[#2c4a6a]">{ghs(totalSSNITEr)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ EMPLOYEES ═══════════════════════════ */}
      {tab === "employees" && (
        <SectionCard
          title="Employee Compliance Records"
          subtitle="TIN, SSNIT numbers and tax relief configuration — all fields required for GRA/SSNIT"
          action={<AddBtn onClick={openAddE} label="Add Employee"/>}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Employee","TIN","SSNIT Number","Gross Salary","Tax Relief","Actions"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {initials(e.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{e.name}</p>
                          <p className="text-xs text-gray-400">{e.department} · {e.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {e.tin
                        ? <span className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">{e.tin}</span>
                        : <span className="flex items-center gap-1 text-xs font-medium text-[#1e3147]"><span>⚠</span>Missing</span>}
                    </td>
                    <td className="px-5 py-4">
                      {e.ssnitNumber
                        ? <span className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">{e.ssnitNumber}</span>
                        : <span className="flex items-center gap-1 text-xs font-medium text-[#1e3147]"><span>⚠</span>Missing</span>}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-[#2c4a6a]">{ghs(e.grossSalary)}</td>
                    <td className="px-5 py-4"><StatusBadge status={e.taxRelief ? "Active" : "No"}/></td>
                    <td className="px-5 py-4">
                      <button onClick={() => openEditE(e)} className="p-1.5 hover:bg-[#eef3f9] rounded-lg text-gray-500 hover:text-[#2c4a6a] transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* ═══════════════════════════ PAYROLL ═══════════════════════════ */}
      {tab === "payroll" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Gross"       value={ghsK(totalGross)}   sub="Before any deductions"/>
            <StatCard label="Total PAYE"        value={ghsK(totalPAYE)}    sub="GRA tax liability"/>
            <StatCard label="Total SSNIT"       value={ghsK(totalSSNITEm)} sub="Employee portion"/>
            <StatCard label="Total Net Payable" value={ghsK(totalNet)}     sub="After all deductions"/>
          </div>

          <SectionCard
            title="Payroll Calculation Results"
            subtitle="Formula: Gross → SSNIT deduction → Taxable Income → PAYE → Net Salary"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Employee","Gross Salary","SSNIT (Emp)","Taxable Income","PAYE Tax","Net Salary"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payroll.map(r => (
                    <tr key={r.employeeId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {initials(r.employeeName)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{r.employeeName}</p>
                            <p className="text-xs text-gray-400">{r.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-800">{ghs(r.grossSalary)}</td>
                      <td className="px-5 py-4 text-sm text-[#1e3147] font-medium">– {ghs(r.ssnitEmployee)}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{ghs(r.taxableIncome)}</td>
                      <td className="px-5 py-4 text-sm text-[#1e3147] font-medium">– {ghs(r.paye)}</td>
                      <td className="px-5 py-4 text-sm font-extrabold text-[#2c4a6a]">{ghs(r.netSalary)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#f5f8fc] border-t-2 border-[#2c4a6a]/20">
                  <tr>
                    <td className="px-5 py-4 text-sm font-extrabold text-[#153453]">TOTALS</td>
                    <td className="px-5 py-4 text-sm font-extrabold text-gray-800">{ghs(totalGross)}</td>
                    <td className="px-5 py-4 text-sm font-extrabold text-[#1e3147]">– {ghs(totalSSNITEm)}</td>
                    <td className="px-5 py-4 text-sm font-extrabold text-gray-800">{ghs(payroll.reduce((s,r)=>s+r.taxableIncome,0))}</td>
                    <td className="px-5 py-4 text-sm font-extrabold text-[#1e3147]">– {ghs(totalPAYE)}</td>
                    <td className="px-5 py-4 text-sm font-extrabold text-[#2c4a6a]">{ghs(totalNet)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </SectionCard>

          {/* Export */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#153453] mb-1">Compliance Reports</h2>
            <p className="text-xs text-gray-500 mb-4">Generate and download official payroll compliance reports</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title:"PAYE Monthly Report",        desc:"GRA submission schedule",          formats:["PDF","Excel","CSV"] },
                { title:"SSNIT Contribution Schedule",desc:"Tier 1, 2 & 3 breakdown",          formats:["PDF","Excel","CSV"] },
                { title:"Employee Deduction Summary",  desc:"Per-employee full breakdown",      formats:["PDF","Excel","CSV"] },
              ].map(r => (
                <div key={r.title} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{r.title}</p>
                      <p className="text-xs text-gray-400">{r.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {r.formats.map(f => (
                      <button key={f} onClick={() => handleExport(`${r.title} — ${f}`)}
                        className="flex-1 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600 hover:bg-[#eef3f9] hover:text-[#2c4a6a] hover:border-[#a8c5db] transition-all">
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ PAYMENTS ═══════════════════════════ */}
      {tab === "payments" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="PAYE Paid"         value={ghsK(payments.filter(p=>p.type==="PAYE"&&p.status==="Paid").reduce((s,p)=>s+p.amount,0))}    sub="To GRA"/>
            <StatCard label="SSNIT Paid"        value={ghsK(payments.filter(p=>p.type==="SSNIT"&&p.status==="Paid").reduce((s,p)=>s+p.amount,0))}   sub="To SSNIT"/>
            <StatCard label="PAYE Pending"      value={ghsK(payments.filter(p=>p.type==="PAYE"&&p.status==="Pending").reduce((s,p)=>s+p.amount,0))} sub="Outstanding"/>
            <StatCard label="SSNIT Pending"     value={ghsK(payments.filter(p=>p.type==="SSNIT"&&p.status==="Pending").reduce((s,p)=>s+p.amount,0))} sub="Outstanding"/>
          </div>

          <SectionCard
            title="Payment Records"
            subtitle="Track all remittances to GRA and SSNIT with reference numbers"
            action={<AddBtn onClick={() => setShowPM(true)} label="Record Payment"/>}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Type","Amount","Date","Reference Number","Status"].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${p.type==="PAYE" ? "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]" : "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]"}`}>
                          {p.type}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm font-extrabold text-[#2c4a6a]">{ghs(p.amount)}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{new Date(p.date).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</td>
                      <td className="px-6 py-3"><span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">{p.reference}</span></td>
                      <td className="px-6 py-3"><StatusBadge status={p.status}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ═══════════════════════════ MODALS ═══════════════════════════ */}

      {/* Bracket Modal */}
      {showBM && (
        <Modal title={editB ? "Edit Tax Bracket" : "Add Tax Bracket"} onClose={() => setShowBM(false)}>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Minimum Income (GHS) *</label>
              <input type="number" value={bForm.minIncome} onChange={e=>setBForm(p=>({...p,minIncome:e.target.value}))} className={inputCls} placeholder="0"/>
            </div>
            <div>
              <label className={labelCls}>Maximum Income (GHS) — leave blank for unlimited</label>
              <input type="number" value={bForm.maxIncome} onChange={e=>setBForm(p=>({...p,maxIncome:e.target.value}))} className={inputCls} placeholder="Unlimited"/>
            </div>
            <div>
              <label className={labelCls}>Tax Rate (%) *</label>
              <input type="number" step="0.5" min="0" max="100" value={bForm.rate} onChange={e=>setBForm(p=>({...p,rate:e.target.value}))} className={inputCls} placeholder="0"/>
            </div>
            <div>
              <label className={labelCls}>Personal Relief Amount (GHS)</label>
              <input type="number" value={bForm.personalRelief} onChange={e=>setBForm(p=>({...p,personalRelief:e.target.value}))} className={inputCls} placeholder="200"/>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowBM(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={saveB} className="flex-1 py-2.5 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-lg text-sm font-medium transition-all">Save Bracket</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Employee Modal */}
      {showEM && (
        <Modal title={editE ? "Edit Employee Record" : "Add Employee"} onClose={() => setShowEM(false)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelCls}>Full Name *</label>
              <input value={eForm.name} onChange={e=>setEForm(p=>({...p,name:e.target.value}))} className={`${inputCls} ${eErrors.name?"border-[#96b3cc]":""}`} placeholder="e.g. Kwame Asante"/>
              {eErrors.name && <p className="text-xs text-[#1e3147] mt-1">{eErrors.name}</p>}
            </div>
            <div>
              <label className={labelCls}>Department *</label>
              <select value={eForm.department} onChange={e=>setEForm(p=>({...p,department:e.target.value}))} className={`${inputCls} ${eErrors.department?"border-[#96b3cc]":""}`}>
                <option value="">Select department</option>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
              {eErrors.department && <p className="text-xs text-[#1e3147] mt-1">{eErrors.department}</p>}
            </div>
            <div>
              <label className={labelCls}>Gross Salary (GHS) *</label>
              <input type="number" value={eForm.grossSalary} onChange={e=>setEForm(p=>({...p,grossSalary:e.target.value}))} className={`${inputCls} ${eErrors.grossSalary?"border-[#96b3cc]":""}`} placeholder="5000"/>
              {eErrors.grossSalary && <p className="text-xs text-[#1e3147] mt-1">{eErrors.grossSalary}</p>}
            </div>
            <div>
              <label className={labelCls}>Tax Identification Number (TIN) *</label>
              <input value={eForm.tin} onChange={e=>setEForm(p=>({...p,tin:e.target.value}))} className={`${inputCls} ${eErrors.tin?"border-[#96b3cc]":""}`} placeholder="TIN-GH-XXXXXXXX"/>
              {eErrors.tin && <p className="text-xs text-[#1e3147] mt-1">{eErrors.tin}</p>}
            </div>
            <div>
              <label className={labelCls}>SSNIT Number *</label>
              <input value={eForm.ssnitNumber} onChange={e=>setEForm(p=>({...p,ssnitNumber:e.target.value}))} className={`${inputCls} ${eErrors.ssnitNumber?"border-[#96b3cc]":""}`} placeholder="SSN-XXXXXXX"/>
              {eErrors.ssnitNumber && <p className="text-xs text-[#1e3147] mt-1">{eErrors.ssnitNumber}</p>}
            </div>
            <div>
              <label className={labelCls}>Personal Relief (GHS)</label>
              <input type="number" value={eForm.personalRelief} onChange={e=>setEForm(p=>({...p,personalRelief:e.target.value}))} className={inputCls} placeholder="200"/>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`relative w-10 h-6 rounded-full transition-colors ${eForm.taxRelief ? "bg-[#2c4a6a]" : "bg-gray-300"}`}
                  onClick={() => setEForm(p=>({...p,taxRelief:!p.taxRelief}))}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${eForm.taxRelief ? "translate-x-4" : ""}`}></span>
                </div>
                <span className="text-sm text-gray-700">Eligible for Tax Relief (Personal Relief deduction)</span>
              </label>
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button onClick={() => setShowEM(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={saveE} className="flex-1 py-2.5 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-lg text-sm font-medium transition-all">Save Employee</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Payment Modal */}
      {showPM && (
        <Modal title="Record Payment" onClose={() => { setShowPM(false); setPErrors({}); }}>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Payment Type *</label>
              <select value={pForm.type} onChange={e=>setPForm(p=>({...p,type:e.target.value}))} className={`${inputCls}`}>
                <option value="PAYE">PAYE — Ghana Revenue Authority (GRA)</option>
                <option value="SSNIT">SSNIT — Social Security and National Insurance Trust</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Amount (GHS) *</label>
              <input type="number" value={pForm.amount} onChange={e=>setPForm(p=>({...p,amount:e.target.value}))} className={`${inputCls} ${pErrors.amount?"border-[#96b3cc]":""}`} placeholder="0.00"/>
              {pErrors.amount && <p className="text-xs text-[#1e3147] mt-1">{pErrors.amount}</p>}
            </div>
            <div>
              <label className={labelCls}>Payment Date *</label>
              <input type="date" value={pForm.date} onChange={e=>setPForm(p=>({...p,date:e.target.value}))} className={`${inputCls} ${pErrors.date?"border-[#96b3cc]":""}`}/>
              {pErrors.date && <p className="text-xs text-[#1e3147] mt-1">{pErrors.date}</p>}
            </div>
            <div>
              <label className={labelCls}>Reference Number *</label>
              <input value={pForm.reference} onChange={e=>setPForm(p=>({...p,reference:e.target.value}))} className={`${inputCls} ${pErrors.reference?"border-[#96b3cc]":""}`} placeholder="e.g. GRA-2026-03-001"/>
              {pErrors.reference && <p className="text-xs text-[#1e3147] mt-1">{pErrors.reference}</p>}
            </div>
            <div>
              <label className={labelCls}>Status *</label>
              <select value={pForm.status} onChange={e=>setPForm(p=>({...p,status:e.target.value}))} className={inputCls}>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowPM(false); setPErrors({}); }} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={savePay} className="flex-1 py-2.5 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-lg text-sm font-medium transition-all">Save Payment</button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}