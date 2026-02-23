"use client";

import React, { useState } from "react";

export default function BenefitsAndDeductionsPage() {
  const [activeTab, setActiveTab] = useState("benefits");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    amount: "",
    status: "Active",
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
  });

  const [benefits, setBenefits] = useState([
    { id: 1, name: "Housing Allowance", type: "Allowances", amount: "GHS 500 / month", status: "Active" },
    { id: 2, name: "Transport Allowance", type: "Allowances", amount: "GHS 300 / month", status: "Active" },
    { id: 3, name: "Meal Allowance", type: "Allowances", amount: "GHS 200 / month", status: "Active" },
    { id: 4, name: "Base Salary", type: "Compensation", amount: "GHS 2000 / month", status: "Active" },
    { id: 5, name: "Performance Bonus", type: "Compensation", amount: "GHS 800 / month", status: "Active" },
    { id: 6, name: "Overtime Pay", type: "Compensation", amount: "GHS 150 / hour", status: "Active" },
    { id: 7, name: "Health Insurance", type: "Benefit Category", amount: "GHS 400 / month", status: "Active" },
    { id: 8, name: "Life Insurance", type: "Benefit Category", amount: "GHS 250 / month", status: "Active" },
    { id: 9, name: "Education Support", type: "Benefit Category", amount: "GHS 600 / month", status: "Active" },
    { id: 10, name: "Spouse", type: "Beneficiaries", amount: "GHS 300 / month", status: "Active" },
    { id: 11, name: "Children", type: "Beneficiaries", amount: "GHS 200 / month", status: "Active" },
    { id: 12, name: "Dependents", type: "Beneficiaries", amount: "GHS 150 / month", status: "Active" },
  ]);

  const [deductions, setDeductions] = useState([
    { id: 1, name: "PAYE Tax", type: "Deductions Category", amount: "15%", status: "Active" },
    { id: 2, name: "Withholding Tax", type: "Deductions Category", amount: "7.5%", status: "Active" },
    { id: 3, name: "Employee Contribution", type: "SSNIT", amount: "5.5%", status: "Active" },
    { id: 4, name: "Employer Contribution", type: "SSNIT", amount: "13%", status: "Active" },
    { id: 5, name: "Tier 1", type: "Pension", amount: "5%", status: "Active" },
    { id: 6, name: "Tier 2", type: "Pension", amount: "5%", status: "Active" },
    { id: 7, name: "Tier 3", type: "Pension", amount: "10%", status: "Active" },
    { id: 8, name: "Loan Repayment", type: "Other Deductions", amount: "GHS 500 / month", status: "Active" },
    { id: 9, name: "Union Dues", type: "Other Deductions", amount: "GHS 50 / month", status: "Active" },
    { id: 10, name: "Advances", type: "Other Deductions", amount: "GHS 300 / month", status: "Active" },
  ]);

  const benefitCategories = [
    { id: 1, name: "Allowances" },
    { id: 2, name: "Compensation" },
    { id: 3, name: "Benefit Category" },
    { id: 4, name: "Beneficiaries" },
  ];

  const deductionCategories = [
    { id: 1, name: "Deductions Category" },
    { id: 2, name: "SSNIT" },
    { id: 3, name: "Pension" },
    { id: 4, name: "Other Deductions" },
  ];

  const getCurrentData = () => {
    return activeTab === "benefits" ? benefits : deductions;
  };

  const getCurrentCategories = () => {
    return activeTab === "benefits" ? benefitCategories : deductionCategories;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const newItem = {
      id: getCurrentData().length + 1,
      name: formData.name,
      type: formData.type,
      amount: formData.amount,
      status: formData.status,
    };

    if (activeTab === "benefits") {
      setBenefits([...benefits, newItem]);
    } else {
      setDeductions([...deductions, newItem]);
    }

    setIsCreateModalOpen(false);
    setFormData({ name: "", type: "", amount: "", status: "Active" });
    alert(`${activeTab === "benefits" ? "Benefit" : "Deduction"} created successfully!`);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      type: item.type,
      amount: item.amount,
      status: item.status,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedItem = {
      ...selectedItem,
      name: formData.name,
      type: formData.type,
      amount: formData.amount,
      status: formData.status,
    };

    if (activeTab === "benefits") {
      setBenefits(benefits.map(b => b.id === selectedItem.id ? updatedItem : b));
    } else {
      setDeductions(deductions.map(d => d.id === selectedItem.id ? updatedItem : d));
    }

    setIsEditModalOpen(false);
    setSelectedItem(null);
    setFormData({ name: "", type: "", amount: "", status: "Active" });
    alert(`${activeTab === "benefits" ? "Benefit" : "Deduction"} updated successfully!`);
  };

  const handleDisable = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDisable = () => {
    if (activeTab === "benefits") {
      setBenefits(benefits.map(b => 
        b.id === selectedItem.id ? { ...b, status: "Inactive" } : b
      ));
    } else {
      setDeductions(deductions.map(d => 
        d.id === selectedItem.id ? { ...d, status: "Inactive" } : d
      ));
    }

    setIsDeleteModalOpen(false);
    setSelectedItem(null);
    alert(`${activeTab === "benefits" ? "Benefit" : "Deduction"} disabled successfully!`);
  };

  const handleExportPDF = () => {
    console.log("Exporting to PDF...");
    alert("Exporting data to PDF...");
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    console.log("Adding new category:", categoryFormData);
    setIsCategoryModalOpen(false);
    setCategoryFormData({ name: "", description: "" });
    alert("Category created successfully!");
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-1">Benefits & Deductions</h1>
        <p className="text-sm text-gray-600">Manage allowances, deductions, benefits, and compensation rules</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Benefit Types", value: "12", sub: "Allowances + Compensation + Insurance" },
          { label: "Active Deduction Rules", value: "9", sub: "Tax + SSNIT + Pension + Others" },
          { label: "Configured Categories", value: `${benefitCategories.length + deductionCategories.length}`, sub: "Benefits & Deductions groups" },
          { label: "Last Configuration Update", value: "Feb 01, 2026", sub: "by Kwakye Admin" },
        ].map((card, i) => (
          <div key={i} className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-xl p-5">
            <p className="text-xs text-white/70 mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-white/50 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100 px-6 pt-4 flex">
          {["benefits", "deductions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[#2c4a6a] text-[#2c4a6a]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "benefits" ? "Benefits & Allowances" : "Deductions"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Sidebar */}
          <div className="lg:col-span-3 border-r border-gray-100 p-6 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {activeTab === "benefits" ? "Benefits Structure" : "Deductions Structure"}
            </h3>

            <ul className="space-y-2 text-sm text-gray-700">
              {getCurrentCategories().map((cat) => (
                <li key={cat.id} className="font-medium py-1.5 px-3 rounded-lg hover:bg-white transition-colors">
                  {cat.name}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="mt-6 w-full bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Category
            </button>
          </div>

          {/* Table area */}
          <div className="lg:col-span-9 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab === "benefits" ? "Active Benefits & Allowances" : "Active Deductions"}
              </h2>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New {activeTab === "benefits" ? "Benefit" : "Deduction"}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Name", "Type", "Amount / Rate", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {getCurrentData().map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{item.type}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-[#2c4a6a]">{item.amount}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                          item.status === "Active" 
                            ? "bg-[#d4e1ed] text-[#2c4a6a] border-[#a8c5db]" 
                            : "bg-[#bfcfde] text-[#1e3147] border-[#96b3cc]"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-2 hover:bg-[#eef3f9] rounded-lg transition-colors text-gray-600 hover:text-[#2c4a6a]"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDisable(item)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-600 hover:text-red-600"
                            title="Disable"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleExportPDF}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export to PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Add Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-xl font-bold">
                Create New {activeTab === "benefits" ? "Benefit" : "Deduction"}
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder={`Enter ${activeTab === "benefits" ? "benefit" : "deduction"} name`}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type/Category *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white"
                  >
                    <option value="">Select category</option>
                    {getCurrentCategories().map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount/Rate *</label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                    placeholder="e.g., GHS 500 / month or 5.5%"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all"
                >
                  Create {activeTab === "benefits" ? "Benefit" : "Deduction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-xl font-bold">
                Edit {activeTab === "benefits" ? "Benefit" : "Deduction"}
              </h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedItem(null);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type/Category *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white"
                  >
                    {getCurrentCategories().map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount/Rate *</label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete/Disable Confirmation Modal */}
      {isDeleteModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Disable {activeTab === "benefits" ? "Benefit" : "Deduction"}?
              </h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to disable "<strong>{selectedItem.name}</strong>"? You can reactivate it later if needed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDisable}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Disable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold">Add New Category</h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                  <input
                    type="text"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                    required
                    placeholder="Enter category name"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                    rows={3}
                    placeholder="Enter category description (optional)"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}