"use client";

import React, { useState } from "react";

// Sample report data
const initialReports = [
  { id: "RPT001", title: "Monthly Payroll Summary", period: "January 2024", type: "Summary", generatedDate: "2024-01-31", generatedBy: "John Mensah", size: "245 KB", status: "Ready" },
  { id: "RPT002", title: "Employee Salary Breakdown", period: "January 2024", type: "Detailed", generatedDate: "2024-01-31", generatedBy: "Ama Serwaa", size: "1.2 MB", status: "Ready" },
  { id: "RPT003", title: "Tax Deduction Report", period: "January 2024", type: "Tax", generatedDate: "2024-01-31", generatedBy: "Kofi Boateng", size: "156 KB", status: "Ready" },
  { id: "RPT004", title: "SSNIT Contribution Report", period: "January 2024", type: "Statutory", generatedDate: "2024-01-31", generatedBy: "Efua Addo", size: "189 KB", status: "Ready" },
  { id: "RPT005", title: "Monthly Payroll Summary", period: "February 2024", type: "Summary", generatedDate: "2024-02-29", generatedBy: "John Mensah", size: "251 KB", status: "Ready" },
  { id: "RPT006", title: "Employee Salary Breakdown", period: "February 2024", type: "Detailed", generatedDate: "2024-02-29", generatedBy: "Ama Serwaa", size: "1.3 MB", status: "Ready" },
  { id: "RPT007", title: "Tax Deduction Report", period: "February 2024", type: "Tax", generatedDate: "2024-02-29", generatedBy: "Kofi Boateng", size: "162 KB", status: "Ready" },
  { id: "RPT008", title: "SSNIT Contribution Report", period: "February 2024", type: "Statutory", generatedDate: "2024-02-29", generatedBy: "Efua Addo", size: "195 KB", status: "Ready" },
  { id: "RPT009", title: "Monthly Payroll Summary", period: "March 2024", type: "Summary", generatedDate: "2024-03-31", generatedBy: "John Mensah", size: "258 KB", status: "Ready" },
  { id: "RPT010", title: "Employee Salary Breakdown", period: "March 2024", type: "Detailed", generatedDate: "2024-03-31", generatedBy: "Ama Serwaa", size: "1.4 MB", status: "Ready" },
  { id: "RPT011", title: "Overtime Analysis Report", period: "Q1 2024", type: "Analysis", generatedDate: "2024-03-31", generatedBy: "Kofi Boateng", size: "328 KB", status: "Ready" },
  { id: "RPT012", title: "Allowances Summary", period: "Q1 2024", type: "Summary", generatedDate: "2024-03-31", generatedBy: "Efua Addo", size: "412 KB", status: "Ready" },
  { id: "RPT013", title: "Monthly Payroll Summary", period: "April 2024", type: "Summary", generatedDate: "2024-04-30", generatedBy: "John Mensah", size: "264 KB", status: "Ready" },
  { id: "RPT014", title: "Employee Salary Breakdown", period: "April 2024", type: "Detailed", generatedDate: "2024-04-30", generatedBy: "Ama Serwaa", size: "1.5 MB", status: "Ready" },
  { id: "RPT015", title: "Payroll Variance Report", period: "April 2024", type: "Analysis", generatedDate: "2024-04-30", generatedBy: "Kofi Boateng", size: "287 KB", status: "Ready" },
  { id: "RPT016", title: "Monthly Payroll Summary", period: "May 2024", type: "Summary", generatedDate: "2024-05-31", generatedBy: "John Mensah", size: "271 KB", status: "Ready" },
  { id: "RPT017", title: "Employee Salary Breakdown", period: "May 2024", type: "Detailed", generatedDate: "2024-05-31", generatedBy: "Ama Serwaa", size: "1.6 MB", status: "Ready" },
  { id: "RPT018", title: "Annual Leave Impact Report", period: "May 2024", type: "Analysis", generatedDate: "2024-05-31", generatedBy: "Efua Addo", size: "198 KB", status: "Ready" },
  { id: "RPT019", title: "Department Cost Analysis", period: "Q2 2024", type: "Analysis", generatedDate: "2024-06-30", generatedBy: "John Mensah", size: "445 KB", status: "Processing" },
  { id: "RPT020", title: "Year-to-Date Payroll Summary", period: "H1 2024", type: "Summary", generatedDate: "2024-06-30", generatedBy: "Ama Serwaa", size: "892 KB", status: "Processing" },
];

