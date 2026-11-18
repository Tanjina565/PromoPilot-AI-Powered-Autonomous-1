import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowRight, UserPlus, Sparkles, Compass } from 'lucide-react';

export const ConfidentialGate = ({
  featureName = 'This Feature',
  description = 'Access to this module contains proprietary business data, social media tokens, and private marketing assets.',
  requiredRole = 'Business Owner or Admin',
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 p-8 text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Lock Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-6">
          <Lock className="w-8 h-8" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          Confidential Functionality
        </div>

        {/* Title & Description */}
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
          Authentication Required for {featureName}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {description}
        </p>

        {/* Required Access Level Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Required Role:</span>
            <span className="font-semibold text-slate-800 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
              {requiredRole}
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Confidentiality ensures that only verified owners can modify brand voice, access product pricing margins, and generate live social broadcasts.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
            >
              <UserPlus className="w-4 h-4 text-slate-600" />
              Sign Up
            </button>
          </div>

          <button
            onClick={() => navigate('/visit')}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/60 transition-all"
          >
            <Compass className="w-3.5 h-3.5" />
            Back to Public Visit & Explore Page
          </button>
        </div>
      </div>
    </div>
  );
};
