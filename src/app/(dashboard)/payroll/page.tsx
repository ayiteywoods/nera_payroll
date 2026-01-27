"use client";

import { useState, useMemo } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Download, Loader2 } from "lucide-react";
import PayrollCard from "@/src/app/components/PayrollCard"; // adjust path as needed

// ──────────────────────────────────────────────
// Types & Schema
// ──────────────────────────────────────────────

interface Employee {
  id: number;
  name: string;
  jobTitle: string;
  basicSalary: number;
}

interface PayrollEntry extends Employee {
  allowances: number;
  deductions: number;
  ssnitEmployee?: number;
  payeTax?: number;
  netPay: number;
  paid: boolean;
  lastPaid?: string;
}

const payrollSchema = z.object({
  employees: z.array(
    z.object({
      id: z.number(),
      allowances: z.number().min(0).max(15000),
      deductions: z.number().min(0).max(8000),
    })
  ),
});

type PayrollForm = z.infer<typeof payrollSchema>;

// Sample data
const initialEmployees: Employee[] = [
  { id: 1, name: "Kwame Asante", jobTitle: "Senior Software Engineer", basicSalary: 9800 },
  { id: 2, name: "Abena Mensah", jobTitle: "Product Manager", basicSalary: 13500 },
  { id: 3, name: "Kofi Boateng", jobTitle: "UI/UX Designer", basicSalary: 8200 },
  { id: 4, name: "Efua Osei", jobTitle: "HR Business Partner", basicSalary: 11000 },
  { id: 5, name: "Yaw Adjei", jobTitle: "DevOps Engineer", basicSalary: 10500 },
];

