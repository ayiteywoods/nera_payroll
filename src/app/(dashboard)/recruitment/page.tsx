"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Briefcase, Plus, X, Building2, Clock, Calendar } from "lucide-react";

// ──────────────────────────────────────────────
// Schema + Types
// ──────────────────────────────────────────────

const jobPositionSchema = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters").max(120),
  department: z.string().min(2, "Department is required").max(80),
  type: z.enum(["Full-Time", "Part-Time", "Contract", "Internship"]),
  status: z.enum(["Open", "Closed", "On Hold"]),
});

type JobPositionForm = z.infer<typeof jobPositionSchema>;

type JobPosition = JobPositionForm & {
  id: number;
  createdAt: string;
};

// ──────────────────────────────────────────────
// Status badge styles
// ──────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  Open: "bg-green-100 text-green-800 border-green-200",
  Closed: "bg-red-100 text-red-800 border-red-200",
  "On Hold": "bg-amber-100 text-amber-800 border-amber-200",
};

const typeStyles: Record<string, string> = {
  "Full-Time": "bg-blue-50 text-blue-700",
  "Part-Time": "bg-purple-50 text-purple-700",
  Contract: "bg-indigo-50 text-indigo-700",
  Internship: "bg-teal-50 text-teal-700",
};

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

export default function RecruitmentPage() {
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JobPositionForm>({
    resolver: zodResolver(jobPositionSchema),
    defaultValues: {
      title: "",
      department: "",
      type: "Full-Time",
      status: "Open",
    },
  });

  const onSubmit: SubmitHandler<JobPositionForm> = (data) => {
    const newPosition: JobPosition = {
      id: positions.length + 1,
      ...data,
      createdAt: new Date().toISOString(),
    };

    setPositions((prev) => [newPosition, ...prev]); // newest first
    reset();
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/40 px-4 py-8 md:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#154667]">
              Recruitment
            </h1>
            <p className="mt-1.5 text-gray-600">
              Manage job openings and positions
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#154667] px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-[#0f3b55] focus:outline-none focus:ring-2 focus:ring-[#154667] focus:ring-offset-2"
            >
              <Plus size={18} />
              New Position
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-10 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#154667]">
                Create New Job Position
              </h2>
              <button
                onClick={() => {
                  reset();
                  setShowForm(false);
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title")}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-[#154667] focus:ring-1 focus:ring-[#154667] focus:outline-none"
                  placeholder="e.g. Senior Frontend Engineer"
                />
                {errors.title && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("department")}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-[#154667] focus:ring-1 focus:ring-[#154667]"
                  placeholder="e.g. Engineering, Marketing, Finance"
                />
                {errors.department && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.department.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Job Type</label>
                <select
                  {...register("type")}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#154667] focus:ring-1 focus:ring-[#154667]"
                >
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  {...register("status")}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-[#154667] focus:ring-1 focus:ring-[#154667]"
                >
                  <option>Open</option>
                  <option>Closed</option>
                  <option>On Hold</option>
                </select>
              </div>

              <div className="col-span-2 flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setShowForm(false);
                  }}
                  className="rounded-xl border border-gray-300 px-6 py-2.5 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#154667] px-6 py-2.5 font-medium text-white shadow-sm hover:bg-[#0f3b55] disabled:opacity-60"
                >
                  {isSubmitting ? "Saving..." : "Create Position"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Positions List */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-[#154667]">Current Positions</h2>

          {positions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Briefcase size={64} className="mb-6 text-gray-300" strokeWidth={1.2} />
              <h3 className="mb-2 text-xl font-medium text-gray-700">No positions yet</h3>
              <p className="max-w-md text-gray-500">
                Click the "New Position" button above to start adding job openings.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-600">
                    <th className="px-6 py-4">Job Title</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {positions.map((pos) => (
                    <tr
                      key={pos.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                        {pos.title}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-gray-400" />
                          {pos.department}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${typeStyles[pos.type]}`}
                        >
                          {pos.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[pos.status]}`}
                        >
                          {pos.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}