import React, { useState, useMemo } from "react";
import AppLayout from "../components/Layout";
import { Activity, Download, Filter, TerminalSquare } from "lucide-react";
import { format } from "date-fns";
type LogLevel = "INFO" | "WARN" | "ERROR" | "SYSTEM";
interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
} /*  Generate some mock logs for the system */
function generateLogs(count = 50): LogEntry[] {
  const sources = [
    "AI Engine",
    "Auth Service",
    "GIS Sync",
    "Data Ingestion",
    "System Core",
  ];
  const messages = [
    "User successfully authenticated.",
    "Model V2 loaded into enclave.",
    "Geospatial sync completed with 0 errors.",
    "SHAP analysis requested for Parcel LA-MH-2035.",
    "High-risk threshold exceeded.",
    "Timeout connecting to external GIS service.",
    "Database connection established.",
    "Batch upload processing finished.",
  ];
  const logs: LogEntry[] = [];
  const baseTime = new Date().getTime();
  for (let i = 0; i < count; i++) {
    const isError = Math.random() > 0.9;
    const isWarn = !isError && Math.random() > 0.7;
    const level: LogLevel = isError
      ? "ERROR"
      : isWarn
        ? "WARN"
        : Math.random() > 0.8
          ? "SYSTEM"
          : "INFO";
    logs.push({
      id: `log_${count - i}`,
      timestamp: new Date(baseTime - i * 1500000 * Math.random()).toISOString(),
      level,
      source: sources[Math.floor(Math.random() * sources.length)],
      message: isError
        ? "Connection failed during sync."
        : isWarn
          ? "High memory usage detected."
          : messages[Math.floor(Math.random() * messages.length)],
    });
  }
  return logs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}
const systemLogs = generateLogs(100);
export default function LogsPage() {
  const [filterLevel, setFilterLevel] = useState<LogLevel | "ALL">("ALL");
  const filteredLogs = useMemo(() => {
    if (filterLevel === "ALL") return systemLogs;
    return systemLogs.filter((log) => log.level === filterLevel);
  }, [filterLevel]);
  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "INFO":
        return "text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600";
      case "WARN":
        return "text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600";
      case "ERROR":
        return "text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600";
      case "SYSTEM":
        return "text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600";
      default:
        return "text-zinc-800 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600";
    }
  };
  return (
    <AppLayout>
      {" "}
      <div className="flex flex-col h-[calc(100vh-6rem)]">
        {" "}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {" "}
          <div>
            {" "}
            <h1 className="text-2xl font-light tracking-tight text-text-primary dark:text-white flex items-center gap-3">
              {" "}
              <TerminalSquare className="w-6 h-6 text-zinc-800 dark:text-zinc-300" />{" "}
              System Logs{" "}
            </h1>{" "}
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Real-time application execution and error logs.
            </p>{" "}
          </div>{" "}
          <div className="flex items-center gap-2">
            {" "}
            <button className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-bold rounded-none font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-2">
              {" "}
              <Download className="w-3.5 h-3.5" /> Export Logs{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex-1 bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-none flex flex-col overflow-hidden">
          {" "}
          {/* Toolbar */}{" "}
          <div className="p-3 border-b border-border-subtle dark:border-zinc-800 flex justify-between items-center bg-background-primary dark:bg-[#0A0A0A]">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <Filter className="w-4 h-4 text-zinc-600 dark:text-zinc-400 ml-2" />{" "}
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value as any)}
                className="bg-transparent text-xs text-zinc-800 dark:text-zinc-300 border-none focus:ring-0 cursor-pointer pr-8 py-1 font-semibold font-bold outline-none"
              >
                {" "}
                <option value="ALL">All Levels</option>{" "}
                <option value="INFO">Info</option>{" "}
                <option value="WARN">Warnings</option>{" "}
                <option value="ERROR">Errors</option>{" "}
                <option value="SYSTEM">System</option>{" "}
              </select>{" "}
            </div>{" "}
            <div className="flex items-center gap-2 mr-2">
              {" "}
              <span className="w-2 h-2 rounded-none bg-zinc-900 dark:bg-zinc-100"></span>{" "}
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase tracking-widest font-bold">
                Live Stream
              </span>{" "}
            </div>{" "}
          </div>{" "}
          {/* Log Viewer */}{" "}
          <div className="flex-1 overflow-y-auto bg-black p-4 font-mono text-xs">
            {" "}
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex gap-4 py-1.5 border-b border-zinc-900/50 hover:bg-zinc-900/30 transition-colors"
              >
                {" "}
                <div className="text-zinc-900 dark:text-zinc-100 flex-shrink-0 w-32">
                  {" "}
                  {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}{" "}
                </div>{" "}
                <div className="flex-shrink-0 w-16">
                  {" "}
                  <span
                    className={`px-1.5 py-0.5 rounded-none text-[9px] font-bold tracking-widest border ${getLevelColor(log.level)}`}
                  >
                    {" "}
                    {log.level}{" "}
                  </span>{" "}
                </div>{" "}
                <div
                  className="text-zinc-600 dark:text-zinc-400 flex-shrink-0 w-32 truncate"
                  title={log.source}
                >
                  {" "}
                  [{log.source}]{" "}
                </div>{" "}
                <div className="text-zinc-800 dark:text-zinc-300 flex-1 break-words">
                  {" "}
                  {log.message}{" "}
                </div>{" "}
              </div>
            ))}{" "}
            {filteredLogs.length === 0 && (
              <div className="text-zinc-600 dark:text-zinc-400 py-10 text-center font-sans">
                {" "}
                No logs found for the selected filter.{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </AppLayout>
  );
}
