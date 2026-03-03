
"use client"; 
import React, { useState, useEffect } from "react"; 
import Link from "next/link";
import Image from "next/image";

// Monthly tax brackets based on Ghana tax laws (approximated for 2026)
const MONTHLY_TAX_BRACKETS = [
  { from: 0, to: 490, rate: 0 },
  { from: 490.01, to: 600, rate: 5 },
  { from: 600.01, to: 730, rate: 10 },
  { from: 730.01, to: 3896.67, rate: 17.5 },
  { from: 3896.68, to: 19896.67, rate: 25 },
  { from: 19896.68, to: 50416.67, rate: 30 },
  { from: 50416.68, rate: 35 },
];

// Function to calculate monthly PAYE tax
const calculateMonthlyTax = (monthlyIncome: number) => {
  let tax = 0;
  let remaining = monthlyIncome;
  let bracketIndex = 0;

  while (remaining > 0 && bracketIndex < MONTHLY_TAX_BRACKETS.length) {
    const bracket = MONTHLY_TAX_BRACKETS[bracketIndex];
    const taxableInBracket = bracket.to
      ? Math.min(remaining, bracket.to - bracket.from)
      : remaining;

    tax += (taxableInBracket * bracket.rate) / 100;
    remaining -= taxableInBracket;
    bracketIndex++;
  }

  return tax;
};

