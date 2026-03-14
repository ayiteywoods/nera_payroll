"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const initialJobs = [
  { id: "JOB001", title: "Senior Software Engineer", department: "Engineering", location: "Accra, Ghana", type: "Full-Time", experience: "5+ years", salary: "GHS8,000 - GHS12,000", status: "Open", postedDate: "2025-01-15", deadline: "2025-02-28", applicants: 24, description: "We are looking for an experienced software engineer to join our team and contribute to building scalable applications.", requirements: "Bachelor's degree in Computer Science, 5+ years experience with React, Node.js, and cloud platforms." },
  { id: "JOB002", title: "HR Manager", department: "HR", location: "Accra, Ghana", type: "Full-Time", experience: "3+ years", salary: "GHS6,000 - GHS9,000", status: "Open", postedDate: "2025-01-20", deadline: "2025-03-15", applicants: 15, description: "Seeking an HR professional to manage employee relations and recruitment processes.", requirements: "Bachelor's degree in HR Management, 3+ years experience in HR operations." },
  { id: "JOB003", title: "Sales Executive", department: "Sales", location: "Kumasi, Ghana", type: "Contract", experience: "2+ years", salary: "GHS4,000 - GHS6,000", status: "Closed", postedDate: "2025-01-10", deadline: "2025-02-10", applicants: 32, description: "Looking for a motivated sales professional to drive revenue growth.", requirements: "2+ years in B2B sales, proven track record of meeting sales targets." },
];

const initialApplications = [
  { id: "APP001", jobId: "JOB001", jobTitle: "Senior Software Engineer", candidateName: "Kwame Asante",   email: "kwame.asante@email.com",   phone: "+233 24 123 4567", appliedDate: "2025-01-20", status: "Under Review", experience: "6 years", skills: ["JavaScript","React","Node.js","Python"] },
  { id: "APP002", jobId: "JOB001", jobTitle: "Senior Software Engineer", candidateName: "Abena Mensah",   email: "abena.mensah@email.com",   phone: "+233 24 234 5678", appliedDate: "2025-01-22", status: "Under Review", experience: "7 years", skills: ["Java","Spring Boot","AWS","Docker"] },
  { id: "APP003", jobId: "JOB002", jobTitle: "HR Manager",               candidateName: "Yaw Boateng",    email: "yaw.boateng@email.com",    phone: "+233 24 345 6789", appliedDate: "2025-01-25", status: "Under Review", experience: "4 years", skills: ["HR Management","Recruitment","Employee Relations"] },
  { id: "APP004", jobId: "JOB001", jobTitle: "Senior Software Engineer", candidateName: "Akosua Frimpong",email: "akosua.frimpong@email.com", phone: "+233 24 456 7890", appliedDate: "2025-01-23", status: "Under Review", experience: "5 years", skills: ["TypeScript","React","Next.js","PostgreSQL"] },
];

const initialCandidates = [
  { id: "CAN001", name: "Kwame Asante",   email: "kwame.asante@email.com",   phone: "+233 24 123 4567", skills: ["JavaScript","React","Node.js","Python"],     experience: "6 years", location: "Accra, Ghana", status: "Active",           registeredDate: "2025-01-15", applications: 2 },
  { id: "CAN002", name: "Abena Mensah",   email: "abena.mensah@email.com",   phone: "+233 24 234 5678", skills: ["Java","Spring Boot","AWS","Docker"],         experience: "7 years", location: "Accra, Ghana", status: "Active",           registeredDate: "2025-01-18", applications: 3 },
  { id: "CAN003", name: "Akosua Frimpong",email: "akosua.frimpong@email.com",phone: "+233 24 456 7890", skills: ["TypeScript","React","Next.js","PostgreSQL"], experience: "5 years", location: "Accra, Ghana", status: "Passed Interview", registeredDate: "2025-01-20", applications: 1 },
];

// ── Same badge function as employee page ──────────────────────────────────────
const statusColor = (s: string) =>
  s === "Open"             ? "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]"  :
  s === "Active"           ? "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]"  :
  s === "Shortlisted"      ? "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]"  :
  s === "Passed Interview" ? "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]"  :
  s === "Under Review"     ? "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]"  :
  s === "Closed"           ? "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]"  :
  s === "Inactive"         ? "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]"  :
  s === "Rejected"         ? "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]"  :
                             "bg-gray-100 text-gray-700 border-gray-200";

