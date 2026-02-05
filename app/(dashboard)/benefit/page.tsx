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

  const currency = "GHS";

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
          {
            label: "Active Benefit Types",
            value: "12",
            sub: "Allowances + Compensation + Insurance",
          },
          {
            label: "Active Deduction Rules",
            value: "9",
            sub: "Tax + SSNIT + Pension + Others",
          },
          {
            label: "Configured Categories",
            value: `${benefitCategories.length + deductionCategories.length}`,
            sub: "Benefits & Deductions groups",
          },
          {
            label: "Last Configuration Update",
            value: "Feb 01, 2026",
            sub: "by Kwakye Admin",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-blue-50 rounded-xl p-6 shadow-md border border-blue-200 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-sm font-medium text-black">{card.label}</h3>
            <p className="text-3xl font-bold mt-2 text-black">{card.value}</p>
            <p className="text-xs text-black mt-1">{card.sub}</p>
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
              onClick={() => setActiveTab(tab)}
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
              {getCurrentCategories().map((cat) => (
                <li key={cat.id} className="font-medium">
                  {cat.name}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="mt-8 w-full bg-[#153453] hover:bg-[#0f243f] text-white py-2.5 rounded-lg text-sm transition-colors"
            >
              + Add New Category
            </button>
          </div>

          {/* Table area */}
          <div className="lg:col-span-9 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-[#153453]">
                {activeTab === "benefits" ? "Active Benefits & Allowances" : "Active Deductions"}
              </h2>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#153453] hover:bg-[#0f2a45] text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
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
                  {getCurrentData().map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-[#153453]">{item.name}</td>
                      <td className="px-6 py-4 text-gray-600">{item.type}</td>
                      <td className="px-6 py-4 text-gray-600">{item.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === "Active" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                            title="Edit"
                          >
                            <svg 
                              className="w-5 h-5 text-[#153453] group-hover:text-[#0f243f]" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                              />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDisable(item)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Disable"
                          >
                            <svg 
                              className="w-5 h-5 text-red-600 group-hover:text-red-700" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12" 
                              />
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
                className="bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                Export to PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Add Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#153453] to-[#0f243f] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#153453]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type/Category *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#153453] bg-white"
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#153453]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#153453] bg-white"
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
                  className="px-6 py-2.5 bg-gradient-to-r from-[#153453] to-[#0f243f] text-white rounded-lg text-sm font-medium hover:from-[#0f243f] hover:to-[#153453] transition-all"
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
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#153453] to-[#0f243f] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#153453]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type/Category *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#153453] bg-white"
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#153453]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#153453] bg-white"
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
                  className="px-6 py-2.5 bg-gradient-to-r from-[#153453] to-[#0f243f] text-white rounded-lg text-sm font-medium hover:from-[#0f243f] hover:to-[#153453] transition-all"
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
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
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
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="sticky top-0 bg-gradient-to-r from-[#153453] to-[#0f243f] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#153453]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                    rows={3}
                    placeholder="Enter category description (optional)"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#153453]"
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
                  className="px-6 py-2.5 bg-gradient-to-r from-[#153453] to-[#0f243f] text-white rounded-lg text-sm font-medium hover:from-[#0f243f] hover:to-[#153453] transition-all"
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