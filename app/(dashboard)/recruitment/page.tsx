"use client";

import React, { useState } from "react";

// Sample data - replace with your API data
const initialJobs = [
  {
    id: "JOB001",
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Accra, Ghana",
    type: "Full-Time",
    experience: "5+ years",
    salary: "₵8,000 - ₵12,000",
    status: "Open",
    postedDate: "2025-01-15",
    deadline: "2025-02-28",
    applicants: 24,
    description: "We are looking for an experienced software engineer to join our team.",
  },
  {
    id: "JOB002",
    title: "HR Manager",
    department: "HR",
    location: "Accra, Ghana",
    type: "Full-Time",
    experience: "3+ years",
    salary: "₵6,000 - ₵9,000",
    status: "Open",
    postedDate: "2025-01-20",
    deadline: "2025-03-15",
    applicants: 15,
    description: "Seeking an HR professional to manage employee relations.",
  },
  {
    id: "JOB003",
    title: "Sales Executive",
    department: "Sales",
    location: "Kumasi, Ghana",
    type: "Contract",
    experience: "2+ years",
    salary: "₵4,000 - ₵6,000",
    status: "Closed",
    postedDate: "2025-01-10",
    deadline: "2025-02-10",
    applicants: 32,
    description: "Looking for a motivated sales professional.",
  },
];

const initialApplications = [
  {
    id: "APP001",
    jobId: "JOB001",
    jobTitle: "Senior Software Engineer",
    candidateName: "Kwame Asante",
    email: "kwame.asante@email.com",
    phone: "+233 24 123 4567",
    appliedDate: "2025-01-20",
    status: "Under Review",
    resumeUrl: "#",
    coverLetter: "I am very interested in this position...",
  },
  {
    id: "APP002",
    jobId: "JOB001",
    jobTitle: "Senior Software Engineer",
    candidateName: "Abena Mensah",
    email: "abena.mensah@email.com",
    phone: "+233 24 234 5678",
    appliedDate: "2025-01-22",
    status: "Shortlisted",
    resumeUrl: "#",
    coverLetter: "With 7 years of experience...",
  },
  {
    id: "APP003",
    jobId: "JOB002",
    jobTitle: "HR Manager",
    candidateName: "Yaw Boateng",
    email: "yaw.boateng@email.com",
    phone: "+233 24 345 6789",
    appliedDate: "2025-01-25",
    status: "Rejected",
    resumeUrl: "#",
    coverLetter: "I have extensive HR experience...",
  },
];

