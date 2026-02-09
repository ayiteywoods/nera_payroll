"use client";

import Link from "next/link";
import React, { useState } from "react";

// Generate 1000 sample employees
const generateEmployees = () => {
  const firstNames = ["John", "Abena", "Kwame", "Ama", "Kofi", "Akosua", "Yaw", "Adjoa", "Kwabena", "Adwoa", 
    "Fiifi", "Esi", "Kojo", "Efua", "Kwesi", "Akua", "Yaa", "Kow", "Araba", "Kwaku"];
  const lastNames = ["Mensah", "Osei", "Boateng", "Asante", "Owusu", "Appiah", "Agyei", "Adjei", "Opoku", "Gyasi",
    "Sarpong", "Ofori", "Acheampong", "Boakye", "Wiredu", "Baah", "Antwi", "Frimpong", "Danso", "Asiedu"];
  const jobTitles = ["Software Engineer", "Senior Developer", "Product Designer", "Data Analyst", "HR Manager", 
    "Sales Executive", "Marketing Specialist", "Accountant", "Finance Manager", "IT Support", "Project Manager",
    "Business Analyst", "Operations Manager", "Customer Success Manager", "QA Engineer"];
  const departments = ["Engineering", "Management", "Sales", "HR", "Support", "Finance", "Marketing", "Operations"];
  const employmentTypes = ["Full-Time", "Part-Time", "Contract"];
  const statuses = ["Active", "On Leave", "Suspended"];

  const employees = [];
  for (let i = 1; i <= 1000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    
    employees.push({
      id: `EMP${String(i).padStart(4, '0')}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
      phone: `+233 ${20 + Math.floor(Math.random() * 8)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`,
      jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      department,
      employmentType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)],
      employmentStatus: statuses[Math.floor(Math.random() * statuses.length)],
      basicSalary: Math.floor(Math.random() * 10000) + 3000,
      hireDate: `20${18 + Math.floor(Math.random() * 7)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    });
  }
  return employees;
};

export default function EmployeePage() {
  const [employees] = useState(generateEmployees());
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Form state for new employee
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", otherNames: "", email: "", phone: "",
    dateOfBirth: "", gender: "", residentialAddress: "", employeeId: "",
    jobTitle: "", department: "", employmentType: "", hireDate: "",
    employmentStatus: "Active", basicSalary: "", salaryType: "Monthly",
    allowances: "", taxId: "", ssnit: "", bankName: "", accountName: "",
    accountNumber: "", paymentMethod: "", contactName: "", contactPhone: "",
    relationship: "", contactCategory: "", cvFile: null, idFile: null,
  });

  const departments = ["All", "Engineering", "Management", "Sales", "HR", "Support", "Finance", "Marketing", "Operations"];
  const statuses = ["All", "Active", "On Leave", "Suspended"];

  // Filter and sort logic
  React.useEffect(() => {
    let result = [...employees];

    if (searchTerm) {
      result = result.filter(emp => 
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== "All") {
      result = result.filter(emp => emp.department === selectedDepartment);
    }

    if (selectedStatus !== "All") {
      result = result.filter(emp => emp.employmentStatus === selectedStatus);
    }

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
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedDepartment, selectedStatus, sortBy, employees]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

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
    // Handle form submission
    setIsModalOpen(false);
    alert("Employee added successfully!");
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-2">Employee Management</h1>
        <p className="text-sm text-gray-600">Manage your workforce and employee information</p>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
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

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept === "All" ? "All Departments" : dept}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status === "All" ? "All Status" : status}</option>
              ))}
            </select>

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

          <Link href="/employees/create">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Employee
          </button>
          </Link>
          
        </div>

        {/* Stats Row */}
       {/* Stats Row - Styled like your example */}


      </div>
{/* Employee Stats Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

  {/* Total Employees */}
  <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 shadow-sm hover:shadow-md transition">
    <h3 className="text-sm font-medium text-black mb-2">Total Employees</h3>
    <p className="text-3xl font-bold text-black">{employees.length}</p>
    <p className="text-xs text-black mt-1">All employees in system</p>
  </div>

  {/* Active Employees */}
  <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 shadow-sm hover:shadow-md transition">
    <h3 className="text-sm font-medium text-black mb-2">Active</h3>
    <p className="text-3xl font-bold text-black">
      {employees.filter(e => e.employmentStatus === "Active").length}
    </p>
    <p className="text-xs text-black mt-1">Currently active employees</p>
  </div>

  {/* On Leave */}
  <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 shadow-sm hover:shadow-md transition">
    <h3 className="text-sm font-medium text-black mb-2">On Leave</h3>
    <p className="text-3xl font-bold text-black">
      {employees.filter(e => e.employmentStatus === "On Leave").length}
    </p>
    <p className="text-xs text-black mt-1">Employees currently on leave</p>
  </div>

  {/* Filtered Results */}
  <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 shadow-sm hover:shadow-md transition">
    <h3 className="text-sm font-medium text-black mb-2">Filtered Results</h3>
    <p className="text-3xl font-bold text-black">{filteredEmployees.length}</p>
    <p className="text-xs text-black mt-1">Results from current filters</p>
  </div>

</div>

      {/* Pagination Info and Controls (Top) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-gray-900">{Math.min(endIndex, filteredEmployees.length)}</span> of{' '}
            <span className="font-semibold text-gray-900">{filteredEmployees.length}</span> employees
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Show:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mb-6">
        {currentEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 cursor-pointer border border-gray-100"
          >
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

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700 font-medium truncate">{employee.jobTitle}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-gray-600">{employee.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 text-xs truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600 text-xs">{employee.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Basic Salary</p>
                <p className="text-lg font-bold text-[#2c4a6a]">₵ {employee.basicSalary.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls (Bottom) */}
      {filteredEmployees.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentPage === page
                        ? 'bg-linear-to-r from-[#2c4a6a] to-[#1e3147] text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            {/* Mobile: Current page only */}
            <div className="sm:hidden px-3 py-2 bg-linear-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium">
              {currentPage}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Jump to page (Desktop only) */}
          <div className="hidden lg:flex items-center gap-2">
            <label className="text-sm text-gray-600">Go to:</label>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  handlePageChange(page);
                }
              }}
              className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
            />
          </div>
        </div>
      )}

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
    </div>
  );
}