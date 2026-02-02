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
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453]">Benefits & Deductions</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Manage allowances, deductions, benefits, and compensation rules
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Allowances</h3>
          <p className="text-2xl font-bold text-[#153453] mt-2">₵ 48,750</p>
          <p className="text-xs text-gray-500 mt-1">This payroll cycle</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Deductions</h3>
          <p className="text-2xl font-bold text-[#dc2626] mt-2">₵ 32,180</p>
          <p className="text-xs text-gray-500 mt-1">Tax + SSNIT + Others</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Active Benefits</h3>
          <p className="text-2xl font-bold text-[#16a34a] mt-2">14</p>
          <p className="text-xs text-gray-500 mt-1">Assigned to employees</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Currency</h3>
          <p className="text-2xl font-bold text-[#153453] mt-2">{currency}</p>
          <p className="text-xs text-gray-500 mt-1">Default payroll currency</p>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-6 pt-4">
            <button
              onClick={() => setActiveTab("benefits")}
              className={`pb-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === "benefits"
                  ? "border-[#153453] text-[#153453]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Benefits & Allowances
            </button>
            <button
              onClick={() => setActiveTab("deductions")}
              className={`pb-4 px-6 font-medium text-sm ml-2 border-b-2 ${
                activeTab === "deductions"
                  ? "border-[#153453] text-[#153453]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Deductions
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Sidebar */}
          <div className="lg:col-span-3 border-r border-gray-200 p-5 lg:p-6 bg-[#f1f5f9]">
            <h3 className="text-sm font-medium text-[#153453] mb-4">
              {activeTab === "benefits" ? "Benefits Structure" : "Deductions Structure"}
            </h3>

            <ul className="space-y-3 text-sm">
              {activeTab === "benefits" ? (
                <>
                  <li className="font-medium text-[#153453]">Allowances</li>
                  <li className="pl-4 text-gray-600">Allowance Category</li>
                  <li className="font-medium text-[#153453] mt-4">Compensation</li>
                  <li className="font-medium text-[#153453] mt-4">Benefit Category</li>
                  <li className="font-medium text-[#153453] mt-4">Beneficiaries</li>
                </>
              ) : (
                <>
                  <li className="font-medium text-[#153453]">Deductions Category</li>
                  <li className="pl-4 text-gray-600">Tax</li>
                  <li className="pl-4 text-gray-600">SSNIT</li>
                  <li className="pl-4 text-gray-600">Pension</li>
                  <li className="font-medium text-[#153453] mt-4">Other Deductions</li>
                </>
              )}
            </ul>

            <button className="mt-6 w-full bg-[#153453] hover:bg-[#0f2a45] text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
              + Add New Category
            </button>
          </div>

          {/* Main Table */}
          <div className="lg:col-span-9 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-[#153453]">
                {activeTab === "benefits" ? "Active Benefits & Allowances" : "Active Deductions"}
              </h2>
              <button className="bg-[#153453] hover:bg-[#0f2a45] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                + New {activeTab === "benefits" ? "Benefit" : "Deduction"}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount / Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(activeTab === "benefits" ? benefitCategories : deductionCategories).flatMap(
                    (cat) =>
                      cat.items.map((item, idx) => (
                        <tr key={`${cat.id}-${idx}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#153453]">
                            {item}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {cat.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {activeTab === "benefits" ? "GHS 500 / month" : "5.5%"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-[#16a34a]/20 text-[#16a34a]">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-[#153453] hover:text-[#0f2a45] mr-3">Edit</button>
                            <button className="text-[#dc2626] hover:text-red-800">Disable</button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                Export to PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