export default function PayrollReportPage() {
  const [reports, setReports] = useState(initialReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");

  const [reportFormData, setReportFormData] = useState({
    reportType: "", period: "", startDate: "", endDate: "",
    includeCharts: true, includeDetails: true, format: "PDF",
  });

  // Filter reports
  const filteredReports = React.useMemo(() => {
    let result = [...reports];
    if (searchTerm) {
      result = result.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.generatedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType !== "All") {
      result = result.filter(r => r.type === filterType);
    }
    return result;
  }, [reports, searchTerm, filterType]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchTerm]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const pageNums = () => {
    const p: (number|string)[] = [];
    if (totalPages <= 7) { 
      for (let i=1; i<=totalPages; i++) p.push(i); 
    } else if (currentPage <= 4) { 
      for (let i=1; i<=5; i++) p.push(i); 
      p.push("..."); 
      p.push(totalPages); 
    } else if (currentPage >= totalPages-3) { 
      p.push(1); 
      p.push("..."); 
      for (let i=totalPages-4; i<=totalPages; i++) p.push(i); 
    } else { 
      p.push(1); 
      p.push("..."); 
      for (let i=currentPage-1; i<=currentPage+1; i++) p.push(i); 
      p.push("..."); 
      p.push(totalPages); 
    }
    return p;
  };

  const goTo = (n: number) => { 
    setCurrentPage(n); 
    window.scrollTo({top:0, behavior:"smooth"}); 
  };

  const getStatusColor = (status: string) =>
    status === "Ready"      ? "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]" :
    status === "Processing" ? "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]" :
    status === "Failed"     ? "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]" :
                              "bg-gray-100 text-gray-700 border-gray-200";

  const getTypeColor = (type: string) =>
    type === "Summary"   ? "bg-[#2c4a6a]/10 text-[#2c4a6a]" :
    type === "Detailed"  ? "bg-[#4a6b8a]/10 text-[#4a6b8a]" :
    type === "Tax"       ? "bg-[#6b8ca3]/10 text-[#6b8ca3]" :
    type === "Statutory" ? "bg-[#8badc3]/10 text-[#8badc3]" :
    type === "Analysis"  ? "bg-[#abd4ea]/10 text-[#abd4ea]" :
                           "bg-gray-100 text-gray-700";

  const handleGenerateReport = (e) => {
    e.preventDefault();
    const newReport = {
      id: `RPT${String(reports.length + 1).padStart(3, '0')}`,
      title: reportFormData.reportType,
      period: `${reportFormData.startDate} - ${reportFormData.endDate}`,
      type: reportFormData.reportType.includes("Summary") ? "Summary" : "Detailed",
      generatedDate: new Date().toISOString().split('T')[0],
      generatedBy: "Current User",
      size: `${Math.floor(Math.random() * 500) + 100} KB`,
      status: "Processing",
    };
    setReports([newReport, ...reports]);
    setIsGenerateModalOpen(false);
    setReportFormData({ reportType: "", period: "", startDate: "", endDate: "", includeCharts: true, includeDetails: true, format: "PDF" });
    alert("Report generation initiated!");
  };

  const handleDownloadReport = (report) => {
    alert(`Downloading ${report.title} as PDF...`);
  };

  const handleExportReport = (report, format) => {
    alert(`Exporting ${report.title} as ${format}...`);
  };

  const handlePreviewReport = (report) => {
    setSelectedReport(report);
    setIsPreviewModalOpen(true);
  };

  const handleDeleteReport = (reportId) => {
    if (confirm("Are you sure you want to delete this report?")) {
      setReports(reports.filter(r => r.id !== reportId));
      alert("Report deleted!");
    }
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-1">Payroll Reports</h1>
        <p className="text-sm text-gray-600">Generate, export and download payroll reports</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Reports", value: reports.length, sub: "All time generated" },
          { label: "Ready", value: reports.filter(r => r.status === "Ready").length, sub: "Available reports" },
          { label: "Processing", value: reports.filter(r => r.status === "Processing").length, sub: "In queue" },
          { label: "Showing", value: filteredReports.length, sub: "From filters" },
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
              <input type="text" placeholder="Search report, ID..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"/>
            </div>
            <select value={filterType} onChange={e=>setFilterType(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
              {["All", "Summary", "Detailed", "Tax", "Statutory", "Analysis"].map(t=><option key={t} value={t}>{t==="All"?"All Types":t}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button onClick={() => setViewMode("cards")} className={`p-2 rounded-md transition-all ${viewMode === "cards" ? "bg-white text-[#2c4a6a] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white text-[#2c4a6a] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
            <button onClick={() => setIsGenerateModalOpen(true)} className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Pagination top */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{startIndex+1}</span>–<span className="font-semibold text-gray-900">{Math.min(startIndex+itemsPerPage,filteredReports.length)}</span> of <span className="font-semibold text-gray-900">{filteredReports.length}</span> reports
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show</span>
          <select value={itemsPerPage} onChange={e=>{setItemsPerPage(Number(e.target.value));setCurrentPage(1);}} className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
            {[10,20,50,100].map(n=><option key={n}>{n}</option>)}
          </select>
          <span className="text-sm text-gray-500">per page</span>
        </div>
      </div>

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Report ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Report Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentReports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-sm">
                          {report.id.slice(-2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{report.id}</p>
                          <p className="text-xs text-gray-400">{report.generatedDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{report.title}</p>
                      <p className="text-xs text-gray-400">By {report.generatedBy}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-gray-900">{report.period}</p></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(report.type)}`}>{report.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-gray-600">{report.size}</p></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>{report.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={()=>handlePreviewReport(report)} disabled={report.status !== "Ready"} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a] disabled:opacity-40" title="Preview">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                        <button onClick={()=>handleDownloadReport(report)} disabled={report.status !== "Ready"} className="p-2 hover:bg-[#eef3f9] rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a] disabled:opacity-40" title="Download">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </button>
                        <button onClick={()=>handleDeleteReport(report.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-600 hover:text-red-600" title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
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

      {/* CARDS VIEW */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
          {currentReports.map(report => (
            <div key={report.id} className="bg-white rounded-2xl border border-gray-100 hover:border-[#c3d2e9] hover:shadow-md transition-all p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-base">
                    {report.id.slice(-2)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{report.id}</p>
                    <p className="text-xs text-gray-400">{report.generatedDate}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 ${getStatusColor(report.status)}`}>{report.status}</span>
              </div>
              <div className="space-y-1.5 mb-4 flex-1">
                <p className="text-sm font-medium text-gray-800">{report.title}</p>
                <p className="text-xs text-gray-500">{report.period}</p>
                <p className="text-xs text-gray-400">By {report.generatedBy}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(report.type)}`}>{report.type}</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">File Size</p>
                  <p className="text-base font-bold text-[#2c4a6a]">{report.size}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>handlePreviewReport(report)} disabled={report.status !== "Ready"} className="flex items-center gap-1.5 px-3 py-2 bg-[#eef3f9] hover:bg-[#c3d2e9] text-[#2c4a6a] rounded-lg text-xs font-semibold transition-colors disabled:opacity-40">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    View
                  </button>
                  <button onClick={()=>handleDownloadReport(report)} disabled={report.status !== "Ready"} className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-40">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredReports.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <svg className="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p className="text-gray-800 font-semibold mb-2">No reports found</p>
          <p className="text-gray-500 text-sm mb-4">Adjust your filters or search term</p>
          <button onClick={()=>{setSearchTerm("");setFilterType("All");}} className="text-[#2c4a6a] text-sm font-medium hover:underline">Clear filters</button>
        </div>
      )}

      {/* Pagination bottom */}
      {filteredReports.length > 0 && (
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

      {/* Generate Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-xl font-bold">Generate New Report</h2>
              <button onClick={() => setIsGenerateModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleGenerateReport} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Type *</label>
                  <select value={reportFormData.reportType} onChange={e=>setReportFormData({...reportFormData, reportType: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]">
                    <option value="">Select Report Type</option>
                    <option value="Monthly Payroll Summary">Monthly Payroll Summary</option>
                    <option value="Employee Salary Breakdown">Employee Salary Breakdown</option>
                    <option value="Tax Deduction Report">Tax Deduction Report</option>
                    <option value="SSNIT Contribution Report">SSNIT Contribution Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input type="date" value={reportFormData.startDate} onChange={e=>setReportFormData({...reportFormData, startDate: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                  <input type="date" value={reportFormData.endDate} onChange={e=>setReportFormData({...reportFormData, endDate: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"/>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setIsGenerateModalOpen(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all">Generate Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-xl font-bold">Report Preview - {selectedReport.id}</h2>
              <button onClick={() => setIsPreviewModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500 mb-1">Report Title</p><p className="text-base font-semibold text-gray-900">{selectedReport.title}</p></div>
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500 mb-1">Period</p><p className="text-base font-semibold text-gray-900">{selectedReport.period}</p></div>
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500 mb-1">Type</p><span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(selectedReport.type)}`}>{selectedReport.type}</span></div>
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500 mb-1">Size</p><p className="text-base font-semibold text-gray-900">{selectedReport.size}</p></div>
              </div>
              <div className="bg-gray-50 rounded-lg p-8 min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Preview</h3>
                  <p className="text-gray-600 mb-6">{selectedReport.title}<br/>Period: {selectedReport.period}</p>
                  <button onClick={() => handleDownloadReport(selectedReport)} className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all">Download Full Report</button>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t">
                <button onClick={() => setIsPreviewModalOpen(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}