"use client";
import React, { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

// Static data
const data = [
  { name: "Management", count: 20, fill: "#153361" },
  { name: "Engineering", count: 50, fill: "#4a5a8a" },
  { name: "HR", count: 10, fill: "#7d8fb0" },
  { name: "Sales", count: 15, fill: "#b0c4e2" },
  { name: "Support", count: 11, fill: "#dce4f0" },
];

const CountChart = () => {
  // State to trigger re-render for animation
  const [refresh, setRefresh] = useState(false);

  // Calculate total hired
  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Toggle refresh every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((prev) => !prev); // toggle state to trigger re-render
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl w-full p-3 flex flex-col gap-4 shadow-sm">
      
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-base md:text-lg font-semibold text-gray-800">
          Employees Hired
        </h1>
        <FiMoreVertical size={18} className="text-gray-500 cursor-pointer" />
      </div>

      {/* CHART */}
      <div className="relative w-full h-[180px] sm:h-[200px] md:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            key={refresh} // key change forces chart to re-render
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="85%"
            barSize={18}
            data={data}
          >
            <RadialBar
              dataKey="count"
              cornerRadius={8}
              background={{ fill: "#f1f5f9" }}
              isAnimationActive={true}
              animationDuration={1000}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* CENTER TOTAL */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl md:text-3xl font-bold text-gray-800">
            {total}
          </span>
          <span className="text-gray-500 text-xs md:text-sm mt-1">
            Total Hired
          </span>
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <div
              className="w-4 h-4 md:w-5 md:h-5 rounded-full shadow-sm"
              style={{ backgroundColor: item.fill }}
            />
            <span className="font-bold text-sm md:text-base text-gray-800">
              {item.count}
            </span>
            <span className="text-xs text-gray-500 text-center">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountChart;
