"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, User, Save, Upload, Loader2, Calendar, Activity, ChevronDown, Phone, MapPin, Award } from "lucide-react";
import { getPlayerProfile, updatePlayerProfile } from "@/app/training-program/Action";
import { useToast } from "@/context/ToastContext";

interface EditPlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerId: number | string;
  userEmail: string;
  onUpdateSuccess: () => void;
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
        className="w-full rounded-xl cursor-pointer px-4 py-2.5 text-sm flex items-center justify-between transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-slate-50 text-slate-900 border border-slate-200 hover:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
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
                className={`w-full px-4 py-2.5 text-sm text-left transition-colors cursor-pointer flex items-center justify-between ${
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

export default function EditPlayerProfileModal({
  isOpen,
  onClose,
  playerId,
  userEmail,
  onUpdateSuccess,
}: EditPlayerProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {toast} = useToast()

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [playingRole, setPlayingRole] = useState("");
  const [battingStyle, setBattingStyle] = useState("");
  const [bowlingStyle, setBowlingStyle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
  ];

  const playingRoleOptions = [
    { value: "BATSMAN", label: "Batsman" },
    { value: "BALLER", label: "Bowler" },
    { value: "WICKER_KIPPER", label: "Wicket Keeper" },
    { value: "ALL_ROUNDER", label: "All Rounder" },
  ];

  const battingStyleOptions = [
    { value: "RIGHT_HAND_BAT", label: "Right-Hand Bat" },
    { value: "LEFT_HAND_BAT", label: "Left-Hand Bat" },
  ];

  const experienceLevelOptions = [
    { value: "BEGINNER", label: "Beginner" },
    { value: "SCHOOL_LEVEL", label: "School Level" },
    { value: "CLUB_LEVEL", label: "Club Level" },
    { value: "PROFESSIONAL", label: "Professional" },
  ];

  useEffect(() => {
    if (isOpen && playerId) {
      const fetchProfileData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await getPlayerProfile(playerId);
          if (res && res.code === 200 && res.data) {
            const data = res.data;
            setFullName(data.fullName || "");
            setDateOfBirth(data.dateOfBirth || "");
            setGender(data.gender || "");
            setPhoneNumber(data.phoneNumber || "");
            setAddress(data.address || "");
            setPlayingRole(data.playingRole || "");
            setBattingStyle(data.battingStyle || "");
            setBowlingStyle(data.bowlingStyle || "");
            setExperienceLevel(data.experienceLevel || "");
            
            if (data.image) {
              const formattedPath = data.image.replace(/\\/g, "/");
              setPreviewImage(`http://localhost:7000/${formattedPath}`);
            }
          } else {
            setError("Failed to load profile data.");
          }
        } catch (err) {
          setError("Something went wrong while fetching data.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfileData();
    } else {
      setSelectedImage(null);
      setPreviewImage(null);
    }
  }, [isOpen, playerId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      
      const playerData = {
        fullName,
        dateOfBirth,
        gender,
        phoneNumber,
        address,
        playingRole,
        battingStyle,
        bowlingStyle,
        experienceLevel,
      };
      
      formData.append("data", new Blob([JSON.stringify(playerData)], { type: "application/json" }));
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      const result = await updatePlayerProfile(formData, userEmail);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      toast.success("Success", "Successfully Updated Player Profile")
      onUpdateSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Edit Player Profile</h2>
              <p className="text-xs font-bold text-slate-500">Update your personal and cricket details</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
              <p className="text-sm font-bold text-slate-500">Loading your profile data...</p>
            </div>
          ) : (
            <form id="editProfileForm" onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="p-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-sm font-bold">
                  {error}
                </div>
              )}

              {/* Profile Image Upload */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative w-28 h-28 rounded-full border-4 border-emerald-50 bg-slate-100 shadow-inner overflow-hidden flex items-center justify-center group">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-slate-300" />
                  )}
                  
                  <label className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Upload className="w-6 h-6 text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs font-bold text-slate-500">Click image to change profile photo</p>
              </div>

              <hr className="border-slate-100" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" /> Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" /> Gender
                  </label>
                  <CustomSelect
                    value={gender}
                    onChange={setGender}
                    options={genderOptions}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-emerald-600" /> Phone Number
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                {/* Playing Role */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" /> Playing Role
                  </label>
                  <CustomSelect
                    value={playingRole}
                    onChange={setPlayingRole}
                    options={playingRoleOptions}
                  />
                </div>

                {/* Batting Style */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" /> Batting Style
                  </label>
                  <CustomSelect
                    value={battingStyle}
                    onChange={setBattingStyle}
                    options={battingStyleOptions}
                  />
                </div>

                {/* Bowling Style (Text Input) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" /> Bowling Style
                  </label>
                  <input
                    type="text"
                    value={bowlingStyle}
                    onChange={(e) => setBowlingStyle(e.target.value)}
                    placeholder="e.g. Right-arm offbreak"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                {/* Experience Level */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" /> Experience Level
                  </label>
                  <CustomSelect
                    value={experienceLevel}
                    onChange={setExperienceLevel}
                    options={experienceLevelOptions}
                  />
                </div>

              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving || isLoading}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 focus:outline-none transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button" 
            onClick={handleSubmit} 
            disabled={isSaving || isLoading}
            className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-70 flex items-center gap-2"
          >
            {isSaving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}