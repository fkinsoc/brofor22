import React, { useState } from 'react';
import AppLayout from '../components/Layout';
import { FileText, Download, BarChart2, PieChart as PieChartIcon, Sparkles, X } from 'lucide-react';
import { staticParcels } from '../lib/data';
import Markdown from 'react-markdown';

export default function ReportsPage() {
  const [generatingAiReport, setGeneratingAiReport] = useState(false);
  const [aiReportContent, setAiReportContent] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleGenerateAiReport = async () => {
    setShowModal(true);
    setGeneratingAiReport(true);
    setAiReportContent('');
    
    const highRiskCount = staticParcels.filter(p => p.riskLevel === 'High').length;
    const avgDelay = Math.round(staticParcels.reduce((acc, p) => acc + p.predictedDelayDays, 0) / staticParcels.length);
    const activeDisputes = staticParcels.filter(p => p.legalDisputeStatus === 'Active Case').length;

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Write a comprehensive, professional project status report based on the following metrics: Total Parcels: ${staticParcels.length}, High Risk Parcels: ${highRiskCount}, Average Predicted Delay: ${avgDelay} days, Active Legal Disputes: ${activeDisputes}. Use Markdown format with sections for Executive Summary, Risk Assessment, and Recommendations.`,
          systemPrompt: "You are a senior real estate project manager and data analyst AI."
        })
      });
      const data = await response.json();
      if (data.text) {
        setAiReportContent(data.text);
      }
    } catch (e) {
      console.error('Failed to generate AI report', e);
      setAiReportContent('Error generating report. Ensure GROQ_API_KEY is configured.');
    } finally {
      setGeneratingAiReport(false);
    }
  };

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
            <h1 className="text-2xl font-light tracking-tight text-white flex items-center gap-2">
              Reports
            </h1>
            <p className="text-sm text-zinc-400 mt-1">Generate and download analytical reports for stakeholders.</p>
          </div>
          <button 
            onClick={handleGenerateAiReport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Generate AI Report
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-zinc-800 rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-white font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" /> AI Generated Project Report
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-zinc-800 rounded text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 text-sm text-zinc-300 leading-relaxed">
              {generatingAiReport ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-zinc-400">Synthesizing report using Groq AI...</p>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-a:text-blue-400">
                  <Markdown>{aiReportContent}</Markdown>
                </div>
              )}
            </div>
            {!generatingAiReport && aiReportContent && (
              <div className="p-4 border-t border-zinc-800 flex justify-end">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
                >
                  Close Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
