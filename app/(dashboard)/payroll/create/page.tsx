"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Ghanaian names list
const ghanaianNames = [
  // Male names
  "Kwame Boateng", "Kofi Mensah", "Yaw Asante", "Amos Osei", "Benjamin Frimpong",
  "Samuel Appiah", "David Asare", "Nana Owusu", "Emmanuel Gyebi", "Evans Amoah",
  "Victor Acquah", "Frederick Boakye", "Godwin Amponsah", "Henry Otoo", "Isaac Ampadu",
  "Joseph Mensah", "Kenneth Asibey", "Leonard Adjei", "Marlon Agyeman", "Nathan Boakye",
  "Obed Asante", "Patrick Mensah", "Quame Boateng", "Richard Okyere", "Stephen Appiah",
  "Thierry Mensah", "Uche Boateng", "Vincent Owusu", "Winston Gyebi", "Xavier Asibey",
  "Yussif Mensah", "Zackary Osei", "Ahmed Amin", "Baba Issaka", "Chidi Mensah",
  "Daniel Boakye", "Elijah Owusu", "Faisal Mensah", "Ghazi Asante", "Hakim Boateng",
  "Ibrahim Appiah", "Jaleel Gyebi", "Karim Osei", "Leroy Mensah", "Malik Asibey",
  
  // Female names
  "Ama Serwaa", "Abena Osei", "Akosua Mensah", "Abenaa Boateng", "Ama Adjei",
  "Abra Owusu", "Adepa Mensah", "Adwoa Asante", "Afua Boakye", "Ama Boateng",
  "Ampomah Mensah", "Ana Osei", "Ane Asibey", "Anima Owusu", "Anna Mensah",
  "Annin Boateng", "Ansa Asante", "Antoinette Osei", "Anufa Mensah", "Anzu Asibey",
  "Araba Boakye", "Araba Owusu", "Arcadia Mensah", "Ardith Asante", "Aretha Boateng",
  "Ariana Osei", "Aricia Mensah", "Ariel Asibey", "Arisaida Owusu", "Arissa Boakye",
  "Arla Mensah", "Arlee Asante", "Arlene Boateng", "Arlette Osei", "Arlinda Asibey",
  "Arline Mensah", "Arlis Owusu", "Arlissa Boakye", "Armel Asante", "Armida Mensah",
  "Armidey Boateng", "Armin Osei", "Armina Asibey", "Arminde Owusu", "Arminda Mensah",
  "Armistead Asante", "Armon Boakye", "Armona Mensah", "Armonda Boateng", "Armonia Osei",
  "Grace Mensah", "Gifty Boakye", "Gloria Asante", "Glover Owusu", "Gwynne Mensah",
  "Hadiya Boateng", "Hakima Osei", "Halesha Asibey", "Halima Mensah", "Halina Asante",
  "Hamida Owusu", "Hannah Boakye", "Happiness Mensah", "Harley Boateng", "Harmonia Osei",
  "Haruka Asante", "Harvest Owusu", "Hasana Mensah", "Hasina Asante", "Hasini Boakye",
  "Haste Mensah", "Haven Boateng", "Heavenly Osei", "Heba Asibey", "Hedda Owusu",
  "Heidi Mensah", "Helen Asante", "Helene Boakye", "Heleo Mensah", "Helia Boateng",
  "Hellen Osei", "Heloise Asibey", "Helsa Owusu", "Helvie Mensah", "Helyn Asante",
];

// Generate 1000 realistic sample employees with Ghanaian names
const generateEmployees = () => {
  const departments = [
    { name: "Engineering", count: 250 },
    { name: "Sales", count: 200 },
    { name: "Finance", count: 150 },
    { name: "HR", count: 100 },
    { name: "Marketing", count: 120 },
    { name: "Operations", count: 100 },
    { name: "IT Support", count: 80 },
    { name: "Customer Service", count: 150 },
    { name: "Legal", count: 30 },
    { name: "Admin", count: 50 },
  ];

  const positions = ["Manager", "Officer", "Specialist", "Executive", "Coordinator", "Lead", "Developer", "Analyst", "Supervisor", "Associate"];
  const employees = [];
  let empId = 1;

  // Shuffle the Ghanaian names array to distribute randomly
  const shuffledNames = [...ghanaianNames].sort(() => Math.random() - 0.5);
  let nameIndex = 0;

  departments.forEach(dept => {
    for (let i = 0; i < dept.count; i++) {
      const baseSalary = Math.floor(Math.random() * 3000) + 3000;
      const name = shuffledNames[nameIndex % shuffledNames.length];
      
      employees.push({
        id: `EMP-GH-${String(empId).padStart(6, '0')}`,
        name: name,
        department: dept.name,
        position: positions[Math.floor(Math.random() * positions.length)],
        salary: baseSalary + Math.random() * 2000,
        status: Math.random() > 0.1 ? "Active" : "On Leave",
      });
      
      empId++;
      nameIndex++;
    }
  });

  return employees;
};

