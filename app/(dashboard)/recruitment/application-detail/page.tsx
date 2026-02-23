"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplicationDetailPage() {
  const router = useRouter();
  const [application, setApplication] = useState<any>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  useEffect(() => {
    const storedApp = sessionStorage.getItem("selected_application");
    if (storedApp) {
      setApplication(JSON.parse(storedApp));
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
        return "bg-gray-100 text-gray-700 border-gray-200";
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
    alert(`Application status updated to ${newStatus}`);
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">
      
      {/* Back Button */}
      <button
        onClick={() => router.push("/recruitment")}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#2c4a6a] transition-colors"
      >
        ← <span className="text-sm font-medium">Back to Applications</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-2xl">
              {getInitials(application.candidateName)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {application.candidateName}
              </h1>
              <p className="text-sm text-gray-600">{application.email}</p>
              <p className="text-sm text-gray-600">{application.phone}</p>
            </div>
          </div>

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
              application.status
            )}`}
          >
            {application.status}
          </span>
        </div>
      </div>

      {/* Cover Letter */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Cover Letter</h2>
        <p className="text-gray-700 leading-relaxed">
          {application.coverLetter}
        </p>
      </div>

      {/* Skills */}
      {application.skills && application.skills.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {application.skills.map((skill: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-2 bg-[#d4e1ed] text-[#2c4a6a] rounded-lg text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Documents</h2>

        <a
          href={application.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Resume / CV
            </p>
            <p className="text-xs text-gray-500">
              Click to view document
            </p>
          </div>
          ↓
        </a>
      </div>

      {/* Status Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-center mb-4">
              Update Application Status
            </h3>

            {["Under Review", "Shortlisted", "Passed Interview", "Rejected"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(status)}
                  className="w-full px-4 py-2 mb-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  {status}
                </button>
              )
            )}

            <button
              onClick={() => setIsStatusModalOpen(false)}
              className="w-full mt-3 px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}