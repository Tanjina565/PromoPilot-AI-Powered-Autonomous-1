import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Shield, User, LogOut, Compass, ArrowRight, UserPlus } from 'lucide-react';

export const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Left title & Capstone tag */}
      <div className="flex items-center gap-3">
        <h1 className="text-base sm:text-lg font-bold text-slate-800">Autonomous Marketing Automation</h1>
        <span className="hidden md:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Sparkles className="w-3 h-3 text-indigo-600" /> Member 2 Capstone
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Quick link to public Visit Page */}
        <Link
          to="/visit"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/70 rounded-xl transition-all border border-indigo-200/60"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Visit Portal</span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              {isAdmin ? (
                <Shield className="w-4 h-4 text-amber-600 flex-shrink-0" />
              ) : (
                <User className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              )}
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name || 'User'}</p>
                <span className="text-[10px] text-slate-500 font-medium">{user?.role || 'Business Owner'}</span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
              Visitor Mode
            </span>
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
