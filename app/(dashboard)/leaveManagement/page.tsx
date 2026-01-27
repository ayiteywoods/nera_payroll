"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Clock, User, Trash2, Edit, X, Plus, CheckCircle2, AlertCircle, Slash } from "lucide-react";

// ──────────────────────────────────────────────
// Types & Schema
// ──────────────────────────────────────────────

interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  type: "Annual" | "Sick" | "Maternity" | "Other";
  startDate: string; // ISO date
  endDate: string;   // ISO date
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

const leaveFormSchema = z.object({
  type: z.enum(["Annual", "Sick", "Maternity", "Other"]),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required").refine((val, ctx) => {
    if (new Date(val) < new Date(ctx.parent.startDate)) {
      return ctx.addIssue({ code: "custom", message: "End date must be after start" });
    }
    return true;
  }),
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500),
});

type LeaveForm = z.infer<typeof leaveFormSchema>;

// ──────────────────────────────────────────────
// API Helpers (respecting backend endpoints)
// ──────────────────────────────────────────────
// Assume API base URL, e.g., /api/leave
// In real app, use environment variable or config

async function fetchAllLeaves(): Promise<LeaveRequest[]> {
  // GET /leave
  const res = await fetch("/api/leave");
  if (!res.ok) throw new Error("Failed to fetch leaves");
  return res.json();
}

async function createLeave(data: LeaveForm & { employeeId: number }): Promise<LeaveRequest> {
  // POST /leave
  const res = await fetch("/api/leave", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create leave");
  return res.json();
}

async function getLeaveDetails(id: number): Promise<LeaveRequest> {
  // GET /leave/:id
  const res = await fetch(`/api/leave/${id}`);
  if (!res.ok) throw new Error("Failed to fetch leave details");
  return res.json();
}

async function updateLeave(id: number, data: Partial<LeaveForm>): Promise<LeaveRequest> {
  // POST /leave/:id (assuming POST for update as per image)
  const res = await fetch(`/api/leave/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update leave");
  return res.json();
}

async function deleteLeave(id: number): Promise<void> {
  // DELETE /leave/:id
  const res = await fetch(`/api/leave/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete leave");
}

// ──────────────────────────────────────────────
// Status Styles
// ──────────────────────────────────────────────

const statusIcons = {
  Pending: AlertCircle,
  Approved: CheckCircle2,
  Rejected: Slash,
};

const statusColors = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Approved: "bg-green-100 text-green-800 border-green-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
};

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

export default function LeaveManagementPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<LeaveForm>({
    resolver: zodResolver(leaveFormSchema),
  });

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const data = await fetchAllLeaves();
      setLeaves(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())); // newest first
    } catch (err) {
      setError("Failed to load leave requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<LeaveForm> = async (data) => {
    try {
      let result: LeaveRequest;
      if (editingId) {
        result = await updateLeave(editingId, data);
        setLeaves((prev) => prev.map((l) => (l.id === editingId ? result : l)));
      } else {
        // Assume current employee ID (in real app, from auth context)
        const employeeId = 1; // Placeholder
        result = await createLeave({ ...data, employeeId });
        setLeaves((prev) => [result, ...prev]);
      }
      reset();
      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      setError("Operation failed. Please check your input.");
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const leave = await getLeaveDetails(id);
      setValue("type", leave.type);
      setValue("startDate", leave.startDate.split("T")[0]); // for date input
      setValue("endDate", leave.endDate.split("T")[0]);
      setValue("reason", leave.reason);
      setEditingId(id);
      setShowModal(true);
    } catch (err) {
      setError("Failed to load details.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this leave request?")) return;
    try {
      await deleteLeave(id);
      setLeaves((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError("Failed to delete.");
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-GB");

  return (
    <div className="min-h-screen bg-gray-50/40 px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#154667]">
              Leave Management
            </h1>
            <p className="mt-1.5 text-gray-600">
              Track and manage employee leave requests
            </p>
          </div>
          <button
            onClick={() => {
              reset();
              setEditingId(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#154667] px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-[#0f3b55]"
          >
            <Plus size={18} />
            New Leave Request
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Modal for Create/Edit */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#154667]">
                  {editingId ? "Edit Leave Request" : "New Leave Request"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                  <select
                    {...register("type")}
                    className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#154667] focus:ring-1 focus:ring-[#154667]"
                  >
                    <option>Annual</option>
                    <option>Sick</option>
                    <option>Maternity</option>
                    <option>Other</option>
                  </select>
                  {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      {...register("startDate")}
                      className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#154667] focus:ring-1 focus:ring-[#154667]"
                    />
                    {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      {...register("endDate")}
                      className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#154667] focus:ring-1 focus:ring-[#154667]"
                    />
                    {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <textarea
                    {...register("reason")}
                    rows={4}
                    className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#154667] focus:ring-1 focus:ring-[#154667]"
                  />
                  {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-gray-300 px-6 py-2.5 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#154667] px-6 py-2.5 font-medium text-white hover:bg-[#0f3b55] disabled:opacity-60"
                  >
                    {isSubmitting ? "Saving..." : editingId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Leaves Table */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-[#154667]">Leave Requests</h2>

          {loading ? (
            <div className="flex justify-center py-16 text-gray-500">Loading...</div>
          ) : leaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar size={64} className="mb-6 text-gray-300" strokeWidth={1.2} />
              <h3 className="mb-2 text-xl font-medium text-gray-700">No leave requests yet</h3>
              <p className="max-w-md text-gray-500">Create a new request to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-600">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leaves.map((leave) => {
                    const StatusIcon = statusIcons[leave.status];
                    return (
                      <tr key={leave.id} className="transition-colors hover:bg-gray-50/70">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            {leave.employeeName}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{leave.type}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={16} className="text-gray-400" />
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${statusColors[leave.status]}`}
                          >
                            <StatusIcon size={12} />
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(leave.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(leave.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}