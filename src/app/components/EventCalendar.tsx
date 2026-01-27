'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // App Router
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FiMoreVertical } from 'react-icons/fi';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMPORARY EVENTS
const events = [
  {
    id: 1,
    title: "Team Meeting",
    time: "12:00 PM - 2:00 PM",
    description: "Discuss project updates and milestones.",
    color: "#153361",
  },
  {
    id: 2,
    title: "HR Workshop",
    time: "3:00 PM - 4:30 PM",
    description: "Employee engagement and wellness session.",
    color: "#4a5a8a",
  },
  {
    id: 3,
    title: "Client Call",
    time: "5:00 PM - 6:00 PM",
    description: "Monthly client check-in meeting.",
    color: "#7d8fb0",
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const router = useRouter();

  // Navigate when icon is clicked
  const handleGoToCode = () => {
    router.push("/code"); // Change this to your desired route
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto">

      {/* TOP MORE ICON BUTTON */}
      <div className="flex justify-end mb-4">
        <FiMoreVertical
          size={24}
          className="cursor-pointer text-gray-700 hover:text-[#153361] transition"
          onClick={handleGoToCode}
        />
      </div>

      {/* CALENDAR */}
      <Calendar
        className="p-4 w-full bg-white rounded-lg shadow-inner border border-gray-200"
        onChange={onChange}
        value={value}
      />

      {/* HEADER */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Upcoming Events</h1>
        {/* Optional: keep this second icon if you want */}
        <FiMoreVertical
          size={20}
          className="cursor-pointer text-gray-500 hover:text-[#4a5a8a] transition"
        />
      </div>

      {/* EVENTS LIST */}
      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className={`p-4 rounded-lg border-l-4 border-[${event.color}] shadow-sm hover:shadow-md transition cursor-pointer bg-gray-50`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-700">{event.title}</h2>
              <span className="text-xs text-gray-500">{event.time}</span>
            </div>
            <p className="mt-2 text-gray-500 text-sm">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
