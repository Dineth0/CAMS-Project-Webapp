"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { addTrainingProgram, updateTrainingProgram, TrainingProgramItem } from '@/app/admin/programs/Action';
import { useUser } from '@/context/UserContext';

interface AddProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editProgram?: TrainingProgramItem | null; // Edit Data
}

export default function AddProgramModal({ isOpen, onClose, onSubmit, editProgram }: AddProgramModalProps) {
  const [formData, setFormData] = useState({
    programName: '',
    description: '',
    skillLevel: 'BEGINNER',
    durationWeeks: '',
    sessionPerWeek: '',
    fee: '',
    startDate: '',
    maximumPlayers: '',
    location: '',
    status: 'UPCOMING'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    if (editProgram) {
      setFormData({
        programName: editProgram.programName || '',
        description: editProgram.description || '',
        skillLevel: editProgram.skillLevel || 'BEGINNER',
        durationWeeks: editProgram.durationWeeks?.toString() || '',
        sessionPerWeek: editProgram.sessionPerWeek?.toString() || '',
        fee: editProgram.fee?.toString() || '',
        startDate: editProgram.startDate || '',
        maximumPlayers: editProgram.maximumPlayers?.toString() || '',
        location: editProgram.location || '',
        status: editProgram.status || 'UPCOMING'
      });
    } else {
      setFormData({
        programName: '', description: '', skillLevel: 'BEGINNER', durationWeeks: '', 
        sessionPerWeek: '', fee: '', startDate: '', maximumPlayers: '', location: '', status: 'UPCOMING'
      });
    }
  }, [editProgram, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      programName: formData.programName,
      description: formData.description,
      skillLevel: formData.skillLevel,
      durationWeeks: parseInt(formData.durationWeeks) || 0,
      sessionPerWeek: parseInt(formData.sessionPerWeek) || 0,
      fee: parseFloat(formData.fee) || 0.0,
      startDate: formData.startDate,
      maximumPlayers: parseInt(formData.maximumPlayers) || 0,
      location: formData.location,
      status: formData.status
    };

    try {
      let result;
      
      if (editProgram) {
        // --- EDIT / UPDATE MODE ---
        result = await updateTrainingProgram(editProgram.trainingProgramId, payload);
      } else {
        // --- ADD MODE ---
        if (!user || !user.email) {
          toast.error("Error", "User details not found. Please log in again.");
          setIsSubmitting(false);
          return;
        }
        result = await addTrainingProgram(payload, user.email);
      }

      if (result.success) {
        toast.success("Success", editProgram ? "Program Updated Successfully" : "Program Created Successfully");
        onSubmit(); // Refresh Main Table
        onClose();
      } else {
        toast.error("Error", result.message || "Operation failed");
      }
    } catch (error) {
      toast.error("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {editProgram ? "Edit Training Program" : "Add New Training Program"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {editProgram ? "Update details of the program." : "Fill in the details to create a new program."}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <div className="p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <form id="program-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Program Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Program Name *</label>
              <input
                type="text"
                name="programName"
                value={formData.programName}
                onChange={handleChange}
                required
                placeholder="e.g. Advanced Fielding Masterclass"
                className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
                placeholder="Brief description of the training program..."
                className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner"
              />
            </div>

            {/* 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Skill Level */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Skill Level *</label>
                <CustomSelect
                  value={formData.skillLevel}
                  onChange={(val) => handleSelectChange('skillLevel', val)}
                  options={[
                    { value: 'BEGINNER', label: 'Beginner' },
                    { value: 'INTERMEDIATE', label: 'Intermediate' },
                    { value: 'ADVANCED', label: 'Advanced' },
                    { value: 'PROFESSIONAL', label: 'Professional' },
                  ]}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Status *</label>
                <CustomSelect
                  value={formData.status}
                  onChange={(val) => handleSelectChange('status', val)}
                  options={[
                    { value: 'UPCOMING', label: 'Upcoming' },
                    { value: 'ONGOING', label: 'Ongoing' },
                    { value: 'COMPLETED', label: 'Completed' },
                    { value: 'CANCELLED', label: 'Cancelled' },
                  ]}
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner [color-scheme:dark]"
                />
              </div>

              {/* Duration (Weeks) */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Duration (Weeks) *</label>
                <input
                  type="number"
                  name="durationWeeks"
                  value={formData.durationWeeks}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g. 6"
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner"
                />
              </div>

              {/* Sessions Per Week */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Sessions Per Week *</label>
                <input
                  type="number"
                  name="sessionPerWeek"
                  value={formData.sessionPerWeek}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g. 3"
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner"
                />
              </div>

              {/* Fee */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Fee (LKR) *</label>
                <input
                  type="number"
                  name="fee"
                  value={formData.fee}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="e.g. 15000.00"
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner"
                />
              </div>

              {/* Maximum Players */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Maximum Players *</label>
                <input
                  type="number"
                  name="maximumPlayers"
                  value={formData.maximumPlayers}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g. 20"
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Colombo Indoor Nets"
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all shadow-inner"
                />
              </div>

            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-end space-x-3 bg-slate-900/50">
          <button 
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-bold text-slate-300 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="program-form"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : editProgram ? "Update Program" : "Save Program"}
          </button>
        </div>

      </div>
    </div>
  );
}

// CustomSelect Component
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
        className="w-full rounded-xl cursor-pointer px-3.5 py-2.5 text-sm flex items-center justify-between transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-slate-950/50 text-white border border-slate-700 focus:ring-2 focus:ring-emerald-500"
      >
        <span className="truncate font-medium">{selectedOption?.label || "Select an option"}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 text-slate-400 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 w-full mt-1.5 rounded-xl border border-slate-700 shadow-xl z-50 overflow-hidden bg-slate-900">
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
                  isSelected ? "bg-emerald-500/10 text-emerald-400 font-semibold" : "text-white hover:bg-slate-800"
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