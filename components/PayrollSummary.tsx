"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Management", value: 120000 },
  { name: "Engineering", value: 200000 },
  { name: "HR", value: 50000 },
  { name: "Sales", value: 80000 },
  { name: "Support", value: 45000 },
];

const COLORS = ["#153361", "#4a5a8a", "#7d8fb0", "#b0c4e2", "#dce4f0"];

const total = data.reduce((sum, item) => sum + item.value, 0);

export default function PayrollSummary() {
  // state to trigger chart re-render
  const [refresh, setRefresh] = useState(false);

  // toggle refresh every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((prev) => !prev);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">
        Expected Salary Payouts (this month)
      </h2>

      <div className="flex flex-col items-center gap-4">
        {/* Donut Chart */}
        <div className="relative w-full h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart key={refresh}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
                isAnimationActive={true}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold">{total.toLocaleString()}</span>
            <div className="text-gray-500 text-sm">GHS total</div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full flex flex-col gap-1 mt-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                {item.name}
              </div>
              <span>GHS {item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6 w-full">
          <button className="flex-1 border border-gray-300 rounded-lg p-2 hover:bg-gray-100 transition">
            View Full Report
          </button>
          <button className="flex-1 border border-gray-300 rounded-lg p-2 hover:bg-gray-100 transition">
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}
