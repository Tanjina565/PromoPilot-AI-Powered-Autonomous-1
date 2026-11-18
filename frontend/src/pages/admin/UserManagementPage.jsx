import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import {
  Users,
  Shield,
  User,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Search,
  AlertCircle,
} from 'lucide-react';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await userService.getAll();
      setUsers(res.data || []);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await userService.updateRole(userId, newRole);
      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u._id === userId || u.id === userId ? { ...u, role: newRole } : u))
      );
      setSuccessMessage(res.message || `Role updated to ${newRole}`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter((u) => u.role === 'Admin').length;
  const ownerCount = users.filter((u) => u.role === 'Business Owner').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">User Role Governance</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Admin Only
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Assign and govern platform roles. Self-registration defaults to Business Owner; only Admins can elevate roles here.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Users</span>
            <p className="text-2xl font-extrabold text-slate-900">{users.length}</p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-wider">Business Owners</span>
            <p className="text-2xl font-extrabold text-slate-900">{ownerCount}</p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Administrators</span>
            <p className="text-2xl font-extrabold text-slate-900">{adminCount}</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or role..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <span className="text-xs text-slate-400">
            Showing {filteredUsers.length} of {users.length} registered accounts
          </span>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">User Details</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">Current Role</th>
                <th className="py-3.5 px-6 text-right">Assign Role (Admin Only)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const id = u._id || u.id;
                  const isUpdating = updatingId === id;
                  const isAdmin = u.role === 'Admin';

                  return (
                    <tr key={id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isAdmin
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{u.name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono text-slate-600">
                        {u.email}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            isAdmin
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}
                        >
                          {isAdmin ? (
                            <Shield className="w-3 h-3 text-amber-600" />
                          ) : (
                            <User className="w-3 h-3 text-indigo-600" />
                          )}
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <select
                            disabled={isUpdating}
                            value={u.role}
                            onChange={(e) => handleRoleChange(id, e.target.value)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
                          >
                            <option value="Business Owner">Business Owner</option>
                            <option value="Admin">Admin</option>
                          </select>
                          {isUpdating && (
                            <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
