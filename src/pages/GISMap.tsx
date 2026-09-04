import React, { useState, useMemo } from 'react';
import AppLayout from '../components/Layout';
import { staticParcels, RiskLevel } from '../lib/data';
import { Filter } from 'lucide-react';
import MapView from '../components/ParcelMap';

export default function GISMapPage() {
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'All'>('All');

  const filteredParcels = useMemo(() => {
    if (riskFilter === 'All') return staticParcels;
    return staticParcels.filter(p => p.riskLevel === riskFilter);
  }, [riskFilter]);

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-6rem)]">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-text-primary dark:text-white">GIS Map</h1>
            <p className="text-sm text-text-secondary dark:text-zinc-500 mt-1">Geographical distribution of land parcels and risk hotspots.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 p-1.5 rounded-lg shadow-sm">
            <Filter className="h-4 w-4 text-text-secondary dark:text-zinc-500 ml-2" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="bg-transparent text-xs text-zinc-600 dark:text-zinc-300 border-none focus:ring-0 cursor-pointer pr-8 py-1 uppercase tracking-wider font-bold"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk Only</option>
              <option value="Medium">Medium Risk Only</option>
              <option value="Low">Low Risk Only</option>
            </select>
          </div>
        </div>

        <div className="flex-1 bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-xl flex flex-col overflow-hidden relative">
          <div className="absolute top-4 right-4 z-[400] bg-background-secondary dark:bg-[#111111]/90 backdrop-blur border border-border-subtle dark:border-zinc-800 p-4 rounded-lg shadow-lg">
            <h4 className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-widest border-b border-border-subtle dark:border-zinc-800 pb-2">Legend</h4>
            <div className="space-y-3 text-[11px] font-medium tracking-wide">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-white/20"></div>
                <span className="text-zinc-600 dark:text-zinc-300">High Risk (&gt;75)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500 border border-white/20"></div>
                <span className="text-zinc-600 dark:text-zinc-300">Medium Risk (41-75)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white/20"></div>
                <span className="text-zinc-600 dark:text-zinc-300">Low Risk (&le;40)</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-700/50 text-xs text-zinc-500 dark:text-zinc-400">
              Showing {filteredParcels.length} parcels
            </div>
          </div>
          
          <MapView allParcels={filteredParcels} />
        </div>
      </div>
    </AppLayout>
  );
}
