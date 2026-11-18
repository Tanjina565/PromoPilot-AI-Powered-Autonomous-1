import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Building2,
  Sparkles,
  Clock,
  TrendingUp,
  History,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Server,
  Layers,
  Database,
  Activity,
} from 'lucide-react';

export const DashboardPage = () => {
  const [backendHealth, setBackendHealth] = useState(null);
  const [mlHealth, setMlHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServices = async () => {
      try {
        const beRes = await api.get('/health');
        setBackendHealth(beRes.data);
        if (beRes.data?.mlService) {
          setMlHealth(beRes.data.mlService);
        }
      } catch (err) {
        setBackendHealth({ status: 'offline', error: err.message });
        setMlHealth({ status: 'offline' });
      } finally {
        setLoading(false);
      }
    };

    checkServices();
  }, []);

  const modules = [
    {
      code: 'M1-FR2',
      title: 'Business Profile Management',
      desc: 'Create, update, view, and isolate multi-tenant business profiles with target audience, tone, and social bindings.',
      link: '/businesses',
      icon: Building2,
      color: 'from-blue-500 to-indigo-600',
      status: 'Ready for Phase 3',
    },
    {
      code: 'M2-FR1',
      title: 'AI Content Generation',
      desc: 'Autonomous Gemini-powered caption & post creator with English/Bangla multilingual support and drafts.',
      link: '/ai-content',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-600',
      status: 'Ready for Phase 4',
    },
    {
      code: 'M2-FR4',
      title: 'ML Best Time & Engagement',
      desc: 'Scikit-learn Random Forest model predicting optimal posting hours and High/Medium/Low engagement levels.',
      link: '/ml-prediction',
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      status: 'Ready for Phase 5',
    },
    {
      code: 'M3-FR3',
      title: 'AI Recommendations & History',
      desc: 'Actionable performance recommendations from real analytics data, with multi-criteria history filters.',
      link: '/recommendations',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      status: 'Ready for Phase 6',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
            <Layers className="w-3.5 h-3.5" /> University Capstone Project
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            PromoPilot: Autonomous Marketing Automation
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            A production-ready full-stack architecture built completely from scratch using MVC + Service backend,
            component-driven React frontend, and an independent Python FastAPI Scikit-Learn microservice.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium text-slate-200">
              Role: Member 2
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Phase 1: Environment & Architecture Initialized
            </span>
          </div>
        </div>
      </div>

      {/* Service Health Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
          Microservices & Infrastructure Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Backend API */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>Backend Express API</span>
              </div>
              <div className="text-lg font-bold text-slate-800">Port 5000</div>
              <p className="text-xs text-slate-500 mt-1">
                {backendHealth?.status === 'healthy' ? 'Online & Healthy' : 'Starting or Standby'}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-md ${
                backendHealth?.status === 'healthy'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {backendHealth?.status === 'healthy' ? 'Operational' : 'Standby'}
            </span>
          </div>

          {/* ML Microservice */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span>Python ML FastAPI</span>
              </div>
              <div className="text-lg font-bold text-slate-800">Port 8000</div>
              <p className="text-xs text-slate-500 mt-1">
                {mlHealth?.status === 'healthy' ? 'Scikit-Learn Ready' : 'FastAPI Service Ready'}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-md ${
                mlHealth?.status === 'healthy'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}
            >
              {mlHealth?.status === 'healthy' ? 'Operational' : 'Ready'}
            </span>
          </div>

          {/* MongoDB Atlas */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>MongoDB Mongoose</span>
              </div>
              <div className="text-lg font-bold text-slate-800">Atlas / Local</div>
              <p className="text-xs text-slate-500 mt-1">Configured in db.js</p>
            </div>
            <span className="px-2 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              Configured
            </span>
          </div>
        </div>
      </div>

      {/* Member 2 Functional Modules Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
          Assigned Modules (Member 2)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {modules.map((m) => {
            const IconComponent = m.icon;
            return (
              <div
                key={m.code}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${m.color} flex items-center justify-center text-white shadow-sm`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      {m.code}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {m.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-600">{m.status}</span>
                  <Link
                    to={m.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                  >
                    Open View <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
