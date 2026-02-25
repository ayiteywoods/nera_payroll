"use client";
import React from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// 7 departments with your base colors
const departmentData = [
  { name: "Engineering", value: 50, fill: "#2c4a6a" },
  { name: "Sales", value: 35, fill: "#4a6b82" },
  { name: "Marketing", value: 28, fill: "#6b8ca3" },
  { name: "HR", value: 18, fill: "#8badc3" },
  { name: "Finance", value: 22, fill: "#a3c2d7" },
  { name: "Operations", value: 30, fill: "#c3d2e9" },
  { name: "Management", value: 10, fill: "#d4e1ed" },
];

const DepartmentRadialChart = () => {
  const totalDepartments = departmentData.length;
  const totalCount = departmentData.reduce((sum, dept) => sum + dept.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-gray-900 text-sm mb-1">{item.name}</p>
          <p className="text-[#2c4a6a] font-bold text-sm">{item.value} employees</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl w-full p-4 sm:p-5 border border-gray-100 h-full flex flex-col">
     
      
    </div>
  );
};

export default DepartmentRadialChart;