"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

// Static data with descriptions and employee images
const data = [
  { 
    name: "Management", 
    count: 20, 
    fill: "#2c4a6a", 
    description: "Team Leaders",
    employees: [
      { name: "John Mensah", image: "/profiles/employee4.jpg" },
      { name: "Sarah Johnson", image: "/profiles/employee3.jpg" },
    ]
  },
  { 
    name: "Engineering", 
    count: 50, 
    fill: "#4a6b82", 
    description: "Developers",
    employees: [
      { name: "Ama Asantewaa", image: "/profiles/employee3.jpg" },
      { name: "Kwame Boateng", image: "/profiles/employee1.jpg" },
    ]
  },
  { 
    name: "HR", 
    count: 10, 
    fill: "#6b8ca3", 
    description: "Staff",
    employees: [
      { name: "Efua Addo", image: "/profiles/employee2.jpg" },
      { name: "Ama Serwaa", image: "/profiles/employee3.jpg" },
    ]
  },
  { 
    name: "Sales", 
    count: 15, 
    fill: "#8badc3", 
    description: "Representatives",
    employees: [
      { name: "Kofi Boateng", image: "/profiles/employee1.jpg" },
      { name: "Abena Osei", image: "/profiles/employee2.jpg" },
    ]
  },
  { 
    name: "Support", 
    count: 11, 
    fill: "#abd4ea", 
    description: "Specialists",
    employees: [
      { name: "Michael Owusu", image: "/profiles/employee4.jpg" },
      { name: "Francisca Akoshika", image: "/profiles/employee2.jpg" },
    ]
  },
];

const CountChart = () => {
  // State to trigger re-render for animation
  const [refresh, setRefresh] = useState(false);
  const [hoveredDepartment, setHoveredDepartment] = useState<string | null>(null);

  // Calculate total hired
  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Calculate percentage for each department
  const getPercentage = (count: number) => {
    return ((count / total) * 100).toFixed(1);
  };

  // Toggle refresh every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((prev) => !prev);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl w-full p-6 flex flex-col gap-6 shadow-sm border border-gray-100">
      
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Employees Hired
          </h1>
          <p className="text-sm text-gray-500 mt-1">Department Distribution</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs font-semibold text-[#2c4a6a]">Active</span>
        </div>
      </div>

      {/* CHART SECTION - TOP */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-full h-[280px] max-w-sm">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              key={refresh}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="90%"
              barSize={20}
              data={data}
            >
              <RadialBar
                dataKey="count"
                cornerRadius={10}
                background={{ fill: "#f1f5f9" }}
                isAnimationActive={true}
                animationDuration={1000}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* CENTER TOTAL */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-bold text-[#2c4a6a]">
              {total}
            </span>
            <span className="text-sm text-gray-600 mt-2">
              Total Employees
            </span>
          </div>
        </div>
      </div>

      {/* SUMMARY STATS - BELOW CHART */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-gradient-to-br from-[#2c4a6a]/10 to-[#1e3147]/5 border border-[#2c4a6a]/20">
          <p className="text-xs text-gray-600 font-medium mb-1">Average per Dept</p>
          <p className="text-2xl font-bold text-[#2c4a6a]">
            {Math.round(total / data.length)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-[#2c4a6a]/10 to-[#1e3147]/5 border border-[#2c4a6a]/20">
          <p className="text-xs text-gray-600 font-medium mb-1">Largest Dept</p>
          <p className="text-2xl font-bold text-[#2c4a6a]">
            {Math.max(...data.map(d => d.count))}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-[#2c4a6a]/10 to-[#1e3147]/5 border border-[#2c4a6a]/20">
          <p className="text-xs text-gray-600 font-medium mb-1">Departments</p>
          <p className="text-2xl font-bold text-[#2c4a6a]">
            {data.length}
          </p>
        </div>
      </div>

      {/* DETAILS SECTION - MIDDLE */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Department Breakdown</h3>
        
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredDepartment(item.name)}
              onMouseLeave={() => setHoveredDepartment(null)}
              className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                hoveredDepartment === item.name
                  ? "bg-white border-[#2c4a6a] shadow-lg scale-102"
                  : "bg-gray-50 border-gray-100 hover:border-gray-200"
              }`}
            >
              {/* Department Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm flex-shrink-0"
                    style={{ backgroundColor: item.fill }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-lg text-[#2c4a6a]">{item.count}</p>
                  <p className="text-xs text-gray-500">{getPercentage(item.count)}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      backgroundColor: item.fill,
                      width: `${getPercentage(item.count)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Employee Avatars */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-600 font-medium">Managers:</span>
                <div className="flex -space-x-2">
                  {item.employees.map((emp, idx) => (
                    <div
                      key={idx}
                      className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-sm hover:z-10 transition-transform hover:scale-125"
                      title={emp.name}
                    >
                      <Image
                        src={emp.image}
                        alt={emp.name}
                        fill
                        className="object-cover"
                        sizes="28px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM STATS LEGEND */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-6 border-t border-gray-100">
        {data.map((item) => (
          <div
            key={item.name}
            className="text-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-white hover:shadow-md border border-gray-100 transition-all cursor-pointer"
          >
            <div
              className="w-5 h-5 rounded-full shadow-sm mx-auto mb-2.5"
              style={{ backgroundColor: item.fill }}
            />
            <p className="font-bold text-base text-gray-900">
              {item.count}
            </p>
            <p className="text-xs text-gray-600 font-medium mt-1.5">
              {item.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {getPercentage(item.count)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountChart;