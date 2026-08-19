"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, Activity, BookmarkCheck, Calendar, 
  ArrowUpRight, Clock, ShieldCheck, Loader2
} from 'lucide-react';
import { useUser } from "@/context/UserContext";
import { 
  fetchDashboardCounts, 
  getAllRegistrations, 
  getAllPrograms,
  RegistrationItem,
  ProgramItem 
} from './Actions';

export default function Dashboard() {
  const { user } = useUser(); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({ playersCount: 0, programsCount: 0, registrationsCount: 0 });
  const [recentRegistrations, setRecentRegistrations] = useState<RegistrationItem[]>([]);
  const [upcomingPrograms, setUpcomingPrograms] = useState<ProgramItem[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);

      const [countsResult, regsResult, programsResult] = await Promise.all([
        fetchDashboardCounts(),
        getAllRegistrations(),
        getAllPrograms()
      ]);

      if (countsResult.success) {
        setCounts(countsResult.data);
      }

      if (regsResult.success && regsResult.data.length > 0) {
        const lastThree = regsResult.data.slice(-3).reverse();
        setRecentRegistrations(lastThree);
      }

      if (programsResult.success && programsResult.data.length > 0) {
        const upcoming = programsResult.data.filter(
          (program) => program.status?.toLowerCase() === "upcoming"
        );
        setUpcomingPrograms(upcoming);
      }

      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const statsData = [
    { title: "Total Players", value: counts.playersCount, increase: "Total verified", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { title: "Total Programs", value: counts.programsCount, increase: "Active & Upcoming", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { title: "Total Registrations", value: counts.registrationsCount, increase: "Across all programs", icon: BookmarkCheck, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  ];

  const calculateDaysLeft = (dateStr: string) => {
    const start = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} Days` : 'Soon';
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-emerald-500">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Welcome back, {user?.name || 'Admin'}. Here is what's happening today.</p>
        </div>
      </div>

      {/* 2. Top Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={`stat-${index}`} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg shadow-black/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-2xl font-black text-slate-100 mb-1">
                  {stat.value.toString().padStart(2, '0')}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> {stat.increase}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-inner ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Content Grid (Table + Side Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Recent Registrations */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg shadow-black/10 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">Recent Registrations</h2>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400 font-bold">
                  <th className="px-5 py-4">Player Name</th>
                  <th className="px-5 py-4">Program </th>
                  <th className="px-5 py-4">Skill Level</th>
                  <th className="px-5 py-4 text-right">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {recentRegistrations.length > 0 ? (
                  recentRegistrations.map((player, index) => (
                    <tr key={player.enrollmentId ? `reg-${player.enrollmentId}` : `reg-index-${index}`} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-200">{player.userName}</div>
                        <div className="text-[11px] text-slate-500">ENR-{player.enrollmentId}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{player.programName}</td>
                      <td className="px-5 py-4">
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 uppercase">
                          {player.skillLevel || "N/A"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase ${
                          player.paymentStatus === 'PAID' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {player.paymentStatus === 'PAID' && <ShieldCheck className="w-3 h-3 mr-1" />}
                          {player.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-500 text-sm">
                      No recent registrations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Upcoming Programs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg shadow-black/10 flex flex-col">
          <div className="p-5 border-b border-slate-800">
            <h2 className="text-base font-bold text-slate-100">Upcoming Programs</h2>
          </div>
          
          <div className="p-5 space-y-4 flex-1">
            {upcomingPrograms.length > 0 ? (
              upcomingPrograms.map((program, index) => (
                <div key={program.programId ? `prog-${program.programId}` : `prog-index-${index}`} className="flex items-start p-3 rounded-xl hover:bg-slate-800/40 border border-transparent hover:border-slate-800 transition-colors group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-3 shrink-0">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                      {program.programName}
                    </h4>
                    <div className="flex items-center text-[11px] text-slate-400 font-medium mt-1">
                      <Clock className="w-3 h-3 mr-1 text-slate-500" /> Starts in {calculateDaysLeft(program.startDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-300">{program.enrolledCount}{program.maxCapacity}</div>
                    <div className="text-[10px] text-slate-500">Enrolled</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 text-sm py-4">
                No upcoming programs at the moment.
              </div>
            )}
          </div>

          <div className="mt-auto p-5 border-t border-slate-800">
            <button className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-600 transition-all text-sm font-bold flex items-center justify-center">
              Create New Program
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}