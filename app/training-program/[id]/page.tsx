"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Calendar, MapPin, Users, 
  Clock, Target, ShieldCheck, Loader2, AlertCircle, CheckCircle2, Zap, Trophy, Flame,
  Phone,
  Mail,
  ArrowRight
} from "lucide-react";

import EnrollModal from "@/components/user/EnrollModal";
import PlayerUpgradeModal from "@/components/user/PlayerUpgradeModal"; 
import { getAllTrainingPrograms } from "../Action"; 
import { useUser } from "@/context/UserContext"; 
import { TrainingProgram } from "../page";
import backImg from "../Images/cricket_ground.png"


export default function TrainingProgramDetailsLightEpic() {
  const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:7000";

  const params = useParams();
  const router = useRouter();
  const programId = params.id as string;

  const [program, setProgram] = useState<TrainingProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isPlayerUpgradeModalOpen, setIsPlayerUpgradeModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  const { user: currentUser, refreshUser } = useUser();

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        setIsLoading(true);
        const result = await getAllTrainingPrograms();
        if (result && result.code === 200 && Array.isArray(result.data)) {
          const foundProgram = result.data.find((p: TrainingProgram) => p.trainingProgramId === programId);
          setProgram(foundProgram || null);
        }
      } catch (error) {
        console.error("Failed to load program details", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (programId) fetchProgramDetails();
  }, [programId]);

  useEffect(() => {
    const fetchUserEnrollments = async () => {
      if (currentUser && currentUser.id && currentUser.role === "PLAYER") {
        try {
          const response = await fetch(`${API_GATEWAY}/api/v1/trainingRegistration/player/${currentUser.id}`);
          const result = await response.json();
          if (result.code === 200 && Array.isArray(result.data)) {
            const isEnrolled = result.data.some((enrollment: any) => enrollment.trainingProgramId === programId);
            setIsAlreadyEnrolled(isEnrolled);
          }
        } catch (error) {
          console.error("Failed to load user enrollments", error);
        }
      }
    };
    fetchUserEnrollments();
  }, [currentUser, programId]);

  const handleEnrollClick = () => {
    if (currentUser?.role === "PLAYER") {
      setIsEnrollModalOpen(true);
    } else {
      setIsWarningModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-cover bg-center -z-20 fixed" style={{ backgroundImage:  `url(${backImg.src})` }}></div>
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px] -z-10 fixed pointer-events-none"></div>
        
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
          <p className="text-emerald-800 font-bold tracking-wider uppercase text-xs">Loading Arena...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-6 text-slate-800 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-cover bg-center -z-20 fixed" style={{ backgroundImage:`url(${backImg.src})` }}></div>
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[4px] -z-10 fixed pointer-events-none"></div>

        <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl border border-slate-200 shadow-2xl flex flex-col items-center text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
          <h2 className="text-2xl font-black mb-2 text-slate-900">Program Not Found</h2>
          <p className="text-slate-600 font-medium text-sm mb-6">The training session you are looking for does not exist or has been removed.</p>
          <button onClick={() => router.back()} className="w-full cursor-pointer px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-md shadow-emerald-600/20 transition-all">
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  const isProgramFull = program.status === "FULL";
  const isButtonDisabled = isAlreadyEnrolled || isProgramFull;

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-emerald-600 selection:text-white relative overflow-hidden">
      
      {/* Stadium Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center -z-20 fixed"
        style={{ backgroundImage: `url(${backImg.src})` }}
      ></div>
      
      {/* Reduced White Overlay (bg-white/40) for better visibility of the image */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px] -z-10 fixed pointer-events-none"></div>

      {/* Background Soft Gradients (Kept to enhance the feel but made subtle) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300/30 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-teal-300/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Navigation */}
      <nav className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between">
        <button 
          onClick={() => router.back()} 
          className="group flex items-center cursor-pointer gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-md hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 shadow-sm rounded-2xl text-slate-800 hover:text-emerald-800 transition-all font-bold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </button>
        <div className="flex items-center cursor-pointer gap-2 text-xs font-black uppercase tracking-widest bg-emerald-600 border border-emerald-500 text-white px-4 py-2 rounded-full shadow-md shadow-emerald-600/20">
          <Flame className="w-3.5 h-3.5 text-yellow-300" /> Pro Training Arena
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 relative z-10">
        
        {/* Hero Banner Section */}
        <div className="relative bg-emerald-800/90 backdrop-blur-md text-white rounded-3xl p-6 sm:p-10 mb-8 overflow-hidden shadow-2xl shadow-emerald-950/20 border border-emerald-600/50">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Trophy className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap gap-2.5 mb-5">
              <span className="bg-white/20 text-white border border-white/30 text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                <Target className="w-3.5 h-3.5" /> {program.skillLevel}
              </span>
              <span className={`text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider border backdrop-blur-md shadow-sm ${
                program.status === 'ONGOING' ? 'bg-blue-500/80 text-white border-blue-400' : 
                program.status === 'FULL' ? 'bg-rose-500/80 text-white border-rose-400' : 
                'bg-black/40 text-slate-100 border-white/20'
              }`}>
                {program.status}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight leading-tight">
              {program.programName}
            </h1>
            
            <p className="text-emerald-50 text-base sm:text-lg font-medium leading-relaxed">
              {program.description}
            </p>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Info Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 text-center shadow-sm hover:border-emerald-500 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 flex items-center justify-center text-emerald-700 mx-auto mb-3 border border-emerald-200">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Duration</p>
                <p className="text-lg font-black text-slate-900">{program.durationWeeks} Weeks</p>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 text-center shadow-sm hover:border-emerald-500 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-teal-100/80 flex items-center justify-center text-teal-700 mx-auto mb-3 border border-teal-200">
                  <Zap className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Intensity</p>
                <p className="text-lg font-black text-slate-900">{program.sessionPerWeek}x / Wk</p>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 text-center shadow-sm hover:border-emerald-500 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-blue-100/80 flex items-center justify-center text-blue-700 mx-auto mb-3 border border-blue-200">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Slots</p>
                <p className="text-lg font-black text-slate-900">Max {program.maximumPlayers}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 text-center shadow-sm hover:border-emerald-500 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-purple-100/80 flex items-center justify-center text-purple-700 mx-auto mb-3 border border-purple-200">
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Starts</p>
                <p className="text-base font-black text-slate-900">{program.startDate}</p>
              </div>
            </div>

            {/* Venue Card */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 flex items-center justify-center text-emerald-700 border border-emerald-200">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Training Ground & Venue</h3>
              </div>
              <p className="text-slate-800 font-black text-lg ml-13">{program.location}</p>
              <p className="text-slate-600 font-semibold text-sm mt-2 ml-13">Equipped with professional nets, pitching machines, and expert instructors.</p>
            </div>

          </div>

          {/* Right Action Box (Pricing & Enrollment) */}
          <div className="lg:col-span-4">
            <div className="bg-white/90 backdrop-blur-md border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-900/10 relative overflow-hidden sticky top-6">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none"></div>

              <p className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-2 relative z-10">Investment</p>
              <div className="text-4xl font-black text-slate-900 mb-6 flex items-baseline gap-1 relative z-10">
                Rs. {program.fee.toLocaleString()}
              </div>

              <div className="relative z-10">
                {isAlreadyEnrolled ? (
                  <div className="w-full py-4 px-4 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-2xl font-black flex items-center justify-center gap-2 mb-6 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Already Enrolled
                  </div>
                ) : (
                  <button 
                    onClick={handleEnrollClick}
                    disabled={isButtonDisabled}
                    className={`w-full py-4 px-4 cursor-pointer rounded-2xl text-base font-black transition-all duration-300 shadow-lg mb-6 ${
                      isProgramFull
                      ? "bg-slate-200/80 text-slate-500 cursor-pointer border border-slate-300 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 active:scale-[0.98]"
                    }`}
                  >
                    {isProgramFull ? "Session Full" : "Enroll Now"}
                  </button>
                )}
              </div>

              <div className="space-y-3.5 pt-4 border-t border-slate-200/80 relative z-10">
                <div className="flex items-center gap-3 text-sm text-slate-700 font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" /> Certified Professional Training
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 font-bold">
                  <Zap className="w-5 h-5 text-emerald-600 shrink-0" /> Instant slot confirmation
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modals */}
        {isWarningModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
             <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl">
                <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <AlertCircle className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Player Account Needed</h3>
                <p className="text-slate-500 text-sm mb-6 font-medium">Upgrade your account to a player profile to unlock training programs.</p>
                <div className="flex gap-3">
                  <button onClick={() => setIsWarningModalOpen(false)} className="flex-1 cursor-pointer px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors shadow-sm">
                    Cancel
                  </button>
                  <button onClick={() => { setIsWarningModalOpen(false); setIsPlayerUpgradeModalOpen(true); }} className="flex-1 cursor-pointer px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all">
                    Upgrade
                  </button>
                </div>
             </div>
          </div>
        )}
        

        <EnrollModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          program={program}
          onSubmit={() => {
            setIsAlreadyEnrolled(true);
            setIsEnrollModalOpen(false);
          }}
        />

        <PlayerUpgradeModal 
          isOpen={isPlayerUpgradeModalOpen} 
          onClose={() => setIsPlayerUpgradeModalOpen(false)}
          onSuccess={() => {
            refreshUser();
          }}
        />

      </main>
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
    </div>
  );
}