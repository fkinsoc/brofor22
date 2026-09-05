import React, { useMemo, useState, useEffect } from "react";
import AppLayout from "../components/Layout";
import { staticParcels } from "../lib/data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  Map as MapIcon,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
const COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
  info: "#3b82f6",
};
export default function Dashboard() {
  const parcels = staticParcels;
  const stats = useMemo(() => {
    const total = parcels.length;
    const acquired = parcels.filter(
      (p) => p.currentAcquisitionStage === "Taking Possession",
    ).length;
    const highRisk = parcels.filter((p) => p.riskLevel === "High").length;
    const mediumRisk = parcels.filter((p) => p.riskLevel === "Medium").length;
    const totalDelayDays = parcels.reduce(
      (acc, p) => acc + p.predictedDelayDays,
      0,
    );
    const avgDelay = Math.round(totalDelayDays / total);
    let activeIssues = 0;
    parcels.forEach((p) => {
      if (p.legalDisputeStatus === "Active Case") activeIssues++;
      if (p.compensationStatus === "Pending") activeIssues++;
      if (p.ownershipVerificationStatus === "Disputed") activeIssues++;
    });
    return { total, acquired, highRisk, mediumRisk, avgDelay, activeIssues };
  }, [parcels]);
  const [aiSummary, setAiSummary] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  useEffect(() => {
    async function fetchAiSummary() {
      setLoadingAi(true);
      try {
        const response = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `Based on the following stats: Total Parcels: ${stats.total}, High Risk: ${stats.highRisk}, Avg Delay: ${stats.avgDelay} days, Active Issues: ${stats.activeIssues}. Summarize the project health in 2-3 short, highly actionable sentences. Keep it professional and direct.`,
            systemPrompt:
              "You are an expert land acquisition and risk analysis AI assistant.",
          }),
        });
        const data = await response.json();
        if (data.text) setAiSummary(data.text);
      } catch (e) {
        console.error("Failed to fetch AI summary", e);
      } finally {
        setLoadingAi(false);
      }
    }
    fetchAiSummary();
  }, [stats]);
  const riskDistributionData = useMemo(
    () => [
      {
        name: "Low Risk",
        value: parcels.filter((p) => p.riskLevel === "Low").length,
        color: COLORS.low,
      },
      { name: "Medium Risk", value: stats.mediumRisk, color: COLORS.medium },
      { name: "High Risk", value: stats.highRisk, color: COLORS.high },
    ],
    [parcels, stats],
  );
  const issueCategoryData = useMemo(() => {
    let legal = 0;
    let compensation = 0;
    let documentation = 0;
    let ownership = 0;
    let encroachment = 0;
    parcels.forEach((p) => {
      if (p.legalDisputeStatus === "Active Case") legal++;
      if (p.compensationStatus === "Pending") compensation++;
      if (p.documentationStatus === "Incomplete") documentation++;
      if (p.ownershipVerificationStatus === "Disputed") ownership++;
      if (p.encroachmentStatus === "Major") encroachment++;
    });
    return [
      { name: "Legal", value: legal },
      { name: "Compensation", value: compensation },
      { name: "Documentation", value: documentation },
      { name: "Ownership", value: ownership },
      { name: "Encroachment", value: encroachment },
    ].sort((a, b) => b.value - a.value);
  }, [parcels]);
  const stageData = useMemo(() => {
    const stages = [
      "Initial Notification",
      "Survey",
      "Hearing of Objections",
      "Declaration",
      "Award Enquiry",
      "Taking Possession",
    ];
    return stages.map((stage) => ({
      name: stage.split(" ")[0],
      count: parcels.filter((p) => p.currentAcquisitionStage === stage).length,
    }));
  }, [parcels]);
  return (
    <AppLayout>
      {" "}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl font-light tracking-tight text-text-primary dark:text-white">
            Project Dashboard
          </h1>{" "}
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Real-time overview of land acquisition risks and delays.
          </p>{" "}
        </div>{" "}
        <div className="flex items-center gap-2">
          {" "}
          <span className="px-3 py-1.5 rounded-none bg-zinc-900 dark:bg-zinc-100/30 text-[10px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest border border-zinc-900 dark:border-zinc-100">
            {" "}
            Project Health: AT RISK{" "}
          </span>{" "}
        </div>{" "}
      </div>{" "}
      {/* AI Summary Banner */}{" "}
      <div className="bg-zinc-900/20 dark:bg-zinc-100/20 border border-zinc-900 dark:border-zinc-100/30 rounded-none p-5 mb-6 flex items-start gap-4">
        {" "}
        <div className="bg-zinc-200 dark:bg-zinc-800 p-2 rounded-none text-zinc-900 dark:text-zinc-100">
          {" "}
          <Sparkles className="w-5 h-5" />{" "}
        </div>{" "}
        <div className="flex-1">
          {" "}
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest mb-2">
            AI Executive Summary
          </h3>{" "}
          <p className="text-sm text-zinc-800 dark:text-zinc-300 leading-relaxed">
            {" "}
            {loadingAi
              ? "Analyzing project state via AI..."
              : aiSummary ||
                "AI analysis temporarily unavailable. Configure GROQ_API_KEY."}{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* KPI Cards */}{" "}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {" "}
        <div className="bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-none p-5">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <h3 className="text-[10px] uppercase text-zinc-600 dark:text-zinc-400 mb-1">
              Total Parcels
            </h3>{" "}
            <MapIcon className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />{" "}
          </div>{" "}
          <div className="mt-1 flex items-baseline gap-2">
            {" "}
            <span className="text-3xl font-light text-text-primary dark:text-white tracking-tight">
              {stats.total}
            </span>{" "}
          </div>{" "}
          <div className="mt-2 text-[10px] text-zinc-600 dark:text-zinc-400 uppercase">
            {" "}
            <span className="text-zinc-900 dark:text-zinc-100 font-bold">
              {stats.acquired}
            </span>{" "}
            acquired{" "}
          </div>{" "}
        </div>{" "}
        <div className="bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-none p-5 border-l-red-500 border-l-2">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <h3 className="text-[10px] uppercase text-zinc-600 dark:text-zinc-400 mb-1">
              High Risk Parcels
            </h3>{" "}
            <AlertTriangle className="w-4 h-4 text-zinc-900 dark:text-zinc-100 opacity-50" />{" "}
          </div>{" "}
          <div className="mt-1 flex items-baseline gap-2">
            {" "}
            <span className="text-3xl font-light text-zinc-900 dark:text-zinc-100 tracking-tight">
              {stats.highRisk}
            </span>{" "}
          </div>{" "}
          <div className="mt-2 text-[10px] text-zinc-600 dark:text-zinc-400 uppercase">
            {" "}
            <span className="text-zinc-900 dark:text-zinc-100 font-bold">
              {stats.mediumRisk}
            </span>{" "}
            medium risk{" "}
          </div>{" "}
        </div>{" "}
        <div className="bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-none p-5 border-l-amber-500 border-l-2">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <h3 className="text-[10px] uppercase text-zinc-600 dark:text-zinc-400 mb-1">
              Avg Predicted Delay
            </h3>{" "}
            <Clock className="w-4 h-4 text-zinc-900 dark:text-zinc-100 opacity-50" />{" "}
          </div>{" "}
          <div className="mt-1 flex items-baseline gap-1">
            {" "}
            <span className="text-3xl font-light text-text-primary dark:text-white tracking-tight">
              +{stats.avgDelay}
            </span>{" "}
            <span className="text-xs uppercase text-zinc-600 dark:text-zinc-400 ml-1">
              days
            </span>{" "}
          </div>{" "}
          <div className="mt-2 text-[10px] text-zinc-600 dark:text-zinc-400 uppercase">
            {" "}
            Across all active parcels{" "}
          </div>{" "}
        </div>{" "}
        <div className="bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-none p-5">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <h3 className="text-[10px] uppercase text-zinc-600 dark:text-zinc-400 mb-1">
              Active Issues
            </h3>{" "}
            <ShieldAlert className="w-4 h-4 text-zinc-900 dark:text-zinc-100 opacity-50" />{" "}
          </div>{" "}
          <div className="mt-1 flex items-baseline gap-2">
            {" "}
            <span className="text-3xl font-light text-text-primary dark:text-white tracking-tight">
              {stats.activeIssues}
            </span>{" "}
          </div>{" "}
          <div className="mt-2 text-[10px] text-zinc-600 dark:text-zinc-400 uppercase">
            {" "}
            Pending resolutions{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {" "}
        {/* Risk Distribution Chart */}{" "}
        <div className="bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-none p-6 lg:col-span-1 flex flex-col">
          {" "}
          <h3 className="text-[10px] font-bold text-zinc-800 dark:text-zinc-300 uppercase tracking-widest border-b border-border-subtle dark:border-zinc-800 pb-3 mb-4">
            Risk Distribution
          </h3>{" "}
          <div className="flex-1 min-h-[240px]">
            {" "}
            <ResponsiveContainer width="100%" height="100%">
              {" "}
              <PieChart>
                {" "}
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
                  {" "}
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}{" "}
                </Pie>{" "}
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#27272a",
                    color: "#f4f4f5",
                  }}
                  itemStyle={{ color: "#f4f4f5" }}
                />{" "}
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: "12px" }}
                />{" "}
              </PieChart>{" "}
            </ResponsiveContainer>{" "}
          </div>{" "}
        </div>{" "}
        {/* Issues by Category */}{" "}
        <div className="bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-none p-6 lg:col-span-2 flex flex-col">
          {" "}
          <h3 className="text-[10px] font-bold text-zinc-800 dark:text-zinc-300 uppercase tracking-widest border-b border-border-subtle dark:border-zinc-800 pb-3 mb-4">
            Issues by Category
          </h3>{" "}
          <div className="flex-1 min-h-[240px]">
            {" "}
            <ResponsiveContainer width="100%" height="100%">
              {" "}
              <BarChart
                data={issueCategoryData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                {" "}
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  vertical={false}
                />{" "}
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />{" "}
                <YAxis
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />{" "}
                <RechartsTooltip
                  cursor={{ fill: "#27272a" }}
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#27272a",
                    color: "#f4f4f5",
                  }}
                />{" "}
                <Bar
                  dataKey="value"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />{" "}
              </BarChart>{" "}
            </ResponsiveContainer>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {" "}
        {/* Acquisition Progress */}{" "}
        <div className="bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-none p-6 flex flex-col">
          {" "}
          <h3 className="text-[10px] font-bold text-zinc-800 dark:text-zinc-300 uppercase tracking-widest border-b border-border-subtle dark:border-zinc-800 pb-3 mb-4">
            Parcels by Stage
          </h3>{" "}
          <div className="flex-1 min-h-[256px]">
            {" "}
            <ResponsiveContainer width="100%" height="100%">
              {" "}
              <AreaChart
                data={stageData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                {" "}
                <defs>
                  {" "}
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    {" "}
                    <stop
                      offset="5%"
                      stopColor="#8b4513"
                      stopOpacity={0.4}
                    />{" "}
                    <stop
                      offset="95%"
                      stopColor="#8b4513"
                      stopOpacity={0}
                    />{" "}
                  </linearGradient>{" "}
                </defs>{" "}
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  vertical={false}
                />{" "}
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />{" "}
                <YAxis
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />{" "}
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#27272a",
                    color: "#f4f4f5",
                  }}
                />{" "}
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8b4513"
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />{" "}
              </AreaChart>{" "}
            </ResponsiveContainer>{" "}
          </div>{" "}
        </div>{" "}
        {/* Highest Risk Parcels List */}{" "}
        <div className="bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-none flex flex-col overflow-hidden min-h-[300px]">
          {" "}
          <div className="p-6 border-b border-border-subtle dark:border-zinc-800 flex justify-between items-center">
            {" "}
            <h3 className="text-[10px] font-bold text-zinc-800 dark:text-zinc-300 uppercase tracking-widest">
              Critical Parcels Watchlist
            </h3>{" "}
            <Link
              to="/parcels"
              className="text-[10px] uppercase font-bold text-zinc-900 dark:text-zinc-100 hover:text-zinc-900 dark:text-zinc-100 tracking-wider"
            >
              View All
            </Link>{" "}
          </div>{" "}
          <div className="flex-1 overflow-y-auto p-0">
            {" "}
            <table className="w-full text-sm text-left">
              {" "}
              <thead className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest bg-zinc-900/30 border-b border-border-subtle dark:border-zinc-800 sticky top-0">
                {" "}
                <tr>
                  {" "}
                  <th className="px-6 py-4">Parcel ID</th>{" "}
                  <th className="px-6 py-4">Risk Score</th>{" "}
                  <th className="px-6 py-4">Predicted Delay</th>{" "}
                  <th className="px-6 py-4">Top Factor</th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody className="divide-y divide-zinc-800">
                {" "}
                {parcels
                  .filter((p) => p.riskLevel === "High")
                  .sort((a, b) => b.riskScore - a.riskScore)
                  .slice(0, 5)
                  .map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="hover:bg-zinc-800/20 transition-colors"
                    >
                      {" "}
                      <td className="px-6 py-4 font-medium text-text-primary dark:text-white">
                        {" "}
                        <Link
                          to={`/parcels/${parcel.id}`}
                          className="hover:text-zinc-800 dark:text-zinc-300"
                        >
                          {" "}
                          {parcel.id}{" "}
                        </Link>{" "}
                      </td>{" "}
                      <td className="px-6 py-4">
                        {" "}
                        <span className="px-2 py-1 rounded-none bg-zinc-900 dark:bg-zinc-100/40 text-zinc-900 dark:text-zinc-100 font-bold text-[11px] border border-zinc-900 dark:border-zinc-100">
                          {" "}
                          {parcel.riskScore}/100{" "}
                        </span>{" "}
                      </td>{" "}
                      <td className="px-6 py-4 text-zinc-800 dark:text-zinc-300 text-xs uppercase tracking-wide">
                        +{parcel.predictedDelayDays} days
                      </td>{" "}
                      <td
                        className="px-6 py-4 text-zinc-800 dark:text-zinc-300 text-xs truncate max-w-[120px]"
                        title={parcel.topRiskFactors[0]?.factor}
                      >
                        {" "}
                        {parcel.topRiskFactors[0]?.factor || "N/A"}{" "}
                      </td>{" "}
                    </tr>
                  ))}{" "}
              </tbody>{" "}
            </table>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </AppLayout>
  );
}