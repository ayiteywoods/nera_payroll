"use client";

type AttendanceItem = {
  name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hours: number;
  overtime: number;
  status: "Present" | "Late" | "Absent";
};

const attendanceData: AttendanceItem[] = [
  {
    name: "John Mensah",
    date: "Mon, 25 Mar",
    checkIn: "08:05",
    checkOut: "17:10",
    hours: 8,
    overtime: 1,
    status: "Late",
  },
  {
    name: "Ama Boateng",
    date: "Mon, 25 Mar",
    checkIn: "08:00",
    checkOut: "16:30",
    hours: 7.5,
    overtime: 3,
    status: "Present",
  },
  {
    name: "Kwame Asare",
    date: "Mon, 25 Mar",
    checkIn: "--",
    checkOut: "--",
    hours: 0,
    overtime: 0,
    status: "Absent",
  },
];

export default function AttendanceActivity() {
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-600 mb-4">
        Attendance Activity
      </h3>

      <div className="space-y-3">
        {attendanceData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
          >
            {/* Employee */}
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-500">{item.date}</p>
            </div>

            {/* Time */}
            <div className="hidden sm:block text-sm text-gray-600">
              {item.checkIn} – {item.checkOut}
            </div>

            {/* Hours */}
            <div className="hidden md:block text-sm text-gray-600">
              {item.hours}h / overtime: {item.overtime}h
            </div>

            {/* Status */}
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full
                ${
                  item.status === "Present"
                    ? "bg-green-100 text-green-700"
                    : item.status === "Late"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }
              `}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
