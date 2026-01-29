"use client";

import React, { useState } from "react";

// Sample employee data - replace with your API data
const initialEmployees = [
  {
    id: "EMP001",
    firstName: "John",
    lastName: "Mensah",
    email: "john.mensah@company.com",
    phone: "+233 24 123 4567",
    jobTitle: "Senior Software Engineer",
    department: "Engineering",
    employmentType: "Full-Time",
    employmentStatus: "Active",
    basicSalary: 8000,
    hireDate: "2023-01-15",
  },
  {
    id: "EMP002",
    firstName: "Abena",
    lastName: "Osei",
    email: "abena.osei@company.com",
    phone: "+233 24 234 5678",
    jobTitle: "HR Manager",
    department: "HR",
    employmentType: "Full-Time",
    employmentStatus: "Active",
    basicSalary: 6500,
    hireDate: "2022-06-20",
  },
  {
    id: "EMP003",
    firstName: "Kwame",
    lastName: "Boateng",
    email: "kwame.boateng@company.com",
    phone: "+233 24 345 6789",
    jobTitle: "Sales Executive",
    department: "Sales",
    employmentType: "Full-Time",
    employmentStatus: "Active",
    basicSalary: 4500,
    hireDate: "2023-03-10",
  },
  {
    id: "EMP004",
    firstName: "Ama",
    lastName: "Asante",
    email: "ama.asante@company.com",
    phone: "+233 24 456 7890",
    jobTitle: "Product Designer",
    department: "Engineering",
    employmentType: "Contract",
    employmentStatus: "Active",
    basicSalary: 5500,
    hireDate: "2023-08-01",
  },
  {
    id: "EMP005",
    firstName: "Kofi",
    lastName: "Owusu",
    email: "kofi.owusu@company.com",
    phone: "+233 24 567 8901",
    jobTitle: "Accountant",
    department: "Management",
    employmentType: "Full-Time",
    employmentStatus: "On Leave",
    basicSalary: 5000,
    hireDate: "2021-11-05",
  },
];

