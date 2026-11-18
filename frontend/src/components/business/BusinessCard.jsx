import React from 'react';
import {
  Building2,
  Globe,
  Share2,
  Users,
  Edit2,
  Trash2,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export const BusinessCard = ({ business, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-50 to-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-lg">
              {business.businessName.charAt(0)}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {business.businessName}
              </h4>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {business.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(business)}
              title="Edit Profile"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(business)}
              title="Delete Profile"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Target Audience */}
        <div className="mb-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-500" /> Target Audience
          </div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {business.targetAudience}
          </p>
        </div>

        {/* Metadata Pills */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Brand Tone</span>
            <span className="text-xs font-bold text-slate-700">{business.brandTone}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Language</span>
            <span className="text-xs font-bold text-indigo-600">{business.preferredLanguage}</span>
          </div>
        </div>

        {/* Social Accounts connected */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-indigo-500" /> Connected Socials (
            {business.socialMediaPages?.length || 0})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {business.socialMediaPages && business.socialMediaPages.length > 0 ? (
              business.socialMediaPages.map((soc, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  {soc.platform}: {soc.pageName}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No social accounts connected</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Created {new Date(business.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={() => onView(business)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          View Full Specs <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