export default function PayrollPage() {
  const [payrollData, setPayrollData] = useState<PayrollEntry[]>(
    initialEmployees.map((e) => ({
      ...e,
      allowances: 0,
      deductions: 0,
      netPay: e.basicSalary,
      paid: false,
    }))
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, watch, formState: { isDirty } } = useForm<PayrollForm>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      employees: payrollData.map((e) => ({
        id: e.id,
        allowances: e.allowances,
        deductions: e.deductions,
      })),
    },
  });

  const { fields } = useFieldArray({ control, name: "employees" });
  const watched = watch("employees");

  const enrichedPayroll = useMemo(() => {
    return payrollData.map((emp, i) => {
      const vals = watched[i] ?? { allowances: 0, deductions: 0 };
      const gross = emp.basicSalary + vals.allowances;
      const ssnitEmp = Math.round(gross * 0.055);
      const taxable = gross - ssnitEmp - vals.deductions;
      const paye = Math.round(Math.max(0, taxable > 2000 ? (taxable - 2000) * 0.15 : 0));

      return {
        ...emp,
        ...vals,
        ssnitEmployee: ssnitEmp,
        payeTax: paye,
        netPay: gross - ssnitEmp - vals.deductions - paye,
      };
    });
  }, [payrollData, watched]);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return enrichedPayroll;
    const term = searchTerm.toLowerCase();
    return enrichedPayroll.filter(
      (e) => e.name.toLowerCase().includes(term) || e.jobTitle.toLowerCase().includes(term)
    );
  }, [enrichedPayroll, searchTerm]);

  const totalNet = filtered.reduce((sum, e) => sum + e.netPay, 0);
  const pendingCount = enrichedPayroll.filter((e) => !e.paid).length;
  const paidThisPeriod = enrichedPayroll.filter((e) => e.lastPaid).length;

  const onSubmit: SubmitHandler<PayrollForm> = async (data) => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setPayrollData((prev) =>
      prev.map((emp) => {
        const upd = data.employees.find((f) => f.id === emp.id);
        return upd ? { ...emp, allowances: upd.allowances, deductions: upd.deductions } : emp;
      })
    );
    setIsSaving(false);
  };

  const handlePay = (id: number) => {
    if (!confirm("Confirm payment processing?")) return;
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    setPayrollData((prev) =>
      prev.map((e) => (e.id === id ? { ...e, paid: true, lastPaid: today } : e))
    );
  };

  const formatGHS = (n: number) =>
    `GH₵ ${n.toLocaleString("en-GH", { minimumFractionDigits: 0 })}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header – smaller */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#153361]">
            Payroll Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Salaries, deductions & payments • {new Date().toLocaleDateString("en-GB")}
          </p>
        </div>

        {/* Payroll Cards – unchanged internally, just tighter spacing */}
        <div className="mb-10 flex flex-nowrap gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300/50 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-x-visible">
          <PayrollCard
            period="This Month"
            title="Total Payroll"
            amount={formatGHS(totalNet)}
            subtitle="Net after deductions"
            footer="Ready for bank upload"
          />
          <PayrollCard
            period="Active Staff"
            title="Team Size"
            amount={enrichedPayroll.length}
            subtitle="Full-time employees"
            footer="All contracts current"
          />
          <PayrollCard
            period="Pending"
            title="Payments Due"
            amount={pendingCount}
            subtitle="Awaiting approval"
            footer="Process before EOM"
          />
          <PayrollCard
            period="Processed"
            title="Paid This Cycle"
            amount={paidThisPeriod}
            subtitle="Successful transfers"
            footer="Confirmed by finance"
          />
        </div>

        {/* Search + Actions – smaller */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name or role..."
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#153361]/70 focus:ring-1 focus:ring-[#153361]/20 outline-none shadow-sm transition"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={!isDirty || isSaving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#153361] px-5 py-2 text-sm font-medium text-white shadow hover:bg-[#0d2a4e] disabled:opacity-60 transition disabled:cursor-not-allowed"
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Table – smaller fonts & tighter padding */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-[#153361]">
              <tr>
                <th className="py-3 px-5 text-left text-xs font-semibold text-white">Employee</th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-white">Role</th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-white">Basic</th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-white">Allowances</th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-white">Deductions</th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-white">PAYE Est.</th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-white">Net Pay</th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-xs text-gray-500">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filtered.map((emp, idx) => {
                  const field = fields.find((f) => f.id === emp.id);
                  return (
                    <tr key={emp.id} className="transition-colors hover:bg-blue-50/30">
                      <td className="whitespace-nowrap py-3 px-5 text-sm font-medium text-gray-900">{emp.name}</td>
                      <td className="whitespace-nowrap py-3 px-5 text-xs text-gray-600">{emp.jobTitle}</td>
                      <td className="whitespace-nowrap py-3 px-5 text-sm font-medium">{formatGHS(emp.basicSalary)}</td>

                      <td className="py-3 px-5">
                        <input
                          type="number"
                          min={0}
                          disabled={emp.paid}
                          {...(field && control.register(`employees.${idx}.allowances`, { valueAsNumber: true }))}
                          className="w-28 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-center text-gray-800 disabled:bg-gray-100 disabled:text-gray-500 focus:border-[#153361] focus:ring-1 focus:ring-[#153361]/30 outline-none transition"
                        />
                      </td>

                      <td className="py-3 px-5">
                        <input
                          type="number"
                          min={0}
                          disabled={emp.paid}
                          {...(field && control.register(`employees.${idx}.deductions`, { valueAsNumber: true }))}
                          className="w-28 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-center text-gray-800 disabled:bg-gray-100 disabled:text-gray-500 focus:border-[#153361] focus:ring-1 focus:ring-[#153361]/30 outline-none transition"
                        />
                      </td>

                      <td className="whitespace-nowrap py-3 px-5 text-xs font-medium text-red-600">
                        {emp.payeTax > 0 ? formatGHS(emp.payeTax) : "—"}
                      </td>

                      <td className="whitespace-nowrap py-3 px-5 text-sm font-semibold text-emerald-700">
                        {formatGHS(emp.netPay)}
                      </td>

                      <td className="whitespace-nowrap py-3 px-5">
                        <button
                          onClick={() => handlePay(emp.id)}
                          disabled={emp.paid}
                          className={`rounded-xl px-4 py-1.5 text-xs font-medium text-white transition shadow-sm ${
                            emp.paid
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-[#153361] hover:bg-[#0d2a4e]"
                          }`}
                        >
                          {emp.paid ? `Paid (${emp.lastPaid})` : "Pay"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          Payroll • PAYE & SSNIT estimates only • Verify with current GRA rules
        </div>
      </div>
    </div>
  );
}