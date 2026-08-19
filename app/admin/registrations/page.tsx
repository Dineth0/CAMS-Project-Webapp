"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, BookmarkCheck, CreditCard, Clock, 
  AlertCircle, Eye, Filter, Calendar, User, BookOpen, Loader2
} from 'lucide-react';
import { getAllRegistrations, RegistrationItem } from './Action';
import ViewRegistrationModal from '@/components/admin/registration/ViewRegistrationModal';

export default function RegistrationManagement() {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationItem | null>(null);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    const result = await getAllRegistrations();
    if (result.success) {
      setRegistrations(result.data);
    } else {
      console.error(result.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const totalEnrollments = registrations.length;
  const paidCount = registrations.filter(r => r.paymentStatus?.toUpperCase() === 'PAID').length;
  const pendingCount = registrations.filter(r => r.paymentStatus?.toUpperCase() === 'PENDING').length;
  const failedCount = registrations.filter(r => ['FAILED', 'UNPAID'].includes(r.paymentStatus?.toUpperCase())).length;

  const summaryCards = [
    { title: "Total Enrollments", value: totalEnrollments.toString(), icon: BookmarkCheck, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { title: "Paid Registrations", value: paidCount.toString(), icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { title: "Pending Payments", value: pendingCount.toString(), icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { title: "Failed / Unpaid", value: failedCount.toString(), icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  ];

  const filteredRegistrations = registrations.filter((item) => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      item.enrollmentId.toString().includes(searchString) ||
      item.userName?.toLowerCase().includes(searchString) ||
      item.email?.toLowerCase().includes(searchString) ||
      item.trainingProgramId?.toLowerCase().includes(searchString);

    const matchesStatus = statusFilter === "ALL" || item.paymentStatus?.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRegistrations.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleView = (reg: RegistrationItem) => {
    setSelectedRegistration(reg);
    setIsViewModalOpen(true);
  };

  const getPaymentStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "PENDING": return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "FAILED": return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default: return "bg-slate-800 text-slate-300 border-slate-700/60";
    }
  };

  const formatDateShort = (dateString: string) => {
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 pb-10 flex flex-col h-full">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Program Registrations</h1>
        <p className="text-sm text-slate-400 mt-1">Track and manage player course enrollments & payment status.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg shadow-black/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{card.title}</p>
                <h3 className="text-2xl font-black text-slate-100">{card.value.padStart(2, '0')}</h3>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-inner ${card.bg}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg shadow-black/10">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search by ID, Player Name or Program..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-950/50 transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
          >
            <option value="ALL" className="bg-slate-900 text-slate-200">All Payment Status</option>
            <option value="PAID" className="bg-slate-900 text-slate-200">Paid</option>
            <option value="PENDING" className="bg-slate-900 text-slate-200">Pending</option>
            <option value="FAILED" className="bg-slate-900 text-slate-200">Failed</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg shadow-black/10 flex flex-col flex-1 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="px-6 py-4">Enrollment Details</th>
                <th className="px-6 py-4">Player Details</th>
                <th className="px-6 py-4">Training Program</th>
                <th className="px-6 py-4">Payment Info</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {isLoading ? (
                 <tr>
                 <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                   <div className="flex items-center justify-center gap-2">
                     <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                     Loading registrations...
                   </div>
                 </td>
               </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.enrollmentId} className="hover:bg-slate-800/40 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200 text-base mb-0.5">ENR-{item.enrollmentId}</div>
                      <div className="text-[11px] text-slate-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-slate-500" />
                        {formatDateShort(item.enrollmentDate)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200 flex items-center mb-0.5">
                        <User className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                        {item.userName}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500">
                        {item.email}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      
                      <div className="text-[11px] font-semibold text-slate-400">
                        {item.programName ? `${item.programName}` : 'N/A'}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${getPaymentStatusStyle(item.paymentStatus)}`}>
                        {item.paymentStatus}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1.5 font-medium">
                        Via {item.paymentMethod} ({item.paymentTime})
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => handleView(item)}
                          className="p-2 text-slate-400 cursor-pointer hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 text-sm font-medium">
                    No enrollments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && filteredRegistrations.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs font-medium text-slate-400 bg-slate-950/60 mt-auto">
            <span>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRegistrations.length)} of {filteredRegistrations.length} registrations
            </span>
            <div className="flex space-x-1">
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border cursor-pointer border-slate-700 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-300 transition-colors"
              >
                Prev
              </button>
              
              <div className="hidden sm:flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1.5 cursor-pointer border rounded-lg transition-colors ${
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
                className="px-3 py-1.5 border cursor-pointer border-slate-700 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-300 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      <ViewRegistrationModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        registration={selectedRegistration}
      />

    </div>
  );
}