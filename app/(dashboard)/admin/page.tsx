"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import PayrollChart from "@/components/PayrollChart";
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Brand palette
const C = {
  navy:    "#2c4a6a",
  navyMid: "#3d5a7c",
  navyDk:  "#1e3147",
  steel:   "#6b8ca3",
  fog:     "#a3c2d7",
  iceA:    "#dbe7f1",   // odd secondary cards
  iceB:    "#e7f0f5",   // even secondary cards
};

// Typography helpers – keeps font-size / weight / leading consistent.
// Rule: ONE display size (3xl), ONE heading (lg/base), ONE body (sm),
//       ONE caption (xs) — no rogue sizes outside these four stops.
const T = {
  // Section headings
  sectionTitle: "text-base font-semibold tracking-tight text-gray-900",
  // Card-level numbers / hero values
  heroNum: "text-3xl font-bold leading-none text-[#1e3147]",
  // Secondary numeric (e.g. percentage badges)
  subNum: "text-lg font-bold leading-none text-gray-900",
  // Body copy
  body: "text-sm text-gray-600 leading-snug",
  // Supporting / meta
  caption: "text-xs text-gray-500 leading-tight",
  // Emphasis inside body (name, action)
  strong: "text-sm font-semibold text-gray-900",
  // Labels inside stat cards on dark bg
  cardLabel: "text-xs font-medium text-white/60 uppercase tracking-wide",
  cardValue: "text-3xl font-bold tracking-tight",
  cardMeta:  "text-xs text-white/50",
};

