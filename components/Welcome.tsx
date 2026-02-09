"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface GratitudeMessage {
  id: number;
  name: string;
  department: string;
  image: string;
  message: string;
  date: string;
  type: "appreciation" | "gratitude";
}

interface Employee {
  name: string;
  role: string;
  department: string;
  message: string;
  achievement: string;
  performanceScore: number;
  tasksCompleted: number;
  image: string;
}

interface CompanyNews {
  id: number;
  title: string;
  category: "announcement" | "achievement" | "event";
  date: string;
  icon: string;
}

interface TechUpdate {
  id: number;
  title: string;
  description: string;
  tag: string;
}

const topEmployees: Employee[] = [
  {
    name: "Francisca Akoshika",
    role: "Accountant",
    department: "Finance",
    message: "Top performer at Finance. Exceptional accuracy in financial reporting and record management.",
    achievement: "Achieved 98% accuracy in quarterly reconciliation",
    performanceScore: 98,
    tasksCompleted: 47,
    image: "/profiles/employee2.jpg",
  },
  {
    name: "Ama Asantewaa",
    role: "Software Engineer",
    department: "Engineering",
    message: "Top performer of the month! Keep up the great work and continue driving innovation.",
    achievement: "Delivered 5 critical features ahead of schedule",
    performanceScore: 96,
    tasksCompleted: 52,
    image: "/profiles/employee3.jpg",
  },
  {
    name: "John Mensah",
    role: "Product Designer",
    department: "Design",
    message: "Recognized for outstanding contribution in design. Your creativity is invaluable to the team.",
    achievement: "Led successful redesign of user dashboard interface",
    performanceScore: 94,
    tasksCompleted: 43,
    image: "/profiles/employee4.jpg",
  },
  {
    name: "Kwame Boateng",
    role: "Project Manager",
    department: "Operations",
    message: "Excellent project management skills and team coordination. Setting new standards.",
    achievement: "Successfully delivered 3 major projects on time",
    performanceScore: 95,
    tasksCompleted: 38,
    image: "/profiles/employee1.jpg",
  },
];

const gratitudeMessages: GratitudeMessage[] = [
  {
    id: 1,
    name: "Kwame Boateng",
    department: "Engineering",
    image: "/profiles/employee1.jpg",
    message: "Thank you for being an amazing mentor! Your guidance helped me grow professionally this year.",
    date: "2 days ago",
    type: "appreciation",
  },
  {
    id: 2,
    name: "Abena Osei",
    department: "Sales",
    image: "/profiles/employee2.jpg",
    message: "Grateful for the opportunity to work with such an inspiring team. Exceeded my sales targets!",
    date: "4 days ago",
    type: "gratitude",
  },
  {
    id: 3,
    name: "John Mensah",
    department: "Marketing",
    image: "/profiles/employee4.jpg",
    message: "Appreciate the recognition! The platform really motivates us to do better every day.",
    date: "1 week ago",
    type: "appreciation",
  },
  {
    id: 4,
    name: "Ama Asantewaa",
    department: "Engineering",
    image: "/profiles/employee3.jpg",
    message: "Thanks for the flexible work arrangement. It helped me balance work and personal life.",
    date: "1 week ago",
    type: "gratitude",
  },
  {
    id: 5,
    name: "Sarah Johnson",
    department: "HR",
    image: "/profiles/employee3.jpg",
    message: "So grateful for the professional development opportunities provided this quarter!",
    date: "2 weeks ago",
    type: "appreciation",
  },
];

const companyNews: CompanyNews[] = [
  {
    id: 1,
    title: "Q1 2026 Targets Exceeded",
    category: "achievement",
    date: "Today",
    icon: "▸",
  },
  {
    id: 2,
    title: "New Remote Work Policy",
    category: "announcement",
    date: "Yesterday",
    icon: "▸",
  },
  {
    id: 3,
    title: "Team Building Event - March 15",
    category: "event",
    date: "3 days ago",
    icon: "▸",
  },
  {
    id: 4,
    title: "Engineering Team Expansion",
    category: "announcement",
    date: "1 week ago",
    icon: "▸",
  },
];

