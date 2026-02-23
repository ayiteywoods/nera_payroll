"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CandidateDetailPage() {
  const router = useRouter();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    const storedCandidate = sessionStorage.getItem('selected_candidate');
    if (storedCandidate) {
      setCandidate(JSON.parse(storedCandidate));
    } else {
      router.push('/recruitment');
    }
  }, [router]);

  if (!candidate) {
    return (
      <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c4a6a] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Active":
      case "Passed Interview":
        return "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]";
      case "Inactive":
        return "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name[0] + (name[1] || '');
  };

  const handleSignEmployee = () => {
    sessionStorage.setItem('candidate_to_employee', JSON.stringify(candidate));
    router.push('/employees/create');
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Back Button */}
      <button
        onClick={() => router.push('/recruitment')}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#2c4a6a] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back to Candidates</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {getInitials(candidate.name)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{candidate.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {candidate.email}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {candidate.phone}
                </span>
              </div>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(candidate.status)}`}>
            {candidate.status}
          </span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Candidate ID</p>
            <p className="text-sm font-bold text-gray-900">{candidate.id}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Location</p>
            <p className="text-sm font-bold text-[#2c4a6a]">{candidate.location}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Experience</p>
            <p className="text-sm font-bold text-gray-900">{candidate.experience}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Applications</p>
            <p className="text-sm font-bold text-gray-900">{candidate.applications}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-[#d4e1ed] text-[#2c4a6a] rounded-lg text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d4e1ed] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="text-sm font-semibold text-gray-900">{candidate.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8eef4] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#4a6b8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="text-sm font-semibold text-gray-900">{candidate.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d4e1ed] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{candidate.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d4e1ed] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Registered</p>
                  <p className="text-xs text-gray-500">{new Date(candidate.registeredDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              {candidate.status === "Passed Interview" && (
                <button
                  onClick={handleSignEmployee}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Hire as Employee
                </button>
              )}
              <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Candidate
              </button>
              <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}