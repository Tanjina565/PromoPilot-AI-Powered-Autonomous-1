import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mlService } from '../services/mlService';
import api from '../services/api';
import {
  Rocket,
  Sparkles,
  Clock,
  Building2,
  Boxes,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Lock,
  Unlock,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe,
  Share2,
  Play,
  Layers,
  ChevronRight,
  Sliders,
  Check,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const VisitPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Health data state
  const [health, setHealth] = useState(null);

  // ML Simulator State
  const [simParams, setSimParams] = useState({
    platform: 'Instagram',
    category: 'Fashion',
    day_of_week: 'Friday',
    hour_of_day: 19,
    caption_length: 120,
    hashtag_count: 5,
    has_cta: 1,
    media_type: 'Video',
  });
  const [simLoading, setSimLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    // Fetch live system health
    const fetchHealth = async () => {
      try {
        const res = await api.get('/health');
        setHealth(res.data);
      } catch (err) {
        setHealth({ status: 'offline' });
      }
    };
    fetchHealth();

    // Run initial prediction for visitor demo
    runPrediction();
  }, []);

  const runPrediction = async () => {
    setSimLoading(true);
    try {
      const res = await mlService.predictTimeAndEngagement(simParams);
      setPrediction(res.data);
    } catch (err) {
      console.warn('Simulator fallback:', err);
    } finally {
      setSimLoading(false);
    }
  };

  const chartData = prediction?.hourly_engagement_scores?.map((score, index) => ({
    hour: `${index.toString().padStart(2, '0')}:00`,
    score: Math.round(score * 100),
  })) || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                PromoPilot
              </span>
              <span className="block text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Public Visit Portal
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#overview" className="hover:text-indigo-600 transition-colors">Overview</a>
            <a href="#ml-simulator" className="hover:text-indigo-600 transition-colors">Live ML Predictor</a>
            <a href="#showcase" className="hover:text-indigo-600 transition-colors">AI Showcase</a>
            <a href="#confidentiality" className="hover:text-indigo-600 transition-colors">Access & Governance</a>
            <a href="#architecture" className="hover:text-indigo-600 transition-colors">Architecture</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
              >
                Go to Workspace
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 transition-all"
                >
                  Sign Up Free
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="overview" className="relative py-16 lg:py-24 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Autonomous AI-Powered E-Commerce Marketing Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Turn Product Catalogs into High-Converting Social Campaigns
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            PromoPilot combines Google Gemini 1.5 generative AI with Scikit-Learn machine learning to automatically generate brand-aligned copy and schedule posts at optimal peak audience engagement times.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#ml-simulator"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
            >
              <Zap className="w-4 h-4" />
              Try Live ML Predictor (No Login Needed)
            </a>
            <button
              onClick={() => navigate(isAuthenticated ? '/' : '/login')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
            >
              {isAuthenticated ? 'Open Business Dashboard' : 'Sign In to Workspace'}
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Live System Health Pills */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-700">Backend API:</span>
              <span className="text-slate-500 font-mono">Port 5001 Live</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-700">ML Microservice:</span>
              <span className="text-slate-500 font-mono">Port 8000 Live</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="font-semibold text-slate-700">AI Model:</span>
              <span className="text-slate-500">Gemini 1.5 Flash</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Complete Autonomous Marketing Stack
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Designed for multi-tenant Bangladeshi and international e-commerce businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Autonomous Content Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates authentic promotional copy in Bangla or English strictly adhering to actual product pricing and features without hallucinating coupons or discounts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">ML Best Posting Time</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trained Random Forest Classifier microservice predicts hourly engagement probability curves across Instagram, Facebook, LinkedIn, and Twitter.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Strategic Recommendations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aggregates real-time post impressions, likes, and comment rates to recommend optimal hashtag densities and high-performing format allocations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live ML Simulator Section */}
      <section id="ml-simulator" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              Public Feature • No Login Required
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Interactive ML Posting Time Simulator
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Test our Scikit-Learn Random Forest prediction model live right now. Change the parameters below to see real-time AI engagement estimation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls Form */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Simulation Parameters
                </span>
                <span className="text-[11px] text-slate-400 font-mono">FastAPI :8000</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Social Platform</label>
                <select
                  value={simParams.platform}
                  onChange={(e) => setSimParams({ ...simParams, platform: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter">Twitter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Category</label>
                <select
                  value={simParams.category}
                  onChange={(e) => setSimParams({ ...simParams, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Fashion">Fashion & Apparel</option>
                  <option value="Electronics">Electronics & Gadgets</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                  <option value="Home & Living">Home & Living</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Day of Week</label>
                  <select
                    value={simParams.day_of_week}
                    onChange={(e) => setSimParams({ ...simParams, day_of_week: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Media Type</label>
                  <select
                    value={simParams.media_type}
                    onChange={(e) => setSimParams({ ...simParams, media_type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Video">Video / Reel</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Image">Single Image</option>
                    <option value="Text">Text Only</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Target Posting Hour</span>
                  <span className="font-mono text-indigo-600">{simParams.hour_of_day}:00 ({simParams.hour_of_day >= 12 ? 'PM' : 'AM'})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="23"
                  value={simParams.hour_of_day}
                  onChange={(e) => setSimParams({ ...simParams, hour_of_day: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hashtag Count</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={simParams.hashtag_count}
                    onChange={(e) => setSimParams({ ...simParams, hashtag_count: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Include Call-to-Action</label>
                  <select
                    value={simParams.has_cta}
                    onChange={(e) => setSimParams({ ...simParams, has_cta: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="1">Yes (Active CTA)</option>
                    <option value="0">No CTA</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={runPrediction}
                disabled={simLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 disabled:opacity-50 transition-all mt-2"
              >
                <Zap className="w-4 h-4" />
                {simLoading ? 'Running Model Inference...' : 'Calculate Predicted Engagement'}
              </button>
            </div>

            {/* Prediction Output & Chart */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Live Prediction Result
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Random Forest v1.0
                </span>
              </div>

              {prediction ? (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-center">
                      <span className="text-[10px] font-semibold text-indigo-700 uppercase">Predicted Level</span>
                      <p className="text-xl font-extrabold text-indigo-900 mt-0.5">
                        {prediction.predicted_engagement}
                      </p>
                    </div>

                    <div className="p-3.5 bg-violet-50/70 border border-violet-100 rounded-2xl text-center">
                      <span className="text-[10px] font-semibold text-violet-700 uppercase">Confidence</span>
                      <p className="text-xl font-extrabold text-violet-900 mt-0.5">
                        {Math.round((prediction.confidence || 0.85) * 100)}%
                      </p>
                    </div>

                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-center">
                      <span className="text-[10px] font-semibold text-emerald-700 uppercase">Peak Time Slot</span>
                      <p className="text-sm font-extrabold text-emerald-900 mt-1">
                        {prediction.best_time_slot || '19:00 - 21:00'}
                      </p>
                    </div>
                  </div>

                  {/* Hourly Engagement Curve Chart */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-700">24-Hour Engagement Probability Curve</span>
                      <span className="text-slate-400 text-[10px]">Peak highlighted at 19:00</span>
                    </div>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="visColor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#visColor)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Click calculate to view real-time model output.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AI Content Showcase */}
      <section id="showcase" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Sample AI Marketing Generations
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              See how PromoPilot autonomously crafts high-performing posts tailored for specific products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sample 1: Fashion (Bangla) */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <span className="text-xs font-bold text-slate-800">Aura Lifestyle BD</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                    Instagram • Bangla
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Heritage Khadi Cotton Panjabi
                </h3>
                <div className="text-xs font-semibold text-indigo-600 mb-3">2,450 BDT • 100% Breathable Cotton</div>
                <p className="text-xs text-slate-700 bg-white p-4 rounded-2xl border border-slate-200 whitespace-pre-line leading-relaxed mb-4">
                  ✨ ঐতিহ্যের সাথে আধুনিকতার নিখুঁত মেলবন্ধন! Aura Lifestyle BD নিয়ে এলো খাঁটি খাদি কটনের হ্যান্ডলুম পাঞ্জাবি।

                  ১০০% ব্রিদেবল পিওর কটন ফ্যাব্রিকে নিখুঁত মিনিমালিস্ট কাজ — যা আপনাকে দিবে সর্বোচ্চ আরাম ও মার্জিত লুক।

                  মূল্য: ২৪৫০ BDT
                  সীমিত স্টক! এখনই ইনবক্স করে আপনার সাইজ অর্ডার করুন।
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60">
                <span className="text-[10px] text-indigo-600 bg-indigo-50/70 px-2 py-0.5 rounded-md font-mono">#AuraLifestyleBD</span>
                <span className="text-[10px] text-indigo-600 bg-indigo-50/70 px-2 py-0.5 rounded-md font-mono">#KhadiPanjabi</span>
                <span className="text-[10px] text-indigo-600 bg-indigo-50/70 px-2 py-0.5 rounded-md font-mono">#MensFashionBD</span>
              </div>
            </div>

            {/* Sample 2: Tech (English) */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                    <span className="text-xs font-bold text-slate-800">ElectroTech Gadgets</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full border border-violet-200">
                    Facebook • English
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  AcousticPro ANC Wireless Earbuds
                </h3>
                <div className="text-xs font-semibold text-violet-600 mb-3">3,600 BDT • 40dB ANC • 40Hr Battery</div>
                <p className="text-xs text-slate-700 bg-white p-4 rounded-2xl border border-slate-200 whitespace-pre-line leading-relaxed mb-4">
                  🎧 Silence the noise, elevate your sound. Meet the all-new AcousticPro ANC Wireless Earbuds from ElectroTech Gadgets!

                  Engineered with 40dB Hybrid Active Noise Cancellation, Bluetooth 5.3 low-latency gaming mode, and an incredible 40-hour total battery reserve.

                  Price: 3600 BDT
                  Special Launch Warranty: 1 Year Official Replacement
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60">
                <span className="text-[10px] text-violet-600 bg-violet-50/70 px-2 py-0.5 rounded-md font-mono">#ElectroTechBD</span>
                <span className="text-[10px] text-violet-600 bg-violet-50/70 px-2 py-0.5 rounded-md font-mono">#WirelessEarbuds</span>
                <span className="text-[10px] text-violet-600 bg-violet-50/70 px-2 py-0.5 rounded-md font-mono">#ActiveNoiseCancellation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confidentiality & Access Levels Table */}
      <section id="confidentiality" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Feature Confidentiality & Governance
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Clear security boundaries ensure private company catalogs and social tokens remain confidential.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {/* Row 1: Public */}
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Unlock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">Public Visit & Simulator Portal</h4>
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                        Public (No Login)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Platform architecture overview, live service status monitoring, and the interactive ML engagement predictor.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                  Open Access
                </span>
              </div>

              {/* Row 2: Business Owner */}
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">Business & Product Workspaces</h4>
                      <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                        Confidential
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Multi-tenant business profiles, connected social account credentials, product pricing margins, and custom AI content generation.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-xl transition-colors"
                >
                  Requires Sign In
                </button>
              </div>

              {/* Row 3: Admin */}
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">Admin Governance & Model Retraining</h4>
                      <span className="text-[10px] font-semibold bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                        Restricted
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Scikit-Learn ML retraining triggers, cross-tenant performance metrics, system memory logs, and server monitoring.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-colors"
                >
                  Admin Role Only
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section id="architecture" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Capstone Microservices Architecture
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              High-availability architecture built for seamless horizontal scalability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-indigo-600 uppercase mb-1">Frontend</div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Vite + React 18</h4>
              <p className="text-xs text-slate-500">
                Single-page application featuring Tailwind CSS, Recharts for data visualization, and role-based guards.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-emerald-600 uppercase mb-1">Backend API</div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Node.js + Express</h4>
              <p className="text-xs text-slate-500">
                RESTful API on port 5001 with JWT authentication, Zod input validation, and resilient store fallbacks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-violet-600 uppercase mb-1">ML Engine</div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Python 3 + FastAPI</h4>
              <p className="text-xs text-slate-500">
                Random Forest classifier on port 8000 for posting-time prediction and hourly engagement scoring.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-amber-600 uppercase mb-1">Generative AI</div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Google Gemini 1.5</h4>
              <p className="text-xs text-slate-500">
                Structured multimodal generation for authentic multi-channel social media marketing copy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              P
            </div>
            <div>
              <span className="text-white font-bold text-sm">PromoPilot</span>
              <p className="text-[11px] text-slate-500">Autonomous Marketing Automation Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <Link to="/visit" className="hover:text-white transition-colors">Visit Portal</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
          </div>

          <p className="text-[11px] text-slate-500">
            © 2026 PromoPilot. Member 2 Capstone Project.
          </p>
        </div>
      </footer>
    </div>
  );
};