// Generate sample employees with tax data
const generateEmployees = () => {
  const firstNames = ["John","Abena","Kwame","Ama","Kofi","Akosua","Yaw","Adjoa","Kwabena","Adwoa","Fiifi","Esi","Kojo","Efua","Kwesi","Akua","Yaa","Kow","Araba","Kwaku"];
  const lastNames  = ["Mensah","Osei","Boateng","Asante","Owusu","Appiah","Agyei","Adjei","Opoku","Gyasi","Sarpong","Ofori","Acheampong","Boakye","Wiredu","Baah","Antwi","Frimpong","Danso","Asiedu"];
  const departments = ["Engineering","Management","Sales","HR","Support","Finance","Marketing","Operations"];

  return Array.from({ length: 1000 }, (_, i) => {
    const idx = i + 1;
    const fn  = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln  = lastNames[Math.floor(Math.random() * lastNames.length)];
    const monthlySalary = Math.floor(Math.random() * 10000) + 3000;
    const monthlyTax = calculateMonthlyTax(monthlySalary);
    const ytdTax = monthlyTax * (Math.floor(Math.random() * 12) + 1);
    
    return {
      id: `EMP${String(idx).padStart(4,"0")}`,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${idx}@company.com`,
      department: departments[Math.floor(Math.random()*departments.length)],
      monthlySalary,
      monthlyTax: Math.round(monthlyTax * 100) / 100,
      ytdTax: Math.round(ytdTax * 100) / 100,
      taxRate: Math.round((monthlyTax / monthlySalary * 100) * 10) / 10,
      image: `/profiles/employee${(idx%4)+1}.jpg`,
    };
  });
};

const ALL_EMPLOYEES = generateEmployees();

export default function TaxPage() {
  const [filteredEmployees, setFilteredEmployees] = useState(ALL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<"cards" | "list">("list");

  const DEPTS = ["All", ...new Set(ALL_EMPLOYEES.map(e => e.department))];

  useEffect(() => {
    let r = [...ALL_EMPLOYEES];
    if (searchTerm) r = r.filter(e =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedDepartment !== "All") r = r.filter(e => e.department === selectedDepartment);
    if (sortBy === "name") r.sort((a,b) => a.name.localeCompare(b.name));
    if (sortBy === "salary") r.sort((a,b) => b.monthlySalary - a.monthlySalary);
    if (sortBy === "tax") r.sort((a,b) => b.monthlyTax - a.monthlyTax);
    setFilteredEmployees(r);
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, sortBy]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const visible = filteredEmployees.slice(startIdx, startIdx + itemsPerPage);

  const pageNums = () => {
    const p: (number|string)[] = [];
    if (totalPages <= 7) { for (let i=1;i<=totalPages;i++) p.push(i); }
    else if (currentPage <= 4) { for (let i=1;i<=5;i++) p.push(i); p.push("..."); p.push(totalPages); }
    else if (currentPage >= totalPages-3) { p.push(1); p.push("..."); for (let i=totalPages-4;i<=totalPages;i++) p.push(i); }
    else { p.push(1); p.push("..."); for (let i=currentPage-1;i<=currentPage+1;i++) p.push(i); p.push("..."); p.push(totalPages); }
    return p;
  };

  const goTo = (n: number) => { setCurrentPage(n); window.scrollTo({top:0,behavior:"smooth"}); };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase();
  };

  // Calculate overview stats
  const taxOverview = filteredEmployees.reduce((acc, emp) => {
    acc.totalMonthlyTax += emp.monthlyTax;
    acc.totalYTDTax += emp.ytdTax;
    acc.totalEmployees++;
    return acc;
  }, { totalMonthlyTax: 0, totalYTDTax: 0, totalEmployees: 0 });

  const averageTaxRate = taxOverview.totalEmployees > 0 
    ? (taxOverview.totalMonthlyTax / filteredEmployees.reduce((sum, e) => sum + e.monthlySalary, 0) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-1">Tax Management</h1>
        <p className="text-sm text-gray-600">Manage employee taxes compliant with Ghana tax laws</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Employees", value: taxOverview.totalEmployees, sub: "In current view" },
          { label: "Avg Tax Rate", value: `${averageTaxRate}%`, sub: "Monthly average" },
          { label: "Total Monthly Tax", value: `GHS ${taxOverview.totalMonthlyTax.toLocaleString()}`, sub: "Current deductions" },
          { label: "Total YTD Tax", value: `GHS ${taxOverview.totalYTDTax.toLocaleString()}`, sub: "Year to date" },
        ].map(c => (
          <div key={c.label} className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5 text-white">
            <p className="text-xs opacity-70 mb-1">{c.label}</p>
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="text-xs opacity-60 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            <div className="relative flex-1 lg:max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Search name, ID, email..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"/>
            </div>
            <select value={selectedDepartment} onChange={e=>setSelectedDepartment(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              {DEPTS.map(d=><option key={d} value={d}>{d==="All"?"All Departments":d}</option>)}
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="name">Sort by Name</option>
              <option value="salary">Sort by Salary</option>
              <option value="tax">Sort by Tax Amount</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button onClick={() => setViewMode("cards")} className={`p-2 rounded-md transition-all ${viewMode === "cards" ? "bg-white text-[#2c4a6a] shadow-sm" : "text-gray-500 hover:text-gray-700"}`} title="Card View">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white text-[#2c4a6a] shadow-sm" : "text-gray-500 hover:text-gray-700"}`} title="List View">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <button className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              Generate Tax Report
            </button>
          </div>
        </div>
      </div>

      {/* Pagination top */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{startIdx+1}</span>–<span className="font-semibold text-gray-900">{Math.min(startIdx+itemsPerPage,filteredEmployees.length)}</span> of <span className="font-semibold text-gray-900">{filteredEmployees.length}</span> employees
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show</span>
          <select value={itemsPerPage} onChange={e=>{setItemsPerPage(Number(e.target.value));setCurrentPage(1);}} className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
            {[10,20,50,100].map(n=><option key={n}>{n}</option>)}
          </select>
          <span className="text-sm text-gray-500">per page</span>
        </div>
      </div>

      {/* CARDS VIEW */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
          {visible.map(emp => (
            <div key={emp.id} className="bg-white rounded-2xl border border-gray-100 hover:border-[#c3d2e9] hover:shadow-md transition-all p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-base flex-shrink-0 overflow-hidden relative">
                    <Image src={emp.image} alt={emp.name} fill className="object-cover" />
                    <span className="text-base font-bold z-10">{getInitials(emp.name)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{emp.name}</p>
                    <p className="text-xs text-gray-400">{emp.id}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#abd4ea] text-[#2c4a6a] rounded-full text-[11px] font-semibold">{emp.taxRate}% Rate</span>
              </div>
              <div className="space-y-1.5 mb-4 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{emp.department}</p>
                <p className="text-xs text-gray-500">Monthly Salary: GHS {emp.monthlySalary.toLocaleString()}</p>
                <p className="text-xs text-gray-400 truncate">{emp.email}</p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Monthly Tax</p>
                  <p className="text-base font-bold text-[#2c4a6a]">GHS {emp.monthlyTax.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-[#eef3f9] hover:bg-[#c3d2e9] text-[#2c4a6a] rounded-lg text-xs font-semibold transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    View
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-xs font-semibold transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Monthly Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Monthly Tax</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tax Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">YTD Tax</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden relative">
                          <Image src={emp.image} alt={emp.name} fill className="object-cover" />
                          <span className="text-sm font-bold z-10">{getInitials(emp.name)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-400">{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#2c4a6a]">GHS {emp.monthlySalary.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#2c4a6a]">GHS {emp.monthlyTax.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.taxRate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">GHS {emp.ytdTax.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="View">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                        <button className="p-2 hover:bg-[#eef3f9] rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination bottom */}
      {filteredEmployees.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">Page <b>{currentPage}</b> of <b>{totalPages}</b></p>
          <div className="flex items-center gap-1.5">
            <button onClick={()=>goTo(currentPage-1)} disabled={currentPage===1} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div className="hidden sm:flex gap-1">
              {pageNums().map((p,i)=> p==="..." ? <span key={i} className="w-9 flex items-center justify-center text-gray-400 text-sm">…</span> :
                <button key={p} onClick={()=>goTo(p as number)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage===p?"bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white":"text-gray-700 hover:bg-gray-100"}`}>{p}</button>
              )}
            </div>
            <button onClick={()=>goTo(currentPage+1)} disabled={currentPage===totalPages} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm text-gray-500">Go to</span>
            <input type="number" min={1} max={totalPages} defaultValue={currentPage} onBlur={e=>{const p=parseInt(e.target.value);if(p>=1&&p<=totalPages)goTo(p);}}
              className="w-14 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"/>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredEmployees.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <svg className="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <p className="text-gray-800 font-semibold mb-2">No employees found</p>
          <p className="text-gray-500 text-sm mb-4">Adjust your filters or search term</p>
          <button onClick={()=>{setSearchTerm("");setSelectedDepartment("All");}} className="text-[#2c4a6a] text-sm font-medium hover:underline">Clear filters</button>
        </div>
      )}
    </div>
  );
}