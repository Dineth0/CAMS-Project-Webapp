"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle2, CreditCard, ShieldCheck, Phone, Clock, Activity, ChevronDown } from "lucide-react";
import { TrainingProgram } from "@/app/training-program/page";
import { registerForTraining } from "@/app/training-program/Action";
import { useToast } from "@/context/ToastContext";

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: TrainingProgram | null;
  onSubmit: (enrollmentData: any) => void;
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

export default function EnrollModal({ isOpen, onClose, program, onSubmit }: EnrollModalProps) {
  const [formData, setFormData] = useState({
    paymentTime: "ON_THAT_DAY",
    paymentMethod: "CASH",
    emergencyContact: "",
    preferredSlot: "MORNING",
    medicalConditions: "None",
    skillLevel: "INTERMEDIATE",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (formData.paymentTime === "ON_THAT_DAY") {
      setFormData((prev) => ({ ...prev, paymentMethod: "CASH" }));
    } else {
      setFormData((prev) => ({ ...prev, paymentMethod: "CREDIT_CARD" }));
    }
  }, [formData.paymentTime]);

  if (!isOpen || !program) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const userDataStr = localStorage.getItem("user");
      if (!userDataStr) {
        alert("User not logged in!");
        setIsSubmitting(false);
        return;
      }

      const userObj = JSON.parse(userDataStr);
      const userId = userObj.id;

      if (!userId) {
        alert("User ID not found!");
        setIsSubmitting(false);
        return;
      }

      const registrationData = {
        paymentTime: formData.paymentTime,
        paymentMethod: formData.paymentMethod,
        emergencyContact: parseInt(formData.emergencyContact) || 0,
        preferredSlot: formData.preferredSlot,
        medicalConditions: formData.medicalConditions,
        skillLevel: formData.skillLevel,
      };

      const result = await registerForTraining(userId, program.trainingProgramId, registrationData);

      if (result.success) {
        onSubmit(registrationData);
        toast.success("Success", "Registration Successfully");
        
        setFormData({
          paymentTime: "ON_THAT_DAY",
          paymentMethod: "CASH",
          emergencyContact: "",
          preferredSlot: "MORNING",
          medicalConditions: "None",
          skillLevel: "INTERMEDIATE",
        });
        onClose();
      } else {
        alert(result.message || "Registration Failed.");
      }
    } catch (error) {
      console.error("Registration failed", error);
      alert("Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-white shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mr-2" />
              Enroll Player
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Complete the details to register for the program.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 cursor-pointer hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Program Summary */}
        <div className="bg-emerald-50/50 p-5 border-b border-slate-100 shrink-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-bold text-slate-900 leading-tight">{program.programName}</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0 ml-3">
              {program.trainingProgramId}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs mt-3 text-slate-600 font-medium">
            <span>Starts: <span className="text-slate-900 font-bold">{program.startDate}</span></span>
            <span className="flex items-center">
              Fee: <span className="text-base font-black text-emerald-700 ml-1">Rs. {program.fee.toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          <form id="enrollment-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center mb-3">
                <Activity className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Registration Details
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center">
                    <Phone className="w-3 h-3 mr-1 text-slate-400"/> Emergency Contact *
                  </label>
                  <input 
                    type="number" 
                    name="emergencyContact" 
                    value={formData.emergencyContact} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="771234567" 
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400 shadow-sm transition-colors" 
                  />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Skill Level</label>
                  <CustomSelect
                    value={formData.skillLevel}
                    onChange={(val) => handleSelectChange("skillLevel", val)}
                    options={[
                      { value: "BEGINNER", label: "Beginner" },
                      { value: "INTERMEDIATE", label: "Intermediate" },
                      { value: "ADVANCED", label: "Advanced" },
                      { value: "PROFESSIONAL", label: "Professional" },
                    ]}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-slate-400"/> Preferred Time Slot
                  </label>
                  <CustomSelect
                    value={formData.preferredSlot}
                    onChange={(val) => handleSelectChange("preferredSlot", val)}
                    options={[
                      { value: "MORNING", label: "Morning" },
                      { value: "EVENING", label: "Evening" },
                      { value: "WEEKEND", label: "Weekend" },
                    ]}
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Medical Conditions</label>
                  <textarea 
                    name="medicalConditions" 
                    value={formData.medicalConditions} 
                    onChange={handleInputChange} 
                    rows={2} 
                    placeholder="Enter 'None' if not applicable" 
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400 shadow-sm transition-colors resize-none" 
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center mb-3">
                <CreditCard className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Payment Details
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">When are you paying? *</label>
                  <CustomSelect
                    value={formData.paymentTime}
                    onChange={(val) => handleSelectChange("paymentTime", val)}
                    options={[
                      { value: "ON_THAT_DAY", label: "On Training Day" },
                      { value: "ONLINE", label: "Pay Online Now" },
                    ]}
                  />
                </div>

                {formData.paymentTime === "ONLINE" && (
                  <div className="col-span-2 sm:col-span-1 animate-in fade-in duration-300">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Payment Method *</label>
                    <CustomSelect
                      value={formData.paymentMethod}
                      onChange={(val) => handleSelectChange("paymentMethod", val)}
                      options={[
                        { value: "CREDIT_CARD", label: "Credit/Debit Card" },
                        { value: "BANK_TRANSFER", label: "Bank Transfer" },
                      ]}
                    />
                  </div>
                )}
                
                {formData.paymentTime === "ON_THAT_DAY" && (
                  <div className="col-span-2 sm:col-span-1 flex items-center">
                     <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 w-full font-medium">
                       * Payment method will be set to <strong className="text-slate-900">CASH</strong> by default.
                     </p>
                  </div>
                )}
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2.5 text-sm cursor-pointer font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="enrollment-form" 
            disabled={isSubmitting}
            className="flex items-center px-6 cursor-pointer py-2.5 text-sm font-black text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {formData.paymentTime === 'ONLINE' ? 'Proceed to Pay' : 'Confirm Registration'}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}