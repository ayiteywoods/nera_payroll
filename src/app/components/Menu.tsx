import Link from "next/link";
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
    title: "MAIN",
    items: [
      {
        icon: FiHome,
        label: "Dashboard",
        href: "/admin",
        visible: ["admin", "hr", "finance"],
      },
      {
        icon: FiUsers,
        label: "Employee Management",
        href: "/employees",
        visible: ["admin", "hr"],
      },
      {
        icon: FaMoneyBillWave,
        label: "Payroll",
        href: "/payroll",
        visible: ["admin", "finance"],
      },
      {
        icon: FaHandHoldingUsd,
        label: "Benefits & Deductions",
        href: "/benefit",
        visible: ["admin", "finance"],
      },
      {
        icon: FiUserPlus, // Recruitment added under Benefits & Deductions
        label: "Recruitment",
        href: "/recruitment",
        visible: ["admin", "hr"],
      },
      {
        icon: MdPayments,
        label: "Leave Management",
        href: "/leaveManagement",
        visible: ["admin", "finance"],
      },
    ],
  },
  {
    title: "REPORTS",
    items: [
      {
        icon: FiBarChart2,
        label: "Payroll Reports",
        href: "/reports/payroll",
        visible: ["admin", "finance"],
      },
      {
        icon: MdOutlineReceiptLong,
        label: "Payslips",
        href: "/reports/payslips",
        visible: ["admin", "finance", "employee"],
      },
      {
        icon: FiFileText,
        label: "Tax & Deductions",
        href: "/reports/tax",
        visible: ["admin", "finance"],
      },
    ],
  },
  {
    title: "COMPLIANCE",
    items: [
      {
        icon: FiShield,
        label: "SSNIT / Tax",
        href: "/compliance",
        visible: ["admin", "finance"],
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      {
        icon: FiSettings,
        label: "Settings",
        href: "/settings",
        visible: ["admin", "hr", "finance"],
      },
      {
        icon: FiLogOut,
        label: "Logout",
        href: "/logout",
        visible: ["admin", "hr", "finance", "employee"],
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-4 flex flex-col">
      {menuItems.map((section) => (
        <div key={section.title} className="flex flex-col gap-2">
          <span className="hidden lg:block text-gray-400 my-4 uppercase tracking-wide">
            {section.title}
          </span>

          {section.items
            .filter((item) => item.visible.includes(role))
            .map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="
                    flex items-center justify-center lg:justify-start
                    gap-4 px-3 py-2 rounded-lg
                    text-gray-500 hover:bg-lamaSkyLight
                    hover:text-[#193570] transition
                  "
                >
                  <Icon size={20} />
                  <span className="hidden lg:block font-medium">{item.label}</span>
                </Link>
              );
            })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
