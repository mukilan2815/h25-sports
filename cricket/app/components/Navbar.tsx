
'use client';

import Link from 'next/link';
import { Menu, Search, Bell, User } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                CricPulse
              </span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link href="/matches" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Matches
                </Link>
                <Link href="/teams" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Teams
                </Link>
                <Link href="/news" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  News
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none transition-colors">
                <Search className="h-6 w-6" />
              </button>
              <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none transition-colors">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none transition-colors">
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="/matches" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Matches
            </Link>
            <Link href="/teams" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Teams
            </Link>
            <Link href="/news" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              News
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
