// components/DepartmentAttendanceAreaChart.tsx
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';

// Dummy attendance data — 1 = Present, 0 = Absent
const attendanceData = [
  { date: '2025-01-17', Management: 1, Engineering: 1, HR: 1, Sales: 0, Support: 1 },
  { date: '2025-01-18', Management: 1, Engineering: 1, HR: 1, Sales: 1, Support: 1 },
  { date: '2025-01-19', Management: 1, Engineering: 0, HR: 1, Sales: 1, Support: 0 },
  { date: '2025-01-20', Management: 0, Engineering: 1, HR: 1, Sales: 1, Support: 1 },
  { date: '2025-01-21', Management: 1, Engineering: 1, HR: 0, Sales: 1, Support: 1 },
  { date: '2025-01-22', Management: 1, Engineering: 1, HR: 1, Sales: 0, Support: 1 },
  { date: '2025-01-23', Management: 1, Engineering: 0, HR: 1, Sales: 1, Support: 0 },
  { date: '2025-01-24', Management: 0, Engineering: 1, HR: 1, Sales: 1, Support: 1 },
  { date: '2025-01-25', Management: 1, Engineering: 1, HR: 1, Sales: 1, Support: 1 },
  { date: '2025-01-26', Management: 1, Engineering: 1, HR: 0, Sales: 0, Support: 1 },
  { date: '2025-01-27', Management: 1, Engineering: 0, HR: 1, Sales: 1, Support: 1 },
  { date: '2025-01-28', Management: 0, Engineering: 1, HR: 1, Sales: 1, Support: 0 },
  { date: '2025-01-29', Management: 1, Engineering: 1, HR: 1, Sales: 0, Support: 1 },
  { date: '2025-01-30', Management: 1, Engineering: 1, HR: 1, Sales: 1, Support: 1 },
];

// Exact color palette extracted from your screenshot
const DEPARTMENT_COLORS = {
  Management:   '#1e40af',   // deep navy blue (main dark)
  Engineering:  '#3b82f6',   // vibrant blue
  HR:           '#60a5fa',   // medium-light blue
  Sales:        '#93c5fd',   // softer blue
  Support:      '#bfdbfe',   // very light blue / almost cyan-gray
};

interface DepartmentAttendanceAreaChartProps {
  data?: typeof attendanceData;
  height?: number;
  title?: string;
}

const DepartmentAttendanceAreaChart: React.FC<DepartmentAttendanceAreaChartProps> = ({
  data = attendanceData,
  height = 380,
  title = 'Department Attendance Trend (Last 14 Days)',
}) => {
  // Calculate daily total attendance & average
  const dailyTotals = data.map(day => {
    return Object.entries(day).reduce((sum, [key, val]) => 
      key !== 'date' && typeof val === 'number' ? sum + val : sum, 0);
  });
  const avgAttendance = dailyTotals.reduce((a, b) => a + b, 0) / dailyTotals.length;

  return (
    <div className="w-full rounded-2xl p-6 shadow-2xl border border-blue-800/40 backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-blue-100 mb-6 tracking-tight">{title}</h2>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            {Object.entries(DEPARTMENT_COLORS).map(([dept, color]) => (
              <linearGradient key={dept} id={`grad${dept}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.75} />
                <stop offset="95%" stopColor={color} stopOpacity={0.08} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" opacity={0.4} />
          
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            tick={{ fill: '#cbd5e1', fontSize: 12 }}
            tickFormatter={val => val.slice(5).replace('-', '/')}
          />
          
          <YAxis 
            stroke="#94a3b8" 
            tick={{ fill: '#cbd5e1', fontSize: 12 }}
            domain={[0, 'dataMax + 0.4']}
            tickFormatter={val => val === 1 ? '✓' : val === 0 ? '✗' : ''}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#e2e8f0',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)'
            }}
            formatter={(value: number, name: string) => [
              value === 1 ? 'Present' : 'Absent',
              name
            ]}
            labelStyle={{ color: '#94a3b8', fontWeight: 500 }}
          />

          <Legend 
            wrapperStyle={{ paddingTop: 12 }} 
            iconType="circle"
          />

          {/* Stacked areas — one per department */}
          {Object.keys(DEPARTMENT_COLORS).map(dept => (
            <Area
              key={dept}
              type="monotone"
              dataKey={dept}
              stackId="attendance"
              stroke={DEPARTMENT_COLORS[dept as keyof typeof DEPARTMENT_COLORS]}
              fill={`url(#grad${dept})`}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              animationDuration={1200}
            />
          ))}

          {/* Average attendance reference line */}
          <ReferenceLine
            y={avgAttendance}
            stroke="#facc15"
            strokeWidth={2}
            strokeDasharray="6 6"
            label={{
              value: `Team Avg: ${avgAttendance.toFixed(2)}`,
              position: 'right',
              fill: '#facc15',
              fontSize: 13,
              fontWeight: 'bold',
              offset: 10
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Optional footer buttons like your screenshot */}
      <div className="flex justify-end gap-4 mt-6">
        <button className="px-5 py-2.5 bg-blue-800/60 hover:bg-blue-700/80 text-blue-100 rounded-lg text-sm font-medium transition">
          View Full Report
        </button>
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition">
          Download CSV
        </button>
      </div>
    </div>
  );
};

export default DepartmentAttendanceAreaChart;