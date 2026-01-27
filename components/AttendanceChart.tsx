"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", attendance: 85 },
  { day: "Tue", attendance: 90 },
  { day: "Wed", attendance: 80 },
  { day: "Thu", attendance: 95 },
  { day: "Fri", attendance: 88 },
  { day: "Sat", attendance: 70 },
  { day: "Sun", attendance: 75 },
];

export default function AttendanceChart() {
  // state to trigger re-render
  const [refresh, setRefresh] = useState(false);

  // toggle refresh every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((prev) => !prev); // toggles refresh
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[340px] w-full p-5">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Attendance This Week
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          key={refresh} // changing key forces chart re-render
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" stroke="#6b7280" />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(val) => `${val}%`}
            stroke="#6b7280"
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Attendance"]}
            contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }}
          />
          <Line
            type="monotone"
            dataKey="attendance"
            stroke="#153361"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 7, stroke: "#153361", strokeWidth: 2 }}
            isAnimationActive={true} // enables smooth animation
            animationDuration={1000}   // animation duration 1s
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
