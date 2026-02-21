"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PayrollChart from "@/components/PayrollChart";
import DepartmentChart from "@/components/DepartmentChart";

export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = useState("thisMonth");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  // Modal states
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Attendance tracking state
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const [taskFormData, setTaskFormData] = useState({
    title: "",
    assignee: "",
    dueDate: "",
    priority: "medium",
    category: "general",
    description: "",
  });

  // Attendance data by department
  const attendanceData = {
    All: {
      present: 1089,
      absent: 45,
      late: 55,
      onLeave: 58,
      total: 1247,
      details: [
        { name: "John Mensah", status: "present", time: "08:45 AM", dept: "Engineering", image: "/profiles/employee4.jpg" },
        { name: "Ama Asante", status: "late", time: "09:15 AM", dept: "HR", image: "/profiles/employee3.jpg" },
        { name: "Kofi Boateng", status: "absent", time: "-", dept: "Sales", image: "/profiles/employee1.jpg" },
        { name: "Abena Osei", status: "present", time: "08:30 AM", dept: "Finance", image: "/profiles/employee2.jpg" },
        { name: "Kwame Owusu", status: "onLeave", time: "-", dept: "Marketing", image: "/profiles/employee1.jpg" },
        { name: "Sarah Johnson", status: "present", time: "08:20 AM", dept: "Operations", image: "/profiles/employee3.jpg" },
        { name: "Emmanuel Agyei", status: "present", time: "08:35 AM", dept: "Engineering", image: "/profiles/employee4.jpg" },
        { name: "Grace Appiah", status: "late", time: "09:20 AM", dept: "Sales", image: "/profiles/employee2.jpg" },
        { name: "Michael Mensah", status: "present", time: "08:15 AM", dept: "Finance", image: "/profiles/employee4.jpg" },
        { name: "Yaa Asantewaa", status: "present", time: "08:25 AM", dept: "HR", image: "/profiles/employee3.jpg" },
        { name: "Kwesi Adom", status: "absent", time: "-", dept: "Operations", image: "/profiles/employee1.jpg" },
        { name: "Akosua Frimpong", status: "present", time: "08:40 AM", dept: "Marketing", image: "/profiles/employee2.jpg" },
        { name: "Joseph Nkrumah", status: "late", time: "09:10 AM", dept: "Engineering", image: "/profiles/employee3.jpg" },
        { name: "Efua Mensah", status: "present", time: "08:50 AM", dept: "Sales", image: "/profiles/employee3.jpg" },
        { name: "Daniel Osei", status: "onLeave", time: "-", dept: "Finance", image: "/profiles/employee1.jpg" },
      ]
    },
    Engineering: {
      present: 312, absent: 12, late: 15, onLeave: 3, total: 342,
      details: [
        { name: "John Mensah", status: "present", time: "08:45 AM", dept: "Engineering", image: "/profiles/employee4.jpg" },
        { name: "Emmanuel Agyei", status: "present", time: "08:35 AM", dept: "Engineering", image: "/profiles/employee1.jpg" },
        { name: "Joseph Nkrumah", status: "late", time: "09:10 AM", dept: "Engineering", image: "/profiles/employee3.jpg" },
      ]
    },
    Sales: {
      present: 195, absent: 8, late: 12, onLeave: 3, total: 218,
      details: [
        { name: "Kofi Boateng", status: "absent", time: "-", dept: "Sales", image: "/profiles/employee1.jpg" },
        { name: "Grace Appiah", status: "late", time: "09:20 AM", dept: "Sales", image: "/profiles/employee2.jpg" },
        { name: "Efua Mensah", status: "present", time: "08:50 AM", dept: "Sales", image: "/profiles/employee3.jpg" },
      ]
    },
    Marketing: {
      present: 140, absent: 6, late: 8, onLeave: 2, total: 156,
      details: [
        { name: "Kwame Owusu", status: "onLeave", time: "-", dept: "Marketing", image: "/profiles/employee1.jpg" },
        { name: "Akosua Frimpong", status: "present", time: "08:40 AM", dept: "Marketing", image: "/profiles/employee2.jpg" },
      ]
    },
    HR: {
      present: 78, absent: 4, late: 5, onLeave: 2, total: 89,
      details: [
        { name: "Ama Asante", status: "late", time: "09:15 AM", dept: "HR", image: "/profiles/employee3.jpg" },
        { name: "Yaa Asantewaa", status: "present", time: "08:25 AM", dept: "HR", image: "/profiles/employee2.jpg" },
      ]
    },
    Finance: {
      present: 110, absent: 5, late: 7, onLeave: 2, total: 124,
      details: [
        { name: "Abena Osei", status: "present", time: "08:30 AM", dept: "Finance", image: "/profiles/employee2.jpg" },
        { name: "Michael Mensah", status: "present", time: "08:15 AM", dept: "Finance", image: "/profiles/employee4.jpg" },
      ]
    },
    Operations: {
      present: 175, absent: 10, late: 8, onLeave: 5, total: 198,
      details: [
        { name: "Sarah Johnson", status: "present", time: "08:20 AM", dept: "Operations", image: "/profiles/employee3.jpg" },
        { name: "Kwesi Adom", status: "absent", time: "-", dept: "Operations", image: "/profiles/employee1.jpg" },
      ]
    },
  };

  const currentAttendance = attendanceData[selectedDepartment];

  const [tasks, setTasks] = useState([
    { id: 1, title: "Review Q1 Performance Reports", assignee: "John Mensah", dueDate: "2026-02-05", priority: "high", category: "review", status: "pending", description: "Complete quarterly performance reviews for all team members" },
    { id: 2, title: "Process February Payroll", assignee: "Ama Serwaa", dueDate: "2026-02-28", priority: "high", category: "payroll", status: "pending", description: "Run and verify February payroll processing" },
    { id: 3, title: "Approve Leave Requests", assignee: "Sarah Johnson", dueDate: "2026-02-10", priority: "medium", category: "leave", status: "in-progress", description: "Review and approve pending leave requests" },
    { id: 4, title: "Update Employee Records", assignee: "Kofi Boateng", dueDate: "2026-02-15", priority: "low", category: "admin", status: "pending", description: "Update employee information in the system" },
    { id: 5, title: "Conduct New Hire Orientation", assignee: "Efua Addo", dueDate: "2026-02-08", priority: "medium", category: "training", status: "completed", description: "Onboard new employees for February intake" },
    { id: 6, title: "Tax Filing Preparation", assignee: "John Mensah", dueDate: "2026-02-20", priority: "high", category: "compliance", status: "pending", description: "Prepare documents for quarterly tax filing" },
    { id: 7, title: "Benefits Enrollment Review", assignee: "Ama Serwaa", dueDate: "2026-02-25", priority: "medium", category: "benefits", status: "in-progress", description: "Review employee benefits enrollment" },
    { id: 8, title: "Department Budget Meeting", assignee: "Sarah Johnson", dueDate: "2026-02-12", priority: "medium", category: "meeting", status: "pending", description: "Quarterly budget review with department heads" },
  ]);

  const stats = {
    totalEmployees: 1247,
    activeEmployees: 1189,
    onLeave: 58,
    newHires: 23,
    totalPayroll: 2847500,
    lastMonthPayroll: 2795300,
    pendingApprovals: 15,
    processingPayroll: 2,
    totalAllowances: 487500,
    totalDeductions: 321800,
    avgSalary: 2284,
    departmentCount: 12,
  };

  const reportCreators = {
    totalEmployees: { name: "Kwame Boateng", image: "/profiles/employee1.jpg", role: "Operations Manager" },
    activeEmployees: { name: "Ama Asantewaa", image: "/profiles/employee3.jpg", role: "HR Specialist" },
    payroll: { name: "John Mensah", image: "/profiles/employee4.jpg", role: "Finance Manager" },
    pendingApprovals: { name: "Sarah Johnson", image: "/profiles/employee3.jpg", role: "Admin Officer" },
  };

  const recentActivities = [
    { id: 1, type: "payroll", action: "Payroll processed for January 2026", user: "John Mensah", image: "/profiles/employee4.jpg", time: "2 hours ago", status: "completed", details: "Processed for 1189 employees" },
    { id: 2, type: "leave", action: "Leave request approved for Abena Osei", user: "Sarah Johnson", image: "/profiles/employee3.jpg", time: "3 hours ago", status: "completed", details: "Annual leave approved" },
    { id: 3, type: "employee", action: "New employee onboarded - Kwame Boateng", user: "HR Team", image: "/profiles/employee1.jpg", time: "5 hours ago", status: "completed", details: "Engineering department" },
    { id: 4, type: "payroll", action: "Payslip generated for 1189 employees", user: "System", image: "/profiles/employee2.jpg", time: "1 day ago", status: "completed", details: "Monthly payroll completed" },
    { id: 5, type: "leave", action: "Leave request pending - Ama Asante", user: "Ama Asante", image: "/profiles/employee3.jpg", time: "1 day ago", status: "pending", details: "Awaiting approval" },
  ];

  const departments = [
    { name: "Engineering", employees: 342, budget: 825000, utilization: 92, manager: "Ama Asantewaa", managerImage: "/profiles/employee3.jpg", teamSize: 42, projects: 8 },
    { name: "Sales", employees: 218, budget: 512000, utilization: 88, manager: "Abena Osei", managerImage: "/profiles/employee2.jpg", teamSize: 28, projects: 12 },
    { name: "Marketing", employees: 156, budget: 378000, utilization: 85, manager: "John Mensah", managerImage: "/profiles/employee4.jpg", teamSize: 18, projects: 6 },
    { name: "HR", employees: 89, budget: 198000, utilization: 78, manager: "Efua Addo", managerImage: "/profiles/employee2.jpg", teamSize: 10, projects: 4 },
    { name: "Finance", employees: 124, budget: 289000, utilization: 90, manager: "Kwame Boateng", managerImage: "/profiles/employee1.jpg", teamSize: 15, projects: 5 },
    { name: "Operations", employees: 198, budget: 445000, utilization: 87, manager: "Sarah Johnson", managerImage: "/profiles/employee3.jpg", teamSize: 24, projects: 7 },
  ];

  const leaveStats = [
    { type: "Annual Leave", count: 23, percentage: 40, createdBy: "Kwame Boateng", image: "/profiles/employee1.jpg" },
    { type: "Sick Leave", count: 15, percentage: 26, createdBy: "Ama Asantewaa", image: "/profiles/employee3.jpg" },
    { type: "Emergency Leave", count: 12, percentage: 21, createdBy: "John Mensah", image: "/profiles/employee4.jpg" },
    { type: "Maternity Leave", count: 5, percentage: 9, createdBy: "Sarah Johnson", image: "/profiles/employee2.jpg" },
  ];

  const topPerformers = [
    { id: 1, name: "Kwame Boateng", department: "Engineering", score: 98, avatar: "KB", image: "/profiles/employee1.jpg" },
    { id: 2, name: "Abena Osei", department: "Sales", score: 96, avatar: "AO", image: "/profiles/employee2.jpg" },
    { id: 3, name: "John Mensah", department: "Marketing", score: 94, avatar: "JM", image: "/profiles/employee4.jpg" },
    { id: 4, name: "Ama Asante", department: "Finance", score: 92, avatar: "AA", image: "/profiles/employee3.jpg" },
    { id: 5, name: "Kofi Owusu", department: "Operations", score: 90, avatar: "KO", image: "/profiles/employee1.jpg" },
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "high": return "bg-[#2c4a6a] text-white";
      case "medium": return "bg-[#6b8ca3] text-white";
      case "low": return "bg-gray-200 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTaskCategoryColor = (category) => {
    switch(category) {
      case "payroll": return "bg-[#2c4a6a]";
      case "review": return "bg-[#4a6b82]";
      case "leave": return "bg-[#6b8ca3]";
      case "compliance": return "bg-[#1e3147]";
      case "training": return "bg-[#8badc3]";
      case "benefits": return "bg-[#abd4ea]";
      case "meeting": return "bg-[#2c4a6a]";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "present": return "bg-[#2c4a6a]/10 text-[#2c4a6a] border-[#2c4a6a]/30";
      case "absent": return "bg-gray-200 text-gray-700 border-gray-300";
      case "late": return "bg-[#6b8ca3]/10 text-[#6b8ca3] border-[#6b8ca3]/30";
      case "onLeave": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "present":
        return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
      case "absent":
        return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
      case "late":
        return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case "onLeave":
        return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
      default:
        return null;
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    const newTask = {
      id: tasks.length + 1,
      title: taskFormData.title,
      assignee: taskFormData.assignee,
      dueDate: taskFormData.dueDate,
      priority: taskFormData.priority,
      category: taskFormData.category,
      status: "pending",
      description: taskFormData.description,
    };
    setTasks([...tasks, newTask]);
    setIsCreateTaskModalOpen(false);
    setTaskFormData({
      title: "", assignee: "", dueDate: "", priority: "medium",
      category: "general", description: "",
    });
    alert("Task created successfully!");
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const calendarDays = [];
  
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-1">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Overview of your workforce and system metrics</p>
      </div>

      {/* Primary Stats Cards - NO SHADOWS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 ">
        {/* Total Employees */}
        <div 
          onClick={() => {
            setSelectedReport(reportCreators.totalEmployees);
            setReportModalOpen(true);
          }}
          className="relative rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] text-white cursor-pointer hover:scale-105 transition-all overflow-hidden"
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] bg-white/90 text-[#2c4a6a] px-3 py-1 rounded-full font-medium">
              Current Month
            </span>
            <button className="p-1 rounded-full hover:bg-white/10 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          <div className="my-6">
            <p className="text-sm text-white/70">Total Employees</p>
            <h1 className="text-3xl font-bold tracking-wide mt-1">{stats.totalEmployees.toLocaleString()}</h1>
            <p className="text-xs text-white/60 mt-1">↑ 2.3% vs last month</p>
          </div>

          <div className="text-xs text-white/60 border-t border-white/20 pt-3 flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white flex-shrink-0">
              <img src={reportCreators.totalEmployees.image} alt={reportCreators.totalEmployees.name} className="w-full h-full object-cover" />
            </div>
            <span>by {reportCreators.totalEmployees.name}</span>
          </div>
        </div>

        {/* Active Employees */}
        <div 
          onClick={() => {
            setSelectedReport(reportCreators.activeEmployees);
            setReportModalOpen(true);
          }}
          className="relative rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] text-white cursor-pointer hover:scale-105 transition-all overflow-hidden"
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] bg-white/90 text-[#6b8ca3] px-3 py-1 rounded-full font-medium">
              Active Now
            </span>
            <button className="p-1 rounded-full hover:bg-white/10 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          <div className="my-6">
            <p className="text-sm text-white/70">Active Employees</p>
            <h1 className="text-3xl font-bold tracking-wide mt-1">{stats.activeEmployees.toLocaleString()}</h1>
            <p className="text-xs text-white/60 mt-1">↑ 1.8% vs last month</p>
          </div>

          <div className="text-xs text-white/60 border-t border-white/20 pt-3 flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white flex-shrink-0">
              <img src={reportCreators.activeEmployees.image} alt={reportCreators.activeEmployees.name} className="w-full h-full object-cover" />
            </div>
            <span>by {reportCreators.activeEmployees.name}</span>
          </div>
        </div>

        {/* Monthly Payroll */}
        <div 
          onClick={() => {
            setSelectedReport(reportCreators.payroll);
            setReportModalOpen(true);
          }}
          className="relative rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] text-white cursor-pointer hover:scale-105 transition-all overflow-hidden"
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] bg-white/90 text-[#2c4a6a] px-3 py-1 rounded-full font-medium">
              February
            </span>
            <button className="p-1 rounded-full hover:bg-white/10 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          <div className="my-6">
            <p className="text-sm text-white/70">Monthly Payroll</p>
            <h1 className="text-3xl font-bold tracking-wide mt-1">₵{(stats.totalPayroll / 1000).toFixed(1)}K</h1>
            <p className="text-xs text-white/60 mt-1">↑ 1.9% vs last month</p>
          </div>

          <div className="text-xs text-white/60 border-t border-white/20 pt-3 flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white flex-shrink-0">
              <img src={reportCreators.payroll.image} alt={reportCreators.payroll.name} className="w-full h-full object-cover" />
            </div>
            <span>by {reportCreators.payroll.name}</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div 
          onClick={() => {
            setSelectedReport(reportCreators.pendingApprovals);
            setReportModalOpen(true);
          }}
          className="relative rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] text-white cursor-pointer hover:scale-105 transition-all overflow-hidden"
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] bg-white/90 text-[#6b8ca3] px-3 py-1 rounded-full font-medium">
              Pending
            </span>
            <button className="p-1 rounded-full hover:bg-white/10 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          <div className="my-6">
            <p className="text-sm text-white/70">Pending Approvals</p>
            <h1 className="text-3xl font-bold tracking-wide mt-1">{stats.pendingApprovals}</h1>
            <p className="text-xs text-white/60 mt-1">↓ 3 items need attention</p>
          </div>

          <div className="text-xs text-white/60 border-t border-white/20 pt-3 flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white flex-shrink-0">
              <img src={reportCreators.pendingApprovals.image} alt={reportCreators.pendingApprovals.name} className="w-full h-full object-cover" />
            </div>
            <span>by {reportCreators.pendingApprovals.name}</span>
          </div>
        </div>
      </div>

      {/* Secondary Stats Cards - WITH BASE COLOR SHADES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-gradient-to-br from-[#c3d2e9] to-[#d4dff0] hover:from-[#bfcfe8] hover:to-[#d0dbed] rounded-xl p-5 cursor-pointer transition-all border border-[#2c4a6a]/10">
          <div className="w-9 h-9 rounded-lg bg-[#2c4a6a]/20 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xs font-medium text-[#2c4a6a]/70 mb-1">Avg. Salary</h3>
          <p className="text-2xl font-bold text-[#1e3147]">₵{stats.avgSalary.toLocaleString()}</p>
          <p className="text-xs text-[#2c4a6a]/60 mt-1">Per employee</p>
        </div>

        <div className="bg-gradient-to-br from-[#c3d2e9] to-[#d4dff0] hover:from-[#bfcfe8] hover:to-[#d0dbed] rounded-xl p-5 cursor-pointer transition-all border border-[#2c4a6a]/10">
          <div className="w-9 h-9 rounded-lg bg-[#2c4a6a]/20 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <h3 className="text-xs font-medium text-[#2c4a6a]/70 mb-1">Departments</h3>
          <p className="text-2xl font-bold text-[#1e3147]">{stats.departmentCount}</p>
          <p className="text-xs text-[#2c4a6a]/60 mt-1">Active departments</p>
        </div>

        <div className="bg-gradient-to-br from-[#c3d2e9] to-[#d4dff0] hover:from-[#bfcfe8] hover:to-[#d0dbed] rounded-xl p-5 cursor-pointer transition-all border border-[#2c4a6a]/10">
          <div className="w-9 h-9 rounded-lg bg-[#2c4a6a]/20 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h3 className="text-xs font-medium text-[#2c4a6a]/70 mb-1">On Leave Today</h3>
          <p className="text-2xl font-bold text-[#1e3147]">{stats.onLeave}</p>
          <p className="text-xs text-[#2c4a6a]/60 mt-1">{((stats.onLeave / stats.totalEmployees) * 100).toFixed(1)}% of workforce</p>
        </div>

        <div className="bg-gradient-to-br from-[#c3d2e9] to-[#d4dff0] hover:from-[#bfcfe8] hover:to-[#d0dbed] rounded-xl p-5 cursor-pointer transition-all border border-[#2c4a6a]/10">
          <div className="w-9 h-9 rounded-lg bg-[#2c4a6a]/20 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </div>
          <h3 className="text-xs font-medium text-[#2c4a6a]/70 mb-1">New Hires</h3>
          <p className="text-2xl font-bold text-[#1e3147]">{stats.newHires}</p>
          <p className="text-xs text-[#2c4a6a]/60 mt-1">This month</p>
        </div>
      </div>

      {/* Payroll Chart and Department Chart - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PayrollChart />
        <DepartmentChart />
      </div>

      {/* Today's Attendance - Full Row List View */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Today's Attendance</h2>
            <p className="text-sm text-gray-500 mt-1">Thursday, February 19, 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white font-medium"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
            <Link href="/attendance">
              <button className="px-4 py-2 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all">
                View All
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="bg-gradient-to-br from-[#2c4a6a]/10 to-[#2c4a6a]/5 rounded-xl p-4 border border-[#2c4a6a]/30">
            <p className="text-xs font-medium text-[#2c4a6a]/70 mb-1">Present</p>
            <p className="text-3xl font-bold text-[#1e3147]">{currentAttendance.present}</p>
            <p className="text-xs text-[#2c4a6a]/50 mt-1">{((currentAttendance.present / currentAttendance.total) * 100).toFixed(0)}%</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-1">Absent</p>
            <p className="text-3xl font-bold text-gray-900">{currentAttendance.absent}</p>
            <p className="text-xs text-gray-500 mt-1">{((currentAttendance.absent / currentAttendance.total) * 100).toFixed(0)}%</p>
          </div>
          <div className="bg-gradient-to-br from-[#6b8ca3]/10 to-[#6b8ca3]/5 rounded-xl p-4 border border-[#6b8ca3]/30">
            <p className="text-xs font-medium text-[#6b8ca3]/70 mb-1">Late</p>
            <p className="text-3xl font-bold text-[#1e3147]">{currentAttendance.late}</p>
            <p className="text-xs text-[#6b8ca3]/50 mt-1">{((currentAttendance.late / currentAttendance.total) * 100).toFixed(0)}%</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-1">On Leave</p>
            <p className="text-3xl font-bold text-gray-900">{currentAttendance.onLeave}</p>
            <p className="text-xs text-gray-500 mt-1">{((currentAttendance.onLeave / currentAttendance.total) * 100).toFixed(0)}%</p>
          </div>
        </div>

        {/* Employee List */}
        <div className="space-y-3">
          {currentAttendance.details.slice(0, 8).map((emp, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
              {/* Employee Image */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white">
                <img
                  src={emp.image}
                  alt={emp.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Employee Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{emp.name}</h3>
                <p className="text-sm text-gray-500">{emp.dept}</p>
              </div>

              {/* Clock In Time */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{emp.time}</span>
              </div>

              {/* Status Badge */}
              <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border ${getStatusColor(emp.status)}`}>
                {getStatusIcon(emp.status)}
                {emp.status === 'onLeave' ? 'On Leave' : emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers and Recent Activities in Same Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Performers */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Top Performers</h2>
            <button className="text-sm text-[#2c4a6a] hover:underline font-medium">View All</button>
          </div>
          
          <div className="space-y-3">
            {topPerformers.slice(0, 5).map((performer, index) => (
              <div key={performer.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>

                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
                  <img
                    src={performer.image}
                    alt={performer.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{performer.name}</h3>
                  <p className="text-xs text-gray-500">{performer.department}</p>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-[#2c4a6a]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-lg font-bold text-gray-900">{performer.score}</span>
                  </div>
                  <p className="text-xs text-gray-500">Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-[#2c4a6a] hover:underline font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                  <img
                    src={activity.image}
                    alt={activity.user}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    activity.status === 'completed' ? 'bg-[#2c4a6a]' : 'bg-[#6b8ca3]'
                  }`}></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.details}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                      activity.status === 'completed' 
                        ? 'bg-[#2c4a6a]/10 text-[#2c4a6a]'
                        : 'bg-[#6b8ca3]/10 text-[#6b8ca3]'
                    }`}>
                      {activity.status === 'completed' ? 'Done' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    <span className="font-medium text-gray-700">{activity.user}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Performance & Leave Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department Performance */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Department Overview</h2>
            <button className="text-sm text-[#2c4a6a] hover:underline font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {departments.map((dept, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
                      <img
                        src={dept.managerImage}
                        alt={dept.manager}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                      <p className="text-xs text-gray-500">Manager: {dept.manager}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#2c4a6a]">₵{(dept.budget / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-gray-500">Budget</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3 text-xs">
                  <span className="px-2 py-1 bg-[#2c4a6a]/10 text-[#2c4a6a] rounded-full font-medium">{dept.employees} emps</span>
                  <span className="px-2 py-1 bg-[#4a6b82]/10 text-[#4a6b82] rounded-full font-medium">{dept.teamSize} team</span>
                  <span className="px-2 py-1 bg-[#6b8ca3]/10 text-[#6b8ca3] rounded-full font-medium">{dept.projects} projects</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2c4a6a] to-[#1e3147]"
                      style={{ width: `${dept.utilization}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-[#2c4a6a]">{dept.utilization}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Statistics */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Leave Distribution</h2>
            <span className="text-sm text-gray-500">{stats.onLeave} on leave</span>
          </div>
          
          <div className="space-y-4">
            {leaveStats.map((leave, index) => (
              <div 
                key={index} 
                onClick={() => {
                  setSelectedLeaveType(leave);
                  setLeaveModalOpen(true);
                }}
                className="space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">{leave.type}</span>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
                      <img src={leave.image} alt={leave.createdBy} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#2c4a6a]">{leave.count}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6b8ca3] to-[#2c4a6a]"
                      style={{ width: `${leave.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-500 w-10 text-right">{leave.percentage}%</span>
                </div>
                <p className="text-xs text-gray-500">by {leave.createdBy}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-gray-700">Recorded By:</span>
              <div className="flex -space-x-2">
                {leaveStats.map((leave, index) => (
                  <div 
                    key={index}
                    className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white hover:z-10 cursor-pointer" 
                    title={leave.createdBy}
                  >
                    <img src={leave.image} alt={leave.createdBy} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-[#2c4a6a]/10 rounded-lg cursor-pointer hover:bg-[#2c4a6a]/20 transition-colors">
                <p className="text-xs text-gray-600 mb-1">Approved</p>
                <p className="text-xl font-bold text-[#2c4a6a]">{leaveStats.reduce((sum, l) => sum + l.count, 0) - stats.pendingApprovals}</p>
              </div>
              <div className="text-center p-3 bg-[#6b8ca3]/10 rounded-lg cursor-pointer hover:bg-[#6b8ca3]/20 transition-colors">
                <p className="text-xs text-gray-600 mb-1">Pending</p>
                <p className="text-xl font-bold text-[#6b8ca3]">{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar & Task Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Task Calendar</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-gray-900 min-w-[150px] text-center">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square"></div>;
              }

              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const tasksForDay = getTasksForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square p-2 rounded-lg border cursor-pointer transition-all ${
                    isToday
                      ? 'bg-[#2c4a6a] text-white border-[#2c4a6a]'
                      : isSelected
                      ? 'bg-[#2c4a6a]/10 border-[#2c4a6a]'
                      : tasksForDay.length > 0
                      ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <span className={`text-sm font-medium ${isToday ? 'text-white' : 'text-gray-900'}`}>
                      {day}
                    </span>
                    {tasksForDay.length > 0 && (
                      <div className="mt-1 flex gap-1 flex-wrap">
                        {tasksForDay.slice(0, 3).map(task => (
                          <div
                            key={task.id}
                            className={`w-1.5 h-1.5 rounded-full ${getTaskCategoryColor(task.category)}`}
                            title={task.title}
                          />
                        ))}
                        {tasksForDay.length > 3 && (
                          <span className={`text-[10px] ${isToday ? 'text-white' : 'text-gray-500'}`}>
                            +{tasksForDay.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Assign New Task
            </button>
          </div>
        </div>

        {/* Tasks for Selected Date */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Tasks {selectedDate && `- ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            </h2>
            <span className="text-sm text-gray-500">
              {selectedDate ? getTasksForDate(selectedDate).length : tasks.length} tasks
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {(selectedDate ? getTasksForDate(selectedDate) : tasks.filter(t => t.status === 'pending')).length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 text-sm">No tasks for this day</p>
              </div>
            ) : (
              (selectedDate ? getTasksForDate(selectedDate) : tasks.filter(t => t.status === 'pending')).map(task => (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsTaskModalOpen(true);
                  }}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm flex-1">{task.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{task.assignee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getTaskCategoryColor(task.category)}`}></div>
                      <span className="text-xs text-gray-500 capitalize">{task.category}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.status === 'completed' 
                        ? 'bg-[#2c4a6a]/10 text-[#2c4a6a]'
                        : task.status === 'in-progress'
                        ? 'bg-[#6b8ca3]/10 text-[#6b8ca3]'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}

      {/* Report Modal */}
      {reportModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md">
            <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold">Report Created By</h2>
              <button onClick={() => setReportModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#2c4a6a] mb-4">
                  <img src={selectedReport.image} alt={selectedReport.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{selectedReport.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedReport.role}</p>
              </div>

              <div className="bg-[#2c4a6a]/10 border border-[#2c4a6a]/30 rounded-lg p-4">
                <p className="text-sm text-gray-900">
                  This report was created and verified by <strong>{selectedReport.name}</strong>, who is a <strong>{selectedReport.role}</strong> in the organization.
                </p>
              </div>

              <button onClick={() => setReportModalOpen(false)} className="w-full px-4 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg font-medium transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Type Modal */}
      {leaveModalOpen && selectedLeaveType && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md">
            <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold">{selectedLeaveType.type}</h2>
              <button onClick={() => setLeaveModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#2c4a6a]">
                  <img src={selectedLeaveType.image} alt={selectedLeaveType.createdBy} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recorded By</p>
                  <p className="text-lg font-bold text-gray-900">{selectedLeaveType.createdBy}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2c4a6a]/10 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Total Count</p>
                  <p className="text-3xl font-bold text-[#2c4a6a]">{selectedLeaveType.count}</p>
                </div>
                <div className="bg-[#6b8ca3]/10 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Percentage</p>
                  <p className="text-3xl font-bold text-[#6b8ca3]">{selectedLeaveType.percentage}%</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Distribution</p>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#6b8ca3] to-[#2c4a6a]" style={{ width: `${selectedLeaveType.percentage}%` }}></div>
                </div>
              </div>

              <button onClick={() => setLeaveModalOpen(false)} className="w-full px-4 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg font-medium transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isCreateTaskModalOpen && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-xl font-bold">Assign New Task</h2>
              <button
                onClick={() => setIsCreateTaskModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                  <input
                    type="text"
                    value={taskFormData.title}
                    onChange={(e) => setTaskFormData({...taskFormData, title: e.target.value})}
                    required
                    placeholder="Enter task title"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign To *</label>
                    <select
                      value={taskFormData.assignee}
                      onChange={(e) => setTaskFormData({...taskFormData, assignee: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white"
                    >
                      <option value="">Select assignee</option>
                      <option value="John Mensah">John Mensah</option>
                      <option value="Ama Serwaa">Ama Serwaa</option>
                      <option value="Sarah Johnson">Sarah Johnson</option>
                      <option value="Kofi Boateng">Kofi Boateng</option>
                      <option value="Efua Addo">Efua Addo</option>
                      <option value="Michael Owusu">Michael Owusu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                    <input
                      type="date"
                      value={taskFormData.dueDate}
                      onChange={(e) => setTaskFormData({...taskFormData, dueDate: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                    <select
                      value={taskFormData.priority}
                      onChange={(e) => setTaskFormData({...taskFormData, priority: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={taskFormData.category}
                      onChange={(e) => setTaskFormData({...taskFormData, category: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white"
                    >
                      <option value="general">General</option>
                      <option value="payroll">Payroll</option>
                      <option value="review">Review</option>
                      <option value="leave">Leave</option>
                      <option value="compliance">Compliance</option>
                      <option value="training">Training</option>
                      <option value="benefits">Benefits</option>
                      <option value="meeting">Meeting</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={taskFormData.description}
                    onChange={(e) => setTaskFormData({...taskFormData, description: e.target.value})}
                    rows={4}
                    placeholder="Enter task description..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateTaskModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {isTaskModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="text-xl font-bold">Task Details</h2>
                <p className="text-sm opacity-90">Task #{selectedTask.id}</p>
              </div>
              <button
                onClick={() => {
                  setIsTaskModalOpen(false);
                  setSelectedTask(null);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedTask.title}</h3>
                <p className="text-gray-600">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white text-xs font-bold">
                      {selectedTask.assignee.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="font-semibold text-gray-900">{selectedTask.assignee}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Due Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedTask.dueDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Priority</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getTaskCategoryColor(selectedTask.category)}`}></div>
                    <p className="font-semibold text-gray-900 capitalize">{selectedTask.category}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => handleTaskStatusChange(selectedTask.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white font-semibold"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  className="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Delete Task
                </button>
                <button
                  onClick={() => {
                    setIsTaskModalOpen(false);
                    setSelectedTask(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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