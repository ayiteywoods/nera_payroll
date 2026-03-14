"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplicationDetailPage() {
  const router = useRouter();
  const [application, setApplication] = useState<any>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [recruitmentProgress, setRecruitmentProgress] = useState([
    { stage: "Application Received",  date: "2020-01-15", status: "Completed", notes: "Applied via company career portal",                   duration: "1 day",    score: ""        },
    { stage: "Resume Screening",       date: "2020-01-16", status: "Completed", notes: "Passed initial screening – 5 years experience",        duration: "3 days",   score: ""        },
    { stage: "Phone Interview",        date: "2020-01-20", status: "Completed", notes: "Conducted by Sarah Johnson (HR)",                      duration: "30 mins",  score: "9/10"    },
    { stage: "Technical Assessment",   date: "2020-01-25", status: "Completed", notes: "Online coding challenge – Python & React",             duration: "2 hours",  score: "95/100"  },
    { stage: "Panel Interview",        date: "2020-02-01", status: "Completed", notes: "Met with Engineering team leads",                      duration: "1.5 hours",score: "Excellent"},
    { stage: "Reference Check",        date: "2020-02-10", status: "Completed", notes: "3 professional references verified",                   duration: "5 days",   score: ""        },
    { stage: "Background Check",       date: "2020-02-15", status: "Completed", notes: "Criminal & employment history cleared",                duration: "3 days",   score: ""        },
    { stage: "Offer Extended",         date: "",           status: "Pending",   notes: "Job offer sent to candidate",                          duration: "2 days",   score: ""        },
    { stage: "Offer Accepted",         date: "",           status: "Pending",   notes: "Candidate accepts offer and confirms start date",      duration: "1 day",    score: ""        },
    { stage: "Onboarding Started",     date: "",           status: "Pending",   notes: "First day orientation and setup",                      duration: "Ongoing",  score: ""        },
  ]);

  useEffect(() => {
    const storedApp = sessionStorage.getItem("selected_application");
    if (storedApp) {
      const parsed = JSON.parse(storedApp);
      if (!parsed.status) parsed.status = "Under Review";
      setApplication(parsed);
      const saved = sessionStorage.getItem(`recruitment_progress_${parsed.id}`);
      if (saved) setRecruitmentProgress(JSON.parse(saved));
    } else {
      router.push("/recruitment");
    }
  }, [router]);

  if (!application) {
    return (
      <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c4a6a] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading application details...</p>
        </div>
      </div>
    );
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Shortlisted":
      case "Passed Interview": return "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]";
      case "Under Review":     return "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]";
      case "Rejected":         return "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]";
      default:                 return "bg-[#eef3f9] text-[#5a7a9a] border-[#d4e1ed]";
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length >= 2 ? parts[0][0] + parts[1][0] : name[0] + (name[1] || "");
  };

  // ─── Actions ──────────────────────────────────────────────────────────────
  const handleUpdateStatus = (newStatus: string) => {
    const updated = { ...application, status: newStatus };
    setApplication(updated);
    sessionStorage.setItem("selected_application", JSON.stringify(updated));
    setIsStatusModalOpen(false);
  };

  const handleStageToggle = (index: number) => {
    const updated = [...recruitmentProgress];
    const stage = updated[index];
    if (stage.status === "Completed") {
      stage.status = "Pending";
      stage.date = "";
    } else {
      stage.status = "Completed";
      stage.date = new Date().toISOString().split("T")[0];
    }
    setRecruitmentProgress(updated);
    sessionStorage.setItem(`recruitment_progress_${application.id}`, JSON.stringify(updated));
    const done = updated.filter(s => s.status === "Completed").length;
    if (done === updated.length) handleUpdateStatus("Passed Interview");
    else if (done > 1) handleUpdateStatus("Shortlisted");
  };

  const completedStages = recruitmentProgress.filter(s => s.status === "Completed").length;
  const totalStages     = recruitmentProgress.length;
  const progressPct     = Math.round((completedStages / totalStages) * 100);

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">

    {/* Header */}
<div className="flex items-center gap-4 mb-6">
  <button
    onClick={() => router.push("/recruitment")}
    className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
  >
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
  <div>
    <p className="text-xs text-gray-400 font-normal">Recruitment</p>
    <h1 className="text-2xl md:text-3xl font-bold text-[#153453] tracking-tight">
      Application detail — {application?.id}
    </h1>
  </div>
