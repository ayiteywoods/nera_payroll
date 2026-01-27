// TEMPORARY PAYROLL DATA

export let role = "admin"; // can be "admin", "hr", or "employee"

// Employees
export const employeesData = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "John Doe",
    email: "john@company.com",
    phone: "0241234567",
    department: "Finance",
    position: "Accountant",
    status: "Active",
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
    joiningDate: "2023-01-15",
    salary: 5000,
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Jane Smith",
    email: "jane@company.com",
    phone: "0242345678",
    department: "HR",
    position: "HR Manager",
    status: "Active",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
    joiningDate: "2022-07-01",
    salary: 6000,
  },
  {
    id: 3,
    employeeId: "EMP003",
    name: "Mike Johnson",
    email: "mike@company.com",
    phone: "0243456789",
    department: "IT",
    position: "Software Engineer",
    status: "Active",
    photo: "https://randomuser.me/api/portraits/men/3.jpg",
    joiningDate: "2024-02-10",
    salary: 4500,
  },
  {
    id: 4,
    employeeId: "EMP004",
    name: "Anna Lee",
    email: "anna@company.com",
    phone: "0244567890",
    department: "Finance",
    position: "Finance Analyst",
    status: "Active",
    photo: "https://randomuser.me/api/portraits/women/4.jpg",
    joiningDate: "2023-05-20",
    salary: 4800,
  },
];

// Payroll
export const payrollData = [
  {
    id: 1,
    employeeId: "EMP001",
    period: "January 2026",
    basicSalary: 5000,
    allowances: 500,
    deductions: 200,
    tax: 400,
    netPay: 4900,
    status: "Paid",
    paymentDate: "2026-01-28",
  },
  {
    id: 2,
    employeeId: "EMP002",
    period: "January 2026",
    basicSalary: 6000,
    allowances: 600,
    deductions: 250,
    tax: 480,
    netPay: 5870,
    status: "Pending",
    paymentDate: null,
  },
  {
    id: 3,
    employeeId: "EMP003",
    period: "January 2026",
    basicSalary: 4500,
    allowances: 400,
    deductions: 150,
    tax: 360,
    netPay: 4390,
    status: "Paid",
    paymentDate: "2026-01-28",
  },
];

// Salary Payments
export const paymentsData = [
  {
    id: 1,
    employeeId: "EMP001",
    amount: 4900,
    method: "Bank Transfer",
    date: "2026-01-28",
    reference: "PAYJAN001",
  },
  {
    id: 2,
    employeeId: "EMP003",
    amount: 4390,
    method: "Bank Transfer",
    date: "2026-01-28",
    reference: "PAYJAN003",
  },
];

// Tax & Deductions
export const taxData = [
  {
    id: 1,
    employeeId: "EMP001",
    type: "PAYE",
    amount: 400,
    period: "January 2026",
  },
  {
    id: 2,
    employeeId: "EMP002",
    type: "PAYE",
    amount: 480,
    period: "January 2026",
  },
  {
    id: 3,
    employeeId: "EMP003",
    type: "PAYE",
    amount: 360,
    period: "January 2026",
  },
];

// Reports (simplified for dashboard)
export const reportsData = [
  {
    id: 1,
    title: "January 2026 Payroll Summary",
    totalEmployees: 4,
    totalGrossPay: 20500,
    totalDeductions: 1110,
    totalNetPay: 19390,
    generatedDate: "2026-01-29",
  },
];
