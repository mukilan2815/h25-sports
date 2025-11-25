"use client";

import { Home, LayoutDashboard, Calendar, Users, Newspaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 bg-[#0f172a] h-screen flex flex-col border-r border-slate-800 fixed left-0 top-0 z-50">
      <div className="p-6">
        <Link href="/" className="bg-red-600 text-white font-black text-2xl px-3 py-1 inline-block rounded-md italic tracking-tighter hover:bg-red-700 transition-colors">
          CRIC.CO
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link href="/">
            <NavItem icon={<Home size={20} />} label="Home" active={pathname === '/'} />
        </Link>
        <Link href="/dashboard">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={isActive('/dashboard')} />
        </Link>
        <Link href="/matches">
            <NavItem icon={<Calendar size={20} />} label="Matches" active={isActive('/matches')} />
        </Link>
        <Link href="/teams">
            <NavItem icon={<Users size={20} />} label="Teams" active={isActive('/teams')} />
        </Link>
        <Link href="/news">
            <NavItem icon={<Newspaper size={20} />} label="News" active={isActive('/news')} />
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
                U
            </div>
            <div>
                <div className="text-sm font-bold text-white">User Profile</div>
                <div className="text-xs text-slate-400">Premium Member</div>
            </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${active ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
      <div className={`${active ? 'text-blue-500' : 'text-slate-400 group-hover:text-white'}`}>
        {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
      {active && <div className="ml-auto w-1 h-5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}
    </div>
  )
}
