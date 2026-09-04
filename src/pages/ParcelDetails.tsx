import React, { useMemo } from 'react';
import AppLayout from '../components/Layout';
import { staticParcels } from '../lib/data';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, FileText, Scale, User, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import MapView from '../components/ParcelMap';

export default function ParcelDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id as string;
  
  const parcel = useMemo(() => staticParcels.find(p => p.id === id), [id]);

  if (!parcel) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-semibold text-zinc-300">Parcel not found</h2>
          <button onClick={() => navigate(-1)} className="mt-4 text-amber-500 hover:underline">
            Go back
          </button>
        </div>
      </AppLayout>
    );
  }

  const isHighRisk = parcel.riskLevel === 'High';
  const isMediumRisk = parcel.riskLevel === 'Medium';

  return (
    <AppLayout>
      <div className="mb-6 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-light tracking-tight text-white flex items-center gap-3">
            Parcel {parcel.id}
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
              isHighRisk ? 'bg-red-500/10 text-red-500 border-red-500/20' :
              isMediumRisk ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
              'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            }`}>
              {parcel.riskLevel} Risk
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">{parcel.village}, {parcel.district}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Details & Map */}
        <div className="xl:col-span-2 space-y-6">
          {/* Main Details Card */}
          <div className="bg-[#111111] border border-zinc-800 rounded-xl flex flex-col overflow-hidden p-6">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <h2 className="text-lg font-medium text-white leading-none">Parcel Identity: <span className="text-zinc-500 italic">{parcel.id}</span></h2>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Location</div>
                    <div className="text-sm text-zinc-200">{parcel.village}, {parcel.district}, {parcel.state}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Survey No. & Area</div>
                    <div className="text-sm text-zinc-200">{parcel.surveyNumber} &bull; {parcel.areaAcres} Acres</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5"/> Ownership</div>
                    <div className="text-sm text-zinc-200">{parcel.landOwner} ({parcel.numberOfOwners} owner{parcel.numberOfOwners > 1 ? 's' : ''})</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Timeline</div>
                    <div className="text-sm text-zinc-200">
                      Started: {format(new Date(parcel.acquisitionStartDate), 'MMM dd, yyyy')}<br/>
                      Expected: {format(new Date(parcel.expectedCompletionDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                   <div>
                    <div className="text-xs text-zinc-500 mb-1">Current Stage</div>
                    <div className="text-sm font-medium text-amber-500">{parcel.currentAcquisitionStage}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1.5"><Scale className="w-3.5 h-3.5"/> Legal Status</div>
                    <div className="text-sm text-zinc-200">
                       Disputes: <span className={parcel.legalDisputeStatus === 'Active Case' ? 'text-red-400' : ''}>{parcel.legalDisputeStatus}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Documentation</div>
                    <div className="text-sm text-zinc-200">
                       {parcel.documentationStatus} &bull; {parcel.ownershipVerificationStatus}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Compensation</div>
                    <div className="text-sm text-zinc-200">
                       <span className={parcel.compensationStatus === 'Pending' ? 'text-amber-400' : (parcel.compensationStatus === 'Disputed' ? 'text-red-400' : 'text-emerald-400')}>{parcel.compensationStatus}</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>
          
          {/* Map Card */}
          <div className="bg-[#111111] border border-zinc-800 rounded-xl flex flex-col overflow-hidden p-6">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-3 mb-4">Geographic Location</h3>
            <div className="p-0 h-[400px]">
               <MapView parcel={parcel} />
             </div>
          </div>
        </div>
        
        {/* Right Column: AI Predictions & Explainability */}
        <div className="space-y-6 flex flex-col">
          {/* AI Prediction Card */}
          <div className="bg-[#111111] border border-zinc-800 rounded-xl flex flex-col overflow-hidden relative p-6">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <h2 className="text-lg font-medium text-white leading-none">AI Deep Scan</h2>
                 <p className="text-xs text-zinc-500 mt-2">Prediction Engine V2</p>
               </div>
               <div className="text-right">
                 <div className={`text-4xl font-bold tracking-tighter ${isHighRisk ? 'text-red-500' : isMediumRisk ? 'text-amber-500' : 'text-emerald-500'}`}>
                   {parcel.riskScore}<span className="text-sm font-normal text-zinc-600">/100</span>
                 </div>
                 <div className={`text-[10px] uppercase font-bold tracking-widest ${isHighRisk ? 'text-red-500' : isMediumRisk ? 'text-amber-500' : 'text-emerald-500'}`}>Risk Score</div>
               </div>
             </div>
             
             <div className="pt-4 border-t border-zinc-800">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-xs text-zinc-400 font-medium">Delay Probability</span>
                 <span className="text-sm text-zinc-200 font-bold">{parcel.delayProbability}%</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs text-zinc-400 font-medium">Predicted Additional Delay</span>
                 <span className="text-sm text-amber-500 font-bold flex items-center gap-1">
                   <Clock className="w-4 h-4" />
                   {parcel.predictedDelayDays} Days
                 </span>
               </div>
             </div>
          </div>
          
          {/* Explainable AI Card */}
          <div className="bg-[#111111] border border-zinc-800 rounded-xl flex flex-col p-6">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2 mb-4">Explainable AI (SHAP Analysis)</h3>
            <div className="space-y-3">
               {parcel.topRiskFactors.map((factor, idx) => (
                 <div key={idx}>
                   <div className="flex justify-between text-[11px] mb-1">
                     <span className="text-zinc-300">{factor.factor}</span>
                     <span className="text-white">{factor.contribution}%</span>
                   </div>
                   <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                     <div 
                        className={`h-full ${idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-amber-500' : 'bg-zinc-400'}`}
                        style={{ width: `${factor.contribution}%` }}
                     />
                   </div>
                 </div>
               ))}
            </div>
          </div>
          
          {/* Recommended Actions */}
          <div className="bg-black border border-zinc-800 rounded-lg p-4 flex flex-col mt-auto">
             <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Preventive Protocol</h3>
             <div className="space-y-4">
               <div className="flex gap-3">
                 <div className={`w-1.5 h-1.5 rounded-full ${isHighRisk ? 'bg-red-500' : 'bg-amber-500'} mt-1.5`}></div>
                 <div>
                   <div className="text-xs font-bold text-white">Action Required</div>
                   <div className="text-[10px] text-zinc-500 mt-1">{parcel.recommendedAction}</div>
                 </div>
               </div>
               <button className="mt-auto w-full py-2 bg-zinc-900 border border-zinc-700 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800">
                 Initiate Action Workflow
               </button>
             </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
