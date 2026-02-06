"use client";

import Link from "next/link";
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
} from "react-icons/fi";
import { MdPayments, MdOutlineReceiptLong } from "react-icons/md";
import { FaMoneyBillWave, FaHandHoldingUsd } from "react-icons/fa";

const menuItems = [
  {
    title: "Main",
    items: [
      { icon: FiHome, label: "Dashboard", href: "/admin", visible: ["admin", "hr", "finance"] },
      { icon: FiUsers, label: "Employee Management", href: "/employees", visible: ["admin", "hr"] },
      { icon: FaMoneyBillWave, label: "Payroll", href: "/payroll", visible: ["admin", "finance"] },
      { icon: FaHandHoldingUsd, label: "Benefits & Deductions", href: "/benefit", visible: ["admin", "finance"] },
      { icon: FiUserPlus, label: "Recruitment", href: "/recruitment", visible: ["admin", "hr"] },
      { icon: MdPayments, label: "Leave Management", href: "/leaveManagement", visible: ["admin", "finance"] },
    ],
  },
  {
    title: "Reports",
    items: [
      { icon: FiBarChart2, label: "Payroll Reports", href: "/reports/payrollreport", visible: ["admin", "finance"] },
      { icon: MdOutlineReceiptLong, label: "Payslips", href: "/reports/payslips", visible: ["admin", "finance", "employee"] },
      { icon: FiFileText, label: "Tax & Deductions", href: "/reports/tax", visible: ["admin", "finance"] },
    ],
  },
  {
    title: "Compliance",
    items: [
      { icon: FiShield, label: "SSNIT / Tax", href: "/compliance", visible: ["admin", "finance"] },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: FiSettings, label: "Settings", href: "/settings", visible: ["admin", "hr", "finance"] },
      { icon: FiLogOut, label: "Logout", href: "../auth/logout", visible: ["admin", "hr", "finance", "employee"] },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();

  return (
    <aside className="h-full overflow-y-auto px-2 py-4">
      <div className="flex flex-col gap-6 text-sm">
        {menuItems.map((section) => (
          <div key={section.title}>
            {/* Section title */}
            <span className="hidden lg:block text-[11px] text-gray-400 mb-2 uppercase tracking-widest px-2">
              {section.title}
            </span>

            <div className="flex flex-col gap-1">
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
                        group flex items-center gap-3
                        px-3 py-2 rounded-lg
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-[#e6edff] text-[#193570] font-medium"
                            : "text-gray-500 hover:bg-gray-100 hover:text-[#193570]"
                        }
                        justify-center lg:justify-start
                      `}
                    >
                      <Icon
                        size={18}
                        className={`${
                          isActive
                            ? "text-[#193570]"
                            : "text-gray-400 group-hover:text-[#193570]"
                        }`}
                      />

                      <span className="hidden lg:block text-sm whitespace-nowrap">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Menu;
