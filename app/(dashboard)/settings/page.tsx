"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "NeraPay Solutions",
    companyEmail: "contact@nerapay.com",
    companyPhone: "+233 30 123 4567",
    companyAddress: "14 Independence Ave, Accra, Ghana",
    currency: "GHS",
    dateFormat: "DD/MM/YYYY",
    timeZone: "GMT",
    fiscalYearStart: "January",
  });

  // Payroll Settings State
  const [payrollSettings, setPayrollSettings] = useState({
    payrollFrequency: "Monthly",
    payrollDay: "25",
    taxRate: "15",
    ssnitRate: "5.5",
    overtimeRate: "1.5",
    autoCalculateTax: true,
    autoCalculateSSNIT: true,
    allowNegativeBalance: false,
  });

  // Leave Settings State
  const [leaveSettings, setLeaveSettings] = useState({
    annualLeaveDays: "21",
    sickLeaveDays: "10",
    maternityLeaveDays: "84",
    paternityLeaveDays: "7",
    carryForwardLeave: true,
    maxCarryForward: "5",
    autoApproveLeave: false,
    requireApproval: true,
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    payrollReminders: true,
    leaveRequestAlerts: true,
    employeeBirthdays: true,
    systemUpdates: true,
    weeklyReports: false,
    monthlyReports: true,
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "5",
    ipWhitelist: false,
    dataEncryption: true,
    auditLogs: true,
    backupFrequency: "Daily",
  });

  // Appearance Settings State
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    accentColor: "#2c4a6a",
    fontSize: "medium",
    compactMode: false,
    showAnimations: true,
    language: "English",
  });

  const tabs = [
    { id: "general", label: "General", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
    { id: "payroll", label: "Payroll", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "leave", label: "Leave", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { id: "notifications", label: "Notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { id: "security", label: "Security", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
    { id: "appearance", label: "Appearance", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  ];

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white text-gray-900";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";
  const sectionClass = "bg-white rounded-2xl border border-gray-100 p-6 mb-5";

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">
      
      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-6 right-6 z-[100] bg-[#2c4a6a] text-white px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">Settings saved successfully</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-1">Settings</h1>
        <p className="text-sm text-gray-600">Manage your application preferences and configurations</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl border border-gray-100 mb-6">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all flex-shrink-0 whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "text-[#2c4a6a] border-[#2c4a6a] bg-[#f0f5fa]"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* GENERAL SETTINGS */}
      {activeTab === "general" && (
        <div>
          <div className={sectionClass}>
            <h2 className="text-lg font-bold text-[#1e3147] mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Company Name</label>
                <input
                  type="text"
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Company Email</label>
                <input
                  type="email"
                  value={generalSettings.companyEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, companyEmail: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Company Phone</label>
                <input
                  type="tel"
                  value={generalSettings.companyPhone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, companyPhone: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Currency</label>
                <select
                  value={generalSettings.currency}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                  className={inputClass}
                >
                  <option value="GHS">GHS (Ghanaian Cedi)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Company Address</label>
                <input
                  type="text"
                  value={generalSettings.companyAddress}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, companyAddress: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-lg font-bold text-[#1e3147] mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Regional Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Date Format</label>
                <select
                  value={generalSettings.dateFormat}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
                  className={inputClass}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Time Zone</label>
                <select
                  value={generalSettings.timeZone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, timeZone: e.target.value })}
                  className={inputClass}
                >
                  <option value="GMT">GMT (Greenwich Mean Time)</option>
                  <option value="WAT">WAT (West Africa Time)</option>
                  <option value="EAT">EAT (East Africa Time)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Fiscal Year Start</label>
                <select
                  value={generalSettings.fiscalYearStart}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, fiscalYearStart: e.target.value })}
                  className={inputClass}
                >
                  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* PAYROLL SETTINGS */}
      {activeTab === "payroll" && (
        <div>
          <div className={sectionClass}>
            <h2 className="text-lg font-bold text-[#1e3147] mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Payroll Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Payroll Frequency</label>
                <select
                  value={payrollSettings.payrollFrequency}
                  onChange={(e) => setPayrollSettings({ ...payrollSettings, payrollFrequency: e.target.value })}
                  className={inputClass}
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-Weekly">Bi-Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Payroll Day (Day of Month)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={payrollSettings.payrollDay}
                  onChange={(e) => setPayrollSettings({ ...payrollSettings, payrollDay: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={payrollSettings.taxRate}
                  onChange={(e) => setPayrollSettings({ ...payrollSettings, taxRate: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>SSNIT Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={payrollSettings.ssnitRate}
                  onChange={(e) => setPayrollSettings({ ...payrollSettings, ssnitRate: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Overtime Rate (Multiplier)</label>
                <input
                  type="number"
                  step="0.1"
                  value={payrollSettings.overtimeRate}
                  onChange={(e) => setPayrollSettings({ ...payrollSettings, overtimeRate: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-lg font-bold text-[#1e3147] mb-5">Automation Settings</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Auto-Calculate Tax</p>
                  <p className="text-sm text-gray-500">Automatically calculate PAYE tax based on salary</p>
                </div>
                <input
                  type="checkbox"
                  checked={payrollSettings.autoCalculateTax}
                  onChange={(e) => setPayrollSettings({ ...payrollSettings, autoCalculateTax: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Auto-Calculate SSNIT</p>
                  <p className="text-sm text-gray-500">Automatically calculate SSNIT contributions</p>
                </div>
                <input
                  type="checkbox"
                  checked={payrollSettings.autoCalculateSSNIT}
                  onChange={(e) => setPayrollSettings({ ...payrollSettings, autoCalculateSSNIT: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Allow Negative Balance</p>
                  <p className="text-sm text-gray-500">Allow employees to have negative payroll balance</p>
                </div>
                <input
                  type="checkbox"
                  checked={payrollSettings.allowNegativeBalance}
                  onChange={(e) => setPayrollSettings({ ...payrollSettings, allowNegativeBalance: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* LEAVE SETTINGS */}
      {activeTab === "leave" && (
        <div>
          <div className={sectionClass}>
            <h2 className="text-lg font-bold text-[#1e3147] mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Leave Allowances
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Annual Leave (Days per Year)</label>
                <input
                  type="number"
                  value={leaveSettings.annualLeaveDays}
                  onChange={(e) => setLeaveSettings({ ...leaveSettings, annualLeaveDays: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Sick Leave (Days per Year)</label>
                <input
                  type="number"
                  value={leaveSettings.sickLeaveDays}
                  onChange={(e) => setLeaveSettings({ ...leaveSettings, sickLeaveDays: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Maternity Leave (Days)</label>
                <input
                  type="number"
                  value={leaveSettings.maternityLeaveDays}
                  onChange={(e) => setLeaveSettings({ ...leaveSettings, maternityLeaveDays: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Paternity Leave (Days)</label>
                <input
                  type="number"
                  value={leaveSettings.paternityLeaveDays}
                  onChange={(e) => setLeaveSettings({ ...leaveSettings, paternityLeaveDays: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Max Carry Forward Days</label>
                <input
                  type="number"
                  value={leaveSettings.maxCarryForward}
                  onChange={(e) => setLeaveSettings({ ...leaveSettings, maxCarryForward: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-lg font-bold text-[#1e3147] mb-5">Leave Policies</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Allow Carry Forward</p>
                  <p className="text-sm text-gray-500">Allow unused leave to carry forward to next year</p>
                </div>
                <input
                  type="checkbox"
                  checked={leaveSettings.carryForwardLeave}
                  onChange={(e) => setLeaveSettings({ ...leaveSettings, carryForwardLeave: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Auto-Approve Leave</p>
                  <p className="text-sm text-gray-500">Automatically approve leave requests</p>
                </div>
                <input
                  type="checkbox"
                  checked={leaveSettings.autoApproveLeave}
                  onChange={(e) => setLeaveSettings({ ...leaveSettings, autoApproveLeave: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Require Manager Approval</p>
                  <p className="text-sm text-gray-500">All leave requests must be approved by manager</p>
                </div>
                <input
                  type="checkbox"
                  checked={leaveSettings.requireApproval}
                  onChange={(e) => setLeaveSettings({ ...leaveSettings, requireApproval: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATION SETTINGS */}
      {activeTab === "notifications" && (
        <div>
          <div className={sectionClass}>
            <h2 className="text-lg font-bold text-[#1e3147] mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              Communication Preferences
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.smsNotifications}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-lg font-bold text-[#1e3147] mb-5">Alert Types</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Payroll Reminders</p>
                  <p className="text-sm text-gray-500">Get reminded before payroll processing</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.payrollReminders}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, payrollReminders: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Leave Request Alerts</p>
                  <p className="text-sm text-gray-500">Get notified of new leave requests</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.leaveRequestAlerts}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, leaveRequestAlerts: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Employee Birthdays</p>
                  <p className="text-sm text-gray-500">Get notified of employee birthdays</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.employeeBirthdays}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, employeeBirthdays: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">System Updates</p>
                  <p className="text-sm text-gray-500">Get notified of system updates and maintenance</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.systemUpdates}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, systemUpdates: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-lg font-bold text-[#1e3147] mb-5">Report Notifications</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Weekly Reports</p>
                  <p className="text-sm text-gray-500">Receive weekly summary reports</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.weeklyReports}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReports: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Monthly Reports</p>
                  <p className="text-sm text-gray-500">Receive monthly summary reports</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.monthlyReports}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, monthlyReports: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* SECURITY SETTINGS */}
      {activeTab === "security" && (
        <div>
          <div className={sectionClass}>
            <h2 className="text-lg font-bold text-[#1e3147] mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              Authentication
            </h2>
            <div className="space-y-4 mb-5">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Require 2FA for all user logins</p>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings.twoFactorAuth}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">IP Whitelist</p>
                  <p className="text-sm text-gray-500">Restrict access to specific IP addresses</p>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings.ipWhitelist}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Password Expiry (days)</label>
                <input
                  type="number"
                  value={securitySettings.passwordExpiry}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Max Login Attempts</label>
                <input
                  type="number"
                  value={securitySettings.loginAttempts}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, loginAttempts: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Backup Frequency</label>
                <select
                  value={securitySettings.backupFrequency}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, backupFrequency: e.target.value })}
                  className={inputClass}
                >
                  <option value="Hourly">Hourly</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-lg font-bold text-[#1e3147] mb-5">Data Protection</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Data Encryption</p>
                  <p className="text-sm text-gray-500">Encrypt all sensitive data at rest</p>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings.dataEncryption}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, dataEncryption: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Audit Logs</p>
                  <p className="text-sm text-gray-500">Keep detailed logs of all system activities</p>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings.auditLogs}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, auditLogs: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* APPEARANCE SETTINGS */}
      {activeTab === "appearance" && (
        <div>
          <div className={sectionClass}>
            <h2 className="text-lg font-bold text-[#1e3147] mb-5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              Display Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Theme</label>
                <select
                  value={appearanceSettings.theme}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, theme: e.target.value })}
                  className={inputClass}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Accent Color</label>
                <div className="flex gap-3">
                  {["#2c4a6a", "#1e3147", "#4a6b82", "#6b8ca3", "#8badc3"].map(color => (
                    <button
                      key={color}
                      onClick={() => setAppearanceSettings({ ...appearanceSettings, accentColor: color })}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        appearanceSettings.accentColor === color
                          ? "ring-2 ring-offset-2 ring-[#2c4a6a] scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Font Size</label>
                <select
                  value={appearanceSettings.fontSize}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, fontSize: e.target.value })}
                  className={inputClass}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="xlarge">Extra Large</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Language</label>
                <select
                  value={appearanceSettings.language}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, language: e.target.value })}
                  className={inputClass}
                >
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Twi">Twi</option>
                </select>
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-lg font-bold text-[#1e3147] mb-5">Interface Options</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Compact Mode</p>
                  <p className="text-sm text-gray-500">Reduce spacing and padding for more content</p>
                </div>
                <input
                  type="checkbox"
                  checked={appearanceSettings.compactMode}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, compactMode: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Show Animations</p>
                  <p className="text-sm text-gray-500">Enable smooth transitions and animations</p>
                </div>
                <input
                  type="checkbox"
                  checked={appearanceSettings.showAnimations}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, showAnimations: e.target.checked })}
                  className="w-5 h-5 accent-[#2c4a6a]"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border-2 border-red-200 p-6 mt-6">
        <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Danger Zone
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All Data
          </button>
          <button className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset to Default
          </button>
          <button
            onClick={() => setIsDeleteAccountModalOpen(true)}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {isDeleteAccountModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Delete Account</h2>
                  <p className="text-sm text-white/80">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                <p className="text-sm text-red-800 font-medium">⚠️ Warning: This is permanent!</p>
                <p className="text-xs text-red-600 mt-1">All data, employees, payrolls, and records will be permanently deleted.</p>
              </div>
              <div>
                <label className={labelClass}>
                  Type <span className="font-bold text-red-600">DELETE</span> to confirm
                </label>
                <input
                  className={`${inputClass} border-red-200 focus:ring-red-600`}
                  placeholder="DELETE"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                />
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => { setIsDeleteAccountModalOpen(false); setDeleteConfirmText(""); }}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmText !== "DELETE"}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white transition-all"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}