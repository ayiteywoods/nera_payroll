"use client";

import React, { useState } from "react";

// Generate 1000 employee payslips
const generatePayslips = () => {
  const names = [
    "John Mensah", "Abena Osei", "Kwame Boateng", "Ama Asante", "Kofi Owusu",
    "Yaw Agyeman", "Akosua Frimpong", "Kwesi Darko", "Adjoa Amponsah", "Fiifi Atta",
    "Esi Badu", "Kojo Ansah", "Adwoa Sarpong", "Kwabena Manu", "Afua Opoku",
    "Yaa Kyei", "Kwaku Mensah", "Abena Adomako", "Kofi Asare", "Ama Boateng",
    "Kwame Ofori", "Akua Bonsu", "Yaw Frimpong", "Adjoa Owusu", "Kwesi Agyei",
    "Esi Appiah", "Kojo Baah", "Adwoa Konadu", "Kwabena Osei", "Afua Agyeman"
  ];
  
  const departments = ["Engineering", "HR", "Sales", "Finance", "Marketing", "Operations", "Support", "Management"];
  const positions = ["Senior Manager", "Manager", "Team Lead", "Senior Developer", "Developer", "Analyst", "Coordinator", "Assistant"];
  
  const payslips = [];
  
  for (let i = 1; i <= 1000; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const basicSalary = Math.floor(Math.random() * 5000) + 2000;
    const allowances = Math.floor(Math.random() * 1500) + 500;
    const grossPay = basicSalary + allowances;
    const deductions = Math.floor(grossPay * 0.15);
    const netPay = grossPay - deductions;
    const isPaid = Math.random() > 0.15; // 85% paid
    
    payslips.push({
      id: i,
      employeeId: `EMP${String(i).padStart(4, '0')}`,
      name: name,
      department: department,
      position: position,
      basicSalary: basicSalary,
      allowances: allowances,
      grossPay: grossPay,
      deductions: deductions,
      netPay: netPay,
      isPaid: isPaid,
      paymentDate: isPaid ? `2026-02-${String(Math.floor(Math.random() * 5) + 1).padStart(2, '0')}` : null,
      period: "February 2026",
      taxAmount: Math.floor(grossPay * 0.10),
      ssnitAmount: Math.floor(grossPay * 0.055),
      // Salary History (last 6 months)
      salaryHistory: Array.from({ length: 6 }, (_, index) => {
        const monthIndex = 1 - index; // Feb, Jan, Dec, Nov, Oct, Sep
        const month = monthIndex <= 0 ? (12 + monthIndex) : monthIndex;
        const year = monthIndex <= 0 ? 2025 : 2026;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const historicGross = Math.floor(grossPay * (0.95 + Math.random() * 0.1));
        const historicDeductions = Math.floor(historicGross * 0.15);
        
        return {
          month: `${monthNames[month - 1]} ${year}`,
          grossPay: historicGross,
          deductions: historicDeductions,
          netPay: historicGross - historicDeductions,
          isPaid: true,
        };
      }),
    });
  }
  
  return payslips;
};

