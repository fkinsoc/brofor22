import React, { useState, useMemo } from 'react';
import AppLayout from '../components/Layout';
import { staticParcels, RiskLevel } from '../lib/data';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function ParcelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredParcels = useMemo(() => {
    return staticParcels.filter(p => {
      const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.landOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.village.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'All' || p.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [searchTerm, riskFilter]);

  const totalPages = Math.ceil(filteredParcels.length / itemsPerPage);
  const paginatedParcels = filteredParcels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const riskColor = (level: RiskLevel) => {
    switch (level) {
      case 'High': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Low': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-white">Land Parcels</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage and monitor all land acquisition parcels.</p>
          </div>
          <button className="px-4 py-2 bg-white text-black text-[11px] font-bold rounded uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-sm">
            Add New Parcel
          </button>
        </div>
        
        <div className="bg-[#111111] border border-zinc-800 rounded-xl flex flex-col flex-1 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0A0A0A]">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-500" />
              </div>
              <input
                type="text"
                placeholder="Search by ID, Owner, or Village..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="block w-full pl-10 pr-3 py-2 border border-zinc-800 rounded bg-[#111111] text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 sm:text-xs transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-zinc-500" />
              <select
                value={riskFilter}
                onChange={(e) => { setRiskFilter(e.target.value as any); setCurrentPage(1); }}
                className="block w-full sm:w-48 pl-3 pr-10 py-2 border border-zinc-800 rounded bg-[#111111] text-zinc-300 sm:text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-colors"
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
              <thead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900/30 border-b border-zinc-800 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">Parcel ID</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {paginatedParcels.length > 0 ? paginatedParcels.map((parcel) => (
                  <tr key={parcel.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {parcel.id}
                      <div className="text-[10px] uppercase text-zinc-500 mt-1">{parcel.surveyNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {parcel.village}
                      <div className="text-[10px] uppercase text-zinc-500 mt-1">{parcel.district}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {parcel.landOwner}
                      <div className="text-[10px] uppercase text-zinc-500 mt-1">{parcel.areaAcres} Acres</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300 text-xs">
                      {parcel.currentAcquisitionStage}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${riskColor(parcel.riskLevel)}`}>
                        {parcel.riskLevel} ({parcel.riskScore})
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/parcels/${parcel.id}`}
                        className="inline-flex items-center justify-center p-2 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 bg-[#111111]">
                      No parcels found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-[#0A0A0A]">
            <div className="text-sm text-zinc-400">
              Showing <span className="font-medium text-zinc-200">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-zinc-200">{Math.min(currentPage * itemsPerPage, filteredParcels.length)}</span> of <span className="font-medium text-zinc-200">{filteredParcels.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
