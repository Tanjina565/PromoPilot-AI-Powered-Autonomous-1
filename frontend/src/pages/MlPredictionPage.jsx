import React, { useState } from 'react';
import { mlService } from '../services/mlService';
import {
  Clock,
  TrendingUp,
  Cpu,
  Zap,
  BarChart2,
  Calendar,
  Share2,
  Layers,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const PLATFORMS = ['Instagram', 'Facebook', 'LinkedIn', 'Twitter'];
const CATEGORIES = ['Fashion', 'Electronics', 'Food & Beverage', 'Beauty & Personal Care', 'Home & Living'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEDIA_TYPES = ['Image', 'Video', 'Carousel', 'Text'];

export const MlPredictionPage = () => {
  const [params, setParams] = useState({
    platform: 'Instagram',
    category: 'Fashion',
    day_of_week: 'Wednesday',
    hour_of_day: 19,
    caption_length: 120,
    hashtag_count: 5,
    has_cta: 1,
    media_type: 'Video',
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await mlService.predictTimeAndEngagement(params);
      setPrediction(res.data);
    } catch (err) {
      alert(err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  // Format hourly scores for Recharts
  const chartData = prediction?.hourly_engagement_scores
    ? prediction.hourly_engagement_scores.map((score, h) => ({
        hour: `${h}:00`,
        score: Math.round(score * 100),
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          ML Best Posting Time & Engagement Predictor
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Module 2 (M2-FR4): Powered by an independent Python FastAPI microservice utilizing a Scikit-Learn Random Forest Classifier.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form parameters (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Cpu className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Feature Extraction Inputs
            </h3>
          </div>

          <form onSubmit={handlePredict} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Platform</label>
                <select
                  value={params.platform}
                  onChange={(e) => setParams({ ...params, platform: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 font-medium"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={params.category}
                  onChange={(e) => setParams({ ...params, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 font-medium"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Day of Week</label>
                <select
                  value={params.day_of_week}
                  onChange={(e) => setParams({ ...params, day_of_week: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 font-medium"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Media Format</label>
                <select
                  value={params.media_type}
                  onChange={(e) => setParams({ ...params, media_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 font-medium"
                >
                  {MEDIA_TYPES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hashtag Count ({params.hashtag_count})
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={params.hashtag_count}
                  onChange={(e) => setParams({ ...params, hashtag_count: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Est. Caption Length ({params.caption_length} chars)
                </label>
                <input
                  type="range"
                  min="20"
                  max="400"
                  step="10"
                  value={params.caption_length}
                  onChange={(e) => setParams({ ...params, caption_length: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={params.has_cta === 1}
                  onChange={(e) => setParams({ ...params, has_cta: e.target.checked ? 1 : 0 })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                Include Call-To-Action (CTA) Hook
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {loading ? 'Running Random Forest Model...' : 'Predict Best Time & Engagement'}
            </button>
          </form>
        </div>

        {/* Results display (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {prediction ? (
            <div className="space-y-6">
              {/* Highlight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Best Time Card */}
                <div className="bg-gradient-to-tr from-indigo-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md border border-indigo-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-400" /> Optimal Window
                    </span>
                    <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30">
                      Peak Traffic
                    </span>
                  </div>
                  <div className="text-3xl font-black mt-2 tracking-tight">
                    {prediction.best_time_slot}
                  </div>
                  <p className="text-xs text-indigo-200/80 mt-2">
                    Publishing on <strong>{params.day_of_week}</strong> around {prediction.best_posting_hour}:00 yields highest expected reach.
                  </p>
                </div>

                {/* Predicted Engagement Level */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" /> Predicted Engagement
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <span
                      className={`text-2xl font-black px-3.5 py-1 rounded-xl border ${
                        prediction.predicted_engagement === 'High'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : prediction.predicted_engagement === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      {prediction.predicted_engagement} Level
                    </span>
                  </div>

                  <div className="flex gap-2 text-[10px] text-slate-500">
                    <span>High: {Math.round((prediction.probabilities?.High || 0) * 100)}%</span>
                    <span>•</span>
                    <span>Med: {Math.round((prediction.probabilities?.Medium || 0) * 100)}%</span>
                    <span>•</span>
                    <span>Low: {Math.round((prediction.probabilities?.Low || 0) * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* 24-Hour Engagement Curve Chart */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-indigo-600" />
                    24-Hour Projected Engagement Distribution ({params.day_of_week})
                  </h4>
                  <span className="text-[11px] text-slate-400">Probability Index (%)</span>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} />
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
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorEngage)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            /* Standby Card */
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center h-full flex flex-col items-center justify-center">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">Random Forest Prediction Ready</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                Tune the parameters on the left and click "Predict Best Time & Engagement" to execute the FastAPI machine learning model.
              </p>
              <button
                onClick={handlePredict}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700"
              >
                Run Default Prediction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