const initialCandidates = [
  {
    id: "CAN001",
    name: "Kwame Asante",
    email: "kwame.asante@email.com",
    phone: "+233 24 123 4567",
    skills: ["JavaScript", "React", "Node.js", "Python"],
    experience: "6 years",
    location: "Accra, Ghana",
    status: "Active",
    registeredDate: "2025-01-15",
    applications: 2,
  },
  {
    id: "CAN002",
    name: "Abena Mensah",
    email: "abena.mensah@email.com",
    phone: "+233 24 234 5678",
    skills: ["Java", "Spring Boot", "AWS", "Docker"],
    experience: "7 years",
    location: "Accra, Ghana",
    status: "Active",
    registeredDate: "2025-01-18",
    applications: 3,
  },
  {
    id: "CAN003",
    name: "Yaw Boateng",
    email: "yaw.boateng@email.com",
    phone: "+233 24 345 6789",
    skills: ["HR Management", "Recruitment", "Employee Relations"],
    experience: "4 years",
    location: "Kumasi, Ghana",
    status: "Inactive",
    registeredDate: "2025-01-10",
    applications: 1,
  },
];

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState("jobs"); // jobs, applications, candidates
  const [jobs, setJobs] = useState(initialJobs);
  const [applications, setApplications] = useState(initialApplications);
  const [candidates, setCandidates] = useState(initialCandidates);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [isApplyJobModalOpen, setIsApplyJobModalOpen] = useState(false);
  const [isSignupCandidateModalOpen, setIsSignupCandidateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Form states
  const [jobFormData, setJobFormData] = useState({
    title: "", department: "", location: "", type: "", experience: "",
    salary: "", description: "", requirements: "", deadline: "",
  });

  const [applicationFormData, setApplicationFormData] = useState({
    jobId: "", candidateName: "", email: "", phone: "",
    coverLetter: "", resumeFile: null,
  });

  const [candidateFormData, setCandidateFormData] = useState({
    name: "", email: "", phone: "", skills: "", experience: "",
    location: "", education: "", portfolio: "",
  });

  const getStatusColor = (status) => {
    switch(status) {
      case "Open":
      case "Active":
      case "Shortlisted":
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Under Review":
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Closed":
      case "Inactive":
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // API Functions for Jobs
  const handleFetchAllJobs = () => {
    console.log("GET: Fetch all jobs");
    alert("Fetching all jobs from API...");
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    console.log("POST: Create new job", jobFormData);
    
    const newJob = {
      id: `JOB${String(jobs.length + 1).padStart(3, '0')}`,
      ...jobFormData,
      status: "Open",
      postedDate: new Date().toISOString().split('T')[0],
      applicants: 0,
    };

    setJobs([newJob, ...jobs]);
    setIsCreateJobModalOpen(false);
    setJobFormData({
      title: "", department: "", location: "", type: "", experience: "",
      salary: "", description: "", requirements: "", deadline: "",
    });
    alert("Job created successfully!");
  };

  const handleUpdateJob = (jobId) => {
    console.log("POST: Update job", jobId);
    alert(`Updating job ${jobId}...`);
  };

  const handleDeleteJob = () => {
    console.log("DELETE: Delete job", selectedItem.id);
    setJobs(jobs.filter(job => job.id !== selectedItem.id));
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
    alert("Job deleted successfully!");
  };

  // API Functions for Applications
  const handleFetchAllApplications = () => {
    console.log("GET: Fetch all applications");
    alert("Fetching all applications from API...");
  };

  const handleApplyJob = (e) => {
    e.preventDefault();
    console.log("POST: Apply for job", applicationFormData);
    
    const newApplication = {
      id: `APP${String(applications.length + 1).padStart(3, '0')}`,
      jobTitle: jobs.find(j => j.id === applicationFormData.jobId)?.title || "",
      ...applicationFormData,
      appliedDate: new Date().toISOString().split('T')[0],
      status: "Under Review",
    };

    setApplications([newApplication, ...applications]);
    setIsApplyJobModalOpen(false);
    setApplicationFormData({
      jobId: "", candidateName: "", email: "", phone: "",
      coverLetter: "", resumeFile: null,
    });
    alert("Application submitted successfully!");
  };

  const handleUpdateApplication = (appId) => {
    console.log("POST: Update application", appId);
    alert(`Updating application ${appId}...`);
  };

  const handleDeleteApplication = () => {
    console.log("POST: Delete application", selectedItem.id);
    setApplications(applications.filter(app => app.id !== selectedItem.id));
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
    alert("Application deleted successfully!");
  };

  // API Functions for Candidates
  const handleFetchAllCandidates = () => {
    console.log("GET: Fetch all candidates");
    alert("Fetching all candidates from API...");
  };

  const handleSignupCandidate = (e) => {
    e.preventDefault();
    console.log("POST: Signup new candidate", candidateFormData);
    
    const newCandidate = {
      id: `CAN${String(candidates.length + 1).padStart(3, '0')}`,
      ...candidateFormData,
      skills: candidateFormData.skills.split(',').map(s => s.trim()),
      status: "Active",
      registeredDate: new Date().toISOString().split('T')[0],
      applications: 0,
    };

    setCandidates([newCandidate, ...candidates]);
    setIsSignupCandidateModalOpen(false);
    setCandidateFormData({
      name: "", email: "", phone: "", skills: "", experience: "",
      location: "", education: "", portfolio: "",
    });
    alert("Candidate registered successfully!");
  };

  // Filter logic
  const getFilteredData = () => {
    let data = activeTab === "jobs" ? jobs : activeTab === "applications" ? applications : candidates;
    
    if (searchTerm) {
      data = data.filter(item => 
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "All") {
      data = data.filter(item => item.status === filterStatus);
    }

    return data;
  };

  const filteredData = getFilteredData();

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Recruitment Management</h1>
            <p className="text-sm text-gray-600">Manage jobs, applications, and candidates</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (activeTab === "jobs") handleFetchAllJobs();
                else if (activeTab === "applications") handleFetchAllApplications();
                else handleFetchAllCandidates();
              }}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            {activeTab === "jobs" && (
              <button
                onClick={() => setIsCreateJobModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Job
              </button>
            )}
            {activeTab === "applications" && (
              <button
                onClick={() => setIsApplyJobModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Apply for Job
              </button>
            )}
            {activeTab === "candidates" && (
              <button
                onClick={() => setIsSignupCandidateModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Signup Candidate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Jobs</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Jobs</h3>
          <p className="text-3xl font-bold mb-1">{jobs.length}</p>
          <p className="text-xs opacity-75">Open: {jobs.filter(j => j.status === "Open").length}</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            All positions
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#6b8ca3] to-[#4a6b82] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Applications</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Applications</h3>
          <p className="text-3xl font-bold mb-1">{applications.length}</p>
          <p className="text-xs opacity-75">Under Review: {applications.filter(a => a.status === "Under Review").length}</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            All submissions
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#8ba3b8] to-[#6b8ca3] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Candidates</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Candidates</h3>
          <p className="text-3xl font-bold mb-1">{candidates.length}</p>
          <p className="text-xs opacity-75">Active: {candidates.filter(c => c.status === "Active").length}</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            In talent pool
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#a4b9cc] to-[#8ba3b8] rounded-2xl shadow-sm p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">This Month</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">New Hires</h3>
          <p className="text-3xl font-bold mb-1">8</p>
          <p className="text-xs opacity-75">This month</p>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
            Successfully hired
          </div>
        </div>
      </div> */}

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-1.5 mb-6 inline-flex gap-1">
        {[
          { id: "jobs", label: "Jobs", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
          { id: "applications", label: "Applications", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
          { id: "candidates", label: "Candidates", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 w-full md:max-w-md">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            {activeTab === "jobs" && ["All", "Open", "Closed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? "bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
            {activeTab === "applications" && ["All", "Under Review", "Shortlisted", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? "bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
            {activeTab === "candidates" && ["All", "Active", "Inactive"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
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

      {/* Content Grid - Jobs */}
      {activeTab === "jobs" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredData.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{job.type} • {job.experience}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-[#2c4a6a]">{job.salary}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-gray-700">{job.applicants} applicants</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 line-clamp-2">
                  {job.description}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedItem(job);
                      setIsDetailModalOpen(true);
                    }}
                    className="p-2 hover:bg-[#6b8ca3]/10 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleUpdateJob(job.id)}
                    className="p-2 hover:bg-[#6b8ca3]/10 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(job);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500">Deadline: {job.deadline}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Grid - Applications */}
      {activeTab === "applications" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredData.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-semibold">
                    {app.candidateName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{app.candidateName}</h3>
                    <p className="text-xs text-gray-500">{app.id}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="bg-[#2c4a6a]/5 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Applied For</p>
                  <p className="font-medium text-gray-900">{app.jobTitle}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{app.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700">{app.phone}</span>
                </div>
                <p className="text-xs text-gray-500">Applied: {app.appliedDate}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedItem(app);
                      setIsDetailModalOpen(true);
                    }}
                    className="p-2 hover:bg-[#6b8ca3]/10 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleUpdateApplication(app.id)}
                    className="p-2 hover:bg-[#6b8ca3]/10 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(app);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Grid - Candidates */}
      {activeTab === "candidates" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredData.map((candidate) => (
            <div key={candidate.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-lg">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{candidate.name}</h3>
                    <p className="text-xs text-gray-500">{candidate.id}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(candidate.status)}`}>
                  {candidate.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{candidate.experience} experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">{candidate.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{candidate.email}</span>
                </div>
                <div className="bg-[#2c4a6a]/5 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-[#6b8ca3]/20 text-[#2c4a6a] rounded text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{candidate.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedItem(candidate);
                      setIsDetailModalOpen(true);
                    }}
                    className="p-2 hover:bg-[#6b8ca3]/10 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-[#6b8ca3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500">{candidate.applications} applications</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No {activeTab} found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or create a new entry</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("All");
            }}
            className="text-[#2c4a6a] hover:underline text-sm font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Modals would go here - Create Job, Apply Job, Signup Candidate, Details, Delete */}
      {/* For brevity, I'll include just the Create Job modal structure */}
      
      {/* Create Job Modal */}
      {isCreateJobModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold">Create New Job</h2>
              <button
                onClick={() => setIsCreateJobModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={jobFormData.title}
                    onChange={(e) => setJobFormData({...jobFormData, title: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <input
                    type="text"
                    value={jobFormData.department}
                    onChange={(e) => setJobFormData({...jobFormData, department: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({...jobFormData, location: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
                  <select
                    value={jobFormData.type}
                    onChange={(e) => setJobFormData({...jobFormData, type: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent bg-white"
                  >
                    <option value="">Select Type</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Required *</label>
                  <input
                    type="text"
                    value={jobFormData.experience}
                    onChange={(e) => setJobFormData({...jobFormData, experience: e.target.value})}
                    required
                    placeholder="e.g., 3+ years"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range *</label>
                  <input
                    type="text"
                    value={jobFormData.salary}
                    onChange={(e) => setJobFormData({...jobFormData, salary: e.target.value})}
                    required
                    placeholder="e.g., ₵5,000 - ₵8,000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline *</label>
                  <input
                    type="date"
                    value={jobFormData.deadline}
                    onChange={(e) => setJobFormData({...jobFormData, deadline: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
                  <textarea
                    value={jobFormData.description}
                    onChange={(e) => setJobFormData({...jobFormData, description: e.target.value})}
                    required
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                  <textarea
                    value={jobFormData.requirements}
                    onChange={(e) => setJobFormData({...jobFormData, requirements: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateJobModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                  Create Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Similar modals for Apply Job, Signup Candidate would go here */}
      {/* Delete Modal - reusable */}
      {isDeleteModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete {activeTab === "jobs" ? "Job" : activeTab === "applications" ? "Application" : "Candidate"}?</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete this {activeTab === "jobs" ? "job" : activeTab === "applications" ? "application" : "candidate"}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (activeTab === "jobs") handleDeleteJob();
                    else if (activeTab === "applications") handleDeleteApplication();
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}