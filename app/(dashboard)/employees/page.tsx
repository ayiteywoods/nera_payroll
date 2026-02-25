"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

const generateEmployees = () => {
  const firstNames = ["John","Abena","Kwame","Ama","Kofi","Akosua","Yaw","Adjoa","Kwabena","Adwoa","Fiifi","Esi","Kojo","Efua","Kwesi","Akua","Yaa","Kow","Araba","Kwaku"];
  const lastNames  = ["Mensah","Osei","Boateng","Asante","Owusu","Appiah","Agyei","Adjei","Opoku","Gyasi","Sarpong","Ofori","Acheampong","Boakye","Wiredu","Baah","Antwi","Frimpong","Danso","Asiedu"];
  const jobTitles  = ["Software Engineer","Senior Developer","Product Designer","Data Analyst","HR Manager","Sales Executive","Marketing Specialist","Accountant","Finance Manager","IT Support","Project Manager","Business Analyst","Operations Manager","Customer Success Manager","QA Engineer"];
  const departments = ["Engineering","Management","Sales","HR","Support","Finance","Marketing","Operations"];
  const statuses   = ["Active","On Leave","Suspended"];
  const banks      = ["GCB Bank","Ecobank","Stanbic Bank","Fidelity Bank","Absa Bank","MTN MoMo"];
  const paymentMethods = ["Bank Transfer","Mobile Money","Cheque"];
  const streets    = ["Ring Road","Independence Ave","Oxford St","Cantonments Rd","Liberation Rd"];
  const relationships = ["Spouse","Parent","Sibling","Friend"];

  return Array.from({ length: 1000 }, (_, i) => {
    const idx = i + 1;
    const fn  = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln  = lastNames[Math.floor(Math.random() * lastNames.length)];
    const bs  = Math.floor(Math.random() * 10000) + 3000;
    return {
      id: `EMP${String(idx).padStart(4,"0")}`,
      firstName: fn, lastName: ln,
      otherNames: lastNames[Math.floor(Math.random() * lastNames.length)],
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${idx}@company.com`,
      phone: `+233 ${20+Math.floor(Math.random()*8)} ${Math.floor(Math.random()*900+100)} ${Math.floor(Math.random()*9000+1000)}`,
      dateOfBirth: `19${70+Math.floor(Math.random()*25)}-${String(Math.floor(Math.random()*12)+1).padStart(2,"0")}-${String(Math.floor(Math.random()*28)+1).padStart(2,"0")}`,
      gender: ["Male","Female"][Math.floor(Math.random()*2)],
      residentialAddress: `${Math.floor(Math.random()*99)+1} ${streets[Math.floor(Math.random()*streets.length)]}, Accra, Ghana`,
      profileImage: `/profiles/employee${(idx%4)+1}.jpg`,
      jobTitle: jobTitles[Math.floor(Math.random()*jobTitles.length)],
      department: departments[Math.floor(Math.random()*departments.length)],
      employmentType: ["Full-Time","Part-Time","Contract"][Math.floor(Math.random()*3)],
      employmentStatus: statuses[Math.floor(Math.random()*statuses.length)],
      basicSalary: bs,
      salaryType: "Monthly",
      allowances: Math.floor(Math.random()*1500)+200,
      taxId: `TIN-GH-${Math.floor(Math.random()*90000000)+10000000}`,
      ssnit: `SSN-${Math.floor(Math.random()*9000000)+1000000}`,
      bankName: banks[Math.floor(Math.random()*banks.length)],
      accountName: `${fn} ${ln}`,
      accountNumber: String(Math.floor(Math.random()*9000000000)+1000000000),
      paymentMethod: paymentMethods[Math.floor(Math.random()*paymentMethods.length)],
      hireDate: `20${18+Math.floor(Math.random()*7)}-${String(Math.floor(Math.random()*12)+1).padStart(2,"0")}-${String(Math.floor(Math.random()*28)+1).padStart(2,"0")}`,
      emergencyContact: {
        name: `${firstNames[Math.floor(Math.random()*firstNames.length)]} ${ln}`,
        phone: `+233 ${20+Math.floor(Math.random()*8)} ${Math.floor(Math.random()*900+100)} ${Math.floor(Math.random()*9000+1000)}`,
        relationship: relationships[Math.floor(Math.random()*relationships.length)],
      },
      resume: `${fn.toLowerCase()}_${ln.toLowerCase()}_cv.pdf`,
      idDocument: "ghana_card.pdf",
      performanceScore: Math.floor(Math.random()*30)+70,
      tasksCompleted: Math.floor(Math.random()*150)+20,
      projectsCount: Math.floor(Math.random()*12)+1,
      yearsAtCompany: Math.floor(Math.random()*7)+1,
    };
  });
};

const ALL_EMPLOYEES = generateEmployees();

export default function EmployeePage() {
  const [filteredEmployees, setFilteredEmployees] = useState(ALL_EMPLOYEES);
  const [searchTerm, setSearchTerm]               = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus]         = useState("All");
  const [sortBy, setSortBy]                         = useState("name");
  const [currentPage, setCurrentPage]               = useState(1);
  const [itemsPerPage, setItemsPerPage]             = useState(20);
  const [viewMode, setViewMode]                     = useState<"cards" | "list">("list");

  const DEPTS   = ["All","Engineering","Management","Sales","HR","Support","Finance","Marketing","Operations"];
  const STATUSES = ["All","Active","On Leave","Suspended"];

  React.useEffect(() => {
    let r = [...ALL_EMPLOYEES];
    if (searchTerm) r = r.filter(e =>
      `${e.firstName} ${e.lastName} ${e.email} ${e.id}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedDepartment !== "All") r = r.filter(e => e.department === selectedDepartment);
    if (selectedStatus     !== "All") r = r.filter(e => e.employmentStatus === selectedStatus);
    if (sortBy === "name")   r.sort((a,b) => a.firstName.localeCompare(b.firstName));
    if (sortBy === "date")   r.sort((a,b) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime());
    if (sortBy === "salary") r.sort((a,b) => b.basicSalary - a.basicSalary);
    setFilteredEmployees(r);
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedStatus, sortBy]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIdx   = (currentPage - 1) * itemsPerPage;
  const visible    = filteredEmployees.slice(startIdx, startIdx + itemsPerPage);

  const pageNums = () => {
    const p: (number|string)[] = [];
    if (totalPages <= 7) { for (let i=1;i<=totalPages;i++) p.push(i); }
    else if (currentPage <= 4) { for (let i=1;i<=5;i++) p.push(i); p.push("..."); p.push(totalPages); }
    else if (currentPage >= totalPages-3) { p.push(1); p.push("..."); for (let i=totalPages-4;i<=totalPages;i++) p.push(i); }
    else { p.push(1); p.push("..."); for (let i=currentPage-1;i<=currentPage+1;i++) p.push(i); p.push("..."); p.push(totalPages); }
    return p;
  };

  const goTo = (n: number) => { setCurrentPage(n); window.scrollTo({top:0,behavior:"smooth"}); };

  const statusColor = (s: string) =>
    s === "Active"    ? "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]"  :
    s === "On Leave"  ? "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]" :
    s === "Suspended" ? "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]" :
                        "bg-gray-100 text-gray-700 border-gray-200";

  const handleViewEmployee = (emp: any) => {
    sessionStorage.setItem("nerapay_employee", JSON.stringify(emp));
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-1">Employee Management</h1>
        <p className="text-sm text-gray-600">Manage your workforce and employee information</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label:"Total Employees", value: ALL_EMPLOYEES.length, sub:"All in system" },
          { label:"Active",          value: ALL_EMPLOYEES.filter(e=>e.employmentStatus==="Active").length, sub:"Currently active" },
          { label:"On Leave",        value: ALL_EMPLOYEES.filter(e=>e.employmentStatus==="On Leave").length, sub:"Currently on leave" },
          { label:"Showing",         value: filteredEmployees.length, sub:"From current filters" },
        ].map(c => (
          <div key={c.label} className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
            <p className="text-xs text-white/70 mb-1">{c.label}</p>
            <p className="text-3xl font-bold text-white">{c.value.toLocaleString()}</p>
            <p className="text-xs text-white/50 mt-1">{c.sub}</p>
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
            <select value={selectedStatus} onChange={e=>setSelectedStatus(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              {STATUSES.map(s=><option key={s} value={s}>{s==="All"?"All Status":s}</option>)}
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Hire Date</option>
              <option value="salary">Sort by Salary</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded-md transition-all ${viewMode === "cards" ? "bg-white text-[#2c4a6a] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                title="Card View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white text-[#2c4a6a] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                title="List View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <Link href="/employees/create">
              <button className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                Add Employee
              </button>
            </Link>
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
                    <Image
                      src={emp.profileImage}
                      alt={`${emp.firstName} ${emp.lastName}`}
                      fill
                      className="object-cover"
                    />
                    <span className="text-base font-bold z-10">{emp.firstName[0]}{emp.lastName[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-gray-400">{emp.id}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 ${statusColor(emp.employmentStatus)}`}>{emp.employmentStatus}</span>
              </div>
              <div className="space-y-1.5 mb-4 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{emp.jobTitle}</p>
                <p className="text-xs text-gray-500">{emp.department} · {emp.employmentType}</p>
                <p className="text-xs text-gray-400 truncate">{emp.email}</p>
                <p className="text-xs text-gray-400">{emp.phone}</p>
                <p className="text-xs text-gray-400">Hired: {new Date(emp.hireDate).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Basic Salary</p>
                  <p className="text-base font-bold text-[#2c4a6a]">GHs{emp.basicSalary.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Link href="/employees/profile" onClick={() => handleViewEmployee(emp)} className="flex items-center gap-1.5 px-3 py-2 bg-[#eef3f9] hover:bg-[#c3d2e9] text-[#2c4a6a] rounded-lg text-xs font-semibold transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    View
                  </Link>
                  <Link href="/employees/profile" onClick={() => handleViewEmployee(emp)} className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-xs font-semibold transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    Edit
                  </Link>
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden relative">
                          <Image
                            src={emp.profileImage}
                            alt={`${emp.firstName} ${emp.lastName}`}
                            fill
                            className="object-cover"
                          />
                          <span className="text-sm font-bold z-10">{emp.firstName[0]}{emp.lastName[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-gray-400">{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{emp.jobTitle}</p>
                      <p className="text-xs text-gray-400">{emp.employmentType}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-gray-900">{emp.department}</p></td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 truncate max-w-[200px]">{emp.email}</p>
                      <p className="text-xs text-gray-400">{emp.phone}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-bold text-[#2c4a6a]">GHS {emp.basicSalary.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Monthly</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(emp.employmentStatus)}`}>{emp.employmentStatus}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/employees/profile" onClick={() => handleViewEmployee(emp)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="View">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </Link>
                        <Link href="/employees/profile" onClick={() => handleViewEmployee(emp)} className="p-2 hover:bg-[#eef3f9] rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </Link>
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
          <button onClick={()=>{setSearchTerm("");setSelectedDepartment("All");setSelectedStatus("All");}} className="text-[#2c4a6a] text-sm font-medium hover:underline">Clear filters</button>
        </div>
      )}
    </div>
  );
}