const sampleEmployees = generateEmployees();

export default function CreatePayrollPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Employee selection state - Start with all employees selected
  const [selectedEmployees, setSelectedEmployees] = useState(new Set(sampleEmployees.map(e => e.id)));
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("All");
  const [employeeListPage, setEmployeeListPage] = useState(1);
  const employeesPerPage = 50;

  // Process Payroll Form State
  const [processFormData, setProcessFormData] = useState({
    month: "",
    year: "",
    startDate: "",
    endDate: "",
    includeBonuses: true,
    includeAllowances: true,
    deductTaxes: true,
    deductSSNIT: true,
  });

  // Get unique departments
  const departments = useMemo(() => {
    const depts = [...new Set(sampleEmployees.map(e => e.department))].sort();
    return depts;
  }, []);

  // Filter employees based on search and department
  const filteredEmployees = useMemo(() => {
    return sampleEmployees.filter(emp => {
      const matchSearch = emp.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
                         emp.id.toLowerCase().includes(employeeSearchQuery.toLowerCase());
      const matchDept = selectedDepartmentFilter === "All" || emp.department === selectedDepartmentFilter;
      return matchSearch && matchDept;
    });
  }, [employeeSearchQuery, selectedDepartmentFilter]);

  // Paginate filtered employees
  const paginatedEmployees = useMemo(() => {
    const startIdx = (employeeListPage - 1) * employeesPerPage;
    return filteredEmployees.slice(startIdx, startIdx + employeesPerPage);
  }, [filteredEmployees, employeeListPage]);

  const totalEmployeePages = Math.ceil(filteredEmployees.length / employeesPerPage);

  // Get department-wise breakdown
  const departmentStats = useMemo(() => {
    const stats = {};
    departments.forEach(dept => {
      const deptEmps = sampleEmployees.filter(e => e.department === dept);
      const selectedDeptEmps = deptEmps.filter(e => selectedEmployees.has(e.id));
      stats[dept] = {
        total: deptEmps.length,
        selected: selectedDeptEmps.length,
        salary: selectedDeptEmps.reduce((sum, e) => sum + e.salary, 0),
      };
    });
    return stats;
  }, [selectedEmployees]);

  // Get employees being removed
  const removedEmployees = useMemo(() => {
    return sampleEmployees.filter(emp => !selectedEmployees.has(emp.id));
  }, [selectedEmployees]);

  // Toggle employee selection
  const toggleEmployeeSelection = (employeeId) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId);
    } else {
      newSelected.add(employeeId);
    }
    setSelectedEmployees(newSelected);
  };

  // Select all employees in current filter
  const selectAllInFilter = () => {
    const newSelected = new Set(selectedEmployees);
    filteredEmployees.forEach(emp => newSelected.add(emp.id));
    setSelectedEmployees(newSelected);
  };

  // Deselect all employees in current filter
  const deselectAllInFilter = () => {
    const newSelected = new Set(selectedEmployees);
    filteredEmployees.forEach(emp => newSelected.delete(emp.id));
    setSelectedEmployees(newSelected);
  };

  // Select all employees in a department
  const selectDepartment = (dept) => {
    const newSelected = new Set(selectedEmployees);
    sampleEmployees.filter(e => e.department === dept).forEach(emp => newSelected.add(emp.id));
    setSelectedEmployees(newSelected);
  };

  // Deselect all employees in a department
  const deselectDepartment = (dept) => {
    const newSelected = new Set(selectedEmployees);
    sampleEmployees.filter(e => e.department === dept).forEach(emp => newSelected.delete(emp.id));
    setSelectedEmployees(newSelected);
  };

  // Select all employees
  const selectAllEmployees = () => {
    setSelectedEmployees(new Set(sampleEmployees.map(e => e.id)));
  };

  // Deselect all employees
  const deselectAllEmployees = () => {
    setSelectedEmployees(new Set());
  };

  // Calculate total salary for selected employees
  const totalSelectedSalary = useMemo(() => {
    return sampleEmployees
      .filter(emp => selectedEmployees.has(emp.id))
      .reduce((sum, emp) => sum + emp.salary, 0);
  }, [selectedEmployees]);

  const handleProcessPayroll = async (e) => {
    e.preventDefault();
    
    if (selectedEmployees.size === 0) {
      alert("Please select at least one employee to process payroll!");
      return;
    }

    if (!processFormData.month || !processFormData.year || !processFormData.startDate || !processFormData.endDate) {
      alert("Please fill in all required fields!");
      return;
    }

    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      // Create the new payroll object
      const newPayroll = {
        id: `PAY${String(Math.floor(Math.random() * 900) + 100)}`,
        month: `${processFormData.month} ${processFormData.year}`,
        period: `${processFormData.startDate} – ${processFormData.endDate}`,
        totalEmployees: selectedEmployees.size,
        totalGrossPay: Math.round(totalSelectedSalary),
        totalDeductions: Math.round(totalSelectedSalary * 0.11),
        totalNetPay: Math.round(totalSelectedSalary * 0.89),
        status: "Processing",
        processedDate: new Date().toISOString().split('T')[0],
        processedBy: "Current User",
        approvalStatus: "Pending",
        approvedBy: null,
        approvedDate: null,
      };

      // Store in session storage
      sessionStorage.setItem('newPayroll', JSON.stringify(newPayroll));

      setIsProcessing(false);
      setShowNotification(true);

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        router.push('/payroll');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-4 md:p-8">
      {/* Processing Notification */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2c4a6a] animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center">Processing Payroll...</h3>
              <p className="text-gray-600 text-sm mt-2 text-center">
                Setting up payroll for {selectedEmployees.size} employees
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">✓ Done!</h3>
              <p className="text-gray-900 font-semibold mb-1">Payroll Created Successfully</p>
              <p className="text-gray-600 text-sm mb-4">
                {selectedEmployees.size} employees with ₵{(totalSelectedSalary / 1000).toFixed(0)}K gross pay
              </p>
              <p className="text-xs text-gray-500">
                Redirecting to payroll list...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Create New Payroll</h1>
            <p className="text-gray-600 mt-2">Configure payroll settings and select employees to process</p>
          </div>
          {!isProcessing && !showNotification && (
            <Link
              href="/payroll"
              className="p-3 hover:bg-gray-200/50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      <form onSubmit={handleProcessPayroll} className="max-w-7xl mx-auto space-y-8">
        {/* Settings Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payroll Period Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month *</label>
              <select 
                value={processFormData.month} 
                onChange={e => setProcessFormData({...processFormData, month: e.target.value})} 
                required 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
              >
                <option value="">Select Month</option>
                {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
              <select 
                value={processFormData.year} 
                onChange={e => setProcessFormData({...processFormData, year: e.target.value})} 
                required 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
              >
                <option value="">Select Year</option>
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={processFormData.startDate}
                onChange={e => setProcessFormData({...processFormData, startDate: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input
                type="date"
                value={processFormData.endDate}
                onChange={e => setProcessFormData({...processFormData, endDate: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
              />
            </div>
          </div>
        </div>

        {/* Payroll Options */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payroll Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'includeBonuses', label: 'Include Bonuses', desc: 'Add performance bonuses to payroll' },
              { key: 'includeAllowances', label: 'Include Allowances', desc: 'Add housing, transport allowances' },
              { key: 'deductTaxes', label: 'Deduct Taxes', desc: 'Calculate and deduct income tax' },
              { key: 'deductSSNIT', label: 'Deduct SSNIT', desc: 'Calculate SSNIT contributions' }
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-start gap-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200">
                <input
                  type="checkbox"
                  checked={processFormData[key]}
                  onChange={e => setProcessFormData({...processFormData, [key]: e.target.checked})}
                  className="w-6 h-6 text-[#2c4a6a] rounded focus:ring-[#2c4a6a] mt-0.5"
                />
                <div>
                  <p className="font-semibold text-gray-900">{label}</p>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left - Department Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Departments ({departments.length})</h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setSelectedDepartmentFilter("All")}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  selectedDepartmentFilter === "All"
                    ? "bg-[#2c4a6a] text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                All Departments
              </button>
              {departments.map(dept => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDepartmentFilter(dept)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                    selectedDepartmentFilter === dept
                      ? "bg-[#2c4a6a] text-white"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  <span>{dept}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {departmentStats[dept]?.selected}/{departmentStats[dept]?.total}
                  </span>
                </button>
              ))}
            </div>

            {/* Bulk Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <p className="text-xs font-semibold text-gray-600 mb-3">BULK ACTIONS</p>
              <button
                type="button"
                onClick={selectAllEmployees}
                className="w-full px-4 py-2.5 text-sm font-medium text-[#2c4a6a] bg-[#2c4a6a]/10 rounded-lg hover:bg-[#2c4a6a]/20 transition-colors"
              >
                Select All 1000
              </button>
              <button
                type="button"
                onClick={deselectAllEmployees}
                className="w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Deselect All
              </button>
              {selectedDepartmentFilter !== "All" && (
                <>
                  <button
                    type="button"
                    onClick={() => selectDepartment(selectedDepartmentFilter)}
                    className="w-full px-4 py-2.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    Select {selectedDepartmentFilter}
                  </button>
                  <button
                    type="button"
                    onClick={() => deselectDepartment(selectedDepartmentFilter)}
                    className="w-full px-4 py-2.5 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    Deselect {selectedDepartmentFilter}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Middle - Employee List */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Select Employees</h3>
                <div className="text-sm">
                  <span className="font-bold text-[#2c4a6a]">{selectedEmployees.size}</span>
                  <span className="text-gray-600">/{sampleEmployees.length}</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={employeeSearchQuery}
                  onChange={(e) => {
                    setEmployeeSearchQuery(e.target.value);
                    setEmployeeListPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                />
              </div>

              {/* Page Actions */}
              <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                <span>
                  Showing {((employeeListPage - 1) * employeesPerPage) + 1} to {Math.min(employeeListPage * employeesPerPage, filteredEmployees.length)} of {filteredEmployees.length}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllInFilter}
                    className="px-3 py-1 text-xs font-medium text-[#2c4a6a] bg-[#2c4a6a]/10 rounded hover:bg-[#2c4a6a]/20"
                  >
                    Select Page
                  </button>
                  <button
                    type="button"
                    onClick={deselectAllInFilter}
                    className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
                  >
                    Deselect Page
                  </button>
                </div>
              </div>
            </div>

            {/* Employee Grid */}
            <div className="border border-gray-200 rounded-lg max-h-[600px] overflow-y-auto bg-gray-50">
              <div className="divide-y divide-gray-200">
                {paginatedEmployees.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 text-sm">No employees found</p>
                  </div>
                ) : (
                  paginatedEmployees.map((employee) => (
                    <label
                      key={employee.id}
                      className="flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmployees.has(employee.id)}
                        onChange={() => toggleEmployeeSelection(employee.id)}
                        className="w-4 h-4 text-[#2c4a6a] rounded focus:ring-[#2c4a6a]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{employee.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="font-mono">{employee.id}</span>
                          <span>•</span>
                          <span>{employee.department}</span>
                          <span>•</span>
                          <span>{employee.position}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-[#2c4a6a]">₵{Math.round(employee.salary).toLocaleString()}</p>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          employee.status === "Active" 
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {employee.status}
                        </span>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Pagination */}
            {totalEmployeePages > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="text-gray-600">Page {employeeListPage} of {totalEmployeePages}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEmployeeListPage(p => Math.max(1, p - 1))}
                    disabled={employeeListPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmployeeListPage(p => Math.min(totalEmployeePages, p + 1))}
                    disabled={employeeListPage === totalEmployeePages}
                    className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right - Summary */}
          <div className="space-y-6">
            {/* Department Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Department Breakdown</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {departments.map(dept => {
                  const stats = departmentStats[dept];
                  const percentage = (stats.selected / stats.total) * 100;
                  return (
                    <div key={dept} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900">{dept}</span>
                        <span className="text-xs font-bold text-[#2c4a6a]">{stats.selected}/{stats.total}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#2c4a6a] to-[#1e3147]"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payroll Summary */}
            <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl p-6 shadow-sm text-white">
              <h3 className="text-lg font-bold mb-4">Payroll Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Total Employees</span>
                  <span className="text-2xl font-bold">{selectedEmployees.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Coverage</span>
                  <span className="text-2xl font-bold">{Math.round((selectedEmployees.size / sampleEmployees.length) * 100)}%</span>
                </div>
                <div className="border-t border-white/20 pt-3 flex items-center justify-between">
                  <span className="text-white/80 text-sm">Gross Salary</span>
                  <span className="text-2xl font-bold">₵{(totalSelectedSalary / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Deductions (11%)</span>
                  <span className="text-lg font-bold text-red-300">₵{Math.round(totalSelectedSalary * 0.11 / 1000).toFixed(0)}K</span>
                </div>
                <div className="border-t border-white/20 pt-3 flex items-center justify-between">
                  <span className="text-white/80 text-sm">Net Pay</span>
                  <span className="text-xl font-bold text-green-300">₵{Math.round(totalSelectedSalary * 0.89 / 1000).toFixed(0)}K</span>
                </div>
              </div>
            </div>

            {/* Excluded Count */}
            {removedEmployees.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-xs font-medium text-blue-900 mb-2">EXCLUDED EMPLOYEES</p>
                <p className="text-2xl font-bold text-blue-700">{removedEmployees.length}</p>
                <p className="text-xs text-blue-600 mt-1">Not included in payroll</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 sticky bottom-6">
          <Link
            href="/payroll"
            className="flex-1 px-6 py-4 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={selectedEmployees.size === 0 || isProcessing || showNotification}
            className={`flex-1 px-6 py-4 rounded-lg text-base font-medium transition-all ${
              selectedEmployees.size === 0 || isProcessing || showNotification
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white hover:from-[#1e3147] hover:to-[#2c4a6a]'
            }`}
          >
            {isProcessing ? 'Processing...' : `Process Payroll (${selectedEmployees.size} employees)`}
          </button>
        </div>
      </form>
    </div>
  );
}