import React from 'react';
import AppLayout from '../components/Layout';
import { FileText, Download, BarChart2, PieChart as PieChartIcon } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    { id: 1, name: 'Project Alpha - Monthly Risk Assessment', date: 'Oct 01, 2024', type: 'PDF' },
    { id: 2, name: 'Q3 Delay Predictions & Interventions', date: 'Sep 30, 2024', type: 'PDF' },
    { id: 3, name: 'High-Risk Parcels Detailed Extract', date: 'Sep 28, 2024', type: 'CSV' },
    { id: 4, name: 'Legal Disputes Status Summary', date: 'Sep 25, 2024', type: 'PDF' },
  ];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-white">Reports</h1>
            <p className="text-sm text-zinc-400 mt-1">Generate and download analytical reports for stakeholders.</p>
          </div>
          <button className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white text-sm font-medium rounded-md transition-colors shadow-sm flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Generate New Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111111] border border-zinc-800 rounded-xl p-5 shadow-sm hover:border-amber-500/50 transition-colors cursor-pointer group">
            <BarChart2 className="w-8 h-8 text-blue-500 mb-3 group-hover:text-amber-500 transition-colors" />
            <h3 className="text-base font-semibold text-white mb-1">Project Progress Summary</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">Comprehensive overview of acquisition stages, completions, and overall health indicators.</p>
          </div>
          <div className="bg-[#111111] border border-zinc-800 rounded-xl p-5 shadow-sm hover:border-amber-500/50 transition-colors cursor-pointer group">
            <PieChartIcon className="w-8 h-8 text-red-500 mb-3 group-hover:text-amber-500 transition-colors" />
            <h3 className="text-base font-semibold text-white mb-1">Risk Factors Analysis</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">Deep dive into SHAP explanations, top delay contributors, and geospatial risk hotspots.</p>
          </div>
          <div className="bg-[#111111] border border-zinc-800 rounded-xl p-5 shadow-sm hover:border-amber-500/50 transition-colors cursor-pointer group">
            <FileText className="w-8 h-8 text-emerald-500 mb-3 group-hover:text-amber-500 transition-colors" />
            <h3 className="text-base font-semibold text-white mb-1">Executive Dashboard PDF</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">Ready-to-print single-page summary for high-level government and enterprise stakeholders.</p>
          </div>
        </div>

        <div className="bg-[#111111] border border-zinc-800 rounded-xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white">Recent Reports</h2>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Report Name</th>
                  <th className="px-6 py-4 font-semibold">Date Generated</th>
                  <th className="px-6 py-4 font-semibold">Format</th>
                  <th className="px-6 py-4 font-semibold text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-200">
                      {report.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {report.date}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`text-xs font-bold px-2 py-1 rounded ${report.type === 'PDF' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                         {report.type}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-1.5 text-amber-500 hover:text-amber-400 font-medium transition-colors text-xs">
                        <Download className="w-4 h-4" /> Export
                      </button>
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
