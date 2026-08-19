"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Users, UserCheck, 
  Trophy, TrendingUp, Trash2, 
  Mail, Phone, Shield, 
  Eye, Loader2, AlertTriangle
} from 'lucide-react';
import AddPlayerModal from '@/components/admin/AddNewPlayer';
import { getAllPlayers, deletePlayer, PlayerItem } from './Action';
import { useToast } from '@/context/ToastContext';
import ViewPlayerModal from '@/components/admin/player/ViewPlayerModal';

export default function PlayersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<PlayerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [playerToView, setPlayerToView] = useState<PlayerItem | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { toast } = useToast();

  const fetchPlayers = async () => {
    setIsLoading(true);
    const res = await getAllPlayers();
    if (res.code === 200 && Array.isArray(res.data)) {
      setPlayers(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const totalPlayers = players.length;
  const clubLevelCount = players.filter(p => p.experienceLevel?.toUpperCase() === 'CLUB_LEVEL').length;
  const proLevelCount = players.filter(p => p.experienceLevel?.toUpperCase() === 'PRO_LEVEL' || p.experienceLevel?.toUpperCase() === 'PRO').length;
  const schoolLevelCount = players.filter(p => p.experienceLevel?.toUpperCase() === 'SCHOOL_LEVEL' || p.experienceLevel?.toUpperCase() === 'BEGINNER').length;

  const summaryCards = [
    { title: "Total Players", value: totalPlayers.toString(), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { title: "Club Level", value: clubLevelCount.toString(), icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { title: "Pro Level", value: proLevelCount.toString(), icon: Trophy, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { title: "School/Beginner", value: schoolLevelCount.toString(), icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  ];

  const filteredPlayers = players.filter((player) => 
    player.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.playingRole?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPlayers.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const confirmDelete = (id: number) => {
    setPlayerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (playerToDelete === null) return;
    setIsDeleting(true);

    const result = await deletePlayer(playerToDelete);
    
    if (result.success) {
      toast.success("Success", "Player deleted successfully");
      fetchPlayers(); 
    } else {
      toast.error("Error", result.message || "Failed to delete player");
    }

    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setPlayerToDelete(null);
  };

  const handleViewPlayer = (player: PlayerItem) => {
    setPlayerToView(player);
    setIsViewModalOpen(true);
  };

  const getRoleFormat = (role: string) => role?.replace(/_/g, " ") || "N/A";
  
  const getExperienceStyle = (level: string) => {
    const formatted = level?.toUpperCase();
    if (formatted === "BEGINNER" || formatted === "SCHOOL_LEVEL") return "bg-slate-800 text-slate-300 border-slate-700/60";
    if (formatted === "CLUB_LEVEL") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return "bg-amber-500/10 text-amber-400 border-amber-500/20"; 
  };

  return (
    <div className="space-y-6 pb-10 flex flex-col h-full">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Players Management</h1>
        <p className="text-sm text-slate-400 mt-1">Manage player profiles, expertise, and contact details.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center justify-between">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search players by name, role or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-950/50 transition-all shadow-inner"
          />
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center w-full sm:w-auto px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Player
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex flex-col flex-1 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="px-6 py-4">Player Profile</th>
                <th className="px-6 py-4">Cricket Role & Style</th>
                <th className="px-6 py-4">Experience Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                      Loading players...
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No players found.
                  </td>
                </tr>
              ) : (
                currentItems.map((player) => (
                  <tr key={player.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Profile & Contact WITH AVATAR */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar Image or Name Initial */}
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 text-emerald-400 font-bold border border-slate-700 overflow-hidden shrink-0 shadow-inner">
                          {player.image ? (
                            <img 
                              src={player.image} 
                              alt={player.fullName} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = player.fullName ? player.fullName.charAt(0).toUpperCase() : '?';
                              }}
                            />
                          ) : (
                            <span>{player.fullName ? player.fullName.charAt(0).toUpperCase() : '?'}</span>
                          )}
                        </div>
                        
                        {/* Details */}
                        <div>
                          <div className="font-bold text-slate-200 text-base mb-1">{player.fullName}</div>
                          <div className="flex flex-col gap-1 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-500">ID: {player.id}</span>
                            <span className="flex items-center"><Mail className="w-3 h-3 mr-1.5 text-slate-500" /> {player.email}</span>
                            <span className="flex items-center"><Phone className="w-3 h-3 mr-1.5 text-slate-500" /> {player.phoneNumber}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Style */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200 text-xs mb-1.5 flex items-center">
                        <Shield className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                        {getRoleFormat(player.playingRole)}
                      </div>
                      <div className="text-[11px] text-slate-400 flex flex-col gap-0.5">
                        <span>Bat: <span className="font-medium text-slate-300">{getRoleFormat(player.battingStyle)}</span></span>
                        <span>Bowl: <span className="font-medium text-slate-300">{getRoleFormat(player.bowlingStyle)}</span></span>
                      </div>
                    </td>

                    {/* Experience */}
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getExperienceStyle(player.experienceLevel)}`}>
                        {getRoleFormat(player.experienceLevel)}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-2 font-medium">
                        DOB: {player.dateOfBirth}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border-emerald-500/30`}>
                        ACTIVE
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* VIEW Button */}
                        <button 
                          onClick={() => handleViewPlayer(player)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" 
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* DELETE Button */}
                        <button 
                          onClick={() => confirmDelete(player.id)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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
        {!isLoading && filteredPlayers.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs font-medium text-slate-400 bg-slate-950/60 mt-auto">
            <span>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPlayers.length)} of {filteredPlayers.length} players
            </span>
            <div className="flex space-x-1">
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-slate-700 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-300 transition-colors"
              >
                Prev
              </button>
              
              <div className="hidden sm:flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1.5 border rounded-lg transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
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
                className="px-3 py-1.5 border border-slate-700 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-300 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPlayerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={() => {
          fetchPlayers();
        }}
      />

      <ViewPlayerModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        player={playerToView}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 overflow-hidden">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/10 mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 text-center mb-2">Delete Player?</h3>
            <p className="text-sm text-slate-400 text-center mb-6">
              Are you sure you want to remove this player? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-5 py-2.5 text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 w-full"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 text-sm font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-500 shadow-lg shadow-rose-900/20 transition-all disabled:opacity-50 flex items-center justify-center w-full"
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