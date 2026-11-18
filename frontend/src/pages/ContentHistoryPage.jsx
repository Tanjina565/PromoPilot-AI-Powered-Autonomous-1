import React, { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import { businessService } from '../services/businessService';
import {
  History,
  Search,
  Filter,
  Calendar,
  Share2,
  Copy,
  Check,
  Eye,
  Building2,
  Tag,
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

const PLATFORMS = ['All', 'Facebook', 'Instagram', 'LinkedIn', 'Twitter'];
const STATUSES = ['All', 'Draft', 'Saved', 'Published'];

export const ContentHistoryPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Preview modal
  const [viewingContent, setViewingContent] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

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

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedBusinessId) params.businessId = selectedBusinessId;
      if (selectedPlatform !== 'All') params.platform = selectedPlatform;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (searchTerm) params.search = searchTerm;

      const res = await contentService.getHistory(params);
      setHistory(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedBusinessId, selectedPlatform, selectedStatus, searchTerm]);

  const handleCopy = (id, text, hashtags) => {
    const full = `${text}\n\n${Array.isArray(hashtags) ? hashtags.join(' ') : hashtags || ''}`;
    navigator.clipboard.writeText(full);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Generated Content History
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Module 3 (M3-FR3): Centralized audit log and multi-criteria filterable archive of all AI-generated marketing posts.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Business Select */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Business
            </label>
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50"
            >
              <option value="">All Businesses</option>
              {businesses.map((b) => (
                <option key={b._id || b.id} value={b._id || b.id}>
                  {b.businessName}
                </option>
              ))}
            </select>
          </div>

          {/* Platform Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Platform
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Search Caption
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pl-8 rounded-xl border border-slate-300 text-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading content archive...</div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">No Content Matches Filter</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            No posts generated yet matching the selected business, platform, or search term.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6">Generated Post Content</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Marketing Goal</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {history.map((item) => (
                <tr key={item._id || item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 max-w-md">
                    <p className="font-semibold text-slate-800 line-clamp-2 leading-relaxed">
                      {item.generatedCaption}
                    </p>
                    {item.hashtags && item.hashtags.length > 0 && (
                      <span className="text-[10px] text-indigo-600 font-medium truncate block mt-1">
                        {item.hashtags.slice(0, 4).join(' ')}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {item.platform}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-600">{item.marketingGoal}</td>
                  <td className="py-4 px-4 font-semibold text-indigo-600">{item.language}</td>
                  <td className="py-4 px-4 text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleCopy(item._id || item.id, item.generatedCaption, item.hashtags)}
                        title="Copy Post"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        {copiedId === (item._id || item.id) ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setViewingContent(item)}
                        title="View Full Post"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details View Modal */}
      <Modal
        isOpen={!!viewingContent}
        onClose={() => setViewingContent(null)}
        title="Archived Social Media Post"
      >
        {viewingContent && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-indigo-600">{viewingContent.platform}</span>
                <span className="text-slate-400 ml-2">Goal: {viewingContent.marketingGoal}</span>
              </div>
              <span className="font-bold text-slate-700">{viewingContent.language}</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Caption
              </label>
              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {viewingContent.generatedCaption}
              </p>
            </div>

            {viewingContent.hashtags && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-indigo-600 font-semibold">
                {viewingContent.hashtags.join(' ')}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
