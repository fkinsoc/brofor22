import React, { useMemo } from 'react';
import AppLayout from '../components/Layout';
import { staticParcels } from '../lib/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { AlertTriangle, Clock, ShieldAlert, Map as MapIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
  info: '#3b82f6',
};

export default function Dashboard() {
  const parcels = staticParcels;
  
  const stats = useMemo(() => {
    const total = parcels.length;
    const acquired = parcels.filter(p => p.currentAcquisitionStage === 'Taking Possession').length;
    const highRisk = parcels.filter(p => p.riskLevel === 'High').length;
    const mediumRisk = parcels.filter(p => p.riskLevel === 'Medium').length;
    const totalDelayDays = parcels.reduce((acc, p) => acc + p.predictedDelayDays, 0);
    const avgDelay = Math.round(totalDelayDays / total);
    
    let activeIssues = 0;
    parcels.forEach(p => {
      if (p.legalDisputeStatus === 'Active Case') activeIssues++;
      if (p.compensationStatus === 'Pending') activeIssues++;
      if (p.ownershipVerificationStatus === 'Disputed') activeIssues++;
    });
    return { total, acquired, highRisk, mediumRisk, avgDelay, activeIssues };
  }, [parcels]);

  const riskDistributionData = useMemo(() => [
    { name: 'Low Risk', value: parcels.filter(p => p.riskLevel === 'Low').length, color: COLORS.low },
    { name: 'Medium Risk', value: stats.mediumRisk, color: COLORS.medium },
    { name: 'High Risk', value: stats.highRisk, color: COLORS.high },
  ], [parcels, stats]);

  const issueCategoryData = useMemo(() => {
    let legal = 0;
    let compensation = 0;
    let documentation = 0;
    let ownership = 0;
    let encroachment = 0;
    
    parcels.forEach(p => {
      if (p.legalDisputeStatus === 'Active Case') legal++;
      if (p.compensationStatus === 'Pending') compensation++;
      if (p.documentationStatus === 'Incomplete') documentation++;
      if (p.ownershipVerificationStatus === 'Disputed') ownership++;
      if (p.encroachmentStatus === 'Major') encroachment++;
    });
    return [
      { name: 'Legal', value: legal },
      { name: 'Compensation', value: compensation },
      { name: 'Documentation', value: documentation },
      { name: 'Ownership', value: ownership },
      { name: 'Encroachment', value: encroachment },
    ].sort((a, b) => b.value - a.value);
  }, [parcels]);

  const stageData = useMemo(() => {
    const stages = [
      'Initial Notification', 'Survey', 'Hearing of Objections', 'Declaration', 'Award Enquiry', 'Taking Possession'
    ];
    return stages.map(stage => ({
      name: stage.split(' ')[0], // abbreviate
      count: parcels.filter(p => p.currentAcquisitionStage === stage).length
    }));
  }, [parcels]);

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-white">Project Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Real-time overview of land acquisition risks and delays.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="px-3 py-1.5 rounded bg-red-950/30 text-[10px] font-bold text-red-500 uppercase tracking-widest border border-red-900/50">
             Project Health: AT RISK
           </span>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111111] border border-zinc-800 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase text-zinc-500 mb-1">Total Parcels</h3>
            <MapIcon className="w-4 h-4 text-zinc-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-light text-white tracking-tight">{stats.total}</span>
          </div>
          <div className="mt-2 text-[10px] text-zinc-500 uppercase">
             <span className="text-emerald-500 font-bold">{stats.acquired}</span> acquired
          </div>
        </div>
        <div className="bg-[#111111] border border-zinc-800 rounded-lg p-5 border-l-red-500 border-l-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase text-zinc-500 mb-1">High Risk Parcels</h3>
            <AlertTriangle className="w-4 h-4 text-red-500 opacity-50" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-light text-red-500 tracking-tight">{stats.highRisk}</span>
          </div>
          <div className="mt-2 text-[10px] text-zinc-500 uppercase">
             <span className="text-amber-500 font-bold">{stats.mediumRisk}</span> medium risk
          </div>
        </div>
        <div className="bg-[#111111] border border-zinc-800 rounded-lg p-5 border-l-amber-500 border-l-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase text-zinc-500 mb-1">Avg Predicted Delay</h3>
            <Clock className="w-4 h-4 text-amber-500 opacity-50" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-light text-white tracking-tight">+{stats.avgDelay}</span>
            <span className="text-xs uppercase text-zinc-500 ml-1">days</span>
          </div>
          <div className="mt-2 text-[10px] text-zinc-500 uppercase">
             Across all active parcels
          </div>
        </div>
        <div className="bg-[#111111] border border-zinc-800 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase text-zinc-500 mb-1">Active Issues</h3>
            <ShieldAlert className="w-4 h-4 text-blue-500 opacity-50" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-light text-white tracking-tight">{stats.activeIssues}</span>
          </div>
          <div className="mt-2 text-[10px] text-zinc-500 uppercase">
             Pending resolutions
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Risk Distribution Chart */}
        <div className="bg-[#111111] border border-zinc-800 rounded-xl p-6 lg:col-span-1 flex flex-col">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-3 mb-4">Risk Distribution</h3>
          <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                  itemStyle={{ color: '#f4f4f5' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Issues by Category */}
        <div className="bg-[#111111] border border-zinc-800 rounded-xl p-6 lg:col-span-2 flex flex-col">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-3 mb-4">Issues by Category</h3>
          <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={issueCategoryData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: '#27272a' }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acquisition Progress */}
        <div className="bg-[#111111] border border-zinc-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-3 mb-4">Parcels by Stage</h3>
          <div className="flex-1 min-h-[256px]"> 
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stageData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b4513" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b4513" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                />
                <Area type="monotone" dataKey="count" stroke="#8b4513" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Highest Risk Parcels List */}
        <div className="bg-[#111111] border border-zinc-800 rounded-xl flex flex-col overflow-hidden min-h-[300px]">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Critical Parcels Watchlist</h3>
            <Link to="/parcels" className="text-[10px] uppercase font-bold text-amber-500 hover:text-amber-400 tracking-wider">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900/30 border-b border-zinc-800 sticky top-0">
                <tr>
                  <th className="px-6 py-4">Parcel ID</th>
                  <th className="px-6 py-4">Risk Score</th>
                  <th className="px-6 py-4">Predicted Delay</th>
                  <th className="px-6 py-4">Top Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {parcels.filter(p => p.riskLevel === 'High').sort((a,b) => b.riskScore - a.riskScore).slice(0, 5).map((parcel) => (
                  <tr key={parcel.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      <Link to={`/parcels/${parcel.id}`} className="hover:text-zinc-300">
                        {parcel.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-red-950/40 text-red-500 font-bold text-[11px] border border-red-900/50">
                        {parcel.riskScore}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-xs uppercase tracking-wide">+{parcel.predictedDelayDays} days</td>
                    <td className="px-6 py-4 text-zinc-400 text-xs truncate max-w-[120px]" title={parcel.topRiskFactors[0]?.factor}>
                      {parcel.topRiskFactors[0]?.factor || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
