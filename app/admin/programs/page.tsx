"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Target, Activity, 
  CalendarClock, CheckCircle, Edit, 
  Trash2, MoreVertical, Calendar, MapPin, Loader2, AlertTriangle
} from 'lucide-react';
import AddProgramModal from '@/components/admin/AddNewProgram';
import { getAllTrainingPrograms, deleteTrainingProgram, TrainingProgramItem } from './Action';
import { useToast } from '@/context/ToastContext'; 

export default function TrainingProgram() {
  const [searchTerm, setSearchTerm] = useState("");
  const [programs, setPrograms] = useState<TrainingProgramItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgramItem | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { toast } = useToast();

  const fetchPrograms = async () => {
    setIsLoading(true);
    const res = await getAllTrainingPrograms();
    if (res.code === 200 && Array.isArray(res.data)) {
      setPrograms(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const totalPrograms = programs.length;
  const activeCount = programs.filter(p => p.status?.toUpperCase() === 'ONGOING' || p.status?.toUpperCase() === 'ACTIVE').length;
  const upcomingCount = programs.filter(p => p.status?.toUpperCase() === 'UPCOMING').length;
  const completedCount = programs.filter(p => p.status?.toUpperCase() === 'COMPLETED').length;

  const summaryCards = [
    { title: "Total Programs", value: totalPrograms.toString().padStart(2, '0'), icon: Target, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { title: "Active / Ongoing", value: activeCount.toString().padStart(2, '0'), icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { title: "Upcoming Programs", value: upcomingCount.toString().padStart(2, '0'), icon: CalendarClock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { title: "Completed", value: completedCount.toString().padStart(2, '0'), icon: CheckCircle, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  ];

  const filteredPrograms = programs.filter((program) => 
    program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.skillLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddNew = () => {
    setSelectedProgram(null);
    setIsModalOpen(true);
  };

  const handleEdit = (program: TrainingProgramItem) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: string) => {
    setProgramToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!programToDelete) return;
    setIsDeleting(true);

    const result = await deleteTrainingProgram(programToDelete);
    
    if (result.success) {
      toast.success("Success", "Training program deleted successfully");
      fetchPrograms(); 
    } else {
      toast.error("Error", result.message || "Failed to delete program");
    }

    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setProgramToDelete(null);
  };

  const getLevelStyle = (level: string) => {
    const formatted = level?.toUpperCase();
    if (formatted === "BEGINNER") return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    if (formatted === "INTERMEDIATE") return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
  };

  const getStatusStyle = (status: string) => {
    const formatted = status?.toUpperCase();
    if (formatted === "UPCOMING") return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    if (formatted === "ONGOING" || formatted === "ACTIVE") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (formatted === "FULL") return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    return "bg-slate-800 text-slate-300 border-slate-700/60";
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Training Programs</h1>
        <p className="text-sm text-slate-400 mt-1">Manage all cricket academy courses and sessions.</p>
      </div>

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{card.title}</p>
                <h3 className="text-2xl font-black text-slate-100">{card.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${card.bg}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search by name, location or level..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-950/50"
          />
        </div>

        <button 
          onClick={handleAddNew} 
          className="flex items-center cursor-pointer justify-center w-full sm:w-auto px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Program
        </button>
      </div>

      {/* 3. Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="px-6 py-4">Program Details</th>
                <th className="px-6 py-4">Skill Level</th>
                <th className="px-6 py-4">Duration & Fee</th>
                <th className="px-6 py-4">Status & Capacity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                      Loading programs...
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No programs found.
                  </td>
                </tr>
              ) : (
                currentItems.map((program) => (
                  <tr key={program.trainingProgramId} className="hover:bg-slate-800/40 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200 text-base mb-0.5">{program.programName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span className="font-semibold text-slate-500">#{program.trainingProgramId.substring(0, 8)}...</span>
                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1 text-slate-500" /> {program.startDate}</span>
                        <span className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-slate-500" /> {program.location}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getLevelStyle(program.skillLevel)}`}>
                        {program.skillLevel}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200 mb-0.5">
                        {program.durationWeeks} Weeks <span className="text-xs text-slate-400 font-normal">({program.sessionPerWeek} sessions/wk)</span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400">
                        Rs. {program.fee?.toLocaleString()}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="mb-1.5">
                         <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wide ${getStatusStyle(program.status)}`}>
                           {program.status}
                         </span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400">
                        Max Players: <span className="text-slate-200">{program.maximumPlayers}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Edit Button */}
                        <button 
                          onClick={() => handleEdit(program)}
                          className="p-2 cursor-pointer text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {/* Delete Button */}
                        <button 
                          onClick={() => confirmDelete(program.trainingProgramId)}
                          className="p-2 cursor-pointer text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 cursor-pointer text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {!isLoading && filteredPrograms.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs font-medium text-slate-400 bg-slate-950/60 mt-auto">
            <span>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPrograms.length)} of {filteredPrograms.length} programs
            </span>
            <div className="flex space-x-1">
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 cursor-pointer border border-slate-700 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-300 transition-colors"
              >
                Prev
              </button>
              
              {/* Pagination Numbers (Optional) */}
              <div className="hidden sm:flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 cursor-pointer py-1.5 border rounded-lg transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-emerald-500/20 cursor-pointer border-emerald-500/30 text-emerald-400' 
                        : 'border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 cursor-pointer border border-slate-700 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-300 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add / Edit Modal Component */}
      <AddProgramModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProgram(null);
        }} 
        editProgram={selectedProgram}
        onSubmit={() => {
          fetchPrograms(); 
        }} 
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 overflow-hidden">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/10 mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 text-center mb-2">Delete Program?</h3>
            <p className="text-sm text-slate-400 text-center mb-6">
              Are you sure you want to delete this training program? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-5 py-2.5 cursor-pointer text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 w-full"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 cursor-pointer text-sm font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-500 shadow-lg shadow-rose-900/20 transition-all disabled:opacity-50 flex items-center justify-center w-full"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}