export default function AdminDashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [taskFormData, setTaskFormData] = useState({
    title: "", assignee: "", dueDate: "",
    priority: "medium", category: "general", description: "",
  });

  const systemAlerts = [
    { id: 1, title: "Welcome Back!", message: "You have 5 pending approvals waiting for your attention" },
    { id: 2, title: "Payroll Processing", message: "February payroll has been successfully processed" },
    { id: 3, title: "New Employees", message: "23 new hires onboarded this month" },
    { id: 4, title: "Department Update", message: "Engineering team completed 8 projects this quarter" },
    { id: 5, title: "System Notification", message: "All systems operating normally — 99.9% uptime" },
  ];

  useEffect(() => {
    const t = setInterval(() => setCurrentAlertIndex(p => (p + 1) % systemAlerts.length), 5000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const departmentData = [
    { name: "Engineering", value: 342, fill: C.navy },
    { name: "Sales",       value: 218, fill: C.navyMid },
    { name: "Marketing",   value: 156, fill: C.steel },
    { name: "HR",          value:  89, fill: C.fog },
    { name: "Finance",     value: 124, fill: "#a3c2d7" },
    { name: "Operations",  value: 198, fill: "#c3d2e9" },
  ];

  const attendanceData = {
    All: {
      present: 1089, absent: 45, late: 55, onLeave: 58, total: 1247,
      details: [
        { name: "John Mensah",     status: "present", time: "08:45 AM", dept: "Engineering", image: "/profiles/employee4.jpg" },
        { name: "Ama Asante",      status: "late",    time: "09:15 AM", dept: "HR",          image: "/profiles/employee3.jpg" },
        { name: "Kofi Boateng",    status: "absent",  time: "-",        dept: "Sales",       image: "/profiles/employee1.jpg" },
        { name: "Abena Osei",      status: "present", time: "08:30 AM", dept: "Finance",     image: "/profiles/employee2.jpg" },
        { name: "Kwame Owusu",     status: "onLeave", time: "-",        dept: "Marketing",   image: "/profiles/employee1.jpg" },
        { name: "Sarah Johnson",   status: "present", time: "08:20 AM", dept: "Operations",  image: "/profiles/employee3.jpg" },
        { name: "Emmanuel Agyei",  status: "present", time: "08:35 AM", dept: "Engineering", image: "/profiles/employee4.jpg" },
        { name: "Grace Appiah",    status: "late",    time: "09:20 AM", dept: "Sales",       image: "/profiles/employee2.jpg" },
      ]
    },
    Engineering: { present: 312, absent: 12, late: 15, onLeave: 3, total: 342, details: [] },
    Sales:       { present: 195, absent:  8, late: 12, onLeave: 3, total: 218, details: [] },
    Marketing:   { present: 140, absent:  6, late:  8, onLeave: 2, total: 156, details: [] },
    HR:          { present:  78, absent:  4, late:  5, onLeave: 2, total:  89, details: [] },
    Finance:     { present: 110, absent:  5, late:  7, onLeave: 2, total: 124, details: [] },
    Operations:  { present: 175, absent: 10, late:  8, onLeave: 5, total: 198, details: [] },
  };

  const currentAttendance = attendanceData[selectedDepartment];

  const [tasks, setTasks] = useState([
    { id: 1, title: "Review Q1 Performance Reports", assignee: "John Mensah",  dueDate: "2026-02-05", priority: "high",   category: "review",  status: "pending",     description: "Complete quarterly performance reviews" },
    { id: 2, title: "Process February Payroll",      assignee: "Ama Serwaa",   dueDate: "2026-02-28", priority: "high",   category: "payroll", status: "pending",     description: "Run and verify payroll" },
    { id: 3, title: "Approve Leave Requests",         assignee: "Sarah Johnson",dueDate: "2026-02-10", priority: "medium", category: "leave",   status: "in-progress", description: "Review pending requests" },
  ]);

  const stats = {
    totalEmployees: 1247, activeEmployees: 1189, onLeave: 58, newHires: 23,
    totalPayroll: "2,847,534.04", pendingApprovals: 15,
    avgSalary: 2284, departmentCount: 12,
  };

  const recentActivities = [
    { id: 1, type: "payroll",   action: "Payroll processed for January 2026",                  user: "John Mensah",  image: "/profiles/employee4.jpg", time: "2 h ago",  status: "completed", details: "Processed for 1,189 employees" },
    { id: 2, type: "leave",     action: "Leave request approved for Abena Osei",               user: "Sarah Johnson",image: "/profiles/employee3.jpg", time: "3 h ago",  status: "completed", details: "Annual leave approved" },
    { id: 3, type: "employee",  action: "New employee onboarded — Kwame Boateng",              user: "HR Team",      image: "/profiles/employee1.jpg", time: "5 h ago",  status: "completed", details: "Engineering department" },
    { id: 4, type: "review",    action: "Performance review completed for Marketing",          user: "Ama Asante",   image: "/profiles/employee2.jpg", time: "6 h ago",  status: "completed", details: "Quarterly review finalised" },
    { id: 5, type: "training",  action: "Training session scheduled for new hires",            user: "Kofi Owusu",   image: "/profiles/employee1.jpg", time: "8 h ago",  status: "pending",   details: "Onboarding programme" },
  ];

  const leaveStats = [
    { type: "Annual Leave",    count: 23, percentage: 40, employees: [
      { name: "Kwame Boateng", image: "/profiles/employee1.jpg" },
      { name: "Ama Asante",    image: "/profiles/employee2.jpg" },
      { name: "John Mensah",   image: "/profiles/employee4.jpg" },
      { name: "Sarah Johnson", image: "/profiles/employee3.jpg" },
    ]},
    { type: "Sick Leave",      count: 15, percentage: 26, employees: [
      { name: "Abena Osei",    image: "/profiles/employee2.jpg" },
      { name: "Kofi Owusu",    image: "/profiles/employee1.jpg" },
      { name: "Grace Appiah",  image: "/profiles/employee3.jpg" },
      { name: "Emmanuel Agyei",image: "/profiles/employee4.jpg" },
    ]},
    { type: "Emergency Leave", count: 12, percentage: 21, employees: [
      { name: "John Mensah",   image: "/profiles/employee4.jpg" },
      { name: "Kwame Boateng", image: "/profiles/employee1.jpg" },
      { name: "Sarah Johnson", image: "/profiles/employee3.jpg" },
      { name: "Ama Asante",    image: "/profiles/employee2.jpg" },
    ]},
    { type: "Maternity Leave", count:  5, percentage:  9, employees: [
      { name: "Sarah Johnson", image: "/profiles/employee2.jpg" },
      { name: "Grace Appiah",  image: "/profiles/employee3.jpg" },
      { name: "Abena Osei",    image: "/profiles/employee1.jpg" },
      { name: "Ama Asantewaa", image: "/profiles/employee4.jpg" },
    ]},
  ];

  const topAttendees = [
    { id: 1, name: "Kwame Boateng", department: "Engineering", attendanceRate: 100, daysPresent: 22, image: "/profiles/employee1.jpg" },
    { id: 2, name: "Abena Osei",    department: "Sales",       attendanceRate: 100, daysPresent: 22, image: "/profiles/employee2.jpg" },
    { id: 3, name: "John Mensah",   department: "Marketing",   attendanceRate:  98, daysPresent: 21, image: "/profiles/employee4.jpg" },
    { id: 4, name: "Ama Asante",    department: "Finance",     attendanceRate:  98, daysPresent: 21, image: "/profiles/employee3.jpg" },
    { id: 5, name: "Kofi Owusu",    department: "Operations",  attendanceRate:  95, daysPresent: 20, image: "/profiles/employee1.jpg" },
  ];

  // ─── Utility fns ──────────────────────────────────────────────────────────
  const getPriorityColor = (p) => ({
    high:   "bg-[#2c4a6a] text-white",
    medium: "bg-[#6b8ca3] text-white",
    low:    "bg-gray-200 text-gray-700",
  }[p] ?? "bg-gray-100 text-gray-700");

  const getCategoryDot = (c) => ({
    payroll: "bg-[#2c4a6a]",
    review:  "bg-[#4a6b82]",
    leave:   "bg-[#6b8ca3]",
  }[c] ?? "bg-gray-400");

  const formatTime = (d) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const formatDate = (d) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const getDaysInMonth = (d) => {
    const y = d.getFullYear(), m = d.getMonth();
    return { daysInMonth: new Date(y, m + 1, 0).getDate(), startingDayOfWeek: new Date(y, m, 1).getDay() };
  };
  const getTasksForDate = (d) => {
    const s = d.toISOString().split("T")[0];
    return tasks.filter(t => t.dueDate === s);
  };

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const handleTaskStatusChange = (id, s) => setTasks(tasks.map(t => t.id === id ? { ...t, status: s } : t));
  const handleDeleteTask = (id) => { setTasks(tasks.filter(t => t.id !== id)); setIsTaskModalOpen(false); setSelectedTask(null); };

  const handleCreateTask = (e) => {
    e.preventDefault();
    setTasks([...tasks, { id: tasks.length + 1, ...taskFormData, status: "pending" }]);
    setIsCreateTaskModalOpen(false);
    setTaskFormData({ title: "", assignee: "", dueDate: "", priority: "medium", category: "general", description: "" });
    alert("Task created successfully!");
  };

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const calendarDays = [...Array(startingDayOfWeek).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const CustomTooltip = ({ active, payload }) => active && payload?.length ? (
    <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-200">
      <p className={T.strong}>{payload[0].payload.name}</p>
      <p className={T.body}><span className="font-semibold text-[#2c4a6a]">{payload[0].value}</span> employees</p>
      <p className={T.caption + " mt-1"}>{((payload[0].value / stats.totalEmployees) * 100).toFixed(1)}% of total</p>
    </div>
  ) : null;

  // ─── Shared panel anatomy ─────────────────────────────────────────────────
  // Both "Top Attendees" and "Recent Activity" use this exact shell so they feel
  // like siblings: same card bg, same header spacing, same row height (~68 px),
  // same avatar size (w-10 h-10), same "View All" link style.
  const PanelShell = ({ title, count, countLabel, href, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 flex flex-col">
      {/* Panel header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
        <div>
          <h2 className={T.sectionTitle}>{title}</h2>
          {count != null && (
            <p className={T.caption + " mt-0.5"}>{count} {countLabel}</p>
          )}
        </div>
        {href ? (
          <Link href={href} className="text-xs font-semibold text-[#2c4a6a] hover:text-[#1e3147] transition-colors tracking-wide uppercase">
            View all
          </Link>
        ) : (
          <button className="text-xs font-semibold text-[#2c4a6a] hover:text-[#1e3147] transition-colors tracking-wide uppercase">
            View all
          </button>
        )}
      </div>
      {/* Panel body */}
      <div className="flex-1 px-6 py-3 space-y-1">
        {children}
      </div>
    </div>
  );

  // Unified row used inside BOTH panels
  // Left: rank badge OR status dot · avatar · name+sub
  // Right: primary value · secondary value
  const PanelRow = ({ left, right }) => (
    <div className="flex items-center gap-3 py-2.5 rounded-xl px-2 -mx-2 hover:bg-gray-50 transition-colors cursor-default">
      {left}
      <div className="ml-auto flex-shrink-0">
        {right}
      </div>
    </div>
  );

  // Avatar
  const Avatar = ({ src, alt, size = "w-10 h-10" }) => (
    <div className={`relative flex-shrink-0 ${size} rounded-full overflow-hidden ring-2 ring-white`}>
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">

      {/* ── Welcome Header ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-4 ring-[#2c4a6a] flex-shrink-0">
              <Image src="/profiles/employee1.jpg" alt="Ama" fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2c4a6a] leading-tight">Welcome back, Ama!</h1>
              <p className="text-sm font-mono text-gray-500 mt-0.5">{formatTime(currentTime)} GMT</p>
              <p className={T.caption}>{formatDate(currentTime)}</p>
            </div>
          </div>

          <div className="hidden lg:block" />

          {/* Alert carousel */}
          <div className="relative">
            <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white p-4 rounded-xl">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold leading-tight">{systemAlerts[currentAlertIndex].title}</p>
                  <p className="text-xs text-white/80 mt-1 leading-snug">{systemAlerts[currentAlertIndex].message}</p>
                </div>
                <button className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex gap-1.5 justify-center">
                {systemAlerts.map((_, i) => (
                  <button key={i} onClick={() => setCurrentAlertIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${i === currentAlertIndex ? "w-5 bg-white" : "w-1.5 bg-white/35"}`} />
                ))}
              </div>
            </div>
            {/* Prev / Next */}
            {[-1, 1].map((dir) => (
              <button key={dir}
                onClick={() => setCurrentAlertIndex(p => (p + dir + systemAlerts.length) % systemAlerts.length)}
                className={`absolute top-1/2 -translate-y-1/2 ${dir === -1 ? "-left-3" : "-right-3"} w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform`}
              >
                <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dir === -1 ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className={T.body}>Here is what is happening in your company today</p>
        </div>
      </div>

      {/* ── Primary Stat Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { badge: "Current Month", label: "Total Employees",   value: stats.totalEmployees.toLocaleString(), meta: "↑ 2.3% vs last month", dark: true  },
          { badge: "Active Now",    label: "Active Employees",  value: stats.activeEmployees.toLocaleString(),meta: "↑ 1.8% vs last month", dark: false },
          { badge: "February",      label: "Monthly Payroll",   value: `GHS ${stats.totalPayroll}`,           meta: "↑ 1.9% vs last month", dark: true  },
          { badge: "Pending",       label: "Pending Approvals", value: String(stats.pendingApprovals),        meta: "↓ 3 items need attention", dark: false },
        ].map(({ badge, label, value, meta, dark }) => (
          <div key={label} className={`rounded-2xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-all ${dark ? "bg-gradient-to-br from-[#2c4a6a] to-[#1e3147]" : "bg-gradient-to-br from-[#3d5a7c] to-[#2c4a6a]"} text-white`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold bg-white/90 text-[#2c4a6a] px-2.5 py-1 rounded-full tracking-wide">{badge}</span>
              <button className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <div className="my-5">
              <p className={T.cardLabel}>{label}</p>
              <p className="text-2xl font-bold tracking-tight mt-1 leading-tight">{value}</p>
              <p className={T.cardMeta + " mt-1.5"}>{meta}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Secondary Stat Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { bg: C.iceA, iconBg: C.navy,    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Avg. Salary",    value: `GHS ${stats.avgSalary.toLocaleString()}`, meta: "Per employee" },
          { bg: C.iceB, iconBg: C.navyMid, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", label: "Departments",   value: String(stats.departmentCount),           meta: "Active departments" },
          { bg: C.iceA, iconBg: C.navy,    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",                                                         label: "On Leave Today", value: String(stats.onLeave),                    meta: `${((stats.onLeave / stats.totalEmployees) * 100).toFixed(1)}% of workforce` },
          { bg: C.iceB, iconBg: C.navyMid, icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",                                                          label: "New Hires",      value: String(stats.newHires),                   meta: "This month" },
        ].map(({ bg, iconBg, icon, label, value, meta }) => (
          <div key={label} style={{ background: bg }} className="rounded-xl p-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: iconBg }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
              </svg>
            </div>
            <p className={T.caption + " font-medium text-gray-600 mb-1"}>{label}</p>
            <p className="text-2xl font-bold text-[#1e3147] leading-tight">{value}</p>
            <p className={T.caption + " mt-1"}>{meta}</p>
          </div>
        ))}
      </div>

      {/* ── Charts ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PayrollChart />

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={T.sectionTitle}>Department Distribution</h2>
            <span className={T.caption}>{stats.totalEmployees.toLocaleString()} employees</span>
          </div>
          <div className="h-[350px] relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <svg className="w-9 h-9 text-[#2c4a6a]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" barSize={13} data={departmentData} startAngle={90} endAngle={-270}>
                <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={5} label={{ position: "insideStart", fill: "#fff", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Legend iconSize={9} layout="horizontal" verticalAlign="bottom" align="center"
                  wrapperStyle={{ paddingTop: "16px" }}
                  formatter={(_, entry) => (
                    <span className="text-xs text-gray-600">{entry.payload.name} ({entry.payload.value})</span>
                  )}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Today's Attendance ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className={T.sectionTitle}>Today's Attendance</h2>
            <p className={T.caption + " mt-0.5"}>{formatDate(currentTime)}</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white">
              {["All","Engineering","Sales","Marketing","HR","Finance","Operations"].map(d => (
                <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>
              ))}
            </select>
            <Link href="/attendance">
              <button className="px-4 py-2 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-lg text-sm font-medium transition-colors">View All</button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Present",  value: currentAttendance.present,  total: currentAttendance.total, tint: "from-[#2c4a6a]/10 to-[#2c4a6a]/5 border-[#2c4a6a]/25", lc: "text-[#2c4a6a]" },
            { label: "Absent",   value: currentAttendance.absent,   total: currentAttendance.total, tint: "from-gray-50 to-gray-50 border-gray-200",               lc: "text-gray-500" },
            { label: "Late",     value: currentAttendance.late,     total: currentAttendance.total, tint: "from-[#6b8ca3]/10 to-[#6b8ca3]/5 border-[#6b8ca3]/25", lc: "text-[#6b8ca3]" },
            { label: "On Leave", value: currentAttendance.onLeave,  total: currentAttendance.total, tint: "from-gray-50 to-gray-50 border-gray-200",               lc: "text-gray-500" },
          ].map(({ label, value, total, tint, lc }) => (
            <div key={label} className={`bg-gradient-to-br ${tint} rounded-xl p-4 border`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${lc} opacity-70`}>{label}</p>
              <p className={T.heroNum}>{value}</p>
              <p className={`text-xs mt-1 ${lc} opacity-50`}>{((value / total) * 100).toFixed(0)}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Calendar & Task Management ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className={T.sectionTitle}>Task Calendar</h2>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm font-semibold text-gray-800 w-36 text-center">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {dayNames.map(d => (
              <div key={d} className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide py-2">{d}</div>
            ))}
            {calendarDays.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`} className="aspect-square" />;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const tasksForDay = getTasksForDate(date);
              const isToday    = date.toDateString() === new Date().toDateString();
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
              return (
                <div key={day} onClick={() => setSelectedDate(date)}
                  className={`aspect-square p-1.5 rounded-lg border cursor-pointer transition-all ${
                    isToday    ? "bg-[#2c4a6a] border-[#2c4a6a]" :
                    isSelected ? "bg-[#2c4a6a]/10 border-[#2c4a6a]" :
                    tasksForDay.length ? "bg-gray-50 border-gray-200 hover:bg-gray-100" :
                                         "border-gray-100 hover:bg-gray-50"
                  }`}>
                  <span className={`text-xs font-semibold ${isToday ? "text-white" : "text-gray-800"}`}>{day}</span>
                  {tasksForDay.length > 0 && (
                    <div className="mt-0.5 flex gap-0.5 flex-wrap">
                      {tasksForDay.slice(0, 3).map(t => (
                        <span key={t.id} className={`w-1.5 h-1.5 rounded-full ${getCategoryDot(t.category)}`} />
                      ))}
                      {tasksForDay.length > 3 && (
                        <span className={`text-[9px] leading-none ${isToday ? "text-white" : "text-gray-400"}`}>+{tasksForDay.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-5 border-t border-gray-100">
            <button onClick={() => setIsCreateTaskModalOpen(true)}
              className="w-full py-2.5 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Assign New Task
            </button>
          </div>
        </div>

        {/* Task list */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={T.sectionTitle}>
              Tasks{selectedDate && ` · ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
            </h2>
            <span className={T.caption}>
              {(selectedDate ? getTasksForDate(selectedDate) : tasks.filter(t => t.status === "pending")).length} tasks
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {(() => {
              const list = selectedDate ? getTasksForDate(selectedDate) : tasks.filter(t => t.status === "pending");
              if (!list.length) return (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className={T.caption}>No tasks for this day</p>
                </div>
              );
              return list.map(task => (
                <div key={task.id} onClick={() => { setSelectedTask(task); setIsTaskModalOpen(true); }}
                  className="p-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold text-gray-900 leading-snug flex-1">{task.title}</p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getCategoryDot(task.category)}`} />
                      <span className={T.caption + " capitalize"}>{task.category}</span>
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      task.status === "completed"   ? "bg-[#2c4a6a]/10 text-[#2c4a6a]" :
                      task.status === "in-progress" ? "bg-[#6b8ca3]/10 text-[#6b8ca3]" :
                      "bg-gray-200 text-gray-600"
                    }`}>{task.status}</span>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* ── Top Attendees + Recent Activity ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Top Attendees */}
        <PanelShell title="Top Attendees" count={topAttendees.length} countLabel="this month" href="/attendance">
          {topAttendees.map((a, i) => (
            <PanelRow key={a.id}
              left={
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-[#2c4a6a]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-bold text-[#2c4a6a]">{i + 1}</span>
                  </span>
                  <Avatar src={a.image} alt={a.name} />
                  <div className="min-w-0">
                    <p className={T.strong + " truncate"}>{a.name}</p>
                    <p className={T.caption + " truncate"}>{a.department}</p>
                  </div>
                </div>
              }
              right={
                <div className="text-right">
                  <p className="text-sm font-bold text-[#2c4a6a] leading-tight">{a.attendanceRate}%</p>
                  <p className={T.caption}>{a.daysPresent}/22 days</p>
                </div>
              }
            />
          ))}
        </PanelShell>

        {/* Recent Activity */}
        <PanelShell title="Recent Activity" count={recentActivities.length} countLabel="latest events">
          {recentActivities.map((act) => (
            <PanelRow key={act.id}
              left={
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={act.image} alt={act.user} />
                  <div className="min-w-0">
                    <p className={T.strong + " truncate leading-tight"}>{act.action}</p>
                    <p className={T.caption + " truncate"}>{act.user} · {act.time}</p>
                  </div>
                </div>
              }
              right={
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap
                  ${act.status === "completed"
                    ? "bg-[#2c4a6a]/10 text-[#2c4a6a]"
                    : "bg-[#6b8ca3]/10 text-[#6b8ca3]"
                  }`}>
                  {act.status === "completed" ? "Done" : "Pending"}
                </span>
              }
            />
          ))}
        </PanelShell>

      </div>

      {/* ── Leave Distribution ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className={T.sectionTitle}>Leave Distribution</h2>
          <span className={T.caption}>{stats.onLeave} on leave</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {leaveStats.map((leave, i) => (
            <div key={i} onClick={() => { setSelectedLeaveType(leave); setLeaveModalOpen(true); }}
              className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{leave.type}</p>
                <span className="text-sm font-bold text-[#2c4a6a]">{leave.count}</span>
              </div>
              <div className="flex items-center -space-x-2 mb-3">
                {leave.employees.map((emp, idx) => (
                  <div key={idx} className="relative w-7 h-7 rounded-full overflow-hidden ring-2 ring-white">
                    <Image src={emp.image} alt={emp.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#6b8ca3] to-[#2c4a6a] rounded-full" style={{ width: `${leave.percentage}%` }} />
                </div>
                <span className={T.caption + " font-medium w-8 text-right"}>{leave.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODALS ─────────────────────────────────────────────────────────── */}
      {/* Leave modal */}
      {leaveModalOpen && selectedLeaveType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-base font-bold">{selectedLeaveType.type}</h2>
              <button onClick={() => setLeaveModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex flex-col items-center pb-5 border-b border-gray-100">
                <p className={T.caption + " mb-3"}>Employees on this leave</p>
                <div className="flex items-center -space-x-3">
                  {selectedLeaveType.employees.map((emp, i) => (
                    <div key={i} className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-white">
                      <Image src={emp.image} alt={emp.name} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2c4a6a]/8 rounded-xl p-4">
                  <p className={T.caption + " mb-1"}>Total Count</p>
                  <p className="text-3xl font-bold text-[#2c4a6a] leading-none">{selectedLeaveType.count}</p>
                </div>
                <div className="bg-[#6b8ca3]/8 rounded-xl p-4">
                  <p className={T.caption + " mb-1"}>Percentage</p>
                  <p className="text-3xl font-bold text-[#6b8ca3] leading-none">{selectedLeaveType.percentage}%</p>
                </div>
              </div>
              <button onClick={() => setLeaveModalOpen(false)}
                className="w-full py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-xl text-sm font-semibold transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create task modal */}
      {isCreateTaskModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-base font-bold">Assign New Task</h2>
              <button onClick={() => setIsCreateTaskModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Task Title *</label>
                <input type="text" value={taskFormData.title} onChange={e => setTaskFormData({...taskFormData, title: e.target.value})}
                  required placeholder="Enter task title"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Assign To", key: "assignee", type: "select", options: ["","John Mensah","Ama Serwaa","Sarah Johnson","Kofi Boateng","Efua Addo"], placeholder: "Select assignee" },
                  { label: "Due Date",  key: "dueDate",  type: "date" },
                  { label: "Priority",  key: "priority", type: "select", options: ["low","medium","high"] },
                  { label: "Category",  key: "category", type: "select", options: ["general","payroll","review","leave","compliance","training","benefits","meeting","admin"] },
                ].map(({ label, key, type, options, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{label} *</label>
                    {type === "select" ? (
                      <select value={taskFormData[key]} onChange={e => setTaskFormData({...taskFormData, [key]: e.target.value})}
                        required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white capitalize">
                        {options.map(o => <option key={o} value={o}>{o || placeholder}</option>)}
                      </select>
                    ) : (
                      <input type={type} value={taskFormData[key]} onChange={e => setTaskFormData({...taskFormData, [key]: e.target.value})}
                        required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]" />
                    )}
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description</label>
                <textarea value={taskFormData.description} onChange={e => setTaskFormData({...taskFormData, description: e.target.value})}
                  rows={4} placeholder="Enter task description…"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] resize-none" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setIsCreateTaskModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task detail modal */}
      {isTaskModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="text-base font-bold">Task Details</h2>
                <p className="text-xs text-white/70 mt-0.5">Task #{selectedTask.id}</p>
              </div>
              <button onClick={() => { setIsTaskModalOpen(false); setSelectedTask(null); }} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">{selectedTask.title}</h3>
                <p className={T.body + " mt-2"}>{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Assigned To", value: selectedTask.assignee },
                  { label: "Due Date",    value: new Date(selectedTask.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4">
                    <p className={T.caption + " mb-1"}>{label}</p>
                    <p className="text-sm font-semibold text-gray-900">{value}</p>
                  </div>
                ))}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className={T.caption + " mb-1.5"}>Priority</p>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${getPriorityColor(selectedTask.priority)}`}>{selectedTask.priority}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className={T.caption + " mb-1.5"}>Category</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${getCategoryDot(selectedTask.category)}`} />
                    <p className="text-sm font-semibold text-gray-900 capitalize">{selectedTask.category}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                  <p className={T.caption + " mb-2"}>Status</p>
                  <select value={selectedTask.status} onChange={e => handleTaskStatusChange(selectedTask.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button onClick={() => handleDeleteTask(selectedTask.id)}
                  className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-semibold transition-colors">Delete</button>
                <button onClick={() => { setIsTaskModalOpen(false); setSelectedTask(null); }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}