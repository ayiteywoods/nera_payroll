"use client";

import { useEffect, useState } from "react";
import { Calendar, User, DollarSign, Download } from "lucide-react";

// ──────────────────────────────
// Types
// ──────────────────────────────
interface PayrollRecord {
  id: number;
  employeeName: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: "Paid" | "Pending";
  paymentDate: string;
}

// ──────────────────────────────
// API Helpers
// ──────────────────────────────
async function fetchPayroll(month?: string, department?: string): Promise<PayrollRecord[]> {
  const query = new URLSearchParams();
  if (month) query.append("month", month);
  if (department) query.append("department", department);

  const res = await fetch(`/api/payroll?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch payroll");
  return res.json();
}

// Optional: CSV export
function exportCSV(records: PayrollRecord[]) {
  const headers = ["Employee", "Department", "Basic Salary", "Allowances", "Deductions", "Net Pay", "Status", "Payment Date"];
  const rows = records.map(r => [
    r.employeeName,
    r.department,
    r.basicSalary,
    r.allowances,
    r.deductions,
    r.netPay,
    r.status,
    new Date(r.paymentDate).toLocaleDateString("en-GB")
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `payroll_report_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// ──────────────────────────────
// Component
// ──────────────────────────────
export default function PayrollReportPage() {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState<string>("");
  const [department, setDepartment] = useState<string>("");

  const loadPayroll = async () => {
    try {
      setLoading(true);
      const data = await fetchPayroll(month, department);
      setRecords(data);
      setError(null);
    } catch {
      setError("Failed to load payroll data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPayroll(); }, []);

  const totalSalary = records.reduce((acc, r) => acc + r.basicSalary + r.allowances, 0);
  const totalDeductions = records.reduce((acc, r) => acc + r.deductions, 0);
  const totalNet = records.reduce((acc, r) => acc + r.netPay, 0);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#154667]">Payroll Reports</h1>
            <p className="mt-1 text-gray-500">Comprehensive overview of employee payroll</p>
          </div>
          <button
            onClick={() => exportCSV(records)}
            className="flex items-center gap-2 rounded-lg bg-[#154667] px-4 py-2 text-white text-sm font-medium hover:bg-[#0f3b55] transition"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-[#154667] focus:ring-1 focus:ring-[#154667]"
            placeholder="Select Month"
          />
          <input
            type="text"
            value={department}
            onChange={e => setDepartment(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-[#154667] focus:ring-1 focus:ring-[#154667]"
            placeholder="Department"
          />
          <button
            onClick={loadPayroll}
            className="rounded-md bg-[#154667] px-4 py-2 text-white text-sm font-medium hover:bg-[#0f3b55] transition"
          >
            Filter
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-white p-5 shadow flex items-center gap-4">
            <User size={28} className="text-[#154667]" />
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-xl font-semibold text-gray-700">{records.length}</p>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow flex items-center gap-4">
            <DollarSign size={28} className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Total Salary + Allowances</p>
              <p className="text-xl font-semibold text-gray-700">₵{totalSalary.toLocaleString()}</p>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow flex items-center gap-4">
            <DollarSign size={28} className="text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Total Net Pay</p>
              <p className="text-xl font-semibold text-gray-700">₵{totalNet.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="rounded-xl border bg-white p-6 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-lg">Loading payroll data...</div>
          ) : error ? (
            <div className="py-16 text-center text-red-500 text-lg">{error}</div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
              <Calendar size={50} className="mb-4" />
              <h3 className="text-lg font-medium">No payroll records found</h3>
              <p className="text-sm mt-1">Try adjusting your filters or adding payroll data.</p>
            </div>
          ) : (
            <table className="w-full text-sm min-w-[900px] table-auto">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 font-medium border-b">
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Basic Salary</th>
                  <th className="px-5 py-3">Allowances</th>
                  <th className="px-5 py-3">Deductions</th>
                  <th className="px-5 py-3">Net Pay</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">{r.employeeName}</td>
                    <td className="px-5 py-3">{r.department}</td>
                    <td className="px-5 py-3">₵{r.basicSalary.toLocaleString()}</td>
                    <td className="px-5 py-3">₵{r.allowances.toLocaleString()}</td>
                    <td className="px-5 py-3">₵{r.deductions.toLocaleString()}</td>
                    <td className="px-5 py-3 font-semibold">₵{r.netPay.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${r.status === "Paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">{new Date(r.paymentDate).toLocaleDateString("en-GB")}</td>
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
