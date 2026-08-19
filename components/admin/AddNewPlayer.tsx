"use client";

import React, { useState } from 'react';
import { X, User, Phone, Trophy } from 'lucide-react';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function AddPlayerModal({ isOpen, onClose, onSubmit }: AddPlayerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: 'MALE',
    email: '',
    phoneNumber: '',
    address: '',
    playingRole: 'BATSMAN',
    battingStyle: 'RIGHT_HAND',
    bowlingStyle: 'RIGHT_ARM_FAST',
    experienceLevel: 'BEGINNER',
    status: 'ACTIVE'
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '', dateOfBirth: '', gender: 'MALE', email: '', phoneNumber: '', 
      address: '', playingRole: 'BATSMAN', battingStyle: 'RIGHT_HAND', 
      bowlingStyle: 'RIGHT_ARM_FAST', experienceLevel: 'BEGINNER', status: 'ACTIVE'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Register New Player</h2>
            <p className="text-xs text-slate-400 mt-1">Add a new player profile to the system.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <div className="p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <form id="add-player-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Personal Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center border-b border-slate-800 pb-2">
                <User className="w-4 h-4 text-emerald-400 mr-2" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Kusal Mendis"
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Date of Birth</label>
                  <input 
                    type="date" 
                    name="dateOfBirth" 
                    value={formData.dateOfBirth} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner [color-scheme:dark]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Gender</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner"
                  >
                    <option value="MALE" className="bg-slate-900">Male</option>
                    <option value="FEMALE" className="bg-slate-900">Female</option>
                    <option value="OTHER" className="bg-slate-900">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Details */}
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center border-b border-slate-800 pb-2">
                <Phone className="w-4 h-4 text-emerald-400 mr-2" /> Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="example@mail.com"
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber" 
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                    required 
                    placeholder="+94 77 123 4567"
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Address</label>
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    rows={2} 
                    required 
                    placeholder="Street, City, District"
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner" 
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Cricket Profile */}
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center border-b border-slate-800 pb-2">
                <Trophy className="w-4 h-4 text-emerald-400 mr-2" /> Cricket Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Playing Role</label>
                  <select 
                    name="playingRole" 
                    value={formData.playingRole} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner"
                  >
                    <option value="BATSMAN" className="bg-slate-900">Batsman</option>
                    <option value="BOWLER" className="bg-slate-900">Bowler</option>
                    <option value="WICKET_KEEPER" className="bg-slate-900">Wicket Keeper</option>
                    <option value="ALL_ROUNDER" className="bg-slate-900">All-Rounder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Experience Level</label>
                  <select 
                    name="experienceLevel" 
                    value={formData.experienceLevel} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner"
                  >
                    <option value="BEGINNER" className="bg-slate-900">Beginner</option>
                    <option value="CLUB_LEVEL" className="bg-slate-900">Club Level</option>
                    <option value="PRO" className="bg-slate-900">Professional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Batting Style</label>
                  <select 
                    name="battingStyle" 
                    value={formData.battingStyle} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner"
                  >
                    <option value="RIGHT_HAND" className="bg-slate-900">Right Hand</option>
                    <option value="LEFT_HAND" className="bg-slate-900">Left Hand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Bowling Style</label>
                  <select 
                    name="bowlingStyle" 
                    value={formData.bowlingStyle} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner"
                  >
                    <option value="RIGHT_ARM_FAST" className="bg-slate-900">Right Arm Fast</option>
                    <option value="RIGHT_ARM_SPIN" className="bg-slate-900">Right Arm Spin</option>
                    <option value="LEFT_ARM_FAST" className="bg-slate-900">Left Arm Fast</option>
                    <option value="LEFT_ARM_SPIN" className="bg-slate-900">Left Arm Spin</option>
                    <option value="NONE" className="bg-slate-900">None</option>
                  </select>
                </div>
                
              </div>
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-end space-x-3 bg-slate-900/50 shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2.5 text-sm font-bold text-slate-300 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="add-player-form" 
            className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all"
          >
            Register Player
          </button>
        </div>

      </div>
    </div>
  );
}