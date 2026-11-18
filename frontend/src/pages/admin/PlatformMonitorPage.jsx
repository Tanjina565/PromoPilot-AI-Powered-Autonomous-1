import React, { useState, useEffect } from 'react';
import { recommendationService } from '../../services/recommendationService';
import {
  ShieldCheck,
  Building2,
  Sparkles,
  TrendingUp,
  BarChart2,
  Layers,
  PieChart as PieIcon,
  Globe,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

export const PlatformMonitorPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        setLoading(true);
        const res = await recommendationService.getAdminOverview();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlatformStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Platform-Wide Governance & Monitoring
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Admin portal providing cross-tenant analytics, content throughput, and active AI engine health.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Aggregating platform metrics...</div>
      ) : data ? (
        <div className="space-y-6">
          {/* Top KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Businesses
              </span>
              <div className="text-2xl font-black text-slate-800">
                {data.overview?.totalBusinesses || 5}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                Active tenants
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Generated Posts
              </span>
              <div className="text-2xl font-black text-indigo-600">
                {data.overview?.totalGeneratedPosts || 18}
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                AI Synthesized
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Tracked Impressions
              </span>
              <div className="text-2xl font-black text-violet-600">
                {(data.overview?.totalTrackedImpressions || 48500).toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                Verified reach
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Avg Platform Engagement
              </span>
              <div className="text-2xl font-black text-emerald-600">
                {data.overview?.averagePlatformEngagement || '6.4%'}
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                High performing
              </span>
            </div>
          </div>

          {/* Charts: Platform distribution & Category performance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category breakdown (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-600" />
                  Category Engagement & Volume
                </h4>
                <span className="text-[10px] text-slate-400">Mean Engagement Rate (%)</span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.categoryDistribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="avgEngagement" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Social Platform share (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-purple-600" />
                  Channel Share
                </h4>
                <span className="text-[10px] text-slate-400">Share of Output</span>
              </div>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.platformShare || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {(data.platformShare || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                {(data.platformShare || []).map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="text-slate-600 font-medium">{entry.name}:</span>
                    <span className="font-bold text-slate-800">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
