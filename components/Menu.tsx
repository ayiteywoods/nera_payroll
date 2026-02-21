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
    <aside className="h-full flex flex-col bg-white rounded-2xl">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-100">
        <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c3d2e9] to-[#d4dff0] border border-[#2c4a6a]/10 flex items-center justify-center flex-shrink-0">
            <Image 
              src="/eye.png" 
              alt="logo" 
              height={20} 
              width={20}
              className="object-contain"
            />
          </div>
          <span className="hidden lg:block font-extrabold text-[#1e3147] text-2xl">
            NeraAdmin
          </span>
        </Link>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-3 py-3 sm:py-4">
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 text-sm">
          {menuItems.map((section) => (
            <div key={section.title}>
              {/* Section title */}
              <span className="hidden md:block text-[10px] sm:text-[11px] text-[#2c4a6a]/50 mb-2 uppercase tracking-widest px-2 font-semibold">
                {section.title}
              </span>

              <div className="flex flex-col gap-0.5 sm:gap-1">
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
                          group relative flex items-center gap-2 sm:gap-3
                          px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg
                          transition-all duration-200
                          ${
                            isActive
                              ? "bg-gradient-to-r from-[#2c4a6a]/10 to-[#2c4a6a]/5 text-[#1e3147] font-medium border border-[#2c4a6a]/20"
                              : "text-gray-500 hover:bg-[#c3d2e9]/30 hover:text-[#1e3147]"
                          }
                          justify-center md:justify-start
                        `}
                        title={item.label}
                      >
                        <Icon
                          size={18}
                          className={`
                            flex-shrink-0
                            ${
                              isActive
                                ? "text-[#2c4a6a]"
                                : "text-gray-400 group-hover:text-[#2c4a6a]"
                            }
                          `}
                        />

                        {/* Label */}
                        <span className="hidden md:block text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.label}
                        </span>

                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#2c4a6a]"></div>
                        )}

                        {/* Tooltip for mobile */}
                        <span className="md:hidden absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
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

      {/* Footer - User Profile (Optional) */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#c3d2e9]/40 to-[#d4dff0]/40 border border-[#2c4a6a]/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {role === "admin" ? "A" : role === "hr" ? "H" : "F"}
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1e3147] truncate capitalize">{role}</p>
            <p className="text-[10px] text-gray-500 truncate">Admin User</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Menu;