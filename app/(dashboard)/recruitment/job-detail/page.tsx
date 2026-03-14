"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function JobDetailPage() {
  const router = useRouter();
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selected_job");
    if (stored) {
      setJob(JSON.parse(stored));
    } else {
      router.push("/recruitment");
    }
  }, [router]);

  if (!job) {
    return (
      <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c4a6a] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading job details...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":   return "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]";
      case "Closed": return "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]";
      default:       return "bg-[#e8eef4] text-[#4a6b8a] border-[#c3d2e9]";
    }
  };

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
      Job detail — {job?.id}
    </h1>
  </div>
</div>
      {/* ── Header card ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          {/* Icon + title */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {job.id.slice(-2)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#153453]">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5 text-[#2c4a6a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  {job.department}
                </span>
                <span className="text-gray-300 hidden sm:inline">·</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5 text-[#2c4a6a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {job.location}
                </span>
                <span className="text-gray-300 hidden sm:inline">·</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5 text-[#2c4a6a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {job.type}
                </span>
              </div>
            </div>
          </div>

          {/* Status badge — correct small size */}
          <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
        </div>

        {/* Quick stats — dark navy gradient */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Job ID",      value: job.id,           odd: true  },
            { label: "Salary Range",value: job.salary,       odd: false },
            { label: "Experience",  value: job.experience,   odd: true  },
            { label: "Applicants",  value: job.applicants,   odd: false },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 text-white ${s.odd ? "bg-[#1e3a52]" : "bg-[#2c4a6a]"}`}>
              <p className="text-xs text-white/70 mb-1 font-medium">{s.label}</p>
              <p className="text-sm font-extrabold text-white truncate">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── LEFT (2/3) ───────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-6">

          {/* Job Description */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h2 className="text-base font-bold text-[#153453]">Job Description</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                  </svg>
                </div>
                <h2 className="text-base font-bold text-[#153453]">Requirements</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{job.requirements}</p>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <h2 className="text-base font-bold text-[#153453]">Responsibilities</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{job.responsibilities}</p>
            </div>
          )}
        </div>

        {/* ── RIGHT (1/3): Sidebar ─────────────────────────────────── */}
        <div className="space-y-6">

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#153453] mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#d4e1ed] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Posted Date</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(job.postedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#e8eef4] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#4a6b8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Deadline</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(job.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#153453] mb-4">Job Information</h2>
            <div className="space-y-3">
              {[
                {
                  icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                  label: "Employment Type", value: job.type,
                },
                {
                  icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
                  label: "Location", value: job.location,
                },
                {
                  icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                  label: "Department", value: job.department,
                },
              ].map((item, i) => (
                <div key={item.label} className={`flex items-center gap-3 p-3 rounded-xl border ${i % 2 === 0 ? "bg-[#f5f8fc] border-[#e2eaf3]" : "bg-gray-50 border-gray-100"}`}>
                  <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">{item.label}</p>
                    <p className="text-xs font-bold text-[#153453] mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#153453] mb-4">Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2.5 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Edit Job Details
              </button>
              <button className="w-full px-4 py-2.5 bg-[#eef3f9] hover:bg-[#d4e1ed] text-[#2c4a6a] border border-[#c3d2e9] rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
                Share Job Posting
              </button>
              <button className="w-full px-4 py-2.5 bg-[#e8eef4] hover:bg-[#d4e1ed] text-[#4a6b8a] border border-[#c3d2e9] rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Close Position
              </button>
              <button className="w-full px-4 py-2.5 bg-[#e8eef4] hover:bg-[#bfcfde] text-[#1e3147] border border-[#c3d2e9] rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete Job
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}