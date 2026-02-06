"use client";

import CountChart from "@/components/CountChart";
import React, { useState } from "react";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("thisMonth");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: "",
    assignee: "",
    dueDate: "",
    priority: "medium",
    category: "general",
    description: "",
  });

  // Calendar Tasks
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

  // Dashboard Statistics
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

  // Recent Activities
  const recentActivities = [
    { id: 1, type: "payroll", action: "Payroll processed for January 2026", user: "John Mensah", time: "2 hours ago", status: "completed" },
    { id: 2, type: "leave", action: "Leave request approved for Abena Osei", user: "Sarah Johnson", time: "3 hours ago", status: "completed" },
    { id: 3, type: "employee", action: "New employee onboarded - Kwame Boateng", user: "HR Team", time: "5 hours ago", status: "completed" },
    { id: 4, type: "payroll", action: "Payslip generated for 1189 employees", user: "System", time: "1 day ago", status: "completed" },
    { id: 5, type: "leave", action: "Leave request pending - Ama Asante", user: "Ama Asante", time: "1 day ago", status: "pending" },
  ];

  // Department Stats
  const departments = [
    { name: "Engineering", employees: 342, budget: 825000, utilization: 92 },
    { name: "Sales", employees: 218, budget: 512000, utilization: 88 },
    { name: "Marketing", employees: 156, budget: 378000, utilization: 85 },
    { name: "HR", employees: 89, budget: 198000, utilization: 78 },
    { name: "Finance", employees: 124, budget: 289000, utilization: 90 },
    { name: "Operations", employees: 198, budget: 445000, utilization: 87 },
  ];

  // Leave Statistics
  const leaveStats = [
    { type: "Annual Leave", count: 23, percentage: 40 },
    { type: "Sick Leave", count: 15, percentage: 26 },
    { type: "Emergency Leave", count: 12, percentage: 21 },
    { type: "Maternity Leave", count: 5, percentage: 9 },
    { type: "Unpaid Leave", count: 3, percentage: 4 },
  ];

  // Upcoming Events
  const upcomingEvents = [
    { id: 1, title: "Payroll Processing", date: "Feb 28, 2026", type: "payroll", priority: "high" },
    { id: 2, title: "Performance Reviews", date: "Mar 15, 2026", type: "review", priority: "medium" },
    { id: 3, title: "Tax Filing Deadline", date: "Mar 31, 2026", type: "compliance", priority: "high" },
    { id: 4, title: "Employee Training", date: "Apr 10, 2026", type: "training", priority: "low" },
  ];

  // Top Performers
  const topPerformers = [
    { id: 1, name: "Kwame Boateng", department: "Engineering", score: 98, avatar: "KB" },
    { id: 2, name: "Abena Osei", department: "Sales", score: 96, avatar: "AO" },
    { id: 3, name: "John Mensah", department: "Marketing", score: 94, avatar: "JM" },
    { id: 4, name: "Ama Asante", department: "Finance", score: 92, avatar: "AA" },
    { id: 5, name: "Kofi Owusu", department: "Operations", score: 90, avatar: "KO" },
  ];

  // Payroll Trend Data (Last 6 months)
  const payrollTrend = [
    { month: "Sep", amount: 2650000 },
    { month: "Oct", amount: 2725000 },
    { month: "Nov", amount: 2780000 },
    { month: "Dec", amount: 2795300 },
    { month: "Jan", amount: 2847500 },
    { month: "Feb", amount: 2890000 },
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case "payroll":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case "leave":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
      case "employee":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTaskCategoryColor = (category) => {
    switch(category) {
      case "payroll": return "bg-blue-500";
      case "review": return "bg-purple-500";
      case "leave": return "bg-green-500";
      case "compliance": return "bg-red-500";
      case "training": return "bg-yellow-500";
      case "benefits": return "bg-cyan-500";
      case "meeting": return "bg-pink-500";
      default: return "bg-gray-500";
    }
  };

  // Calendar Functions
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
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-2">Dashboard Overview</h1>
            <p className="text-sm text-gray-600">Welcome back! Here's what's happening with your HR system today.</p>
          </div>
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white"
            >
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
            <button className="px-5 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* Total Employees */}
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Total</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Employees</h3>
          <p className="text-3xl font-bold mb-2">{stats.totalEmployees.toLocaleString()}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-300">↑ 2.3%</span>
            <span className="opacity-75">vs last month</span>
          </div>
        </div>

        {/* Active Employees */}
        <div className="bg-gradient-to-br from-[#6b8ca3] to-[#4a6b82] rounded-2xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Active</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Active Employees</h3>
          <p className="text-3xl font-bold mb-2">{stats.activeEmployees.toLocaleString()}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-300">↑ 1.8%</span>
            <span className="opacity-75">vs last month</span>
          </div>
        </div>

        {/* Monthly Payroll */}
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Payroll</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Monthly Payroll</h3>
          <p className="text-3xl font-bold mb-2">₵{(stats.totalPayroll / 1000).toFixed(1)}K</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-300">↑ 1.9%</span>
            <span className="opacity-75">vs last month</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-gradient-to-br from-[#6b8ca3] to-[#4a6b82] rounded-2xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Pending</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Pending Approvals</h3>
          <p className="text-3xl font-bold mb-2">{stats.pendingApprovals}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-red-300">↓ 3 items</span>
            <span className="opacity-75">need attention</span>
          </div>
        </div>
      </div>

      {/* Secondary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">On Leave Today</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.onLeave}</p>
          <p className="text-xs text-gray-400 mt-1">{((stats.onLeave / stats.totalEmployees) * 100).toFixed(1)}% of workforce</p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">New Hires</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.newHires}</p>
          <p className="text-xs text-gray-400 mt-1">This month</p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Avg. Salary</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">₵{stats.avgSalary.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Per employee</p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Departments</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.departmentCount}</p>
          <p className="text-xs text-gray-400 mt-1">Active departments</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Payroll Trend Chart */}
       <CountChart/>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-[#2c4a6a] hover:underline font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <svg className={`w-5 h-5 ${activity.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {getActivityIcon(activity.type)}
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1">{activity.action}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{activity.user}</span>
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
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Department Overview</h2>
            <button className="text-sm text-[#2c4a6a] hover:underline font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {departments.map((dept, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                    <p className="text-sm text-gray-500">{dept.employees} employees</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₵{(dept.budget / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-gray-500">Budget</p>
                  </div>
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
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Leave Distribution</h2>
            <span className="text-sm text-gray-500">{stats.onLeave} on leave</span>
          </div>

          {/* Additional Chart Area (Placeholder for Future) */}
          <div className="rounded-2xl bg-white p-5 xl:p-6 shadow-sm min-h-[350px]">
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm font-medium">Additional Chart</p>
                <p className="text-xs mt-1">Finance Chart / Department Breakdown / Payroll Trends</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Approved</p>
              <p className="text-xl font-bold text-green-700">{leaveStats.reduce((sum, l) => sum + l.count, 0) - stats.pendingApprovals}</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Pending</p>
              <p className="text-xl font-bold text-yellow-700">{stats.pendingApprovals}</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (1/3) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick Actions */}
          <div className="rounded-2xl bg-white p-5 xl:p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <button className="w-full cursor-pointer bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white py-3 rounded-lg text-sm font-medium transition-all shadow-sm">
                Run Payroll
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
            {/* Day Headers */}
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
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
                      ? 'bg-blue-50 border-[#2c4a6a]'
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
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Tasks {selectedDate && `- ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            </h2>
            <span className="text-sm text-gray-500">
              {selectedDate ? getTasksForDate(selectedDate).length : tasks.length} tasks
            </span>
          </div>

          {/* Compliance Status */}
          <div className="rounded-2xl bg-gradient-to-br from-[#2c4a6a]/5 to-[#1e3147]/5 p-5 xl:p-6 shadow-sm border border-[#2c4a6a]/10">
            <h3 className="text-sm font-semibold text-[#2c4a6a] mb-4">Compliance Status</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center py-2 border-b border-[#2c4a6a]/10">
                <span className="text-gray-700 font-medium">PAYE</span>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submitted
                </span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-[#2c4a6a]/10">
                <span className="text-gray-700 font-medium">SSNIT</span>
                <span className="text-yellow-600 font-semibold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pending
                </span>
              </li>
              <li className="flex justify-between items-center py-2">
                <span className="text-gray-700 font-medium">Pension</span>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submitted
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Top Performers</h2>
            <button className="text-sm text-[#2c4a6a] hover:underline font-medium">View All</button>
          </div>
          
          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <div key={performer.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-[#2c4a6a] w-6">{index + 1}</span>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold flex-shrink-0">
                    {performer.avatar}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{performer.name}</h3>
                  <p className="text-sm text-gray-500">{performer.department}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
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
      </div>

      {/* Quick Actions Footer */}
      <div className="mt-6 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors text-left">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <p className="font-semibold">Add Employee</p>
            <p className="text-xs opacity-75">Onboard new staff</p>
          </button>
          <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors text-left">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold">Process Payroll</p>
            <p className="text-xs opacity-75">Run monthly payroll</p>
          </button>
          <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors text-left">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-semibold">Generate Report</p>
            <p className="text-xs opacity-75">Create HR reports</p>
          </button>
          <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors text-left">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-semibold">Manage Leave</p>
            <p className="text-xs opacity-75">Approve requests</p>
          </button>
        </div>
      </div>

      {/* Create Task Modal */}
      {isCreateTaskModalOpen && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
              {/* Task Info */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedTask.title}</h3>
                <p className="text-gray-600">{selectedTask.description}</p>
              </div>

              {/* Task Details Grid */}
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

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
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