"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplicationDetailPage() {
  const router = useRouter();
  const [application, setApplication] = useState<any>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  
  const [recruitmentProgress, setRecruitmentProgress] = useState([
    { stage: "Application Received", date: "2020-01-15", status: "Completed", notes: "Applied via company career portal", duration: "1 day", score: "" },
    { stage: "Resume Screening", date: "2020-01-16", status: "Completed", notes: "Passed initial screening - 5 years experience", duration: "3 days", score: "" },
    { stage: "Phone Interview", date: "2020-01-20", status: "Completed", notes: "Conducted by Sarah Johnson (HR)", duration: "30 mins", score: "9/10" },
    { stage: "Technical Assessment", date: "2020-01-25", status: "Completed", notes: "Online coding challenge - Python & React", duration: "2 hours", score: "95/100" },
    { stage: "Panel Interview", date: "2020-02-01", status: "Completed", notes: "Met with Engineering team leads", duration: "1.5 hours", score: "Excellent" },
    { stage: "Reference Check", date: "2020-02-10", status: "Completed", notes: "3 professional references verified", duration: "5 days", score: "" },
    { stage: "Background Check", date: "2020-02-15", status: "Completed", notes: "Criminal & employment history cleared", duration: "3 days", score: "" },
    { stage: "Offer Extended", date: "", status: "Pending", notes: "Job offer sent to candidate", duration: "2 days", score: "" },
    { stage: "Offer Accepted", date: "", status: "Pending", notes: "Candidate accepts offer and confirms start date", duration: "1 day", score: "" },
    { stage: "Onboarding Started", date: "", status: "Pending", notes: "First day orientation and setup", duration: "Ongoing", score: "" },
  ]);

  useEffect(() => {
    const storedApp = sessionStorage.getItem("selected_application");
    if (storedApp) {
      const parsedApp = JSON.parse(storedApp);
      if (!parsedApp.status) {
        parsedApp.status = "Under Review";
      }
      setApplication(parsedApp);
      
      const savedProgress = sessionStorage.getItem(`recruitment_progress_${parsedApp.id}`);
      if (savedProgress) {
        setRecruitmentProgress(JSON.parse(savedProgress));
      }
    } else {
      router.push("/recruitment");
    }
  }, [router]);

  if (!application) {
    return (
      <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c4a6a] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Shortlisted":
      case "Passed Interview":
        return "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]";
      case "Under Review":
        return "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]";
      case "Rejected":
        return "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]";
      default:
        return "bg-[#eef3f9] text-[#5a7a9a] border-[#d4e1ed]";
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name[0] + (name[1] || "");
  };

  const handleUpdateStatus = (newStatus: string) => {
    const updatedApp = { ...application, status: newStatus };
    setApplication(updatedApp);
    sessionStorage.setItem("selected_application", JSON.stringify(updatedApp));
    setIsStatusModalOpen(false);
  };

  const handleStageComplete = (index: number) => {
    const updatedProgress = [...recruitmentProgress];
    const stage = updatedProgress[index];
    
    if (stage.status === "Completed") {
      stage.status = "Pending";
      stage.date = "";
    } else {
      stage.status = "Completed";
      stage.date = new Date().toISOString().split('T')[0];
    }
    
    setRecruitmentProgress(updatedProgress);
    sessionStorage.setItem(`recruitment_progress_${application.id}`, JSON.stringify(updatedProgress));
    
    const completedStages = updatedProgress.filter(s => s.status === "Completed").length;
    if (completedStages === updatedProgress.length) {
      handleUpdateStatus("Passed Interview");
    } else if (completedStages > 1) {
      handleUpdateStatus("Shortlisted");
    }
  };

  const startProcessing = () => {
    setIsProcessModalOpen(true);
  };

  const completedStages = recruitmentProgress.filter(s => s.status === "Completed").length;
  const totalStages = recruitmentProgress.length;

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">
      
      {/* Back Button */}
      <button
        onClick={() => router.push("/recruitment")}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#2c4a6a] transition-colors font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm">Back to Applications</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {getInitials(application.candidateName)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#153453] mb-2">
                {application.candidateName}
              </h1>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <svg className="w-3.5 h-3.5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{application.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <svg className="w-3.5 h-3.5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium">{application.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(application.status)}`}>
              {application.status}
            </span>
            <button
              onClick={() => setIsStatusModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all"
            >
              Update Status
            </button>
          </div>
        </div>

        {/* Quick Info Stats - ODD/EVEN Pattern */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#dbe7f1] rounded-xl p-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Position</p>
            <p className="text-sm font-bold text-[#1e3147]">{application.position}</p>
          </div>
          <div className="bg-[#e7f0f5] rounded-xl p-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Applied Date</p>
            <p className="text-sm font-bold text-[#2c4a6a]">{new Date(application.appliedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          <div className="bg-[#dbe7f1] rounded-xl p-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Experience</p>
            <p className="text-sm font-bold text-[#1e3147]">{application.experience || "Not specified"}</p>
          </div>
          <div className="bg-[#e7f0f5] rounded-xl p-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Department</p>
            <p className="text-sm font-bold text-[#2c4a6a]">{application.department || "Not specified"}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover Letter */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-gray-900">Cover Letter</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {application.coverLetter}
            </p>
          </div>

          {/* Skills */}
          {application.skills && application.skills.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#3d5a7c] to-[#2c4a6a] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-gray-900">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {application.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-2 bg-[#d4e1ed] text-[#2c4a6a] rounded-lg text-xs font-medium border border-[#a8c5db]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recruitment Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Recruitment Process</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{completedStages} of {totalStages} stages completed</p>
                </div>
              </div>
              <button
                onClick={startProcessing}
                className="px-4 py-2 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all"
              >
                View Timeline
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedStages / totalStages) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Recent Stages */}
            <div className="space-y-2">
              {recruitmentProgress.slice(0, 3).map((stage, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    stage.status === "Completed"
                      ? "bg-[#d4e1ed] border-[#a8c5db]"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      stage.status === "Completed" ? "bg-[#2c4a6a]" : "bg-gray-300"
                    }`}>
                      {stage.status === "Completed" ? (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-xs font-bold text-white">{idx + 1}</span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-gray-900">{stage.stage}</p>
                  </div>
                  {stage.status === "Completed" && stage.date && (
                    <span className="text-xs text-[#2c4a6a]">
                      {new Date(stage.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Application Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5">Application Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#d4e1ed] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Applied Date</p>
                  <p className="text-xs text-gray-600 mt-0.5">{new Date(application.appliedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#e8eef4] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#4a6b8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Current Status</p>
                  <p className="text-xs text-gray-600 mt-0.5">{application.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#dbe7f1] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <p className="text-xs font-semibold text-gray-900 break-all">{application.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#e7f0f5] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#3d5a7c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                  <p className="text-xs font-semibold text-gray-900">{application.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5">Documents</h2>
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-[#dbe7f1] hover:bg-[#c3d2e9] rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#2c4a6a]">Resume / CV</p>
                  <p className="text-xs text-gray-600">Click to view document</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-[#2c4a6a] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5">Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Schedule Interview
              </button>
              <button className="w-full px-4 py-3 bg-[#dbe7f1] hover:bg-[#c3d2e9] text-[#2c4a6a] rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </button>
              <button className="w-full px-4 py-3 bg-[#e8eef4] hover:bg-[#d4e1ed] text-[#4a6b8a] rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
              </button>
              <button className="w-full px-4 py-3 bg-[#bfcfde] hover:bg-[#a8c5db] text-[#1e3147] rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Application
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md">
            <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-bold">Update Application Status</h3>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-3">
              {["Under Review", "Shortlisted", "Passed Interview", "Rejected"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(status)}
                    className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${getStatusColor(status)} hover:scale-[1.02]`}
                  >
                    {status}
                  </button>
                )
              )}

              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="w-full mt-3 px-4 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recruitment Timeline Modal */}
      {isProcessModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-3xl my-8">
            <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl sticky top-0 z-10">
              <div>
                <h3 className="text-lg font-bold">Recruitment Timeline</h3>
                <p className="text-sm text-white/80 mt-1">Track and manage recruitment progress</p>
              </div>
              <button
                onClick={() => setIsProcessModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Progress Summary */}
              <div className="bg-gradient-to-r from-[#dbe7f1] to-[#e8f0f7] rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-[#1e3147]">Overall Progress</p>
                    <p className="text-xs text-gray-600 mt-0.5">{completedStages} of {totalStages} stages completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#2c4a6a]">{Math.round((completedStages / totalStages) * 100)}%</p>
                  </div>
                </div>
                <div className="w-full bg-white/50 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(completedStages / totalStages) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Timeline - Matching Screenshot Design */}
              <div className="space-y-0 max-h-[500px] overflow-y-auto pr-2">
                {recruitmentProgress.map((stage, index) => (
                  <div key={index} className="relative flex gap-4 pb-6 last:pb-0">
                    {/* Left side - Checkbox with connecting line */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      {/* Clickable checkbox */}
                      <button
                        onClick={() => handleStageComplete(index)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md hover:scale-110 transition-transform z-10 ${
                          stage.status === "Completed"
                            ? "bg-[#2c4a6a]"
                            : "bg-gray-300"
                        }`}
                      >
                        {stage.status === "Completed" ? (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : null}
                      </button>
                      
                      {/* Connector line */}
                      {index < recruitmentProgress.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 min-h-[80px] mt-1"></div>
                      )}
                    </div>

                    {/* Right side - Content card */}
                    <div className={`flex-1 rounded-xl p-5 border transition-all -mt-1 ${
                      stage.status === "Completed"
                        ? "bg-white border-gray-200 shadow-sm"
                        : "bg-gray-50 border-gray-200"
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900">{stage.stage}</h3>
                          {stage.date && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(stage.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                          {stage.score && (
                            <span className="px-3 py-1.5 bg-[#e8f0f7] text-[#2c4a6a] border border-[#c3d2e9] rounded-lg text-xs font-bold">
                              {stage.score}
                            </span>
                          )}
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                            stage.status === "Completed"
                              ? "bg-[#e8f0f7] text-[#2c4a6a] border-[#c3d2e9]"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}>
                            {stage.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{stage.notes}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Duration: {stage.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setIsProcessModalOpen(false)}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}