"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { role } from "@/lib/data";

/* ===== Icons ===== */
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiBarChart2,
  FiShield,
  FiUserPlus,
  FiClock,
} from "react-icons/fi";
import { MdPayments, MdOutlineReceiptLong } from "react-icons/md";
import { FaMoneyBillWave, FaHandHoldingUsd } from "react-icons/fa";

const menuItems = [
  {
    title: "MAIN",
    items: [
      { icon: FiHome, label: "Dashboard", href: "/admin", visible: ["admin", "hr", "finance"] },
      { icon: FiUsers, label: "Employee Management", href: "/employees", visible: ["admin", "hr"] },
      { icon: FiClock, label: "Attendance", href: "/attendance", visible: ["admin", "hr"] },
      { icon: FaMoneyBillWave, label: "Payroll", href: "/payroll", visible: ["admin", "finance"] },
      { icon: FaHandHoldingUsd, label: "Benefits & Deductions", href: "/benefit", visible: ["admin", "finance"] },
      { icon: FiUserPlus, label: "Recruitment", href: "/recruitment", visible: ["admin", "hr"] },
      { icon: MdPayments, label: "Leave Management", href: "/leaveManagement", visible: ["admin", "finance"] },
    ],
  },
  {
    title: "REPORTS",
    items: [
      { icon: FiBarChart2, label: "Payroll Reports", href: "/reports/payrollreport", visible: ["admin", "finance"] },
      { icon: MdOutlineReceiptLong, label: "Payslips", href: "/reports/payslipreport", visible: ["admin", "finance", "employee"] },
      { icon: FiFileText, label: "Tax & Deductions", href: "/reports/tax", visible: ["admin", "finance"] },
    ],
  },
  {
    title: "COMPLIANCE",
    items: [
      { icon: FiShield, label: "SSNIT / Tax", href: "/compliance", visible: ["admin", "finance"] },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { icon: FiSettings, label: "Settings", href: "/settings", visible: ["admin", "hr", "finance"] },
      { icon: FiLogOut, label: "Logout", href: "../auth/logout", visible: ["admin", "hr", "finance", "employee"] },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();

  return (
    <aside className="h-full flex flex-col bg-white rounded-2xl border border-gray-100">
      
      {/* Logo Section */}
      <div className="px-3 py-3 border-b border-gray-100">
        <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center shadow-sm">
            <Image
              src="/eye.png"
              alt="logo"
              height={16}
              width={16}
              className="object-contain brightness-0 invert"
            />
          </div>
          <span className="hidden lg:block font-bold text-[#1e3147] text-base tracking-tight">
            NeraAdmin
          </span>
        </Link>
      </div>

      {/* Menu Items */}
      <div
        className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="flex flex-col gap-2.5 text-sm">
          {menuItems.map((section, sectionIndex) => (
            <div key={section.title}>
              
              {/* Section Title */}
              <div
                className={`hidden md:block px-3 mb-1 ${
                  sectionIndex > 0 ? "pt-1.5" : ""
                }`}
              >
                <span className="text-[10px] text-[#2c4a6a]/60 uppercase tracking-wider font-semibold">
                  {section.title}
                </span>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-0">
                {section.items
                  .filter((item) => item.visible.includes(role))
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`
                          group relative flex items-center gap-3
                          px-2.5 py-2 mx-1 rounded-lg
                          transition-all duration-200 overflow-hidden
                          ${
                            isActive
                              ? "bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white font-medium shadow-sm"
                              : "text-gray-600 hover:bg-gray-50 hover:text-[#2c4a6a]"
                          }
                          justify-center md:justify-start
                        `}
                        title={item.label}
                      >
                        {isActive && (
                          <div className="absolute inset-0 opacity-10">
                            <div
                              className="absolute inset-0"
                              style={{
                                backgroundImage:
                                  "radial-gradient(circle, white 1px, transparent 1px)",
                                backgroundSize: "15px 15px",
                              }}
                            ></div>
                          </div>
                        )}

                        <Icon
                          size={17}
                          className={`
                            flex-shrink-0 relative z-10
                            ${
                              isActive
                                ? "text-white"
                                : "text-gray-400 group-hover:text-[#2c4a6a]"
                            }
                          `}
                        />

                        <span className="hidden md:block text-[13px] font-medium whitespace-nowrap overflow-hidden text-ellipsis relative z-10">
                          {item.label}
                        </span>

                        <span className="md:hidden absolute left-full ml-3 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-lg">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Profile */}
      <div className="px-3 py-2.5 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-[#2c4a6a]/30 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {role === "admin" ? "A" : role === "hr" ? "H" : "F"}
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1e3147] truncate capitalize leading-tight">
              {role}
            </p>
            <p className="text-[10px] text-gray-500 truncate leading-tight mt-0.5">
              Admin User
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Menu;