</div>

      {/* ── Header card ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          {/* Avatar + name */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {getInitials(application.candidateName)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#153453]">{application.candidateName}</h1>
              <div className="flex flex-col gap-1 mt-1.5">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5 text-[#2c4a6a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  {application.email}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5 text-[#2c4a6a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  {application.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Status + button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(application.status)}`}>
              {application.status}
            </span>
            <button onClick={() => setIsStatusModalOpen(true)}
              className="bg-[#2c4a6a] hover:bg-[#1e3147] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Update Status
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label:"Position",    value: application.jobTitle || application.position || "—",              odd: true  },
            { label:"Applied",     value: new Date(application.appliedDate).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}), odd: false },
            { label:"Experience",  value: application.experience || "Not specified",                         odd: true  },
            { label:"Application", value: application.id,                                                    odd: false },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 ${s.odd ? "bg-[#1e3a52]" : "bg-[#2c4a6a]"} text-white`}>
              <p className="text-xs text-white/70 mb-1 font-medium">{s.label}</p>
              <p className="text-sm font-extrabold text-white truncate">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── LEFT (2/3): Cover letter + Skills + Recruitment timeline ── */}
        <div className="xl:col-span-2 space-y-6">

          {/* Cover Letter */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h2 className="text-base font-bold text-[#153453]">Cover Letter</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{application.coverLetter}</p>
          </div>

          {/* Skills */}
          {application.skills?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                </div>
                <h2 className="text-base font-bold text-[#153453]">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {application.skills.map((skill: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-[#d4e1ed] text-[#2c4a6a] rounded-lg text-xs font-semibold border border-[#a8c5db]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Recruitment Process — INLINE (no modal) ──────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#153453]">Recruitment Process</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{completedStages} of {totalStages} stages completed · click a stage to toggle</p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-[#2c4a6a]">{progressPct}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
              <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}/>
            </div>

            {/* Timeline rows */}
            <div className="space-y-0">
              {recruitmentProgress.map((stage, idx) => (
                <div key={idx} className="relative flex gap-4 pb-5 last:pb-0">
                  {/* Circle + connector */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <button onClick={() => handleStageToggle(idx)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow transition-transform hover:scale-110 z-10 ${
                        stage.status === "Completed" ? "bg-[#2c4a6a]" : "bg-gray-200"
                      }`}>
                      {stage.status === "Completed" ? (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      ) : (
                        <span className="text-xs font-bold text-gray-400">{idx + 1}</span>
                      )}
                    </button>
                    {idx < totalStages - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[40px] mt-1 ${stage.status === "Completed" ? "bg-[#a8c5db]" : "bg-gray-200"}`}/>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 rounded-xl p-4 border -mt-1 transition-all ${
                    stage.status === "Completed"
                      ? "bg-[#f5f8fc] border-[#c3d2e9]"
                      : "bg-gray-50 border-gray-200"
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${stage.status === "Completed" ? "text-[#153453]" : "text-gray-500"}`}>
                          {stage.stage}
                        </p>
                        {stage.date && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(stage.date).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                          </p>
                        )}
                        <p className={`text-xs mt-1.5 ${stage.status === "Completed" ? "text-gray-600" : "text-gray-400"}`}>
                          {stage.notes}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          {stage.duration}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        {stage.score && (
                          <span className="px-2 py-1 bg-[#d4e1ed] text-[#2c4a6a] border border-[#a8c5db] rounded-lg text-[11px] font-bold">
                            {stage.score}
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-[11px] font-semibold border ${
                          stage.status === "Completed"
                            ? "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]"
                            : "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]"
                        }`}>
                          {stage.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT (1/3): Sidebar ──────────────────────────────────── */}
        <div className="space-y-6">

          {/* Application Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#153453] mb-4">Application Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#d4e1ed] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Applied Date</p>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(application.appliedDate).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#e8eef4] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#4a6b8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Current Status</p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#d4e1ed] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Progress</p>
                  <p className="text-xs text-gray-500 mt-0.5">{completedStages}/{totalStages} stages · {progressPct}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#153453] mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Email</p>
                  <p className="text-xs font-semibold text-gray-800 break-all mt-0.5">{application.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Phone</p>
                  <p className="text-xs font-semibold text-gray-800 mt-0.5">{application.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#153453] mb-4">Documents</h2>
            <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-[#eef3f9] hover:bg-[#d4e1ed] border border-[#c3d2e9] rounded-xl transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2c4a6a] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#2c4a6a]">Resume / CV</p>
                  <p className="text-[10px] text-gray-500">Click to view</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-[#2c4a6a] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#153453] mb-4">Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2.5 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                </svg>
                Schedule Interview
              </button>
              <button className="w-full px-4 py-2.5 bg-[#eef3f9] hover:bg-[#d4e1ed] text-[#2c4a6a] border border-[#c3d2e9] rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Send Email
              </button>
              <button className="w-full px-4 py-2.5 bg-[#e8eef4] hover:bg-[#d4e1ed] text-[#4a6b8a] border border-[#c3d2e9] rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Download Resume
              </button>
              <button className="w-full px-4 py-2.5 bg-[#e8eef4] hover:bg-[#bfcfde] text-[#1e3147] border border-[#c3d2e9] rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete Application
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Status Modal ─────────────────────────────────────────────── */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm shadow-2xl">
            <div className="bg-[#2c4a6a] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-base font-bold">Update Status</h3>
              <button onClick={() => setIsStatusModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-2">
              <p className="text-xs text-gray-500 mb-3">Change status for <strong>{application.candidateName}</strong></p>
              {["Under Review","Shortlisted","Passed Interview","Rejected"].map(status => (
                <button key={status} onClick={() => handleUpdateStatus(status)}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left border ${
                    application.status === status
                      ? "bg-[#2c4a6a] text-white border-[#2c4a6a]"
                      : `${getStatusColor(status)} hover:opacity-80`
                  }`}>
                  {status}
                </button>
              ))}
              <button onClick={() => setIsStatusModalOpen(false)}
                className="w-full mt-1 px-4 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}