export default function PayslipReportPage() {
  const [payslips, setPayslips] = useState(generatePayslips());
  const [filteredPayslips, setFilteredPayslips] = useState(payslips);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const departments = ["All", "Engineering", "HR", "Sales", "Finance", "Marketing", "Operations", "Support", "Management"];

  // Filter logic
  React.useEffect(() => {
    let result = [...payslips];

    // Search filter
    if (searchTerm) {
      result = result.filter(payslip => 
        payslip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payslip.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
    if (filterDepartment !== "All") {
      result = result.filter(payslip => payslip.department === filterDepartment);
    }

    // Payment status filter
    if (filterPaymentStatus !== "All") {
      result = result.filter(payslip => 
        filterPaymentStatus === "Paid" ? payslip.isPaid : !payslip.isPaid
      );
    }

    setFilteredPayslips(result);
    setCurrentPage(1);
  }, [searchTerm, filterDepartment, filterPaymentStatus, payslips]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayslips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayslips = filteredPayslips.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const pageInput = parseInt(e.target.elements.pageNumber.value);
    if (pageInput >= 1 && pageInput <= totalPages) {
      handlePageChange(pageInput);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleViewDetails = (payslip) => {
    setSelectedPayslip(payslip);
    setIsDetailModalOpen(true);
  };

  const handleExportToExcel = () => {
    console.log("Exporting to Excel...");
    alert(`Exporting ${filteredPayslips.length} payslips to Excel...`);
  };

  const handleGenerateReport = () => {
    console.log("Generating report...");
    alert("Generating comprehensive payslip report...");
  };

  const handleMarkAsPaid = (payslipId) => {
    setPayslips(payslips.map(p => 
      p.id === payslipId 
        ? { ...p, isPaid: true, paymentDate: new Date().toISOString().split('T')[0] }
        : p
    ));
    alert("Employee marked as paid!");
  };

  const totalGrossPay = filteredPayslips.reduce((sum, p) => sum + p.grossPay, 0);
  const totalNetPay = filteredPayslips.reduce((sum, p) => sum + p.netPay, 0);
  const totalDeductions = filteredPayslips.reduce((sum, p) => sum + p.deductions, 0);
  const paidCount = filteredPayslips.filter(p => p.isPaid).length;
  const unpaidCount = filteredPayslips.filter(p => !p.isPaid).length;

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Payslip Reports</h1>
            <p className="text-sm text-gray-600">View, manage and export employee payslips</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportToExcel}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export to Excel
            </button>
            <button
              onClick={handleGenerateReport}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Employees</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{filteredPayslips.length}</p>
          <p className="text-xs text-gray-400 mt-1">In current view</p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Paid Employees</h3>
          <p className="text-2xl md:text-3xl font-bold text-green-600">{paidCount}</p>
          <p className="text-xs text-gray-400 mt-1">{((paidCount / filteredPayslips.length) * 100).toFixed(1)}% completed</p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Unpaid Employees</h3>
          <p className="text-2xl md:text-3xl font-bold text-red-600">{unpaidCount}</p>
          <p className="text-xs text-gray-400 mt-1">Pending payment</p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Gross Pay</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">₵{(totalGrossPay / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-400 mt-1">Before deductions</p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Net Pay</h3>
          <p className="text-2xl md:text-3xl font-bold text-[#2c4a6a]">₵{(totalNetPay / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-400 mt-1">After deductions</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full lg:max-w-xs">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
            />
          </div>

          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept === "All" ? "All Departments" : dept}</option>
            ))}
          </select>

          {/* Payment Status Filter */}
          <div className="flex gap-2">
            {["All", "Paid", "Unpaid"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterPaymentStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterPaymentStatus === status
                    ? "bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payslip Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        {currentPayslips.map((payslip) => (
          <div
            key={payslip.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-semibold text-lg">
                  {payslip.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{payslip.name}</h3>
                  <p className="text-xs text-gray-500">{payslip.employeeId} • {payslip.department}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                payslip.isPaid 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {payslip.isPaid ? 'Paid' : 'Unpaid'}
              </span>
            </div>

            {/* Payslip Details */}
            <div className="space-y-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Position</p>
                <p className="text-sm font-medium text-gray-900">{payslip.position}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Basic Salary</p>
                  <p className="text-sm font-semibold text-gray-900">₵{payslip.basicSalary.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Allowances</p>
                  <p className="text-sm font-semibold text-gray-900">₵{payslip.allowances.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Gross Pay</p>
                <p className="text-base font-bold text-[#2c4a6a]">₵{payslip.grossPay.toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Deductions</p>
                  <p className="text-sm font-semibold text-red-600">₵{payslip.deductions.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Net Pay</p>
                  <p className="text-sm font-bold text-green-600">₵{payslip.netPay.toLocaleString()}</p>
                </div>
              </div>

              {payslip.isPaid && payslip.paymentDate && (
                <div className="text-xs text-gray-500 text-center">
                  Paid on {new Date(payslip.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => handleViewDetails(payslip)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all mr-2"
              >
                View Details
              </button>
              
              {!payslip.isPaid && (
                <button
                  onClick={() => handleMarkAsPaid(payslip.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Mark Paid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPayslips.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No payslips found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterDepartment("All");
              setFilterPaymentStatus("All");
            }}
            className="text-[#2c4a6a] hover:underline text-sm font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredPayslips.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#2c4a6a] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Go to:</span>
              <input
                type="number"
                name="pageNumber"
                min="1"
                max={totalPages}
                defaultValue={currentPage}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
              />
            </form>
          </div>
        </div>
      )}

      {/* Payslip Detail Modal with Salary History */}
      {isDetailModalOpen && selectedPayslip && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="text-xl font-bold">Payslip Details</h2>
                <p className="text-sm opacity-90">{selectedPayslip.employeeId} - {selectedPayslip.period}</p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Employee Info */}
              <div className="bg-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/10">
                <h3 className="text-sm font-semibold text-[#2c4a6a] mb-3">Employee Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{selectedPayslip.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Employee ID</p>
                    <p className="font-medium text-gray-900">{selectedPayslip.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Department</p>
                    <p className="font-medium text-gray-900">{selectedPayslip.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Position</p>
                    <p className="font-medium text-gray-900">{selectedPayslip.position}</p>
                  </div>
                </div>
              </div>

              {/* Salary Breakdown */}
              <div className="bg-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/10">
                <h3 className="text-sm font-semibold text-[#2c4a6a] mb-3">Salary Breakdown - {selectedPayslip.period}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Basic Salary</span>
                    <span className="text-sm font-semibold text-gray-900">₵{selectedPayslip.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Allowances</span>
                    <span className="text-sm font-semibold text-gray-900">₵{selectedPayslip.allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 bg-blue-50 px-3 rounded">
                    <span className="text-sm font-medium text-gray-900">Gross Pay</span>
                    <span className="text-base font-bold text-[#2c4a6a]">₵{selectedPayslip.grossPay.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 text-red-600">
                    <span className="text-sm">Tax Deduction (10%)</span>
                    <span className="text-sm font-semibold">- ₵{selectedPayslip.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 text-red-600">
                    <span className="text-sm">SSNIT Contribution (5.5%)</span>
                    <span className="text-sm font-semibold">- ₵{selectedPayslip.ssnitAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 text-red-600">
                    <span className="text-sm">Other Deductions</span>
                    <span className="text-sm font-semibold">- ₵{(selectedPayslip.deductions - selectedPayslip.taxAmount - selectedPayslip.ssnitAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 bg-green-50 px-3 rounded">
                    <span className="text-base font-bold text-gray-900">Net Pay</span>
                    <span className="text-xl font-bold text-green-600">₵{selectedPayslip.netPay.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/10">
                <h3 className="text-sm font-semibold text-[#2c4a6a] mb-3">Payment Status</h3>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedPayslip.isPaid 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedPayslip.isPaid ? '✓ Paid' : '✗ Unpaid'}
                  </span>
                  {selectedPayslip.isPaid && selectedPayslip.paymentDate && (
                    <span className="text-sm text-gray-600">
                      Paid on {new Date(selectedPayslip.paymentDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Salary History */}
              <div className="bg-[#2c4a6a]/5 rounded-xl p-5 border border-[#2c4a6a]/10">
                <h3 className="text-sm font-semibold text-[#2c4a6a] mb-4">Salary History (Last 6 Months)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Period</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Gross Pay</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Deductions</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Net Pay</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedPayslip.salaryHistory.map((history, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{history.month}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">₵{history.grossPay.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-right text-red-600">₵{history.deductions.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">₵{history.netPay.toLocaleString()}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                              {history.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Avg. Gross Pay</p>
                    <p className="text-sm font-bold text-gray-900">
                      ₵{Math.round(selectedPayslip.salaryHistory.reduce((sum, h) => sum + h.grossPay, 0) / selectedPayslip.salaryHistory.length).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Avg. Deductions</p>
                    <p className="text-sm font-bold text-red-600">
                      ₵{Math.round(selectedPayslip.salaryHistory.reduce((sum, h) => sum + h.deductions, 0) / selectedPayslip.salaryHistory.length).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Avg. Net Pay</p>
                    <p className="text-sm font-bold text-green-600">
                      ₵{Math.round(selectedPayslip.salaryHistory.reduce((sum, h) => sum + h.netPay, 0) / selectedPayslip.salaryHistory.length).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end p-6 border-t">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  console.log("Downloading payslip PDF...");
                  alert(`Downloading payslip for ${selectedPayslip.name}...`);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}