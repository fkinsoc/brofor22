import React, { useMemo, useState } from "react";
import AppLayout from "../components/Layout";
import { staticParcels, Parcel } from "../lib/data";
import {
  AlertTriangle,
  Clock,
  Scale,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

type AlertType = "HIGH_RISK" | "LEGAL_DISPUTE" | "LONG_DELAY" | "DOCUMENTATION";

interface Alert {
  id: string;
  parcel: Parcel;
  type: AlertType;
  title: string;
  message: string;
  status: "New" | "Under Review" | "Resolved" | "Escalated";
  timestamp: string;
}

export default function AlertsPage() {
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // Generate alerts based on parcel data
  const alerts = useMemo(() => {
    const generated: Alert[] = [];
    const baseDate = new Date('2026-09-02T12:00:00Z').getTime();
    staticParcels.forEach((p, index) => {
      // Simulate historical timestamps based on index
      const timestamp = new Date(baseDate - (index * 3600000)).toISOString();
      let status: Alert['status'] = index % 5 === 0 ? 'Under Review' : (index % 11 === 0 ? 'Escalated' : 'New');
      if (p.riskScore > 80) {
        generated.push({
          id: `ALT-${p.id}-1`,
          parcel: p,
          type: 'HIGH_RISK',
          title: 'Critical Risk Threshold Exceeded',
          message: `Risk score hit ${p.riskScore}/100. Immediate intervention recommended.`,
          status,
          timestamp
        });
      }
      if (p.legalDisputeStatus === 'Active Case') {
        generated.push({
          id: `ALT-${p.id}-2`,
          parcel: p,
          type: 'LEGAL_DISPUTE',
          title: 'Active Legal Dispute Detected',
          message: 'Ownership dispute identified. Escalate for legal review.',
          status: index % 3 === 0 ? 'Under Review' : 'New',
          timestamp
        });
      }
      if (p.predictedDelayDays > 60) {
        generated.push({
          id: `ALT-${p.id}-3`,
          parcel: p,
          type: 'LONG_DELAY',
          title: 'Severe Delay Predicted',
          message: `Predicted additional delay of ${p.predictedDelayDays} days threatens project milestones.`,
          status,
          timestamp
        });
      }
    });
    return generated.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, []);

  const filteredAlerts = alerts.filter(a => filterStatus === 'All' || a.status === filterStatus);

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'HIGH_RISK':
        return <AlertTriangle className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />;
      case 'LEGAL_DISPUTE':
        return <Scale className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />;
      case 'LONG_DELAY':
        return <Clock className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />;
      case 'DOCUMENTATION':
        return <FileText className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-400 dark:border-zinc-600';
      case 'Under Review':
        return 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-400 dark:border-zinc-600';
      case 'Escalated':
        return 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-400 dark:border-zinc-600';
      case 'Resolved':
        return 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-400 dark:border-zinc-600';
      default:
        return 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 border-zinc-400 dark:border-zinc-600';
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-text-primary dark:text-white">Early Warning System</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Automated alerts for high-risk parcels and predicted delays.</p>
          </div>
          <div className="flex bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-none p-1 text-sm font-medium">
            {['All', 'New', 'Under Review', 'Escalated'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-none transition-colors text-[10px] uppercase font-bold tracking-wider ${filterStatus === status ? 'bg-zinc-800 text-text-primary dark:text-white ' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-300'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-12">
          {filteredAlerts.length > 0 ? filteredAlerts.map(alert => (
            <div key={alert.id} className="bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-none p-6 flex flex-col sm:flex-row gap-5 hover:border-zinc-700 transition-colors">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-none bg-background-primary dark:bg-[#0A0A0A] flex items-center justify-center border border-border-subtle dark:border-zinc-800">
                  {getAlertIcon(alert.type)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary dark:text-white flex items-center gap-3">
                      {alert.title}
                      <span className={`text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded-none border ${getStatusBadge(alert.status)}`}>
                        {alert.status}
                      </span>
                    </h3>
                    <div className="text-xs text-zinc-800 dark:text-zinc-300 mt-1">
                      <Link to={`/parcels/${alert.parcel.id}`} className="font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-900 dark:text-zinc-100">
                        {alert.parcel.id}
                      </Link>
                      <span className="text-zinc-700 mx-2">&bull;</span>
                      <span className="text-zinc-600 dark:text-zinc-400">{alert.parcel.village}, {alert.parcel.district}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold flex items-center gap-1.5 whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5 opacity-50" />
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm text-zinc-800 dark:text-zinc-300 mt-4 leading-relaxed">
                  {alert.message}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <Link to={`/parcels/${alert.parcel.id}`} className="text-[10px] uppercase font-bold tracking-wider bg-background-primary dark:bg-[#0A0A0A] hover:bg-zinc-800 text-text-primary dark:text-white px-4 py-2 rounded-none transition-colors border border-border-subtle dark:border-zinc-800">
                    View Parcel
                  </Link>
                  {alert.status !== 'Escalated' && (
                    <button className="text-[10px] uppercase font-bold tracking-wider text-zinc-900 dark:text-zinc-100 hover:text-zinc-900 dark:text-zinc-100 px-3 py-2 transition-colors">
                      Escalate
                    </button>
                  )}
                  {alert.status === 'New' && (
                    <button className="text-[10px] uppercase font-bold tracking-wider text-zinc-900 dark:text-zinc-100 hover:text-zinc-900 dark:text-zinc-100 px-3 py-2 transition-colors">
                      Mark as Reviewing
                    </button>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-600 dark:text-zinc-400 bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-none">
              <CheckCircle2 className="w-12 h-12 mb-4 text-zinc-800" />
              <p className="text-sm">No alerts match the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}