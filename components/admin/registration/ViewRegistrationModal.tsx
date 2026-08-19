import React from 'react';
import { 
  X, User, Mail, Calendar, CreditCard, 
  Activity, Clock, Phone, FileText, CheckCircle2 
} from 'lucide-react';

export interface Registration {
  enrollmentId: number;
  userId: number;
  userName: string;
  email: string;
  trainingProgramId: string;
  enrollmentDate: string;
  paymentTime: string;
  paymentMethod: string;
  paymentStatus: string;
  emergencyContact: number;
  preferredSlot: string | null;
  medicalConditions: string | null;
  skillLevel: string | null;
}

interface ViewRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: Registration | null;
}

export default function ViewRegistrationModal({ isOpen, onClose, registration }: ViewRegistrationModalProps) {
  if (!isOpen || !registration) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "PENDING": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "FAILED": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default: return "text-slate-300 bg-slate-800 border-slate-700/60";
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-full flex items-center justify-center text-xl font-bold uppercase">
              {registration.userName?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">{registration.userName}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ENROLLMENT ID: {registration.enrollmentId}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* User & Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                Player & Contact Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">User ID</span>
                  <span className="text-sm text-slate-300 font-medium mt-0.5">{registration.userId}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Email Address</span>
                  <span className="text-sm text-slate-300 flex items-center gap-2 mt-0.5">
                    <Mail className="w-4 h-4 text-slate-400" /> {registration.email}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Emergency Contact</span>
                  <span className="text-sm text-slate-300 flex items-center gap-2 mt-0.5">
                    <Phone className="w-4 h-4 text-slate-400" /> 
                    {registration.emergencyContact === 0 ? "Not Provided" : registration.emergencyContact}
                  </span>
                </div>
              </div>

              {/* Medical & Skill Information */}
              <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2 mt-6">
                <Activity className="w-4 h-4 text-rose-400" />
                Health & Skills
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Medical Conditions</span>
                  <span className="text-sm text-slate-300 mt-0.5">
                    {registration.medicalConditions || "None reported"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Skill Level</span>
                  <span className="text-sm text-slate-300 mt-0.5">
                    {registration.skillLevel || "Not Specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Program & Payment Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Program Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex flex-col bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 break-all">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Training Program ID</span>
                  <span className="text-sm font-medium text-slate-200 mt-0.5">
                    {registration.trainingProgramId}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Enrollment Date</span>
                  <span className="text-sm text-slate-300 flex items-center gap-2 mt-0.5">
                    <Calendar className="w-4 h-4 text-slate-400" /> 
                    {formatDate(registration.enrollmentDate)}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Preferred Slot</span>
                  <span className="text-sm text-slate-300 flex items-center gap-2 mt-0.5">
                    <Clock className="w-4 h-4 text-slate-400" /> 
                    {registration.preferredSlot || "Any Available"}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2 mt-6">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Payment Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Payment Method</span>
                  <span className="text-sm font-bold text-slate-200 mt-0.5">{registration.paymentMethod}</span>
                </div>
                <div className="flex flex-col bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Payment Type</span>
                  <span className="text-sm font-bold text-slate-200 mt-0.5">{registration.paymentTime}</span>
                </div>
                <div className="flex flex-col col-span-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold mb-1">Status</span>
                  <span className={`inline-flex w-fit items-center text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${getStatusStyle(registration.paymentStatus)}`}>
                    {registration.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}