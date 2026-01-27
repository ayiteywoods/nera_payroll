"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRightCircle } from "lucide-react";
import { motion } from "framer-motion";
import LandingNavBar from "./components/LandingNavBar";

// Floating animation (subtle)
const floatAnim = {
  animate: { y: [0, -10, 0] },
  transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <LandingNavBar />

      {/* ================= HERO ================= */}
      <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-40 flex-grow">

        {/* ================= SCATTERED TOP IMAGES ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Left */}
          <motion.div
            {...floatAnim}
            className="w-full max-w-[320px] mx-auto"
          >
            <Image
              src="/ScheduleImage.jpg"
              alt="Payslip preview"
              width={320}
              height={190}
              className="rounded-xl shadow-lg w-full h-auto"
            />
            <p className="mt-3 text-sm text-gray-700 leading-relaxed text-center md:text-left">
              Automatically generate employee payslips with accurate deductions,
              bonuses, and tax calculations.
            </p>
          </motion.div>

          {/* Center */}
          <motion.div
            {...floatAnim}
            className="w-full max-w-[360px] mx-auto"
          >
            <Image
              src="/Monitor.png"
              alt="Payroll analytics"
              width={360}
              height={210}
              className="rounded-xl shadow-lg w-full h-auto"
            />
            <p className="mt-3 text-sm text-gray-700 leading-relaxed text-center">
              Monitor payroll performance with real-time analytics and clear
              financial breakdowns.
            </p>
          </motion.div>

          {/* Right */}
          <motion.div
            {...floatAnim}
            className="w-full max-w-[340px] mx-auto"
          >
            <Image
              src="/Tax.jpg"
              alt="Payroll summary"
              width={340}
              height={200}
              className="rounded-xl shadow-lg w-full h-auto"
            />
            <p className="mt-3 text-sm text-gray-700 leading-relaxed text-center md:text-right">
              View payroll summaries that show total payouts, staff count,
              and department-level expenses.
            </p>
          </motion.div>
        </div>

        {/* ================= MAIN IMAGE ================= */}
        <div className="flex justify-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            whileHover={{ rotate: -2, scale: 1.03 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl w-full bg-white rounded-3xl p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] border border-gray-200"
          >
            <div className="mx-auto mb-4 h-[3px] w-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />

            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
              <Image
                src="/landing.png"
                alt="NeraPay dashboard"
                fill
                priority
                className="object-contain"
              />
            </div>

            <p className="mt-5 text-sm text-gray-700 text-center leading-relaxed">
              NeraPay brings payroll processing, employee management,
              approvals, and reporting into one intuitive dashboard —
              built for speed, accuracy, and security.
            </p>
          </motion.div>
        </div>

        {/* ================= TEXT ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-14 text-center max-w-2xl mx-auto space-y-5"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Smart Payroll, <span className="text-blue-500">Zero Stress</span>
          </h1>

          <p className="text-lg text-gray-700">
            Simplify payroll operations, eliminate manual errors, and
            gain full visibility into staff payments — all from one
            modern platform.
          </p>
        </motion.div>

        {/* ================= CTA ================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-8 flex justify-center"
        >
          <Link href="/admin">
            <button className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-[#153361] font-semibold shadow-lg hover:-translate-y-1 transition">
              Get Started
              <ArrowRightCircle className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0f274a] text-gray-300 mt-auto">
        <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h2 className="text-2xl font-bold text-white">NeraPay</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-md">
              A modern payroll and employee management platform designed
              to help businesses pay staff accurately and on time.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/docs" className="hover:text-white transition">Documentation</Link></li>
              <li><Link href="/support" className="hover:text-white transition">Support</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-sm">
          © {new Date().getFullYear()} NeraPay. All rights reserved.
        </div>
      </footer>
    </div>
  );
}