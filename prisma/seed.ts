// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ── Departments ───────────────────────────────────────
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { name: 'Engineering' },
      update: {},
      create: { name: 'Engineering', budget: 1200000, utilization: 88 },
    }),
    prisma.department.upsert({
      where: { name: 'Finance' },
      update: {},
      create: { name: 'Finance', budget: 650000, utilization: 92 },
    }),
    prisma.department.upsert({
      where: { name: 'HR' },
      update: {},
      create: { name: 'HR', budget: 320000, utilization: 79 },
    }),
  ])

  // ── Employees ─────────────────────────────────────────
  const employees = await Promise.all([
    prisma.employee.upsert({
      where: { email: 'kwame.engineer@company.com' },
      update: {},
      create: {
        employeeId: 'EMP001',
        name: 'Kwame Asare',
        email: 'kwame.engineer@company.com',
        phone: '+233241234567',
        position: 'Senior Software Engineer',
        status: 'Active',
        joiningDate: new Date('2022-03-15'),
        salary: 7800,
        performanceScore: 94,
        departmentId: departments[0].id,
        photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
    }),
    prisma.employee.upsert({
      where: { email: 'ama.hr@company.com' },
      update: {},
      create: {
        employeeId: 'EMP002',
        name: 'Ama Serwaa',
        email: 'ama.hr@company.com',
        phone: '+233542345678',
        position: 'HR Manager',
        status: 'Active',
        joiningDate: new Date('2021-08-01'),
        salary: 9200,
        performanceScore: 91,
        departmentId: departments[2].id,
        photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
    }),
  ])

  // ── Leave Requests ────────────────────────────────────
  await prisma.leaveRequest.createMany({
    data: [
      {
        employeeId: employees[0].id,
        type: 'ANNUAL',
        startDate: new Date('2026-03-10'),
        endDate: new Date('2026-03-17'),
        days: 6,
        status: 'APPROVED',
        approvedById: employees[1].id,
      },
      {
        employeeId: employees[1].id,
        type: 'SICK',
        startDate: new Date('2026-02-20'),
        endDate: new Date('2026-02-22'),
        days: 2,
        status: 'PENDING',
      },
    ],
    skipDuplicates: true,
  })

  // ── Tasks ─────────────────────────────────────────────
  await prisma.task.createMany({
    data: [
      {
        title: 'Complete Q1 code review',
        description: 'Review all pull requests from January–March',
        assigneeId: employees[0].id,
        createdById: employees[1].id,
        dueDate: new Date('2026-04-05'),
        priority: 'HIGH',
        category: 'review',
        status: 'PENDING',
      },
      {
        title: 'Prepare February payroll',
        assigneeId: employees[1].id,
        createdById: employees[1].id,
        dueDate: new Date('2026-03-02'),
        priority: 'HIGH',
        category: 'payroll',
        status: 'IN_PROGRESS',
      },
    ],
    skipDuplicates: true,
  })

  console.log('Seed completed successfully')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })