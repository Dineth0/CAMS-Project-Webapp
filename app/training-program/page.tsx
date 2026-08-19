"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Users, Activity, Clock, Target, 
  ShieldCheck, ArrowRight, Loader2, User, Trophy,
  ChevronDown, UserCog, LogOut, 
  Mail, Phone, MapPin
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllTrainingPrograms, getPlayerProfile } from "./Action"; 
import { useUser } from "@/context/UserContext"; 
import backImg from "../training-program/Images/cricket_ground.png";
import EditPlayerProfileModal from "@/components/user/EditPlayerProfileModal";

export interface TrainingProgram {
  trainingProgramId: string;
  programName: string;
  description: string;
  skillLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  durationWeeks: number;
  sessionPerWeek: number;
  fee: number;
  startDate: string;
  maximumPlayers: number;
  location: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "FULL";
}

export default function MobileResponsiveDashboardLight() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "ONGOING">("ALL");
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const { user: currentUser, setUser } = useUser();
  const router = useRouter();
  const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:7000";


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (currentUser?.role === "PLAYER" && currentUser?.id) {
        const res = await getPlayerProfile(currentUser.id);
        if (res && res.code === 200 && res.data?.image) {
          // Check if the image starts with http/https (Bucket URL) or not
          const imageUrl = res.data.image.startsWith('http') 
            ? res.data.image 
            : `${API_GATEWAY}/${res.data.image}`;
            
          setPlayerImage(imageUrl); 
        }
      }
    };
    fetchProfileImage();
  }, [currentUser]);
  

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        const result = await getAllTrainingPrograms();
        if (result && result.code === 200 && Array.isArray(result.data)) {
          setPrograms(result.data);
        }
      } catch (error) {
        console.error("Failed to load programs", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.programName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "ALL" ? true : program.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getSkillBadge = (level: string) => {
    if (level === "BEGINNER") return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (level === "INTERMEDIATE") return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-orange-100 text-orange-800 border-orange-300";
  };

  const getStatusIndicator = (status: string) => {
    if (status === "UPCOMING") return <span className="flex w-2.5 h-2.5 rounded-full bg-blue-500 mr-2 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse"></span>;
    if (status === "ONGOING") return <span className="flex w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>;
    if (status === "FULL") return <span className="flex w-2.5 h-2.5 rounded-full bg-rose-500 mr-2 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>;
    return <span className="flex w-2.5 h-2.5 rounded-full bg-slate-400 mr-2"></span>;
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 relative overflow-hidden">
      
      <div 
        className="absolute inset-0 bg-cover bg-center -z-14 fixed"
        style={{ backgroundImage: `url(${backImg.src})` }}
      ></div>
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] -z-10 fixed pointer-events-none"></div>

      {/* Header Area */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Academy<span className="text-emerald-600">Pro</span>
                </h1>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-4 w-full sm:w-auto shrink-0">
              <div className="relative w-full sm:w-72 group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 sm:py-2 bg-white/90 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                />
              </div>
              
              {/* User Profile Dropdown Area */}
              {currentUser && (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-slate-800 leading-none">{currentUser.userName}</p>
                      <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">{currentUser.role}</p>
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black shadow-inner border border-emerald-200 overflow-hidden shrink-0">
                      {currentUser.role === "PLAYER" && playerImage ? (
                        <img 
                          src={playerImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = currentUser.userName.charAt(0).toUpperCase();
                          }}
                        />
                      ) : (
                        <span>{currentUser.userName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                      {currentUser.role === "PLAYER" && (
                        <button 
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsEditProfileOpen(true);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <UserCog className="w-4 h-4" /> Edit Player Profile
                        </button>
                      )}
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Welcome Banner */}
        <div className="mb-8 bg-emerald-700/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between shadow-2xl shadow-emerald-950/20 border border-emerald-600 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 text-center sm:text-left mb-6 sm:mb-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
              <Trophy className="w-3.5 h-3.5" /> Next Season
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
              {currentUser ? `Step up to the crease, ${currentUser.userName.split(' ')[0]}!` : 'Master your technique!'}
            </h2>
            <p className="text-emerald-50 text-sm sm:text-base font-medium max-w-lg">
              Explore professional training programs, improve your skills, and get ready for your next innings.
            </p>
          </div>
        </div>

        {/* Filters and Counters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex p-1 bg-white/80 backdrop-blur-md rounded-xl inline-flex shadow-sm border border-slate-200">
            {["ALL", "UPCOMING", "ONGOING"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                  activeTab === tab 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {tab === "ALL" ? "All Programs" : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-700 font-bold bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            Showing <span className="text-emerald-700 font-black">{filteredPrograms.length}</span> programs
          </p>
        </div>

        {/* Program Cards Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
            <p className="text-slate-700 font-bold">Loading training sessions...</p>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="text-center py-24 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-sm">
            <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-700 font-bold">No training programs match your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => {
              return (
                <div 
                  key={program.trainingProgramId} 
                  className="group relative bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-950/15 flex flex-col cursor-pointer"
                  onClick={() => router.push(`/training-program/${program.trainingProgramId}`)}
                >
                  <div className="h-1.5 w-full bg-slate-200 group-hover:bg-emerald-600 transition-colors"></div>

                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-md border flex items-center shrink-0 uppercase tracking-widest ${getSkillBadge(program.skillLevel)}`}>
                        <Target className="w-3 h-3 mr-1.5" />
                        {program.skillLevel}
                      </span>
                      <div className="flex items-center bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {getStatusIndicator(program.status)}
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                          {program.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-emerald-700 transition-colors">
                      {program.programName}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-600 mt-4">
                       <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-600" /> {program.durationWeeks} Weeks</span>
                       <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-emerald-600" /> {program.sessionPerWeek}x Sessions</span>
                    </div>
                  </div>

                  <div className="mt-auto p-5 border-t border-slate-100 bg-slate-50/80 flex justify-between items-center group-hover:bg-emerald-50/60 transition-colors">
                      <span className="text-slate-700 text-sm font-bold">View Full Details</span>
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white transition-all text-slate-500 shadow-sm">
                         <ArrowRight className="w-4 h-4" />
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer Area */}
      <footer className="relative z-10 border-t border-slate-200/80 bg-white/80 backdrop-blur-xl mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Brand & Description */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-600/20">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Academy<span className="text-emerald-600">Pro</span>
                </h2>
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-sm">
                Empowering the next generation of cricket stars with professional training programs, expert coaching, and advanced performance analytics.
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Training Programs</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Our Coaches</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Leaderboard</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> About Academy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Contact Us</h3>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-sm font-bold text-slate-600 leading-tight">No 12, Main Cricket Ground Road,<br/>Colombo 07, Sri Lanka.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm font-bold text-slate-600">+94 77 123 4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm font-bold text-slate-600">hello@academypro.com</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-500">
              &copy; {new Date().getFullYear()} AcademyPro. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {currentUser && (
        <EditPlayerProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          playerId={currentUser.id}
          userEmail={currentUser.email}
          onUpdateSuccess={() => {
            window.location.reload(); 
          }}
        />
      )}
    </div>
  );
}