export default function EmployeePage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  // Form state for new employee
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    otherNames: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    residentialAddress: "",
    
    // Employment Details
    employeeId: "",
    jobTitle: "",
    department: "",
    employmentType: "",
    hireDate: "",
    employmentStatus: "Active",
    
    // Payroll Information
    basicSalary: "",
    salaryType: "Monthly",
    allowances: "",
    taxId: "",
    ssnit: "",
    
    // Bank & Payment
    bankName: "",
    accountName: "",
    accountNumber: "",
    paymentMethod: "",
    
    // Emergency Contact
    contactName: "",
    contactPhone: "",
    relationship: "",
    contactCategory: "",
    
    // Documents
    cvFile: null,
    idFile: null,
  });

  const departments = ["All", "Engineering", "Management", "Sales", "HR", "Support"];
  const statuses = ["All", "Active", "On Leave", "Suspended"];

  // Filter and sort logic
  React.useEffect(() => {
    let result = [...employees];

    // Search filter
    if (searchTerm) {
      result = result.filter(emp => 
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
    if (selectedDepartment !== "All") {
      result = result.filter(emp => emp.department === selectedDepartment);
    }

    // Status filter
    if (selectedStatus !== "All") {
      result = result.filter(emp => emp.employmentStatus === selectedStatus);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.firstName.localeCompare(b.firstName);
      } else if (sortBy === "date") {
        return new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime();
      } else if (sortBy === "salary") {
        return b.basicSalary - a.basicSalary;
      }
      return 0;
    });

    setFilteredEmployees(result);
  }, [searchTerm, selectedDepartment, selectedStatus, sortBy, employees]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newEmployee = {
      id: formData.employeeId || `EMP${String(employees.length + 1).padStart(3, '0')}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      jobTitle: formData.jobTitle,
      department: formData.department,
      employmentType: formData.employmentType,
      employmentStatus: formData.employmentStatus,
      basicSalary: parseFloat(formData.basicSalary),
      hireDate: formData.hireDate,
    };

    setEmployees([...employees, newEmployee]);
    setIsModalOpen(false);
    
    // Reset form
    setFormData({
      firstName: "", lastName: "", otherNames: "", email: "", phone: "",
      dateOfBirth: "", gender: "", residentialAddress: "", employeeId: "",
      jobTitle: "", department: "", employmentType: "", hireDate: "",
      employmentStatus: "Active", basicSalary: "", salaryType: "Monthly",
      allowances: "", taxId: "", ssnit: "", bankName: "", accountName: "",
      accountNumber: "", paymentMethod: "", contactName: "", contactPhone: "",
      relationship: "", contactCategory: "", cvFile: null, idFile: null,
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Active": return "bg-green-100 text-green-700 border-green-200";
      case "On Leave": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Suspended": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Employee Management</h1>
        <p className="text-sm text-gray-600">Manage your workforce and employee information</p>
      </div>

      {/* Stats Cards - Using Your UI Colors */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">All Time</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Employees</h3>
          <p className="text-3xl font-bold mb-1">₵ {employees.length}</p>
          <p className="text-xs opacity-75">Complete workforce</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            Across all departments
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#6b8ca3] to-[#4a6b82] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Current Status</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Active Staff</h3>
          <p className="text-3xl font-bold mb-1">{employees.filter(e => e.employmentStatus === "Active").length}</p>
          <p className="text-xs opacity-75">Currently working</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            All departments
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#8ba3b8] to-[#6b8ca3] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Status Update</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">On Leave</h3>
          <p className="text-3xl font-bold mb-1">{employees.filter(e => e.employmentStatus === "On Leave").length}</p>
          <p className="text-xs opacity-75">Temporary absence</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            Currently unavailable
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#a4b9cc] to-[#8ba3b8] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Filtered View</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Showing Results</h3>
          <p className="text-3xl font-bold mb-1">{filteredEmployees.length}</p>
          <p className="text-xs opacity-75">Based on filters</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            Current search criteria
          </div>
        </div>
      </div> */}

      {/* Controls Section - Search, Filter, Sort, Create */}
      <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          
          {/* Left side - Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 lg:max-w-xs">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept} Department</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Hire Date</option>
              <option value="salary">Sort by Salary</option>
            </select>
          </div>

          {/* Right side - Create Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Employee
          </button>
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 cursor-pointer border border-gray-100"
          >
            {/* Header with Avatar and Status */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-semibold text-lg">
                  {employee.firstName[0]}{employee.lastName[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-xs text-gray-500">{employee.id}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.employmentStatus)}`}>
                {employee.employmentStatus}
              </span>
            </div>

            {/* Job Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700 font-medium">{employee.jobTitle}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-gray-600">{employee.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 text-xs">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600 text-xs">{employee.phone}</span>
              </div>
            </div>

            {/* Footer with Salary and Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Basic Salary</p>
                <p className="text-lg font-bold text-[#2c4a6a]">₵ {employee.basicSalary.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-[#6b8ca3]/10 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-[#6b8ca3]/10 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedDepartment("All");
              setSelectedStatus("All");
            }}
            className="text-[#2c4a6a] hover:underline text-sm font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Modal for Adding Employee */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold">Add New Employee</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6">
              
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#2c4a6a] mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Other Names</label>
                    <input
                      type="text"
                      name="otherNames"
                      value={formData.otherNames}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address *</label>
                    <input
                      type="text"
                      name="residentialAddress"
                      value={formData.residentialAddress}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#2c4a6a] mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Employment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      placeholder="Auto-generated if empty"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Management">Management</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">HR</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date *</label>
                    <input
                      type="date"
                      name="hireDate"
                      value={formData.hireDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status *</label>
                    <select
                      name="employmentStatus"
                      value={formData.employmentStatus}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payroll Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#2c4a6a] mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Payroll Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary *</label>
                    <input
                      type="number"
                      name="basicSalary"
                      value={formData.basicSalary}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Type *</label>
                    <select
                      name="salaryType"
                      value={formData.salaryType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Hourly">Hourly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allowances</label>
                    <input
                      type="number"
                      name="allowances"
                      value={formData.allowances}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID / TIN *</label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SSNIT Number *</label>
                    <input
                      type="text"
                      name="ssnit"
                      value={formData.ssnit}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Bank & Payment */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#2c4a6a] mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Bank & Payment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name *</label>
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Mobile Money">Mobile Money</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#2c4a6a] mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                    <input
                      type="text"
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Category *</label>
                    <select
                      name="contactCategory"
                      value={formData.contactCategory}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Next of Kin">Next of Kin</option>
                      <option value="Dependent">Dependent</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#2c4a6a] mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV</label>
                    <input
                      type="file"
                      name="cvFile"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload ID</label>
                    <input
                      type="file"
                      name="idFile"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer with Actions */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 -mx-6 -mb-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}