const techUpdates: TechUpdate[] = [
  {
    id: 1,
    title: "AI-Powered Analytics Dashboard",
    description: "New ML features for predictive reporting",
    tag: "AI/ML",
  },
  {
    id: 2,
    title: "Cloud Migration Complete",
    description: "100% infrastructure migrated to AWS",
    tag: "Infrastructure",
  },
  {
    id: 3,
    title: "API v3.0 Released",
    description: "Enhanced REST endpoints and WebSocket support",
    tag: "Development",
  },
];

export default function AdminWelcomeCard() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [newsExpanded, setNewsExpanded] = useState(false);
  const [techExpanded, setTechExpanded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const topEmployeesTotal = topEmployees.length;
  const gratitudeTotal = gratitudeMessages.length;

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (currentTabIndex === topEmployeesTotal - 1) {
        setCurrentTabIndex(topEmployeesTotal);
      } else if (currentTabIndex === topEmployeesTotal + gratitudeTotal - 1) {
        setCurrentTabIndex(0);
      } else {
        setCurrentTabIndex((prev) => prev + 1);
      }
    }, 6000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, currentTabIndex, topEmployeesTotal, gratitudeTotal]);

  const isTopPerformersTab = currentTabIndex < topEmployeesTotal;
  const performerIndex = currentTabIndex;
  const gratitudeIndex = currentTabIndex - topEmployeesTotal;

  const currentPerformer = isTopPerformersTab ? topEmployees[performerIndex] : null;
  const currentGratitude = !isTopPerformersTab ? gratitudeMessages[gratitudeIndex] : null;

  const getScoreColor = (score: number) => {
    if (score >= 95) return "from-green-500 to-emerald-500";
    if (score >= 90) return "from-blue-500 to-cyan-500";
    return "from-purple-500 to-pink-500";
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case "Finance":
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case "Engineering":
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
      case "Design":
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;
      case "Operations":
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
      default:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex === 0) {
      setCurrentTabIndex(topEmployeesTotal + gratitudeTotal - 1);
    } else {
      setCurrentTabIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentTabIndex === topEmployeesTotal + gratitudeTotal - 1) {
      setCurrentTabIndex(0);
    } else {
      setCurrentTabIndex((prev) => prev + 1);
    }
  };

  const handleTabClick = (tab: "top" | "gratitude") => {
    setCurrentTabIndex(tab === "top" ? 0 : topEmployeesTotal);
  };

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 h-full flex flex-col">
        
        {/* Tabs Navigation */}
        <div className="flex items-center gap-3 md:gap-4 mb-4 pb-3 border-b border-gray-100 flex-wrap">
          <button
            onClick={() => handleTabClick("top")}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-all ${
              isTopPerformersTab
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="hidden sm:inline">Top Performers</span>
            <span className="sm:hidden">Performers</span>
          </button>

          <button
            onClick={() => handleTabClick("gratitude")}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-all ${
              !isTopPerformersTab
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v-1a1.5 1.5 0 01-3 0v1zM14 4a1 1 0 011 1v2a1 1 0 11-2 0V5a1 1 0 011-1zm3.5 2a1.5 1.5 0 10-3 0v1a1.5 1.5 0 003 0v-1zM4 15a1 1 0 001 1h4a1 1 0 001-1v-3a1 1 0 00-1-1H5a1 1 0 00-1 1v3zm6-11a1 1 0 011 1v2a1 1 0 11-2 0V5a1 1 0 011-1z" />
            </svg>
            <span className="hidden sm:inline">Appreciation Wall</span>
            <span className="sm:hidden">Gratitude</span>
          </button>

          <div className="flex-1"></div>

          <span className="text-xs font-medium bg-blue-50 text-[#2c4a6a] px-2.5 md:px-3 py-1 rounded-full whitespace-nowrap">
            {isTopPerformersTab ? performerIndex + 1 : gratitudeIndex + 1} / {isTopPerformersTab ? topEmployeesTotal : gratitudeTotal}
          </span>
        </div>

        {/* Content Area */}
        <div className="space-y-3 md:space-y-4 flex-1 flex flex-col">
          {isTopPerformersTab && currentPerformer ? (
            <>
              <div className="relative w-full h-44 md:h-52 rounded-xl overflow-hidden shadow-md border border-gray-100 flex-shrink-0">
                <Image
                  src={currentPerformer.image}
                  alt={`Profile photo of ${currentPerformer.name}, ${currentPerformer.role}`}
                  fill
                  priority={performerIndex === 0}
                  loading={performerIndex === 0 ? "eager" : "lazy"}
                  quality={90}
                  className="object-cover object-center"
                  sizes="100%"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              <div className="space-y-2 md:space-y-2.5 flex-1">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{currentPerformer.name}</h2>
                  <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                    <span className="px-2.5 md:px-3 py-0.5 md:py-1 bg-amber-50 text-amber-700 text-[10px] md:text-xs font-semibold rounded-full">
                      Top Performer
                    </span>
                    <span className="px-2.5 md:px-3 py-0.5 md:py-1 bg-blue-50 text-blue-700 text-[10px] md:text-xs font-semibold rounded-full flex items-center gap-1">
                      {getDepartmentIcon(currentPerformer.department)}
                      {currentPerformer.department}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs md:text-sm font-medium text-[#2c4a6a] mb-0.5">{currentPerformer.role}</p>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{currentPerformer.message}</p>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-lg p-2.5 md:p-3">
                  <p className="text-[10px] md:text-xs font-semibold text-amber-700 mb-0.5">Key Achievement</p>
                  <p className="text-xs md:text-sm text-amber-900">{currentPerformer.achievement}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  <div className="bg-gray-50 rounded-lg p-2 md:p-3 text-center border border-gray-100">
                    <div className={`bg-gradient-to-r ${getScoreColor(currentPerformer.performanceScore)} rounded-lg p-1.5 md:p-2 mb-1 md:mb-2 inline-block`}>
                      <p className="text-white font-bold text-base md:text-lg">{currentPerformer.performanceScore}</p>
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-600 font-medium">Performance</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2 md:p-3 text-center border border-gray-100">
                    <p className="text-white font-bold text-base md:text-lg bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-1.5 md:p-2 mb-1 md:mb-2 inline-block">
                      {currentPerformer.tasksCompleted}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-600 font-medium">Tasks Done</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2 md:p-3 text-center border border-gray-100">
                    <p className="text-white font-bold text-base md:text-lg bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-1.5 md:p-2 mb-1 md:mb-2 inline-block">
                      #{performerIndex + 1}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-600 font-medium">Rank</p>
                  </div>
                </div>
              </div>
            </>
          ) : currentGratitude ? (
            <>
              <div className="relative w-full h-44 md:h-52 rounded-xl overflow-hidden shadow-md border border-green-100 flex-shrink-0">
                <Image
                  src={currentGratitude.image}
                  alt={`Profile photo of ${currentGratitude.name}`}
                  fill
                  priority={gratitudeIndex === 0}
                  loading={gratitudeIndex === 0 ? "eager" : "lazy"}
                  quality={90}
                  className="object-cover object-center"
                  sizes="100%"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              <div className="space-y-2 md:space-y-2.5 flex-1">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{currentGratitude.name}</h2>
                  <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                    <span className={`px-2.5 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-semibold rounded-full flex items-center gap-1 ${
                      currentGratitude.type === 'appreciation'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-green-50 text-green-700'
                    }`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {currentGratitude.type === 'appreciation' ? 'Appreciation' : 'Gratitude'}
                    </span>
                    <span className="px-2.5 md:px-3 py-0.5 md:py-1 bg-gray-50 text-gray-700 text-[10px] md:text-xs font-semibold rounded-full flex items-center gap-1">
                      {getDepartmentIcon(currentGratitude.department)}
                      {currentGratitude.department}
                    </span>
                  </div>
                </div>

                <div className={`bg-gradient-to-br ${
                  currentGratitude.type === 'appreciation'
                    ? 'from-blue-50 to-cyan-50 border-blue-100'
                    : 'from-green-50 to-emerald-50 border-green-100'
                } border rounded-lg p-3 md:p-4`}>
                  <p className={`text-base md:text-lg leading-relaxed font-medium ${
                    currentGratitude.type === 'appreciation'
                      ? 'text-blue-900'
                      : 'text-green-900'
                  }`}>
                    "{currentGratitude.message}"
                  </p>
                  <p className={`text-[10px] md:text-xs font-medium mt-2 ${
                    currentGratitude.type === 'appreciation'
                      ? 'text-blue-600'
                      : 'text-green-600'
                  }`}>
                    Sent {currentGratitude.date}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-2 md:p-3 text-center border border-green-100">
                    <p className="text-xl md:text-2xl font-bold text-green-600 mb-0.5">✓</p>
                    <p className="text-[10px] md:text-xs text-gray-600 font-medium">Message Sent</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-2 md:p-3 text-center border border-blue-100">
                    <p className="text-lg md:text-xl font-bold text-blue-600 mb-0.5">❤</p>
                    <p className="text-[10px] md:text-xs text-gray-600 font-medium">Uplifting</p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2 md:gap-3 pt-2 md:pt-3 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={handlePrevious}
            aria-label="Previous"
            className="p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-1 md:gap-1.5 flex-1 justify-center flex-wrap">
            {isTopPerformersTab
              ? topEmployees.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`View ${topEmployees[index].name}`}
                    aria-current={index === performerIndex ? "true" : "false"}
                    onClick={() => setCurrentTabIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                      index === performerIndex
                        ? "bg-amber-500 w-6 shadow-sm"
                        : "bg-gray-300 w-1.5 hover:bg-gray-400"
                    }`}
                  />
                ))
              : gratitudeMessages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`View message from ${gratitudeMessages[index].name}`}
                    aria-current={index === gratitudeIndex ? "true" : "false"}
                    onClick={() => setCurrentTabIndex(topEmployeesTotal + index)}
                    className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                      index === gratitudeIndex
                        ? "bg-green-500 w-6 shadow-sm"
                        : "bg-gray-300 w-1.5 hover:bg-gray-400"
                    }`}
                  />
                ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next"
            className="p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* FOOTER: Company News & Tech Updates */}
        <div className="mt-2 pt-2 border-t border-gray-200 space-y-2">
          {/* Company News */}
          <div>
            <button
              onClick={() => setNewsExpanded(!newsExpanded)}
              className="w-full flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="text-xs font-semibold text-gray-900">Company News</span>
              <svg className={`w-3 h-3 text-gray-500 transition-transform ${newsExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {newsExpanded && (
              <div className="space-y-1 mt-1 pl-2 border-l border-gray-300">
                {companyNews.map((news) => (
                  <div key={news.id} className="p-1.5 cursor-pointer hover:bg-gray-50 transition-colors rounded">
                    <div className="flex items-start gap-2">
                      <span className="text-xs flex-shrink-0 text-gray-400 mt-0.5">{news.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900">{news.title}</p>
                        <p className="text-[10px] text-gray-500">{news.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tech Updates */}
          <div>
            <button
              onClick={() => setTechExpanded(!techExpanded)}
              className="w-full flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="text-xs font-semibold text-gray-900">Tech Updates</span>
              <svg className={`w-3 h-3 text-gray-500 transition-transform ${techExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {techExpanded && (
              <div className="space-y-1 mt-1 pl-2 border-l border-gray-300">
                {techUpdates.map((tech) => (
                  <div key={tech.id} className="p-1.5 cursor-pointer hover:bg-gray-50 transition-colors rounded">
                    <div className="flex items-start gap-2">
                      <span className="inline-block bg-gray-200 text-gray-700 text-[9px] font-bold px-1 py-0.5 rounded flex-shrink-0">{tech.tag}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900">{tech.title}</p>
                        <p className="text-[10px] text-gray-600">{tech.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}