import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Rocket,
  Building2,
  Sparkles,
  Clock,
  TrendingUp,
  History,
  ShieldCheck,
  Cpu,
  LayoutDashboard,
  Boxes,
  User,
  Users,
  Shield,
  LogOut,
  Compass,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isAuthenticated, isAdmin, isBusinessOwner, logout } = useAuth();
  const navigate = useNavigate();

  const navItemClass = ({ isActive }) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'G';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between flex-shrink-0">
      <div>
        {/* Brand Logo & Tag */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                PromoPilot
              </span>
              <span className="block text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                {isAuthenticated ? (isAdmin ? 'Admin Console' : 'User Portal') : 'Guest Explorer'}
              </span>
            </div>
          </Link>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isAuthenticated
                ? isAdmin
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {isAuthenticated ? (isAdmin ? 'Admin' : 'Owner') : 'Visitor'}
          </span>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-4 space-y-5">
          {/* Public Portal Link */}
          <div>
            <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Explore
            </div>
            <nav className="space-y-1">
              <NavLink to="/visit" className={navItemClass}>
                <div className="flex items-center gap-3">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  <span>Visit Portal</span>
                </div>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-semibold">
                  Public
                </span>
              </NavLink>

              <NavLink to="/" end className={navItemClass}>
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview Dashboard</span>
                </div>
              </NavLink>
            </nav>
          </div>

          {/* Marketing Modules */}
          <div>
            <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Marketing Modules</span>
              {!isAuthenticated && <Lock className="w-3 h-3 text-slate-400" title="Confidential" />}
            </div>
            <nav className="space-y-1">
              <NavLink to="/businesses" className={navItemClass}>
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4" />
                  <span>Businesses</span>
                </div>
                {!isAuthenticated && <Lock className="w-3 h-3 text-slate-400" />}
              </NavLink>

              <NavLink to="/products" className={navItemClass}>
                <div className="flex items-center gap-3">
                  <Boxes className="w-4 h-4" />
                  <span>Products</span>
                </div>
                {!isAuthenticated && <Lock className="w-3 h-3 text-slate-400" />}
              </NavLink>

              <NavLink to="/ai-content" className={navItemClass}>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Content Generator</span>
                </div>
                {!isAuthenticated && <Lock className="w-3 h-3 text-slate-400" />}
              </NavLink>

              <NavLink to="/ml-prediction" className={navItemClass}>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" />
                  <span>ML Best Time</span>
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                  Open
                </span>
              </NavLink>

              <NavLink to="/recommendations" className={navItemClass}>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4" />
                  <span>Recommendations</span>
                </div>
                {!isAuthenticated && <Lock className="w-3 h-3 text-slate-400" />}
              </NavLink>

              <NavLink to="/content-history" className={navItemClass}>
                <div className="flex items-center gap-3">
                  <History className="w-4 h-4" />
                  <span>Content History</span>
                </div>
                {!isAuthenticated && <Lock className="w-3 h-3 text-slate-400" />}
              </NavLink>
            </nav>
          </div>

          {/* Admin Tools — visible if admin or visitor exploring */}
          {(isAdmin || !isAuthenticated) && (
            <div>
              <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Admin & Governance</span>
                {!isAdmin && <Shield className="w-3 h-3 text-amber-500" title="Admin only" />}
              </div>
              <nav className="space-y-1">
                <NavLink to="/admin/users" className={navItemClass}>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>User Roles</span>
                  </div>
                  {!isAdmin && <Lock className="w-3 h-3 text-slate-400" />}
                </NavLink>

                <NavLink to="/admin/model-metrics" className={navItemClass}>
                  <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4" />
                    <span>Model Evaluation</span>
                  </div>
                  {!isAdmin && <Lock className="w-3 h-3 text-slate-400" />}
                </NavLink>

                <NavLink to="/admin/platform-monitor" className={navItemClass}>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Platform Monitor</span>
                  </div>
                  {!isAdmin && <Lock className="w-3 h-3 text-slate-400" />}
                </NavLink>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Card */}
      <div className="p-3 border-t border-slate-200 space-y-2.5">
        {isAuthenticated ? (
          /* Logged In User Side Panel */
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0 ${
                  isAdmin
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                }`}
              >
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate leading-snug">
                  {user?.name || 'Logged User'}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {isAdmin ? (
                    <Shield className="w-3 h-3 text-amber-600 flex-shrink-0" />
                  ) : (
                    <User className="w-3 h-3 text-indigo-600 flex-shrink-0" />
                  )}
                  <span className="text-[10px] text-slate-500 font-medium truncate">
                    {user?.role || 'User'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Visitor Mode Prompt */
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-1">
              <Rocket className="w-3.5 h-3.5 text-indigo-600" />
              Visitor Mode
            </div>
            <p className="text-[11px] text-slate-600 mb-2.5 leading-tight">
              Sign in to unlock confidential business and AI campaign tools.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <span>Sign In / Sign Up</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Live Service Status */}
        <div className="px-2 py-1.5 bg-slate-100/60 rounded-lg flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-600">Services Active</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-slate-600">
            <span>API:5001</span>
            <span>ML:8000</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
