"use client"; // ← Add this at the very top

import React, { useState } from "react";
import Image from "next/image";
import { HiMagnifyingGlass } from "react-icons/hi2";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-4 h-16">

        {/* ===== Left Section: Search ===== */}
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          {/* Mobile: search icon only */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Open search"
          >
            <HiMagnifyingGlass size={20} className="text-gray-600" />
          </button>

          {/* Full search input (desktop) */}
          <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-2 ring-gray-300 px-3 bg-white flex-1">
            <HiMagnifyingGlass size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 bg-transparent outline-none text-sm"
            />
          </div>

          {/* Mobile expanded search */}
          {searchOpen && (
            <div className="absolute top-16 left-0 right-0 z-50 flex items-center gap-2 text-xs rounded-full ring-2 ring-gray-300 px-3 bg-white mx-4">
              <HiMagnifyingGlass size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 bg-transparent outline-none text-sm"
                autoFocus
              />
              <button
                className="p-1"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* ===== Right Section: Icons & Profile ===== */}
        <div className="flex items-center gap-4 md:gap-6 ml-4">
          {/* Email */}
          <button className="bg-[#c3d2e9] w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#b0c4e2] transition">
            <Image src="/email.png" alt="Email" width={20} height={20} />
          </button>

          {/* Messages */}
          <div className="relative">
            <button className="bg-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
              <Image src="/messages.png" alt="Messages" width={20} height={20} />
            </button>
            <div className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-[#153361] text-white rounded-full text-[10px] font-semibold">
              +4
            </div>
          </div>

          {/* User Info */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-medium leading-3">John Doe</span>
            <span className="text-[10px] text-gray-500 font-bold">HR</span>
          </div>

          {/* Profile Image */}
          <Image
            src="/profile.png"
            alt="Profile"
            width={36}
            height={36}
            className="rounded-full"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
