"use client";

import React, { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  industry: string;
  employeeCount: string;
  active: boolean;
  logo?: string;
}

// ─── Initial Companies ────────────────────────────────────────────────────────
const INIT_COMPANIES: Company[] = [
  {
    id: "CO001",
    name: "Neraadmin",
    email: "contact@neraadmin.com",
    phone: "+233 30 123 4567",
    address: "14 Independence Ave, Accra, Ghana",
    currency: "GHS",
    industry: "Technology",
    employeeCount: "51-200",
    active: true,
  },
  {
    id: "CO002",
    name: "Asante Enterprises",
    email: "info@asante.com",
    phone: "+233 24 987 6543",
    address: "22 Ring Road, Kumasi, Ghana",
    currency: "GHS",
    industry: "Manufacturing",
    employeeCount: "201-500",
    active: false,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab]   = useState("company");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState("Settings saved successfully");

  // Company management
  const [companies, setCompanies]           = useState<Company[]>(INIT_COMPANIES);
  const [activeCompany, setActiveCompany]   = useState<Company>(INIT_COMPANIES[0]);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [editingCompany, setEditingCompany]     = useState<Company | null>(null);
  const [showSwitchConfirm, setShowSwitchConfirm] = useState<Company | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Company | null>(null);
  const [deleteText, setDeleteText]             = useState("");
  const [companyForm, setCompanyForm]           = useState<Omit<Company,"id"|"active">>({
    name: "", email: "", phone: "", address: "", currency: "GHS", industry: "", employeeCount: "1-50",
  });

  // Payroll Settings
  const [payrollSettings, setPayrollSettings] = useState({
    payrollFrequency: "Monthly", payrollDay: "25", taxRate: "15", ssnitRate: "5.5",
    overtimeRate: "1.5", autoCalculateTax: true, autoCalculateSSNIT: true, allowNegativeBalance: false,
  });

  // Leave Settings
  const [leaveSettings, setLeaveSettings] = useState({
    annualLeaveDays: "21", sickLeaveDays: "10", maternityLeaveDays: "84", paternityLeaveDays: "7",
    carryForwardLeave: true, maxCarryForward: "5", autoApproveLeave: false, requireApproval: true,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true, smsNotifications: false, payrollReminders: true,
    leaveRequestAlerts: true, employeeBirthdays: true, systemUpdates: true,
    weeklyReports: false, monthlyReports: true,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false, sessionTimeout: "30", passwordExpiry: "90", loginAttempts: "5",
    ipWhitelist: false, dataEncryption: true, auditLogs: true, backupFrequency: "Daily",
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light", accentColor: "#2c4a6a", fontSize: "medium",
    compactMode: false, showAnimations: true, language: "English",
  });

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = (msg = "Settings saved successfully") => {
    setSaveMessage(msg);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openAddCompany = () => {
    setEditingCompany(null);
    setCompanyForm({ name:"", email:"", phone:"", address:"", currency:"GHS", industry:"", employeeCount:"1-50" });
    setShowCompanyModal(true);
  };

  const openEditCompany = (c: Company) => {
    setEditingCompany(c);
    setCompanyForm({ name:c.name, email:c.email, phone:c.phone, address:c.address, currency:c.currency, industry:c.industry, employeeCount:c.employeeCount });
    setShowCompanyModal(true);
  };

  const saveCompany = () => {
    if (!companyForm.name || !companyForm.email) return;
    if (editingCompany) {
      const updated = { ...editingCompany, ...companyForm };
      setCompanies(prev => prev.map(c => c.id === editingCompany.id ? updated : c));
      if (activeCompany.id === editingCompany.id) setActiveCompany(updated);
      handleSave("Company updated successfully");
    } else {
      const newC: Company = {
        id: `CO${String(companies.length + 1).padStart(3,"0")}`,
        ...companyForm,
        active: false,
      };
      setCompanies(prev => [...prev, newC]);
      handleSave("New company created successfully");
    }
    setShowCompanyModal(false);
  };

  const switchCompany = (c: Company) => {
    setCompanies(prev => prev.map(co => ({ ...co, active: co.id === c.id })));
    setActiveCompany(c);
    setShowSwitchConfirm(null);
    handleSave(`Switched to ${c.name} — system updated`);
  };

  const deleteCompany = () => {
    if (!showDeleteConfirm || deleteText !== "DELETE") return;
    if (showDeleteConfirm.id === activeCompany.id) return;
    setCompanies(prev => prev.filter(c => c.id !== showDeleteConfirm.id));
    setShowDeleteConfirm(null);
    setDeleteText("");
    handleSave("Company removed successfully");
  };

  // ─── Styles ────────────────────────────────────────────────────────────────
  const inputCls  = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] bg-white text-gray-900";
  const labelCls  = "block text-sm font-semibold text-gray-700 mb-2";
  const sectionCls = "bg-white rounded-2xl border border-gray-100 p-6 mb-5";
  const toggleRow = (label: string, desc: string, checked: boolean, onChange: (v: boolean) => void) => (
    <label key={label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-5 h-5 accent-[#2c4a6a]"/>
    </label>
  );

  const SaveBtn = ({ msg }: { msg?: string }) => (
    <div className="flex justify-end mt-2">
      <button onClick={() => handleSave(msg)}
        className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
        </svg>
        Save Changes
      </button>
    </div>
  );

  const TABS = [
    { id:"company",       label:"Company",       icon:"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { id:"payroll",       label:"Payroll",       icon:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id:"leave",         label:"Leave",         icon:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { id:"notifications", label:"Notifications", icon:"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { id:"security",      label:"Security",      icon:"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
    { id:"appearance",    label:"Appearance",    icon:"M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  ];

  const INDUSTRIES = ["Technology","Manufacturing","Finance","Healthcare","Education","Retail","Agriculture","Construction","Hospitality","Transport","NGO","Government","Other"];

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen overflow-x-hidden">

      {/* Toast */}
      {saveSuccess && (
        <div className="fixed top-6 right-6 z-[100] bg-[#2c4a6a] text-white px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg animate-in slide-in-from-right">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
          <span className="text-sm font-medium">{saveMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-1">Settings</h1>
            <p className="text-sm text-gray-600">Manage your application preferences and configurations</p>
          </div>
          {/* Active company pill */}
          <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {activeCompany.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
            <div>
              <p className="text-xs font-bold text-[#153453] leading-none">{activeCompany.name}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Active workspace</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 mb-6">
        <div className="flex overflow-x-auto scrollbar-hide">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all flex-shrink-0 whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "text-[#2c4a6a] border-[#2c4a6a] bg-[#f0f5fa]"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
              }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon}/>
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════ COMPANY TAB ══════════════════════ */}
      {activeTab === "company" && (
        <div className="space-y-5">

          {/* Active company banner */}
          <div className="bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs text-white/70 font-medium mb-1 uppercase tracking-wider">Active workspace</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white text-xl font-extrabold flex-shrink-0">
                  {activeCompany.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-extrabold text-white truncate">{activeCompany.name}</h2>
                  <p className="text-sm text-white/70 mt-0.5">{activeCompany.industry} · {activeCompany.employeeCount} employees · {activeCompany.currency}</p>
                  <p className="text-xs text-white/50 mt-0.5">{activeCompany.address}</p>
                </div>
                <button onClick={() => openEditCompany(activeCompany)}
                  className="flex-shrink-0 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/20">
                {[
                  { label:"Email",    val: activeCompany.email    },
                  { label:"Phone",    val: activeCompany.phone    },
                  { label:"Currency", val: activeCompany.currency },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[10px] text-white/50 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm text-white font-semibold truncate mt-0.5">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All companies */}
          <div className={sectionCls}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-[#153453]">All companies / workspaces</h2>
                <p className="text-xs text-gray-500 mt-0.5">Switch between companies or add a new one. Switching updates the entire system.</p>
              </div>
              <button onClick={openAddCompany}
                className="bg-[#2c4a6a] hover:bg-[#1e3147] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                New company
              </button>
            </div>
            <div className="space-y-3">
              {companies.map(c => (
                <div key={c.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${c.id === activeCompany.id ? "bg-[#eef3f9] border-[#a8c5db]" : "bg-gray-50 border-gray-200 hover:border-[#c3d2e9]"}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${c.id === activeCompany.id ? "bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] text-white" : "bg-[#d4e1ed] text-[#2c4a6a]"}`}>
                    {c.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-gray-900">{c.name}</p>
                      {c.id === activeCompany.id && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#d4e1ed] text-[#2c4a6a] border border-[#a8c5db]">Active</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{c.industry} · {c.address}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {c.id !== activeCompany.id && (
                      <button onClick={() => setShowSwitchConfirm(c)}
                        className="px-3 py-1.5 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                        </svg>
                        Switch
                      </button>
                    )}
                    <button onClick={() => openEditCompany(c)}
                      className="p-1.5 hover:bg-[#d4e1ed] rounded-lg text-gray-500 hover:text-[#2c4a6a] transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    {c.id !== activeCompany.id && (
                      <button onClick={() => { setShowDeleteConfirm(c); setDeleteText(""); }}
                        className="p-1.5 hover:bg-[#bfcfde] rounded-lg text-gray-500 hover:text-[#1e3147] transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System-wide effects info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#153453] mb-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              What changes when you switch company
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", label:"Employees",    desc:"Entire workforce"       },
                { icon:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label:"Payroll",       desc:"All salary data"        },
                { icon:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",                                                                                                                                              label:"Leave records", desc:"Requests & balances"     },
                { icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",                                                          label:"Reports",       desc:"Analytics & compliance" },
              ].map(item => (
                <div key={item.label} className="bg-[#f5f8fc] rounded-xl p-4 border border-[#e2eaf3]">
                  <div className="w-8 h-8 rounded-lg bg-[#d4e1ed] flex items-center justify-center mb-2">
                    <svg className="w-4 h-4 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-[#153453]">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-2xl border-2 border-[#96b3cc] p-6">
            <h2 className="text-base font-bold text-[#1e3147] mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              Danger zone
            </h2>
            <p className="text-sm text-gray-600 mb-4">These actions are irreversible. Please proceed with caution.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => handleSave("All data cleared")}
                className="px-5 py-2.5 bg-[#e8eef4] hover:bg-[#d4e1ed] text-[#1e3147] border border-[#c3d2e9] rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Clear all data
              </button>
              <button onClick={() => handleSave("Settings reset to defaults")}
                className="px-5 py-2.5 bg-[#e8eef4] hover:bg-[#d4e1ed] text-[#1e3147] border border-[#c3d2e9] rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Reset to default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════ PAYROLL TAB ══════════════════════ */}
      {activeTab === "payroll" && (
        <div>
          <div className={sectionCls}>
            <h2 className="text-base font-bold text-[#153453] mb-5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              Payroll configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Payroll frequency</label>
                <select value={payrollSettings.payrollFrequency} onChange={e=>setPayrollSettings({...payrollSettings,payrollFrequency:e.target.value})} className={inputCls}>
                  {["Weekly","Bi-Weekly","Monthly","Quarterly"].map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Payroll day (day of month)</label>
                <input type="number" min="1" max="31" value={payrollSettings.payrollDay} onChange={e=>setPayrollSettings({...payrollSettings,payrollDay:e.target.value})} className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Tax rate (%)</label>
                <input type="number" step="0.1" value={payrollSettings.taxRate} onChange={e=>setPayrollSettings({...payrollSettings,taxRate:e.target.value})} className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Ssnit rate (%)</label>
                <input type="number" step="0.1" value={payrollSettings.ssnitRate} onChange={e=>setPayrollSettings({...payrollSettings,ssnitRate:e.target.value})} className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Overtime rate (multiplier)</label>
                <input type="number" step="0.1" value={payrollSettings.overtimeRate} onChange={e=>setPayrollSettings({...payrollSettings,overtimeRate:e.target.value})} className={inputCls}/>
              </div>
            </div>
          </div>
          <div className={sectionCls}>
            <h2 className="text-base font-bold text-[#153453] mb-5">Automation settings</h2>
            <div className="space-y-3">
              {toggleRow("Auto-calculate tax","Automatically calculate PAYE tax based on salary",payrollSettings.autoCalculateTax,v=>setPayrollSettings({...payrollSettings,autoCalculateTax:v}))}
              {toggleRow("Auto-calculate Ssnit","Automatically calculate SSNIT contributions",payrollSettings.autoCalculateSSNIT,v=>setPayrollSettings({...payrollSettings,autoCalculateSSNIT:v}))}
              {toggleRow("Allow negative balance","Allow employees to have negative payroll balance",payrollSettings.allowNegativeBalance,v=>setPayrollSettings({...payrollSettings,allowNegativeBalance:v}))}
            </div>
          </div>
          <SaveBtn msg="Payroll settings saved"/>
        </div>
      )}

      {/* ══════════════════════ LEAVE TAB ══════════════════════ */}
      {activeTab === "leave" && (
        <div>
          <div className={sectionCls}>
            <h2 className="text-base font-bold text-[#153453] mb-5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              Leave allowances
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {label:"Annual leave (days per year)", key:"annualLeaveDays"},
                {label:"Sick leave (days per year)",   key:"sickLeaveDays"},
                {label:"Maternity leave (days)",        key:"maternityLeaveDays"},
                {label:"Paternity leave (days)",        key:"paternityLeaveDays"},
                {label:"Max carry forward days",        key:"maxCarryForward"},
              ].map(f => (
                <div key={f.key}>
                  <label className={labelCls}>{f.label}</label>
                  <input type="number" value={leaveSettings[f.key as keyof typeof leaveSettings] as string}
                    onChange={e=>setLeaveSettings({...leaveSettings,[f.key]:e.target.value})} className={inputCls}/>
                </div>
              ))}
            </div>
          </div>
          <div className={sectionCls}>
            <h2 className="text-base font-bold text-[#153453] mb-5">Leave policies</h2>
            <div className="space-y-3">
              {toggleRow("Allow carry forward","Allow unused leave to carry forward to next year",leaveSettings.carryForwardLeave,v=>setLeaveSettings({...leaveSettings,carryForwardLeave:v}))}
              {toggleRow("Auto-approve leave","Automatically approve leave requests",leaveSettings.autoApproveLeave,v=>setLeaveSettings({...leaveSettings,autoApproveLeave:v}))}
              {toggleRow("Require manager approval","All leave requests must be approved by manager",leaveSettings.requireApproval,v=>setLeaveSettings({...leaveSettings,requireApproval:v}))}
            </div>
          </div>
          <SaveBtn msg="Leave settings saved"/>
        </div>
      )}

      {/* ══════════════════════ NOTIFICATIONS TAB ══════════════════════ */}
      {activeTab === "notifications" && (
        <div>
          <div className={sectionCls}>
            <h2 className="text-base font-bold text-[#153453] mb-5">Communication preferences</h2>
            <div className="space-y-3">
              {toggleRow("Email notifications","Receive notifications via email",notificationSettings.emailNotifications,v=>setNotificationSettings({...notificationSettings,emailNotifications:v}))}
              {toggleRow("SMS notifications","Receive notifications via SMS",notificationSettings.smsNotifications,v=>setNotificationSettings({...notificationSettings,smsNotifications:v}))}
            </div>
          </div>
          <div className={sectionCls}>
            <h2 className="text-base font-bold text-[#153453] mb-5">Alert types</h2>
            <div className="space-y-3">
              {toggleRow("Payroll reminders","Get reminded before payroll processing",notificationSettings.payrollReminders,v=>setNotificationSettings({...notificationSettings,payrollReminders:v}))}
              {toggleRow("Leave request alerts","Get notified of new leave requests",notificationSettings.leaveRequestAlerts,v=>setNotificationSettings({...notificationSettings,leaveRequestAlerts:v}))}
              {toggleRow("Employee birthdays","Get notified of employee birthdays",notificationSettings.employeeBirthdays,v=>setNotificationSettings({...notificationSettings,employeeBirthdays:v}))}
              {toggleRow("System updates","Get notified of system updates and maintenance",notificationSettings.systemUpdates,v=>setNotificationSettings({...notificationSettings,systemUpdates:v}))}
            </div>
          </div>
          <div className={sectionCls}>
            <h2 className="text-base font-bold text-[#153453] mb-5">Report notifications</h2>
            <div className="space-y-3">
              {toggleRow("Weekly reports","Receive weekly summary reports",notificationSettings.weeklyReports,v=>setNotificationSettings({...notificationSettings,weeklyReports:v}))}
              {toggleRow("Monthly reports","Receive monthly summary reports",notificationSettings.monthlyReports,v=>setNotificationSettings({...notificationSettings,monthlyReports:v}))}
            </div>
          </div>
          <SaveBtn msg="Notification settings saved"/>
        </div>
      )}

      {/* ══════════════════════ SECURITY TAB ══════════════════════ */}
      {activeTab === "security" && (
        <div>
          <div className={sectionCls}>
            <h2 className="text-base font-bold text-[#153453] mb-5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              Authentication
            </h2>
            <div className="space-y-3 mb-5">
              {toggleRow("Two-factor authentication","Require 2FA for all user logins",securitySettings.twoFactorAuth,v=>setSecuritySettings({...securitySettings,twoFactorAuth:v}))}
              {toggleRow("IP whitelist","Restrict access to specific IP addresses",securitySettings.ipWhitelist,v=>setSecuritySettings({...securitySettings,ipWhitelist:v}))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {label:"Session timeout (minutes)", key:"sessionTimeout"},
                {label:"Password expiry (days)",    key:"passwordExpiry"},
                {label:"Max login attempts",         key:"loginAttempts"},
              ].map(f=>(
                <div key={f.key}>
                  <label className={labelCls}>{f.label}</label>
                  <input type="number" value={securitySettings[f.key as keyof typeof securitySettings] as string}
                    onChange={e=>setSecuritySettings({...securitySettings,[f.key]:e.target.value})} className={inputCls}/>
                </div>
              ))}
              <div>
                <label className={labelCls}>Backup frequency</label>
                <select value={securitySettings.backupFrequency} onChange={e=>setSecuritySettings({...securitySettings,backupFrequency:e.target.value})} className={inputCls}>
                  {["Hourly","Daily","Weekly","Monthly"].map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className={sectionCls}>
            <h2 className="text-base font-bold text-[#153453] mb-5">Data protection</h2>
            <div className="space-y-3">
              {toggleRow("Data encryption","Encrypt all sensitive data at rest",securitySettings.dataEncryption,v=>setSecuritySettings({...securitySettings,dataEncryption:v}))}
              {toggleRow("Audit logs","Keep detailed logs of all system activities",securitySettings.auditLogs,v=>setSecuritySettings({...securitySettings,auditLogs:v}))}
            </div>
          </div>
          <SaveBtn msg="Security settings saved"/>
        </div>
      )}

      {/* ══════════════════════ APPEARANCE TAB ══════════════════════ */}
      {activeTab === "appearance" && (
        <div>
          <div className={sectionCls}>
            <h2 className="text-base font-bold text-[#153453] mb-5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#eef3f9] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
              </div>
              Display preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Theme</label>
                <select value={appearanceSettings.theme} onChange={e=>setAppearanceSettings({...appearanceSettings,theme:e.target.value})} className={inputCls}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Accent color</label>
                <div className="flex gap-3 pt-1">
                  {["#2c4a6a","#1e3147","#4a6b82","#6b8ca3","#8badc3"].map(color=>(
                    <button key={color} onClick={()=>setAppearanceSettings({...appearanceSettings,accentColor:color})}
                      className={`w-10 h-10 rounded-lg transition-all ${appearanceSettings.accentColor===color?"ring-2 ring-offset-2 ring-[#2c4a6a] scale-110":"hover:scale-105"}`}
                      style={{backgroundColor:color}}/>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Font size</label>
                <select value={appearanceSettings.fontSize} onChange={e=>setAppearanceSettings({...appearanceSettings,fontSize:e.target.value})} className={inputCls}>
                  {["small","medium","large","xlarge"].map(v=><option key={v} value={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Language</label>
                <select value={appearanceSettings.language} onChange={e=>setAppearanceSettings({...appearanceSettings,language:e.target.value})} className={inputCls}>
                  {["English","French","Spanish","Twi"].map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className={sectionCls}>
            <h2 className="text-base font-bold text-[#153453] mb-5">Interface options</h2>
            <div className="space-y-3">
              {toggleRow("Compact mode","Reduce spacing and padding for more content",appearanceSettings.compactMode,v=>setAppearanceSettings({...appearanceSettings,compactMode:v}))}
              {toggleRow("Show animations","Enable smooth transitions and animations",appearanceSettings.showAnimations,v=>setAppearanceSettings({...appearanceSettings,showAnimations:v}))}
            </div>
          </div>
          <SaveBtn msg="Appearance settings saved"/>
        </div>
      )}

      {/* ══════════════════════ MODALS ══════════════════════ */}

      {/* Create / Edit company modal */}
      {showCompanyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 rounded-t-2xl flex justify-between items-center z-10">
              <h3 className="font-bold text-base">{editingCompany ? "Edit company" : "Create new company"}</h3>
              <button onClick={()=>setShowCompanyModal(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelCls}>Company name *</label>
                <input value={companyForm.name} onChange={e=>setCompanyForm(p=>({...p,name:e.target.value}))} className={inputCls} placeholder="e.g. Asante Enterprises Ltd"/>
              </div>
              <div>
                <label className={labelCls}>Email *</label>
                <input type="email" value={companyForm.email} onChange={e=>setCompanyForm(p=>({...p,email:e.target.value}))} className={inputCls} placeholder="contact@company.com"/>
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input type="tel" value={companyForm.phone} onChange={e=>setCompanyForm(p=>({...p,phone:e.target.value}))} className={inputCls} placeholder="+233 30 000 0000"/>
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Address</label>
                <input value={companyForm.address} onChange={e=>setCompanyForm(p=>({...p,address:e.target.value}))} className={inputCls} placeholder="Street, City, Country"/>
              </div>
              <div>
                <label className={labelCls}>Industry</label>
                <select value={companyForm.industry} onChange={e=>setCompanyForm(p=>({...p,industry:e.target.value}))} className={inputCls}>
                  <option value="">Select industry</option>
                  {INDUSTRIES.map(i=><option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Currency</label>
                <select value={companyForm.currency} onChange={e=>setCompanyForm(p=>({...p,currency:e.target.value}))} className={inputCls}>
                  <option value="GHS">GHS — Ghanaian Cedi</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Employee count</label>
                <select value={companyForm.employeeCount} onChange={e=>setCompanyForm(p=>({...p,employeeCount:e.target.value}))} className={inputCls}>
                  {["1-50","51-200","201-500","501-1000","1000+"].map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 flex gap-3 pt-2">
                <button onClick={()=>setShowCompanyModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={saveCompany} className="flex-1 py-2.5 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-xl text-sm font-semibold transition-all">
                  {editingCompany ? "Save changes" : "Create company"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Switch company confirm */}
      {showSwitchConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="w-12 h-12 rounded-full bg-[#eef3f9] flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#153453] text-center mb-2">Switch to {showSwitchConfirm.name}?</h3>
            <p className="text-sm text-gray-500 text-center mb-2">The entire system — employees, payroll, leave records and reports — will switch to this company's workspace.</p>
            <div className="bg-[#eef3f9] border border-[#c3d2e9] rounded-xl p-3 mb-5">
              <p className="text-xs text-[#2c4a6a] font-medium text-center">This does not delete any data. You can switch back at any time.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setShowSwitchConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={()=>switchCompany(showSwitchConfirm)} className="flex-1 py-2.5 bg-[#2c4a6a] hover:bg-[#1e3147] text-white rounded-xl text-sm font-semibold transition-all">Switch now</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete company confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] px-6 py-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Remove company</h2>
                <p className="text-xs text-white/70">This action cannot be undone</p>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-[#e8eef4] border border-[#c3d2e9] rounded-xl p-4 mb-5">
                <p className="text-sm text-[#1e3147] font-medium">⚠ Warning: This is permanent</p>
                <p className="text-xs text-[#4a6b8a] mt-1">All data for <strong>{showDeleteConfirm.name}</strong> including employees, payrolls, and records will be permanently deleted.</p>
              </div>
              <div className="mb-4">
                <label className={labelCls}>Type <span className="font-bold text-[#2c4a6a]">DELETE</span> to confirm</label>
                <input className={inputCls} placeholder="DELETE" value={deleteText} onChange={e=>setDeleteText(e.target.value)}/>
              </div>
              <div className="flex gap-3">
                <button onClick={()=>{setShowDeleteConfirm(null);setDeleteText("");}} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={deleteCompany} disabled={deleteText !== "DELETE"}
                  className="flex-1 px-4 py-2.5 bg-[#2c4a6a] hover:bg-[#1e3147] disabled:bg-[#bfcfde] disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white transition-all">
                  Delete permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}