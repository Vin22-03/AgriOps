"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white shadow-md py-3 flex items-center justify-between px-6 md:px-12">
      {/* Left: Logo and Branding */}
      <div className="flex items-center space-x-3">
        <Image
          src="/agriculture-icon-with-rice-field-and-cog-wheel-vector.jpg"
          alt="AgroSphere Logo"
          width={48}
          height={48}
          className="rounded-full border border-green-300 shadow-sm"
        />
        <div>
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight hover:text-green-200"
          >
            AgroSphere
          </Link>
          <p className="text-xs italic text-green-100 font-light">
            “Where AI & Soil Speak the Same Language”
          </p>
        </div>
      </div>

      {/* Right: Navigation Links */}
      <div className="flex space-x-6 text-sm md:text-base">
        <Link href="/" className="hover:text-green-200 transition">
          🏠 Dashboard
        </Link>
        <Link href="/predict" className="hover:text-green-200 transition">
          🤖 Predict
        </Link>
        <Link href="/sensor" className="hover:text-green-200 transition">
          💧 Sensor Data
        </Link>
        <Link href="/analytics" className="hover:text-green-200 transition">
          📊 Analytics
        </Link>
        <Link href="/about" className="hover:text-green-200 transition">
          🌍 About
        </Link>
      </div>
    </nav>
  );
}
