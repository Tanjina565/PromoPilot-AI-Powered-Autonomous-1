import React, { useState, useEffect } from 'react';
import { recommendationService } from '../services/recommendationService';
import { businessService } from '../services/businessService';
import {
  TrendingUp,
  Sparkles,
  Clock,
  Video,
  Lightbulb,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  BarChart2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const RecommendationsPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await businessService.getAll();
        const list = res.data || [];
        setBusinesses(list);
        if (list.length > 0) {
          setSelectedBusinessId(list[0]._id || list[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBusinesses();
  }, []);

  const fetchRecommendations = async (bId) => {
    if (!bId) return;
    setLoading(true);
    try {
      const res = await recommendationService.getForBusiness(bId);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBusinessId) {
      fetchRecommendations(selectedBusinessId);
    }
  }, [selectedBusinessId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          AI Performance Recommendations
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Module 3 (M3-FR3): Evidence-based recommendations derived strictly from recorded post impressions and engagement metrics.
        </p>
      </div>

      {/* Business Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-600" /> Active Business:
        </label>
        <select
          value={selectedBusinessId}
          onChange={(e) => setSelectedBusinessId(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
        >
          {businesses.map((b) => (
            <option key={b._id || b.id} value={b._id || b.id}>
              {b.businessName} ({b.category})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Analyzing historical analytics records...</div>
      ) : data ? (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              {data.summary}
            </span>
            <span className="font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
              {data.totalPostsTracked} Posts Tracked
            </span>
          </div>

          {/* Actionable Strategy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.recommendations?.map((rec, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 uppercase tracking-wider">
                      {rec.type}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600">
                      {Math.round(rec.confidence * 100)}% Confidence
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-2">{rec.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{rec.insight}</p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-indigo-600 mb-1 flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> Actionable Step:
                  </div>
                  <p className="text-xs text-slate-800 font-medium">{rec.action}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts: Format performance & Hourly distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Format Performance */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Video className="w-4 h-4 text-indigo-600" />
                  Format Engagement Performance (%)
                </h4>
                <span className="text-[10px] text-slate-400">Mean Rate</span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.contentTypeStats || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="type" tick={{ fontSize: 11, fill: '#64748b' }} />
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

            {/* Optimal Hour Performance */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Peak Engagement by Publishing Hour (%)
                </h4>
                <span className="text-[10px] text-slate-400">Time-of-day</span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.hourlyStats || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748b' }} />
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
                    <Bar dataKey="engagement" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
