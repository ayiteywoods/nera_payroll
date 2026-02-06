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
  
  // New state for modals
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  
  // Email states
  const [emailView, setEmailView] = useState('inbox'); // 'inbox', 'compose', 'drafts', 'sent'
  const [emails, setEmails] = useState([
    { id: 1, from: "Abena Osei", subject: "Payroll Review Needed", preview: "Please review the payroll for March 2025...", date: "2 hours ago", read: false, important: true },
    { id: 2, from: "Kofi Owusu", subject: "Leave Request Approved", preview: "Your annual leave request has been approved...", date: "1 day ago", read: true, important: false },
    { id: 3, from: "System", subject: "Monthly Report Ready", preview: "Your monthly HR analytics report is ready...", date: "2 days ago", read: false, important: false },
  ]);
  const [drafts, setDrafts] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [composeEmail, setComposeEmail] = useState({ to: "", subject: "", body: "" });
  
  // Message states
  const [messages, setMessages] = useState([
    { id: 1, name: "Ama Asante", avatar: "/profile.png", lastMessage: "Can we discuss the new project?", time: "10:30 AM", unread: 2, online: true },
    { id: 2, name: "John Mensah", avatar: "/profile.png", lastMessage: "Thanks for the update!", time: "Yesterday", unread: 1, online: false },
    { id: 3, name: "Kwame Boateng", avatar: "/profile.png", lastMessage: "See you at the meeting", time: "2 days ago", unread: 1, online: true },
  ]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  
  // Profile states
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    position: "HR",
    email: "john.doe@company.com",
    phone: "+233 24 123 4567",
    department: "Human Resources",
    avatar: "/profile.png"
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempProfileData, setTempProfileData] = useState(profileData);
  
  // Notification states
  const [notifications, setNotifications] = useState([
    { id: 1, type: "task", title: "New Task Assigned", message: "Review Q1 Performance Reports", time: "5 mins ago", read: false },
    { id: 2, type: "leave", title: "Leave Request", message: "Ama Asante requested 3 days leave", time: "1 hour ago", read: false },
    { id: 3, type: "update", title: "System Update", message: "New payroll module available", time: "2 hours ago", read: false },
    { id: 4, type: "leave", title: "Leave Approved", message: "Your leave request was approved", time: "1 day ago", read: true },
  ]);
  
  const searchRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Comprehensive search data
  const searchableContent = [
    { id: 1, title: "Dashboard", type: "page", path: "/dashboard", description: "View analytics and overview" },
    { id: 2, title: "Total Payroll", type: "metric", path: "/dashboard", description: "₵ 125,430 - Net salaries paid" },
    { id: 3, title: "Employee Statistics", type: "metric", path: "/dashboard", description: "87 employees paid this month" },
    { id: 4, title: "Employee Management", type: "page", path: "/employees", description: "Manage workforce and employee information" },
    { id: 5, title: "Add New Employee", type: "action", path: "/employees?action=add", description: "Create new employee record" },
    { id: 6, title: "John Mensah", type: "employee", path: "/employees?id=EMP001", description: "Senior Software Engineer - Engineering" },
    { id: 7, title: "Ama Asante", type: "employee", path: "/employees?id=EMP004", description: "Product Designer - Engineering" },
    { id: 8, title: "Abena Osei", type: "employee", path: "/employees?id=EMP002", description: "HR Manager - HR" },
    { id: 9, title: "Kofi Owusu", type: "employee", path: "/employees?id=EMP005", description: "Accountant - Management" },
    { id: 10, title: "Kwame Boateng", type: "employee", path: "/employees?id=EMP003", description: "Sales Executive - Sales" },
    { id: 11, title: "Payroll Management", type: "page", path: "/payroll", description: "Process and manage employee payrolls" },
    { id: 12, title: "Process New Payroll", type: "action", path: "/payroll?action=process", description: "Run payroll for current period" },
    { id: 13, title: "March 2025 Payroll", type: "payroll", path: "/payroll?id=PAY001", description: "₵ 157,230 - 87 employees - Completed" },
    { id: 14, title: "February 2025 Payroll", type: "payroll", path: "/payroll?id=PAY002", description: "₵ 151,400 - 85 employees - Completed" },
    { id: 15, title: "Payroll Reports", type: "report", path: "/reports/payroll", description: "Generate payroll reports" },
    { id: 16, title: "Leave Management", type: "page", path: "/leave", description: "Manage employee leave requests" },
    { id: 17, title: "Create Leave Request", type: "action", path: "/leave?action=create", description: "Submit new leave request" },
    { id: 18, title: "Pending Leave Requests", type: "filter", path: "/leave?filter=pending", description: "View all pending leave requests" },
    { id: 19, title: "Approved Leaves", type: "filter", path: "/leave?filter=approved", description: "View approved leave requests" },
    { id: 20, title: "Annual Leave", type: "leave-type", path: "/leave?type=annual", description: "Annual leave requests" },
    { id: 21, title: "Sick Leave", type: "leave-type", path: "/leave?type=sick", description: "Sick leave requests" },
    { id: 22, title: "Recruitment", type: "page", path: "/recruitment", description: "Manage jobs, applications, and candidates" },
    { id: 23, title: "Create New Job", type: "action", path: "/recruitment/jobs?action=create", description: "Post a new job opening" },
    { id: 24, title: "Senior Software Engineer", type: "job", path: "/recruitment/jobs?id=JOB001", description: "Engineering - Full-Time - Open" },
    { id: 25, title: "HR Manager", type: "job", path: "/recruitment/jobs?id=JOB002", description: "HR - Full-Time - Open" },
    { id: 26, title: "Sales Executive", type: "job", path: "/recruitment/jobs?id=JOB003", description: "Sales - Contract - Closed" },
    { id: 27, title: "Applications", type: "filter", path: "/recruitment?tab=applications", description: "View all job applications" },
    { id: 28, title: "Candidates", type: "filter", path: "/recruitment?tab=candidates", description: "View talent pool" },
    { id: 29, title: "Benefits & Deductions", type: "page", path: "/benefits", description: "Manage employee benefits and deductions" },
    { id: 30, title: "SSNIT Contributions", type: "deduction", path: "/benefits?type=ssnit", description: "Social security contributions" },
    { id: 31, title: "Tax Deductions", type: "deduction", path: "/benefits?type=tax", description: "PAYE tax deductions" },
    { id: 32, title: "Health Insurance", type: "benefit", path: "/benefits?type=health", description: "Employee health benefits" },
    { id: 33, title: "Payroll Reports", type: "report", path: "/reports/payroll", description: "Generate and download payroll reports" },
    { id: 34, title: "Payslips", type: "report", path: "/reports/payslips", description: "Generate employee payslips" },
    { id: 35, title: "Tax & Deductions Report", type: "report", path: "/reports/tax", description: "Tax and deduction reports" },
    { id: 36, title: "SSNIT / Tax Compliance", type: "page", path: "/compliance", description: "Manage compliance and submissions" },
    { id: 37, title: "PAYE Submissions", type: "compliance", path: "/compliance?type=paye", description: "Tax submissions and status" },
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

  // Email functions
  const handleSendEmail = () => {
    if (!composeEmail.to || !composeEmail.subject || !composeEmail.body) {
      alert("Please fill in all fields");
      return;
    }

    const newEmail = {
      id: sentEmails.length + 1,
      to: composeEmail.to,
      subject: composeEmail.subject,
      body: composeEmail.body,
      date: "Just now",
    };

    setSentEmails([newEmail, ...sentEmails]);
    setComposeEmail({ to: "", subject: "", body: "" });
    setEmailView('sent');
    alert("Email sent successfully!");
  };

  const handleSaveDraft = () => {
    const draft = {
      id: drafts.length + 1,
      to: composeEmail.to,
      subject: composeEmail.subject || "(No Subject)",
      body: composeEmail.body,
      date: "Just now",
    };

    setDrafts([draft, ...drafts]);
    setComposeEmail({ to: "", subject: "", body: "" });
    setEmailView('drafts');
    alert("Draft saved successfully!");
  };

  const handleLoadDraft = (draft) => {
    setComposeEmail({
      to: draft.to,
      subject: draft.subject === "(No Subject)" ? "" : draft.subject,
      body: draft.body,
    });
    setEmailView('compose');
    setDrafts(drafts.filter(d => d.id !== draft.id));
  };

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setEmails(emails.map(e => e.id === email.id ? { ...e, read: true } : e));
  };

  // Message functions
  const handleSelectChat = (message) => {
    setSelectedChat(message);
    // Simulate loading chat history
    setChatMessages([
      { id: 1, text: message.lastMessage, sender: "them", time: message.time },
      { id: 2, text: "Sure, let's schedule it!", sender: "me", time: "10:35 AM" },
    ]);
    // Mark as read
    setMessages(messages.map(m => m.id === message.id ? { ...m, unread: 0 } : m));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const newMsg = {
      id: chatMessages.length + 1,
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages([...chatMessages, newMsg]);
    setNewMessage("");

    // Update last message in conversation list
    setMessages(messages.map(m => 
      m.id === selectedChat.id 
        ? { ...m, lastMessage: newMessage, time: "Just now" } 
        : m
    ));
  };

  // Profile functions
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfileData({ ...tempProfileData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setProfileData(tempProfileData);
    setEditingProfile(false);
    alert("Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setTempProfileData(profileData);
    setEditingProfile(false);
  };

  // Notification functions
  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const totalUnreadMessages = messages.reduce((sum, m) => sum + m.unread, 0);
  const unreadEmails = emails.filter(e => !e.read).length;

  // Close modals on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSearchResults([]);
      }
      if (emailRef.current && !emailRef.current.contains(event.target)) {
        setEmailModalOpen(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setMessageModalOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileModalOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationModalOpen(false);
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

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case "task":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case "leave":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "update":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
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
          <div className="flex items-center gap-3 md:gap-4 lg:gap-6 ml-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationModalOpen(!notificationModalOpen)}
                className="bg-[#c3d2e9] w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#b0c4e2] transition"
              >
                <svg className="w-5 h-5 text-[#153361]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              {unreadNotifications > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500 text-white rounded-full text-[10px] font-semibold">
                  {unreadNotifications}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <button 
                onClick={() => setEmailModalOpen(!emailModalOpen)}
                className="bg-[#c3d2e9] w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#b0c4e2] transition"
              >
                <Image src="/email.png" alt="Email" width={20} height={20} />
              </button>
              {unreadEmails > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-[#153361] text-white rounded-full text-[10px] font-semibold">
                  {unreadEmails}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="relative">
              <button 
                onClick={() => setMessageModalOpen(!messageModalOpen)}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
              >
                <Image src="/messages.png" alt="Messages" width={20} height={20} />
              </button>
              {totalUnreadMessages > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-[#153361] text-white rounded-full text-[10px] font-semibold">
                  +{totalUnreadMessages}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-medium leading-3">{profileData.name}</span>
              <span className="text-[10px] text-gray-500 font-bold">{profileData.position}</span>
            </div>

            {/* Profile Image */}
            <button onClick={() => setProfileModalOpen(!profileModalOpen)}>
              <Image
                src={profileData.avatar}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full cursor-pointer hover:ring-2 hover:ring-[#2c4a6a] transition"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ===== EMAIL MODAL ===== */}
      {emailModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-start justify-center pt-20 px-4">
          <div ref={emailRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Email</h2>
              <button 
                onClick={() => setEmailModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-48 border-r border-gray-200 p-4 space-y-2 overflow-y-auto">
                <button
                  onClick={() => { setEmailView('compose'); setSelectedEmail(null); }}
                  className="w-full bg-[#153361] text-white px-4 py-2 rounded-lg hover:bg-[#1f4575] transition text-sm font-medium"
                >
                  Compose
                </button>
                <button
                  onClick={() => { setEmailView('inbox'); setSelectedEmail(null); }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition text-sm ${emailView === 'inbox' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                >
                  Inbox ({unreadEmails})
                </button>
                <button
                  onClick={() => { setEmailView('sent'); setSelectedEmail(null); }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition text-sm ${emailView === 'sent' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                >
                  Sent
                </button>
                <button
                  onClick={() => { setEmailView('drafts'); setSelectedEmail(null); }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition text-sm ${emailView === 'drafts' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                >
                  Drafts ({drafts.length})
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                {/* Compose Email */}
                {emailView === 'compose' && (
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold">New Message</h3>
                    <div>
                      <label className="block text-sm font-medium mb-1">To:</label>
                      <input
                        type="email"
                        value={composeEmail.to}
                        onChange={(e) => setComposeEmail({ ...composeEmail, to: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153361] focus:border-transparent"
                        placeholder="recipient@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject:</label>
                      <input
                        type="text"
                        value={composeEmail.subject}
                        onChange={(e) => setComposeEmail({ ...composeEmail, subject: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153361] focus:border-transparent"
                        placeholder="Email subject"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Message:</label>
                      <textarea
                        value={composeEmail.body}
                        onChange={(e) => setComposeEmail({ ...composeEmail, body: e.target.value })}
                        rows={10}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153361] focus:border-transparent resize-none"
                        placeholder="Write your message..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSendEmail}
                        className="bg-[#153361] text-white px-6 py-2 rounded-lg hover:bg-[#1f4575] transition font-medium"
                      >
                        Send Email
                      </button>
                      <button
                        onClick={handleSaveDraft}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                      >
                        Save as Draft
                      </button>
                    </div>
                  </div>
                )}

                {/* Inbox */}
                {emailView === 'inbox' && !selectedEmail && (
                  <div className="p-4">
                    {emails.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500">No emails in inbox</p>
                      </div>
                    ) : (
                      emails.map((email) => (
                        <div
                          key={email.id}
                          onClick={() => handleEmailClick(email)}
                          className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition ${!email.read ? 'bg-blue-50' : ''}`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <span className={`font-semibold ${!email.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {email.from}
                            </span>
                            <span className="text-xs text-gray-500">{email.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`text-sm ${!email.read ? 'font-semibold' : ''}`}>{email.subject}</p>
                            {email.important && (
                              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{email.preview}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Email Detail View */}
                {emailView === 'inbox' && selectedEmail && (
                  <div className="p-6">
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to inbox
                    </button>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{selectedEmail.subject}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>From: <strong>{selectedEmail.from}</strong></span>
                          <span>{selectedEmail.date}</span>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-700">{selectedEmail.preview}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sent Emails */}
                {emailView === 'sent' && (
                  <div className="p-4">
                    {sentEmails.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <p className="text-gray-500">No sent emails</p>
                      </div>
                    ) : (
                      sentEmails.map((email) => (
                        <div key={email.id} className="p-4 border-b border-gray-200 hover:bg-gray-50">
                          <div className="flex items-start justify-between mb-1">
                            <span className="font-semibold text-gray-700">To: {email.to}</span>
                            <span className="text-xs text-gray-500">{email.date}</span>
                          </div>
                          <p className="text-sm font-medium mb-1">{email.subject}</p>
                          <p className="text-sm text-gray-600 truncate">{email.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Drafts */}
                {emailView === 'drafts' && (
                  <div className="p-4">
                    {drafts.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500">No draft emails</p>
                      </div>
                    ) : (
                      drafts.map((draft) => (
                        <div
                          key={draft.id}
                          onClick={() => handleLoadDraft(draft)}
                          className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <span className="font-semibold text-gray-700">To: {draft.to || "(No recipient)"}</span>
                            <span className="text-xs text-gray-500">{draft.date}</span>
                          </div>
                          <p className="text-sm font-medium mb-1">{draft.subject}</p>
                          <p className="text-sm text-gray-600 truncate">{draft.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MESSAGES MODAL ===== */}
      {messageModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-start justify-center pt-20 px-4">
          <div ref={messageRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex">
            {/* Conversations List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                  <button 
                    onClick={() => setMessageModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153361] focus:border-transparent text-sm"
                />
              </div>
              <div className="flex-1 overflow-y-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectChat(msg)}
                    className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition ${selectedChat?.id === msg.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={msg.avatar}
                          alt={msg.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        {msg.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{msg.name}</span>
                          <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">{msg.lastMessage}</p>
                          {msg.unread > 0 && (
                            <span className="bg-[#153361] text-white text-xs px-2 py-0.5 rounded-full ml-2">
                              {msg.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={selectedChat.avatar}
                        alt={selectedChat.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      {selectedChat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedChat.name}</h3>
                      <p className="text-xs text-gray-500">{selectedChat.online ? 'Active now' : 'Offline'}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-2xl ${
                            msg.sender === 'me'
                              ? 'bg-[#153361] text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-gray-300' : 'text-gray-500'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#153361] focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-[#153361] text-white p-3 rounded-full hover:bg-[#1f4575] transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-500 font-medium">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== PROFILE MODAL ===== */}
      {profileModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-start justify-center pt-20 px-4">
          <div ref={profileRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Profile</h2>
              <button 
                onClick={() => setProfileModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Image
                    src={editingProfile ? tempProfileData.avatar : profileData.avatar}
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-gray-200"
                  />
                  {editingProfile && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-[#153361] text-white p-2 rounded-full hover:bg-[#1f4575] transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </div>
                {editingProfile && (
                  <p className="text-xs text-gray-500 mt-2">Click camera icon to change photo</p>
                )}
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  {editingProfile ? (
                    <input
                      type="text"
                      value={tempProfileData.name}
                      onChange={(e) => setTempProfileData({ ...tempProfileData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153361] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700 px-4 py-2 bg-gray-50 rounded-lg">{profileData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Position</label>
                  {editingProfile ? (
                    <input
                      type="text"
                      value={tempProfileData.position}
                      onChange={(e) => setTempProfileData({ ...tempProfileData, position: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153361] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700 px-4 py-2 bg-gray-50 rounded-lg">{profileData.position}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  {editingProfile ? (
                    <input
                      type="email"
                      value={tempProfileData.email}
                      onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153361] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700 px-4 py-2 bg-gray-50 rounded-lg">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  {editingProfile ? (
                    <input
                      type="tel"
                      value={tempProfileData.phone}
                      onChange={(e) => setTempProfileData({ ...tempProfileData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153361] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700 px-4 py-2 bg-gray-50 rounded-lg">{profileData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  {editingProfile ? (
                    <input
                      type="text"
                      value={tempProfileData.department}
                      onChange={(e) => setTempProfileData({ ...tempProfileData, department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153361] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700 px-4 py-2 bg-gray-50 rounded-lg">{profileData.department}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {editingProfile ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-[#153361] text-white px-6 py-2 rounded-lg hover:bg-[#1f4575] transition font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="w-full bg-[#153361] text-white px-6 py-2 rounded-lg hover:bg-[#1f4575] transition font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== NOTIFICATIONS MODAL ===== */}
      {notificationModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-start justify-center pt-20 px-4">
          <div ref={notificationRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <div className="flex items-center gap-2">
                {unreadNotifications > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-[#153361] hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
                <button 
                  onClick={() => setNotificationModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="text-gray-500">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'task' ? 'bg-blue-100 text-blue-600' :
                        notification.type === 'leave' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className={`font-semibold text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;