"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Calendar, Settings, 
  LogOut, Menu, X, ShieldCheck, ChevronRight 
} from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
    const { user: currentUser } = useUser();
  

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Training Programs", href: "/admin/programs", icon: Calendar },
    { name: "Players Management", href: "/admin/players", icon: Users },
    { name: "Registrations", href: "/admin/registrations", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 z-30 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-slate-900 text-slate-300 flex flex-col
        transform transition-transform duration-300 ease-in-out border-r border-slate-800 shadow-xl shadow-black/20
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Sidebar Header / Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-lg text-slate-100 tracking-wide">Admin Portal</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30" 
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-emerald-200" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Logout) */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <button 
            onClick={() => console.log("Logging out...")}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. RIGHT SIDE: Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between shadow-lg shadow-black/10">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700/60"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              {navItems.find(item => item.href === pathname)?.name || "Dashboard"}
            </h2>
          </div>

          {/* Admin Profile Badge */}
          <div className="flex items-center space-x-3">
            {currentUser && (
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl shadow-md self-start sm:self-auto">
            <div className="text-right">
              <p className="text-sm font-bold text-white leading-none">{currentUser.userName}</p>
              <p className="text-[10px] font-bold text-emerald-400 mt-1 uppercase tracking-wider">{currentUser.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold shadow-inner shrink-0">
              {currentUser.userName ? currentUser.userName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
            </div>
          </div>
        )}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}