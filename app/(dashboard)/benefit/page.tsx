"use client";

import React, { useState } from "react";

export default function BenefitsAndDeductionsPage() {
  const [activeTab, setActiveTab] = useState<"benefits" | "deductions">("benefits");

  const benefitCategories = [
    { id: 1, name: "Allowances", items: ["Housing Allowance", "Transport Allowance", "Meal Allowance"] },
    { id: 2, name: "Compensation", items: ["Base Salary", "Performance Bonus", "Overtime Pay"] },
    { id: 3, name: "Benefit Category", items: ["Health Insurance", "Life Insurance", "Education Support"] },
    { id: 4, name: "Beneficiaries", items: ["Spouse", "Children", "Dependents"] },
  ];

  const deductionCategories = [
    { id: 1, name: "Deductions Category", items: ["PAYE Tax", "Withholding Tax"] },
    { id: 2, name: "SSNIT", items: ["Employee Contribution", "Employer Contribution"] },
    { id: 3, name: "Pension", items: ["Tier 1", "Tier 2", "Tier 3"] },
    { id: 4, name: "Other Deductions", items: ["Loan Repayment", "Union Dues", "Advances"] },
  ];

  const currency = "GHS";

  return (
    <div className="min-h-screen bg-[#f9fafb] p-4 lg:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#153453]">Benefits & Deductions</h1>
        <p className="text-gray-600 mt-1">
          Manage allowances, deductions, benefits, and compensation rules
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: "Total Allowances", value: "GHS 48,750" },
          { label: "Total Deductions", value: "GHS 32,180" },
          { label: "Active Benefits", value: "14" },
          { label: "Currency", value: currency },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-blue-50 rounded-xl p-6 shadow-md border border-blue-100"
          >
            <h3 className="text-sm text-gray-700">{card.label}</h3>
            <p className="text-3xl font-bold text-[#153453] mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 pt-4 flex">
          {["benefits", "deductions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[#153453] text-[#153453]"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab === "benefits" ? "Benefits & Allowances" : "Deductions"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Sidebar */}
          <div className="lg:col-span-3 border-r border-gray-200 p-6 bg-[#f1f5f9]">
            <h3 className="text-sm font-medium text-[#153453] mb-4">
              {activeTab === "benefits" ? "Benefits Structure" : "Deductions Structure"}
            </h3>

            <ul className="space-y-2 text-sm text-gray-700">
              {(activeTab === "benefits" ? benefitCategories : deductionCategories).map(
                (cat) => (
                  <li key={cat.id} className="font-medium">
                    {cat.name}
                  </li>
                )
              )}
            </ul>

            <button className="mt-8 w-full bg-[#153453] hover:bg-[#0f243f] text-white py-2.5 rounded-lg text-sm">
              + Add New Category
            </button>
          </div>

          {/* Table */}
          <div className="lg:col-span-9 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-[#153453]">
                {activeTab === "benefits" ? "Active Benefits & Allowances" : "Active Deductions"}
              </h2>
              <button className="bg-[#153453] hover:bg-[#0f2a45] text-white px-4 py-2 rounded-lg text-sm">
                + New {activeTab === "benefits" ? "Benefit" : "Deduction"}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Name", "Type", "Amount / Rate", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(activeTab === "benefits" ? benefitCategories : deductionCategories)
                    .flatMap((cat) =>
                      cat.items.map((item, idx) => (
                        <tr key={`${cat.id}-${idx}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-[#153453]">{item}</td>
                          <td className="px-6 py-4 text-gray-600">{cat.name}</td>
                          <td className="px-6 py-4 text-gray-600">
                            {activeTab === "benefits" ? "GHS 500 / month" : "5.5%"}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm">
                            <button className="text-[#153453] mr-3">Edit</button>
                            <button className="text-red-600">Disable</button>
                          </td>
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-lg text-sm">
                Export to PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
