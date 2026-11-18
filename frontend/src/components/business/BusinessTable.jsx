import React from 'react';
import { Edit2, Trash2, ExternalLink, Globe } from 'lucide-react';

export const BusinessTable = ({ businesses, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-6">Business Name</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Brand Tone</th>
              <th className="py-3.5 px-4">Language</th>
              <th className="py-3.5 px-4">Socials</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {businesses.map((b) => (
              <tr key={b._id || b.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                      {b.businessName.charAt(0)}
                    </div>
                    <div>
                      <span>{b.businessName}</span>
                      <span className="block text-[11px] text-slate-400 font-normal truncate max-w-xs">
                        {b.targetAudience}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700">
                    {b.category}
                  </span>
                </td>
                <td className="py-4 px-4 font-medium text-slate-600">{b.brandTone}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded ${
                      b.preferredLanguage === 'Bangla'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {b.preferredLanguage}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-xs font-semibold text-slate-600">
                    {b.socialMediaPages?.length || 0} Connected
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(b)}
                      title="View Details"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(b)}
                      title="Edit"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(b)}
                      title="Delete"
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
