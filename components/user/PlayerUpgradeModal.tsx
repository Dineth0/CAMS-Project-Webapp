"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Upload, Calendar, MapPin, Phone, ShieldCheck, Loader2, ChevronDown } from "lucide-react";
import { upgradePlayerProfile } from "@/app/training-program/Action";
import { useToast } from "@/context/ToastContext";

interface PlayerUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function CustomSelect({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-xl cursor-pointer px-3.5 py-2.5 text-sm flex items-center justify-between transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-slate-900 border border-slate-200 hover:border-emerald-500 focus:ring-2 focus:ring-emerald-500 shadow-sm"
      >
        <span className="truncate font-medium">{selectedOption?.label || "Select an option"}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 text-slate-500 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 w-full mt-1.5 rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden bg-white">
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 text-sm text-left transition-colors cursor-pointer flex items-center justify-between ${
                  isSelected ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PlayerUpgradeModal({ isOpen, onClose, onSuccess }: PlayerUpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "MALE",
    phoneNumber: "",
    address: "",
    playingRole: "BATSMAN",
    battingStyle: "RIGHT_HAND_BAT",
    bowlingStyle: "Right-arm offbreak",
    experienceLevel: "CLUB_LEVEL",
  });
  const { toast } = useToast();
  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userDataStr = localStorage.getItem("user");
      if (!userDataStr) {
        alert("User not logged in!");
        setIsLoading(false);
        return;
      }

      const userObj = JSON.parse(userDataStr);
      const userEmail = userObj.email;

      if (!userEmail) {
        alert("User email not found in local storage!");
        setIsLoading(false);
        return;
      }

      const submitData = new FormData();
      const jsonBlob = new Blob([JSON.stringify(formData)], { type: "application/json" });
      submitData.append("data", jsonBlob);
      
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      const result = await upgradePlayerProfile(submitData, userEmail);

      if (result.success) {
        toast.success("Success", "User Converted To As Player");
        
        userObj.role = "PLAYER"; 
        localStorage.setItem("user", JSON.stringify(userObj));

        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert(result.message || "Failed to upgrade player profile.");
      }
    } catch (error) {
      console.error("Upgrade failed", error);
      alert("Failed to upgrade player profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mr-2" />
              Upgrade to Player Profile
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">Complete your profile to enroll in programs</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Personal Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5 block">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleInputChange}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5 block">Gender</label>
                  <CustomSelect
                    value={formData.gender}
                    onChange={(val) => setFormData((prev) => ({ ...prev, gender: val }))}
                    options={[
                      { value: "MALE", label: "Male" },
                      { value: "FEMALE", label: "Female" },
                    ]}
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="text" name="phoneNumber" placeholder="0771234567" required value={formData.phoneNumber} onChange={handleInputChange}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5 block">Address</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="text" name="address" placeholder="No 12, Galle Road, Colombo" required value={formData.address} onChange={handleInputChange}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm outline-none" />
                  </div>
                </div>
              </div>

              {/* Cricketing Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5 block">Playing Role</label>
                  <CustomSelect
                    value={formData.playingRole}
                    onChange={(val) => setFormData((prev) => ({ ...prev, playingRole: val }))}
                    options={[
                      { value: "BATSMAN", label: "Batsman" },
                      { value: "BALLER", label: "Baller" },
                      { value: "ALL_ROUNDER", label: "All Rounder" },
                      { value: "WICKER_KIPPER", label: "Wicket Keeper" },
                    ]}
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5 block">Batting Style</label>
                  <CustomSelect
                    value={formData.battingStyle}
                    onChange={(val) => setFormData((prev) => ({ ...prev, battingStyle: val }))}
                    options={[
                      { value: "RIGHT_HAND_BAT", label: "Right Hand Bat" },
                      { value: "LEFT_HAND_BAT", label: "Left Hand Bat" },
                    ]}
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5 block">Bowling Style</label>
                  <input type="text" name="bowlingStyle" placeholder="e.g. Right-arm offbreak" value={formData.bowlingStyle} onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm outline-none" />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5 block">Experience Level</label>
                  <CustomSelect
                    value={formData.experienceLevel}
                    onChange={(val) => setFormData((prev) => ({ ...prev, experienceLevel: val }))}
                    options={[
                      { value: "BEGINNER", label: "Beginner" },
                      { value: "SCHOOL_LEVEL", label: "School Level" },
                      { value: "CLUB_LEVEL", label: "Club Level" },
                      { value: "PROFESSIONAL", label: "Professional" },
                    ]}
                  />
                </div>
              </div>
              
              {/* Image Upload */}
              <div className="sm:col-span-2 mt-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 block">Profile Image (Required)</label>
                 <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-colors">
                    <Upload className="w-8 h-8 text-emerald-600 mb-2" />
                    <input type="file" name="image" accept="image/*" required onChange={handleFileChange} className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"/>
                 </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0 flex gap-3">
            <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 py-3 px-4 bg-white hover:bg-slate-100 text-slate-700 text-sm font-bold border border-slate-200 rounded-xl transition-all disabled:opacity-50 shadow-sm">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 flex items-center justify-center py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting...</> : "Register as Player"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}