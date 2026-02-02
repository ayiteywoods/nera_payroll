"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  // Comprehensive search data - Add your actual data here
  const searchableContent = [
    // Dashboard
    { id: 1, title: "Dashboard", type: "page", path: "/dashboard", description: "View analytics and overview" },
    { id: 2, title: "Total Payroll", type: "metric", path: "/dashboard", description: "₵ 125,430 - Net salaries paid" },
    { id: 3, title: "Employee Statistics", type: "metric", path: "/dashboard", description: "87 employees paid this month" },
    
    // Employees
    { id: 4, title: "Employee Management", type: "page", path: "/employees", description: "Manage workforce and employee information" },
    { id: 5, title: "Add New Employee", type: "action", path: "/employees?action=add", description: "Create new employee record" },
    { id: 6, title: "John Mensah", type: "employee", path: "/employees?id=EMP001", description: "Senior Software Engineer - Engineering" },
    { id: 7, title: "Ama Asante", type: "employee", path: "/employees?id=EMP004", description: "Product Designer - Engineering" },
    { id: 8, title: "Abena Osei", type: "employee", path: "/employees?id=EMP002", description: "HR Manager - HR" },
    { id: 9, title: "Kofi Owusu", type: "employee", path: "/employees?id=EMP005", description: "Accountant - Management" },
    { id: 10, title: "Kwame Boateng", type: "employee", path: "/employees?id=EMP003", description: "Sales Executive - Sales" },
    
    // Payroll
    { id: 11, title: "Payroll Management", type: "page", path: "/payroll", description: "Process and manage employee payrolls" },
    { id: 12, title: "Process New Payroll", type: "action", path: "/payroll?action=process", description: "Run payroll for current period" },
    { id: 13, title: "March 2025 Payroll", type: "payroll", path: "/payroll?id=PAY001", description: "₵ 157,230 - 87 employees - Completed" },
    { id: 14, title: "February 2025 Payroll", type: "payroll", path: "/payroll?id=PAY002", description: "₵ 151,400 - 85 employees - Completed" },
    { id: 15, title: "Payroll Reports", type: "report", path: "/reports/payroll", description: "Generate payroll reports" },
    
    // Leave Management
    { id: 16, title: "Leave Management", type: "page", path: "/leave", description: "Manage employee leave requests" },
    { id: 17, title: "Create Leave Request", type: "action", path: "/leave?action=create", description: "Submit new leave request" },
    { id: 18, title: "Pending Leave Requests", type: "filter", path: "/leave?filter=pending", description: "View all pending leave requests" },
    { id: 19, title: "Approved Leaves", type: "filter", path: "/leave?filter=approved", description: "View approved leave requests" },
    { id: 20, title: "Annual Leave", type: "leave-type", path: "/leave?type=annual", description: "Annual leave requests" },
    { id: 21, title: "Sick Leave", type: "leave-type", path: "/leave?type=sick", description: "Sick leave requests" },
    
    // Recruitment
    { id: 22, title: "Recruitment", type: "page", path: "/recruitment", description: "Manage jobs, applications, and candidates" },
    { id: 23, title: "Create New Job", type: "action", path: "/recruitment/jobs?action=create", description: "Post a new job opening" },
    { id: 24, title: "Senior Software Engineer", type: "job", path: "/recruitment/jobs?id=JOB001", description: "Engineering - Full-Time - Open" },
    { id: 25, title: "HR Manager", type: "job", path: "/recruitment/jobs?id=JOB002", description: "HR - Full-Time - Open" },
    { id: 26, title: "Sales Executive", type: "job", path: "/recruitment/jobs?id=JOB003", description: "Sales - Contract - Closed" },
    { id: 27, title: "Applications", type: "filter", path: "/recruitment?tab=applications", description: "View all job applications" },
    { id: 28, title: "Candidates", type: "filter", path: "/recruitment?tab=candidates", description: "View talent pool" },
    
    // Benefits & Deductions
    { id: 29, title: "Benefits & Deductions", type: "page", path: "/benefits", description: "Manage employee benefits and deductions" },
    { id: 30, title: "SSNIT Contributions", type: "deduction", path: "/benefits?type=ssnit", description: "Social security contributions" },
    { id: 31, title: "Tax Deductions", type: "deduction", path: "/benefits?type=tax", description: "PAYE tax deductions" },
    { id: 32, title: "Health Insurance", type: "benefit", path: "/benefits?type=health", description: "Employee health benefits" },
    
    // Reports
    { id: 33, title: "Payroll Reports", type: "report", path: "/reports/payroll", description: "Generate and download payroll reports" },
    { id: 34, title: "Payslips", type: "report", path: "/reports/payslips", description: "Generate employee payslips" },
    { id: 35, title: "Tax & Deductions Report", type: "report", path: "/reports/tax", description: "Tax and deduction reports" },
    
    // Compliance
    { id: 36, title: "SSNIT / Tax Compliance", type: "page", path: "/compliance", description: "Manage compliance and submissions" },
    { id: 37, title: "PAYE Submissions", type: "compliance", path: "/compliance?type=paye", description: "Tax submissions and status" },
    
    // Settings
    { id: 38, title: "Settings", type: "page", path: "/settings", description: "Application settings and preferences" },
    { id: 39, title: "Profile Settings", type: "setting", path: "/settings/profile", description: "Update your profile information" },
    { id: 40, title: "Company Settings", type: "setting", path: "/settings/company", description: "Configure company details" },
  ];

  // Search function
  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);

    if (query.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Filter results based on query
    const results = searchableContent.filter(item => {
      const searchTerm = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.type.toLowerCase().includes(searchTerm)
      );
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  // Navigate to result
  const handleResultClick = (path) => {
    router.push(path);
    setSearchQuery("");
    setSearchResults([]);
    setSearchOpen(false);
  };

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get icon for result type
  const getTypeIcon = (type) => {
    switch (type) {
      case "page":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case "employee":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case "payroll":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "action":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case "report":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
    }
  };

  // Get badge color for type
  const getTypeBadge = (type) => {
    const colors = {
      page: "bg-blue-100 text-blue-700",
      employee: "bg-purple-100 text-purple-700",
      payroll: "bg-green-100 text-green-700",
      action: "bg-orange-100 text-orange-700",
      report: "bg-indigo-100 text-indigo-700",
      job: "bg-pink-100 text-pink-700",
      filter: "bg-cyan-100 text-cyan-700",
      metric: "bg-yellow-100 text-yellow-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-4 h-16">

        {/* ===== Left Section: Search ===== */}
        <div className="flex items-center gap-2 flex-1 max-w-xl" ref={searchRef}>
          {/* Mobile: search icon only */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Open search"
          >
            <HiMagnifyingGlass size={20} className="text-gray-600" />
          </button>

          {/* Full search input (desktop) */}
          <div className="hidden md:block relative flex-1">
            <div className="flex items-center gap-2 text-xs rounded-full ring-2 ring-gray-300 px-3 bg-white">
              <HiMagnifyingGlass size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search pages, employees, payrolls..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-2 bg-transparent outline-none text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchQuery && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="p-2">
                  {searchResults.slice(0, 10).map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.path)}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors flex items-start gap-3 group"
                    >
                      <div className={`w-10 h-10 rounded-lg ${getTypeBadge(result.type)} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        {getTypeIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{result.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBadge(result.type)}`}>
                            {result.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{result.description}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
                {searchResults.length > 10 && (
                  <div className="p-3 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500">
                      Showing 10 of {searchResults.length} results
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* No Results */}
            {searchQuery && searchResults.length === 0 && !isSearching && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-center z-50">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold text-gray-900 mb-1">No results found</p>
                <p className="text-xs text-gray-500">Try searching for something else</p>
              </div>
            )}
          </div>

          {/* Mobile expanded search */}
          {searchOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 z-50 bg-white shadow-lg p-4">
              <div className="flex items-center gap-2 text-xs rounded-full ring-2 ring-gray-300 px-3 bg-white">
                <HiMagnifyingGlass size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full p-2 bg-transparent outline-none text-sm"
                  autoFocus
                />
                <button
                  className="p-1"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  aria-label="Close search"
                >
                  ✕
                </button>
              </div>

              {/* Mobile Search Results */}
              {searchQuery && searchResults.length > 0 && (
                <div className="mt-4 max-h-64 overflow-y-auto">
                  {searchResults.slice(0, 5).map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.path)}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors flex items-start gap-3 mb-2"
                    >
                      <div className={`w-8 h-8 rounded-lg ${getTypeBadge(result.type)} flex items-center justify-center flex-shrink-0`}>
                        {getTypeIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{result.title}</p>
                        <p className="text-xs text-gray-600 truncate">{result.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== Right Section: Icons & Profile ===== */}
        <div className="flex items-center gap-4 md:gap-6 ml-4">
          {/* Email */}
          <button className="bg-[#c3d2e9] w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#b0c4e2] transition">
            <Image src="/email.png" alt="Email" width={20} height={20} />
          </button>

          {/* Messages */}
          <div className="relative">
            <button className="bg-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
              <Image src="/messages.png" alt="Messages" width={20} height={20} />
            </button>
            <div className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-[#153361] text-white rounded-full text-[10px] font-semibold">
              +4
            </div>
          </div>

          {/* User Info */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-medium leading-3">John Doe</span>
            <span className="text-[10px] text-gray-500 font-bold">HR</span>
          </div>

          {/* Profile Image */}
          <Image
            src="/profile.png"
            alt="Profile"
            width={36}
            height={36}
            className="rounded-full cursor-pointer hover:ring-2 hover:ring-[#2c4a6a] transition"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;