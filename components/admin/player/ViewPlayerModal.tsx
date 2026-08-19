import React from 'react';
import { 
  X, User, Mail, Phone, MapPin, Calendar, 
  Shield, Activity, Award, CheckCircle2 
} from 'lucide-react';
import { PlayerItem } from '@/app/admin/players/Action';

interface ViewPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerItem | null;
}

export default function ViewPlayerModal({ isOpen, onClose, player }: ViewPlayerModalProps) {
  if (!isOpen || !player) return null;

  const getRoleFormat = (role: string) => role?.replace(/_/g, " ") || "N/A";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-xl font-bold uppercase">
              {player.fullName?.charAt(0) || 'P'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">{player.fullName}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ACTIVE PLAYER
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 cursor-pointer hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                Personal Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Email Address</span>
                  <span className="text-sm text-slate-300 flex items-center gap-2 mt-0.5">
                    <Mail className="w-4 h-4 text-slate-400" /> {player.email}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Phone Number</span>
                  <span className="text-sm text-slate-300 flex items-center gap-2 mt-0.5">
                    <Phone className="w-4 h-4 text-slate-400" /> {player.phoneNumber}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Date of Birth</span>
                  <span className="text-sm text-slate-300 flex items-center gap-2 mt-0.5">
                    <Calendar className="w-4 h-4 text-slate-400" /> {player.dateOfBirth}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Gender</span>
                  <span className="text-sm text-slate-300 flex items-center gap-2 mt-0.5">
                    <User className="w-4 h-4 text-slate-400" /> {player.gender}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Address</span>
                  <span className="text-sm text-slate-300 flex items-start gap-2 mt-0.5">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" /> 
                    {player.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Cricket Profile */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Cricket Profile
              </h3>
              
              <div className="space-y-3">
                <div className="flex flex-col bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Playing Role</span>
                  <span className="text-sm font-bold text-emerald-400 mt-0.5">
                    {getRoleFormat(player.playingRole)}
                  </span>
                </div>
                
                <div className="flex flex-col bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Batting Style</span>
                  <span className="text-sm text-slate-200 mt-0.5 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    {getRoleFormat(player.battingStyle)}
                  </span>
                </div>

                <div className="flex flex-col bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Bowling Style</span>
                  <span className="text-sm text-slate-200 mt-0.5 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-400" />
                    {getRoleFormat(player.bowlingStyle)}
                  </span>
                </div>

                <div className="flex flex-col bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Experience Level</span>
                  <span className="text-sm font-bold text-amber-400 mt-0.5 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    {getRoleFormat(player.experienceLevel)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm cursor-pointer font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}