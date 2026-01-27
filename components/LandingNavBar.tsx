import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Settings } from 'lucide-react'

function LandingNavBar() {
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200"
    >
      {/* Logo + Brand */}
      <div className="flex items-center gap-3">
        <Image
          src="/navbar-logo.png"
          alt="NeraPay Logo"
          width={40}
          height={40}
        />
        <h1 className="font-extrabold text-2xl text-[#153361]">
          NeraPay
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        
        {/* Settings */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-[#153361]" />
        </button>

        {/* Login */}
        <Link href="/login">
          <button className="px-5 py-2 text-sm font-semibold text-[#153361] border border-[#153361] rounded-lg hover:bg-[#153361] hover:text-white transition">
            Login
          </button>
        </Link>

        {/* Logout */}
        <Link href="/logout">
          <button className="px-5 py-2 text-sm font-semibold bg-[#153361] text-white rounded-lg hover:bg-[#0f254a] transition">
            SignUp
          </button>
        </Link>
      </div>
    </nav>
  )
}

export default LandingNavBar
