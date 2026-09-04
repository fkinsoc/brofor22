import React, { useState, useMemo } from 'react';
import AppLayout from '../components/Layout';
import { staticParcels, RiskLevel, Parcel } from '../lib/data';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>(staticParcels);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 15;

  const [newParcel, setNewParcel] = useState({
    id: `LA-MH-${Math.floor(Math.random() * 9000) + 1000}`,
    surveyNumber: '',
    village: '',
    district: 'Pune',
    landOwner: '',
    areaAcres: '',
    currentAcquisitionStage: 'Initial Notification',
  });

  const filteredParcels = useMemo(() => {
    return parcels.filter(p => {
      const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.landOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.village.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'All' || p.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [searchTerm, riskFilter, parcels]);

  const totalPages = Math.ceil(filteredParcels.length / itemsPerPage);
  const paginatedParcels = filteredParcels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const riskColor = (level: RiskLevel) => {
    switch (level) {
      case 'High': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Low': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-zinc-500/10 text-text-secondary dark:text-zinc-500 border-zinc-500/20';
    }
  };

  const handleAddParcel = (e: React.FormEvent) => {
    e.preventDefault();
    const parcelToAdd: Parcel = {
      ...newParcel,
      areaAcres: parseFloat(newParcel.areaAcres) || 0,
      state: 'Maharashtra',
      numberOfOwners: 1,
      ownershipVerificationStatus: 'Pending',
      documentationStatus: 'Incomplete',
      compensationStatus: 'Pending',
      legalDisputeStatus: 'None',
      objectionStatus: 'None',
      approvalStatus: 'Pending',
      encroachmentStatus: 'None',
      acquisitionStartDate: new Date().toISOString(),
      expectedCompletionDate: new Date().toISOString(),
      riskScore: 20,
      riskLevel: 'Low',
      delayProbability: 10,
      predictedDelayDays: 0,
      topRiskFactors: [{ factor: 'Standard processing time', contribution: 100 }],
      recommendedAction: 'Continue standard process.',
      lat: 18.5204,
      lng: 73.8567,
    } as Parcel;
    
    setParcels([parcelToAdd, ...parcels]);
    setIsAddModalOpen(false);
    setNewParcel({
      ...newParcel,
      id: `LA-MH-${Math.floor(Math.random() * 9000) + 1000}`,
      surveyNumber: '',
      village: '',
      landOwner: '',
      areaAcres: '',
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">Land Parcels</h1>
            <p className="text-sm text-text-secondary dark:text-zinc-500 mt-1">Manage and monitor all land acquisition parcels.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-text-primary dark:text-white text-[11px] font-bold rounded-lg uppercase tracking-wider hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
          >
            <Plus className="w-4 h-4" />
            Add New Parcel
          </motion.button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-background-secondary dark:bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col flex-1 overflow-hidden shadow-2xl"
        >
          {/* Toolbar */}
          <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-text-secondary dark:text-zinc-500" />
              </div>
              <input
                type="text"
                placeholder="Search by ID, Owner, or Village..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg bg-black/50 text-text-primary dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 sm:text-xs transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-text-secondary dark:text-zinc-500" />
              <select
                value={riskFilter}
                onChange={(e) => { setRiskFilter(e.target.value as any); setCurrentPage(1); }}
                className="block w-full sm:w-48 pl-3 pr-10 py-2 border border-white/10 rounded-lg bg-black/50 text-zinc-600 dark:text-zinc-300 sm:text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
              >
                <option value="All">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>
            </div>
          </div>
          
          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest bg-black/50 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4">Parcel ID</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedParcels.length > 0 ? paginatedParcels.map((parcel, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={parcel.id} 
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-text-primary dark:text-white group-hover:text-blue-400 transition-colors">
                      {parcel.id}
                      <div className="text-[10px] uppercase text-text-secondary dark:text-zinc-500 mt-1">{parcel.surveyNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                      {parcel.village}
                      <div className="text-[10px] uppercase text-text-secondary dark:text-zinc-500 mt-1">{parcel.district}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                      {parcel.landOwner}
                      <div className="text-[10px] uppercase text-text-secondary dark:text-zinc-500 mt-1">{parcel.areaAcres} Acres</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300 text-xs">
                      {parcel.currentAcquisitionStage}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border shadow-sm ${riskColor(parcel.riskLevel)}`}>
                        {parcel.riskLevel} ({parcel.riskScore})
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/parcels/${parcel.id}`}
                        className="inline-flex items-center justify-center p-2 rounded text-text-secondary dark:text-zinc-500 hover:text-text-primary dark:text-white hover:bg-blue-600 transition-all border border-transparent hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-text-secondary dark:text-zinc-500 bg-background-secondary dark:bg-[#111111]">
                      No parcels found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/30">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Showing <span className="font-medium text-text-primary dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-text-primary dark:text-white">{Math.min(currentPage * itemsPerPage, filteredParcels.length)}</span> of <span className="font-medium text-text-primary dark:text-white">{filteredParcels.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-text-primary dark:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg border border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-text-primary dark:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Parcel Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-background-secondary dark:bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-text-primary dark:text-white">Register New Parcel</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Enter preliminary acquisition data.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-text-secondary dark:text-zinc-500 hover:text-text-primary dark:text-white transition-colors p-1 bg-white/5 rounded-full hover:bg-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddParcel} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase text-text-secondary dark:text-zinc-500 font-bold mb-1 tracking-wider">Parcel ID</label>
                    <input 
                      type="text" 
                      value={newParcel.id} 
                      disabled
                      className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-text-secondary dark:text-zinc-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-text-secondary dark:text-zinc-500 font-bold mb-1 tracking-wider">Survey Number *</label>
                    <input 
                      required
                      type="text"
                      placeholder="e.g. SY-45/2"
                      value={newParcel.surveyNumber}
                      onChange={e => setNewParcel({...newParcel, surveyNumber: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary dark:text-white focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-text-secondary dark:text-zinc-500 font-bold mb-1 tracking-wider">Land Owner Name *</label>
                  <input 
                    required
                    type="text"
                    placeholder="Full Legal Name"
                    value={newParcel.landOwner}
                    onChange={e => setNewParcel({...newParcel, landOwner: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary dark:text-white focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase text-text-secondary dark:text-zinc-500 font-bold mb-1 tracking-wider">Village *</label>
                    <input 
                      required
                      type="text"
                      value={newParcel.village}
                      onChange={e => setNewParcel({...newParcel, village: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary dark:text-white focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-text-secondary dark:text-zinc-500 font-bold mb-1 tracking-wider">Area (Acres) *</label>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={newParcel.areaAcres}
                      onChange={e => setNewParcel({...newParcel, areaAcres: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary dark:text-white focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-text-primary dark:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-text-primary dark:text-white text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
                  >
                    Register Parcel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