const getInitials = (name: string) => {
  const parts = name.split(" ");
  return parts.length >= 2 ? parts[0][0] + parts[1][0] : name[0] + (name[1] || "");
};

// Shared table header — exact same style as employee page
const Th = ({ children, right = false }: { children: React.ReactNode; right?: boolean }) => (
  <th className={`px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${right ? "text-right" : "text-left"}`}>
    {children}
  </th>
);

export default function RecruitmentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab]       = useState("jobs");
  const [jobs, setJobs]                 = useState(initialJobs);
  const [applications, setApplications] = useState(initialApplications);
  const [candidates, setCandidates]     = useState(initialCandidates);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen]       = useState(false);
  const [searchTerm, setSearchTerm]     = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode]         = useState<"cards" | "list">("list");
  const [currentPage, setCurrentPage]   = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [jobFormData, setJobFormData] = useState({
    title: "", department: "", location: "", type: "", experience: "",
    salary: "", description: "", requirements: "", deadline: "",
  });

  const handleCreateJob = (e) => {
    e.preventDefault();
    const newJob = {
      id: `JOB${String(jobs.length + 1).padStart(3, "0")}`,
      ...jobFormData, status: "Open",
      postedDate: new Date().toISOString().split("T")[0], applicants: 0,
    };
    setJobs([newJob, ...jobs]);
    setIsCreateJobModalOpen(false);
    setJobFormData({ title: "", department: "", location: "", type: "", experience: "", salary: "", description: "", requirements: "", deadline: "" });
  };

  const handleDeleteJob = () => {
    setJobs(jobs.filter(j => j.id !== selectedItem.id));
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const statusOptions = {
    jobs:         ["All", "Open", "Closed"],
    applications: ["All", "Under Review", "Shortlisted", "Passed Interview", "Rejected"],
    candidates:   ["All", "Active", "Passed Interview", "Inactive"],
  };

  const getFilteredData = () => {
    let data = activeTab === "jobs" ? jobs : activeTab === "applications" ? applications : candidates;
    if (searchTerm)             data = data.filter(item => JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus !== "All") data = data.filter(item => item.status === filterStatus);
    return data;
  };

  const filteredData = getFilteredData();
  const totalPages   = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIdx     = (currentPage - 1) * itemsPerPage;
  const visible      = filteredData.slice(startIdx, startIdx + itemsPerPage);

  const pageNums = () => {
    const p: (number | string)[] = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) p.push(i); }
    else if (currentPage <= 4) { for (let i = 1; i <= 5; i++) p.push(i); p.push("..."); p.push(totalPages); }
    else if (currentPage >= totalPages - 3) { p.push(1); p.push("..."); for (let i = totalPages - 4; i <= totalPages; i++) p.push(i); }
    else { p.push(1); p.push("..."); for (let i = currentPage - 1; i <= currentPage + 1; i++) p.push(i); p.push("..."); p.push(totalPages); }
    return p;
  };

  const goTo     = (n: number) => { setCurrentPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const switchTab = (tab: string) => { setActiveTab(tab); setFilterStatus("All"); setCurrentPage(1); setSearchTerm(""); };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-1">Recruitment management</h1>
        <p className="text-sm text-gray-600">Manage jobs, applications, and candidates</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total jobs",         value: jobs.length,         sub: `${jobs.filter(j => j.status === "Open").length} open positions`           },
          { label: "Total applications", value: applications.length, sub: `${applications.filter(a => a.status === "Under Review").length} under review` },
          { label: "Total candidates",   value: candidates.length,   sub: `${candidates.filter(c => c.status === "Active").length} active candidates`   },
          { label: "Showing",            value: filteredData.length, sub: "From current filters"                                                       },
        ].map(c => (
          <div key={c.label} className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5 text-white relative overflow-hidden transition-all hover:scale-[1.02]">
            <p className="text-xs text-white/80 mb-1 relative z-10 font-medium">{c.label}</p>
            <p className="text-3xl font-extrabold text-white relative z-10">{c.value}</p>
            <p className="text-xs text-white/60 mt-1 relative z-10">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            <div className="relative flex-1 lg:max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]" />
            </div>
            <select value={activeTab} onChange={e => switchTab(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              <option value="jobs">Jobs</option>
              <option value="applications">Applications</option>
              <option value="candidates">Candidates</option>
            </select>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              {statusOptions[activeTab].map(s => <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button onClick={() => setViewMode("cards")}
                className={`p-2 rounded-md transition-all ${viewMode === "cards" ? "bg-white text-[#2c4a6a]" : "text-gray-500 hover:text-gray-700"}`} title="Card view">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white text-[#2c4a6a]" : "text-gray-500 hover:text-gray-700"}`} title="List view">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
            {activeTab === "jobs" && (
              <button onClick={() => setIsCreateJobModalOpen(true)}
                className="bg-[#2c4a6a] hover:bg-[#1e3147] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Create job
              </button>
            )}
            {activeTab === "candidates" && (
              <button onClick={() => router.push("/employees/create")}
                className="bg-[#2c4a6a] hover:bg-[#1e3147] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add candidate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pagination top */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{startIdx + 1}</span>–<span className="font-semibold text-gray-900">{Math.min(startIdx + itemsPerPage, filteredData.length)}</span> of <span className="font-semibold text-gray-900">{filteredData.length}</span> {activeTab}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show</span>
          <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
            {[10, 20, 50, 100].map(n => <option key={n}>{n}</option>)}
          </select>
          <span className="text-sm text-gray-500">per page</span>
        </div>
      </div>

      {/* ── Jobs cards ────────────────────────────────────────────────────── */}
      {activeTab === "jobs" && viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
          {visible.map(job => (
            <div key={job.id} className="bg-white rounded-2xl border border-gray-100 hover:border-[#c3d2e9] transition-all p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {job.id.slice(-2)}
                  </div>
                  <div><p className="font-semibold text-gray-900 text-sm">{job.title}</p><p className="text-xs text-gray-400">{job.id}</p></div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 ${statusColor(job.status)}`}>{job.status}</span>
              </div>
              <div className="space-y-1.5 mb-4 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{job.department}</p>
                <p className="text-xs text-gray-500">{job.location} · {job.type}</p>
                <p className="text-xs text-gray-400">Experience: {job.experience}</p>
                <p className="text-xs text-gray-400 truncate">Salary: {job.salary}</p>
                <p className="text-xs text-gray-400">{job.applicants} applicants</p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Deadline</p>
                  <p className="text-sm font-bold text-[#2c4a6a]">{new Date(job.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { sessionStorage.setItem("selected_job", JSON.stringify(job)); router.push("/recruitment/job-detail"); }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#eef3f9] hover:bg-[#c3d2e9] text-[#2c4a6a] rounded-lg text-xs font-semibold transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    View
                  </button>
                  <button onClick={() => { setSelectedItem(job); setIsDeleteModalOpen(true); }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-lg text-xs font-semibold transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Jobs list ─────────────────────────────────────────────────────── */}
      {activeTab === "jobs" && viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <Th>Job</Th>
                  <Th>Department</Th>
                  <Th>Location</Th>
                  <Th>Salary</Th>
                  <Th>Applicants</Th>
                  <Th>Status</Th>
                  <Th right>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {job.id.slice(-2)}
                        </div>
                        <div><p className="text-sm font-semibold text-gray-900">{job.title}</p><p className="text-xs text-gray-400">{job.id}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><p className="text-sm text-gray-900">{job.department}</p><p className="text-xs text-gray-400">{job.type}</p></td>
                    <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-gray-900">{job.location}</p></td>
                    <td className="px-6 py-4"><p className="text-sm font-bold text-[#2c4a6a]">{job.salary}</p></td>
                    <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-gray-900">{job.applicants}</p></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(job.status)}`}>{job.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { sessionStorage.setItem("selected_job", JSON.stringify(job)); router.push("/recruitment/job-detail"); }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="View">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button onClick={() => { setSelectedItem(job); setIsDeleteModalOpen(true); }}
                          className="p-2 hover:bg-[#eef3f9] rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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

      {/* ── Applications cards ───────────────────────────────────────────── */}
      {activeTab === "applications" && viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
          {visible.map(app => (
            <div key={app.id} className="bg-white rounded-2xl border border-gray-100 hover:border-[#c3d2e9] transition-all p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {getInitials(app.candidateName)}
                  </div>
                  <div><p className="font-semibold text-gray-900 text-sm">{app.candidateName}</p><p className="text-xs text-gray-400">{app.id}</p></div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 ${statusColor(app.status)}`}>{app.status}</span>
              </div>
              <div className="space-y-1.5 mb-4 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{app.jobTitle}</p>
                <p className="text-xs text-gray-500 truncate">{app.email}</p>
                <p className="text-xs text-gray-400">{app.phone}</p>
                <p className="text-xs text-gray-400">Experience: {app.experience}</p>
                <p className="text-xs text-gray-400">Applied: {new Date(app.appliedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
                <button onClick={() => { sessionStorage.setItem("selected_application", JSON.stringify(app)); router.push("/recruitment/application-detail"); }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#eef3f9] hover:bg-[#c3d2e9] text-[#2c4a6a] rounded-lg text-xs font-semibold transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Applications list ────────────────────────────────────────────── */}
      {activeTab === "applications" && viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <Th>Candidate</Th>
                  <Th>Job title</Th>
                  <Th>Contact</Th>
                  <Th>Applied date</Th>
                  <Th>Status</Th>
                  <Th right>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {getInitials(app.candidateName)}
                        </div>
                        <div><p className="text-sm font-semibold text-gray-900">{app.candidateName}</p><p className="text-xs text-gray-400">{app.id}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><p className="text-sm text-gray-900">{app.jobTitle}</p></td>
                    <td className="px-6 py-4"><p className="text-sm text-gray-900 truncate max-w-[200px]">{app.email}</p><p className="text-xs text-gray-400">{app.phone}</p></td>
                    <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-gray-900">{new Date(app.appliedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(app.status)}`}>{app.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { sessionStorage.setItem("selected_application", JSON.stringify(app)); router.push("/recruitment/application-detail"); }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="View">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
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

      {/* ── Candidates cards ─────────────────────────────────────────────── */}
      {activeTab === "candidates" && viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
          {visible.map(candidate => (
            <div key={candidate.id} className="bg-white rounded-2xl border border-gray-100 hover:border-[#c3d2e9] transition-all p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {getInitials(candidate.name)}
                  </div>
                  <div><p className="font-semibold text-gray-900 text-sm">{candidate.name}</p><p className="text-xs text-gray-400">{candidate.id}</p></div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 ${statusColor(candidate.status)}`}>{candidate.status}</span>
              </div>
              <div className="space-y-1.5 mb-4 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{candidate.location}</p>
                <p className="text-xs text-gray-500 truncate">{candidate.email}</p>
                <p className="text-xs text-gray-400">{candidate.phone}</p>
                <p className="text-xs text-gray-400">Experience: {candidate.experience}</p>
                <div className="flex flex-wrap gap-1 pt-2">
                  {candidate.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-[#d4e1ed] text-[#2c4a6a] rounded text-xs font-medium">{skill}</span>
                  ))}
                  {candidate.skills.length > 3 && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">+{candidate.skills.length - 3}</span>}
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div><p className="text-[10px] text-gray-400 mb-0.5">Applications</p><p className="text-base font-bold text-[#2c4a6a]">{candidate.applications}</p></div>
                <button onClick={() => { sessionStorage.setItem("selected_candidate", JSON.stringify(candidate)); router.push("/recruitment/candidate-detail"); }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#eef3f9] hover:bg-[#c3d2e9] text-[#2c4a6a] rounded-lg text-xs font-semibold transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Candidates list ──────────────────────────────────────────────── */}
      {activeTab === "candidates" && viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <Th>Candidate</Th>
                  <Th>Contact</Th>
                  <Th>Experience</Th>
                  <Th>Applications</Th>
                  <Th>Status</Th>
                  <Th right>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map(candidate => (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {getInitials(candidate.name)}
                        </div>
                        <div><p className="text-sm font-semibold text-gray-900">{candidate.name}</p><p className="text-xs text-gray-400">{candidate.id}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><p className="text-sm text-gray-900 truncate max-w-[200px]">{candidate.email}</p><p className="text-xs text-gray-400">{candidate.phone}</p></td>
                    <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm font-bold text-[#2c4a6a]">{candidate.experience}</p></td>
                    <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-gray-900">{candidate.applications}</p></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(candidate.status)}`}>{candidate.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { sessionStorage.setItem("selected_candidate", JSON.stringify(candidate)); router.push("/recruitment/candidate-detail"); }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]" title="View">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
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

      {/* Empty state */}
      {filteredData.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <svg className="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-800 font-semibold mb-2">No {activeTab} found</p>
          <p className="text-gray-500 text-sm mb-4">Adjust your filters or search term</p>
          <button onClick={() => { setSearchTerm(""); setFilterStatus("All"); }} className="text-[#2c4a6a] text-sm font-medium hover:underline">Clear filters</button>
        </div>
      )}

      {/* Pagination bottom */}
      {filteredData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">Page <b>{currentPage}</b> of <b>{totalPages}</b></p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="hidden sm:flex gap-1">
              {pageNums().map((p, i) =>
                p === "..." ? <span key={i} className="w-9 flex items-center justify-center text-gray-400 text-sm">…</span> :
                <button key={p} onClick={() => goTo(p as number)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage === p ? "bg-[#2c4a6a] text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                  {p}
                </button>
              )}
            </div>
            <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm text-gray-500">Go to</span>
            <input type="number" min={1} max={totalPages} defaultValue={currentPage}
              onBlur={e => { const p = parseInt(e.target.value); if (p >= 1 && p <= totalPages) goTo(p); }}
              className="w-14 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]" />
          </div>
        </div>
      )}

      {/* Create job modal */}
      {isCreateJobModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold">Create new job</h2>
              <button onClick={() => setIsCreateJobModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleCreateJob} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: "Job title",           key: "title",      placeholder: ""                         },
                  { label: "Department",          key: "department", placeholder: ""                         },
                  { label: "Location",            key: "location",   placeholder: ""                         },
                  { label: "Experience required", key: "experience", placeholder: "e.g. 3+ years"            },
                  { label: "Salary range",        key: "salary",     placeholder: "e.g. GHS5,000 - GHS8,000" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label} *</label>
                    <input type="text" value={jobFormData[f.key]} placeholder={f.placeholder}
                      onChange={e => setJobFormData({ ...jobFormData, [f.key]: e.target.value })} required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Job type *</label>
                  <select value={jobFormData.type} onChange={e => setJobFormData({ ...jobFormData, type: e.target.value })} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
                    <option value="">Select type</option><option>Full-Time</option><option>Part-Time</option><option>Contract</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Application deadline *</label>
                  <input type="date" value={jobFormData.deadline} onChange={e => setJobFormData({ ...jobFormData, deadline: e.target.value })} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Job description *</label>
                  <textarea value={jobFormData.description} onChange={e => setJobFormData({ ...jobFormData, description: e.target.value })} required rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Requirements</label>
                  <textarea value={jobFormData.requirements} onChange={e => setJobFormData({ ...jobFormData, requirements: e.target.value })} rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]" />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsCreateJobModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit"
                  className="px-6 py-2.5 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-xl text-sm font-semibold transition-all">Create job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {isDeleteModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-base font-bold">Delete job</h2>
              <button onClick={() => { setIsDeleteModalOpen(false); setSelectedItem(null); }} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <div className="w-11 h-11 rounded-full bg-[#eef3f9] flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <p className="text-sm font-bold text-gray-900 text-center mb-1">Delete {selectedItem.id}?</p>
              <p className="text-xs text-gray-500 text-center mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => { setIsDeleteModalOpen(false); setSelectedItem(null); }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleDeleteJob}
                  className="flex-1 py-2.5 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-xl text-sm font-semibold transition-all">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}