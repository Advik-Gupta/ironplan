"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/db/firebase";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Workout", href: "/workout" },
  { name: "Routine", href: "/routine" },
  { name: "Progress", href: "/progress" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOutUser();
    setIsOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          IronPlan
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-gray-300 transition"
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition text-sm"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300 text-sm">
                Login
              </Link>
              <Link href="/signup" className="hover:text-gray-300 text-sm">
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-2 py-1 hover:bg-gray-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-2 py-1 hover:bg-gray-800 rounded text-sm text-red-400"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="block px-2 py-1 hover:bg-gray-800 rounded text-sm"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block px-2 py-1 hover:bg-gray-800 rounded text-sm"
                onClick={() => setIsOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
