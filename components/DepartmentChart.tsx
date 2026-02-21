"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Department allocation data
const data = [
  { name: "Engineering", value: 45, color: "#2c4a6a" },
  { name: "Sales", value: 25, color: "#4a6b82" },
  { name: "Marketing", value: 15, color: "#6b8ca3" },
  { name: "Support", value: 15, color: "#8badc3" },
];

const DepartmentChart = () => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 text-sm">{payload[0].name}</p>
          <p className="text-sm text-[#2c4a6a]">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  // Custom label
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-2xl w-full p-5 border border-gray-100 h-full flex flex-col">
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="text-base font-bold text-gray-900">Department Allocation</h1>
        <p className="text-xs text-gray-500 mt-0.5">Employee distribution by department</p>
      </div>

      {/* CHART */}
      <div className="flex-1 min-h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* CENTER LABEL */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xs text-gray-500">Total Depts</p>
          <p className="text-2xl font-bold text-[#2c4a6a]">{data.length}</p>
        </div>
      </div>

      {/* LEGEND */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-500">{item.value}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentChart;