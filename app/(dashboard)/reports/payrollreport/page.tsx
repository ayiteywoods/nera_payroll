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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Generate Report Form State
  const [reportFormData, setReportFormData] = useState({
    reportType: "",
    period: "",
    startDate: "",
    endDate: "",
    includeCharts: true,
    includeDetails: true,
    format: "PDF",
  });

  // Filter reports by type
  const filteredReports = filterType === "All" 
    ? reports 
    : reports.filter(r => r.type === filterType);

  // Pagination calculations
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterType]);

  const getStatusColor = (status) => {
    switch(status) {
      case "Ready": return "bg-green-100 text-green-700 border-green-200";
      case "Processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Failed": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case "Summary": return "bg-purple-100 text-purple-700";
      case "Detailed": return "bg-blue-100 text-blue-700";
      case "Tax": return "bg-orange-100 text-orange-700";
      case "Statutory": return "bg-cyan-100 text-cyan-700";
      case "Analysis": return "bg-pink-100 text-pink-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    console.log("Generating report:", reportFormData);

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
    setReportFormData({
      reportType: "", period: "", startDate: "", endDate: "",
      includeCharts: true, includeDetails: true, format: "PDF",
    });
    
    alert("Report generation initiated!");
  };

  const handleDownloadReport = (report) => {
    console.log("Downloading report:", report.id);
    alert(`Downloading ${report.title} as PDF...`);
  };

  const handleExportReport = (report, format) => {
    console.log(`Exporting report ${report.id} as ${format}`);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      {/* Header + Actions */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Payroll Reports</h1>
            <p className="text-sm text-gray-600">Generate, export and download payroll reports</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleExportReport({ title: "All Reports" }, "Excel")}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export All
            </button>
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Reports</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{reports.length}</p>
          <p className="text-xs text-gray-400 mt-1">All time generated</p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Ready to Download</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {reports.filter(r => r.status === "Ready").length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Available reports</p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Processing</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {reports.filter(r => r.status === "Processing").length}
          </p>
          <p className="text-xs text-gray-400 mt-1">In queue</p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Size</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">12.4 MB</p>
          <p className="text-xs text-gray-400 mt-1">Storage used</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-1.5 mb-6 inline-flex gap-1">
        {["All", "Summary", "Detailed", "Tax", "Statutory", "Analysis"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              filterType === type
                ? "bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Items per page selector */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredReports.length)} of {filteredReports.length} reports
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gradient-to-r from-[#2c4a6a]/5 to-[#1e3147]/5 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Report ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Report Title</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Period</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Type</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Size</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Status</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Generated</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((report, index) => (
                <tr 
                  key={report.id} 
                  className={`border-b border-gray-100 hover:bg-[#2c4a6a]/5 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-xs">
                        {report.id.slice(-2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{report.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-gray-900">{report.title}</p>
                    <p className="text-xs text-gray-500 mt-1">By {report.generatedBy}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900">{report.period}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <p className="text-sm text-gray-600">{report.size}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <p className="text-sm text-gray-900">{report.generatedDate}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handlePreviewReport(report)}
                        className="p-2 hover:bg-[#6b8ca3]/10 rounded-lg transition-colors group"
                        title="Preview Report"
                        disabled={report.status !== "Ready"}
                      >
                        <svg className={`w-5 h-5 ${report.status === "Ready" ? "text-[#6b8ca3] group-hover:text-[#2c4a6a]" : "text-gray-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDownloadReport(report)}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                        title="Download PDF"
                        disabled={report.status !== "Ready"}
                      >
                        <svg className={`w-5 h-5 ${report.status === "Ready" ? "text-[#6b8ca3] group-hover:text-green-600" : "text-gray-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleExportReport(report, "Excel")}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Export to Excel"
                        disabled={report.status !== "Ready"}
                      >
                        <svg className={`w-5 h-5 ${report.status === "Ready" ? "text-[#6b8ca3] group-hover:text-blue-600" : "text-gray-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Delete Report"
                      >
                        <svg className="w-5 h-5 text-[#6b8ca3] group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="py-16 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filter or generate a new report</p>
            <button
              onClick={() => setFilterType("All")}
              className="text-[#2c4a6a] hover:underline text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredReports.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredReports.length)} of {filteredReports.length} reports
              </div>
              
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generate Report Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-xl font-bold">Generate New Report</h2>
              <button onClick={() => setIsGenerateModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleGenerateReport} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Type *</label>
                  <select 
                    value={reportFormData.reportType} 
                    onChange={e => setReportFormData({...reportFormData, reportType: e.target.value})} 
                    required 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  >
                    <option value="">Select Report Type</option>
                    <option value="Monthly Payroll Summary">Monthly Payroll Summary</option>
                    <option value="Employee Salary Breakdown">Employee Salary Breakdown</option>
                    <option value="Tax Deduction Report">Tax Deduction Report</option>
                    <option value="SSNIT Contribution Report">SSNIT Contribution Report</option>
                    <option value="Overtime Analysis Report">Overtime Analysis Report</option>
                    <option value="Allowances Summary">Allowances Summary</option>
                    <option value="Department Cost Analysis">Department Cost Analysis</option>
                    <option value="Year-to-Date Summary">Year-to-Date Summary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={reportFormData.startDate}
                    onChange={e => setReportFormData({...reportFormData, startDate: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={reportFormData.endDate}
                    onChange={e => setReportFormData({...reportFormData, endDate: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format *</label>
                  <select 
                    value={reportFormData.format} 
                    onChange={e => setReportFormData({...reportFormData, format: e.target.value})} 
                    required 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Excel">Excel</option>
                    <option value="CSV">CSV</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Report Options</label>
                <div className="space-y-3">
                  {[
                    { key: 'includeCharts', label: 'Include Charts & Graphs' },
                    { key: 'includeDetails', label: 'Include Detailed Breakdown' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reportFormData[key]}
                        onChange={e => setReportFormData({...reportFormData, [key]: e.target.checked})}
                        className="w-5 h-5 text-[#2c4a6a] rounded focus:ring-[#2c4a6a]"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-800">The report will be generated based on the selected date range and options. You'll be able to download it once processing is complete.</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsGenerateModalOpen(false)} 
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all"
                >
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-xl font-bold">Report Preview - {selectedReport.id}</h2>
              <button onClick={() => setIsPreviewModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Report Title</p>
                  <p className="text-base font-semibold text-gray-900">{selectedReport.title}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Period</p>
                  <p className="text-base font-semibold text-gray-900">{selectedReport.period}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Type</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(selectedReport.type)}`}>
                    {selectedReport.type}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Generated Date</p>
                  <p className="text-base font-semibold text-gray-900">{selectedReport.generatedDate}</p>
                </div>
              </div>

              {/* Report Preview Area */}
              <div className="bg-gray-50 rounded-lg p-8 min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Preview</h3>
                  <p className="text-gray-600 mb-6">
                    {selectedReport.title}<br/>
                    Period: {selectedReport.period}
                  </p>
                  <button
                    onClick={() => handleDownloadReport(selectedReport)}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all"
                  >
                    Download Full Report
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  onClick={() => handleExportReport(selectedReport, "Excel")}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Export to Excel
                </button>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}