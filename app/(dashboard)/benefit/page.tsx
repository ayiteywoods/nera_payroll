"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Trash2, Edit, Plus, X } from "lucide-react";

// ──────────────────────────────
// Types & Schema
// ──────────────────────────────

interface BenefitDeduction {
  id: number;
  employeeName: string;
  type: "Benefit" | "Deduction";
  title: string;
  amount: number;
  description: string;
  createdAt: string;
}

const benefitFormSchema = z.object({
  type: z.enum(["Benefit", "Deduction"]),
  title: z.string().min(3, "Title required").max(100),
  amount: z.number().min(0, "Amount must be positive"),
  description: z.string().max(500).optional(),
});

type BenefitForm = z.infer<typeof benefitFormSchema>;

// ──────────────────────────────
// API Helpers
// ──────────────────────────────

async function fetchAllBenefits(): Promise<BenefitDeduction[]> {
  const res = await fetch("/api/benefits");
  if (!res.ok) throw new Error("Failed to fetch benefits");
  return res.json();
}

async function createBenefit(data: BenefitForm & { employeeName: string }): Promise<BenefitDeduction> {
  const res = await fetch("/api/benefits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create record");
  return res.json();
}

async function updateBenefit(id: number, data: Partial<BenefitForm>): Promise<BenefitDeduction> {
  const res = await fetch(`/api/benefits/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update record");
  return res.json();
}

async function deleteBenefit(id: number): Promise<void> {
  const res = await fetch(`/api/benefits/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete record");
}

// ──────────────────────────────
// Component
// ──────────────────────────────

export default function BenefitsDeductionsPage() {
  const [records, setRecords] = useState<BenefitDeduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<BenefitForm>({
    resolver: zodResolver(benefitFormSchema),
  });

  useEffect(() => { loadRecords(); }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await fetchAllBenefits();
      setRecords(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch {
      setError("Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<BenefitForm> = async (data) => {
    try {
      let result: BenefitDeduction;
      const employeeName = "John Doe"; // Replace with actual employee selection or auth
      if (editingId) {
        result = await updateBenefit(editingId, data);
        setRecords(prev => prev.map(r => r.id === editingId ? result : r));
      } else {
        result = await createBenefit({ ...data, employeeName });
        setRecords(prev => [result, ...prev]);
      }
      reset(); setShowModal(false); setEditingId(null);
    } catch {
      setError("Operation failed. Check your input.");
    }
  };

  const handleEdit = (record: BenefitDeduction) => {
    setValue("type", record.type);
    setValue("title", record.title);
    setValue("amount", record.amount);
    setValue("description", record.description || "");
    setEditingId(record.id);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this record?")) return;
    try { await deleteBenefit(id); setRecords(prev => prev.filter(r => r.id !== id)); }
    catch { setError("Failed to delete."); }
  };

  return (
    <div className="min-h-screen bg-gray-50/40 px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#154667]">Benefits & Deductions</h1>
            <p className="mt-1 text-sm text-gray-600">Manage employee benefits and deductions</p>
          </div>
          <button onClick={() => { reset(); setEditingId(null); setShowModal(true); }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#154667] px-4 py-2 text-sm text-white hover:bg-[#0f3b55]">
            <Plus size={16}/> New Record
          </button>
        </div>

        {/* Error */}
        {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</div>}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#154667]">{editingId ? "Edit Record" : "New Record"}</h2>
                <button onClick={() => setShowModal(false)} className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"><X size={18}/></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Type</label>
                  <select {...register("type")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#154667] focus:ring-1 focus:ring-[#154667]">
                    <option>Benefit</option>
                    <option>Deduction</option>
                  </select>
                  {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Title</label>
                  <input {...register("title")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#154667] focus:ring-1 focus:ring-[#154667]" />
                  {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Amount</label>
                  <input type="number" {...register("amount", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#154667] focus:ring-1 focus:ring-[#154667]" />
                  {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Description</label>
                  <textarea {...register("description")} rows={2} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#154667] focus:ring-1 focus:ring-[#154667]" />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="rounded-md border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="rounded-md bg-[#154667] px-5 py-2 text-sm font-medium text-white hover:bg-[#0f3b55] disabled:opacity-60">{isSubmitting ? "Saving..." : editingId ? "Update" : "Create"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Records Table */}
        <div className="rounded-xl border bg-white p-5 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading...</div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <User size={48} className="mb-4 text-gray-300" />
              <h3 className="mb-1 text-sm font-medium text-gray-700">No records found</h3>
              <p className="text-xs text-gray-500">Add benefits or deductions for employees.</p>
            </div>
          ) : (
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b bg-gray-50 text-left font-medium text-gray-500">
                  <th className="px-4 py-2">Employee</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-2">{r.employeeName}</td>
                    <td className="px-4 py-2">{r.type}</td>
                    <td className="px-4 py-2">{r.title}</td>
                    <td className="px-4 py-2">₵{r.amount.toLocaleString()}</td>
                    <td className="px-4 py-2">{r.description}</td>
                    <td className="px-4 py-2 flex gap-1">
                      <button onClick={() => handleEdit(r)} className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"><Edit size={14}/></button>
                      <button onClick={() => handleDelete(r.id)} className="p-1 text-red-600 hover:bg-red-50 rounded-full"><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
