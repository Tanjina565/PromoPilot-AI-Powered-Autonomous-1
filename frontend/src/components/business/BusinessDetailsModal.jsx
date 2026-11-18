import React from 'react';
import { Modal } from '../common/Modal';
import {
  Building2,
  Globe,
  Share2,
  Users,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';

export const BusinessDetailsModal = ({ isOpen, onClose, business }) => {
  if (!business) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Business Profile: ${business.businessName}`}>
      <div className="space-y-6">
        {/* Main Banner */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-indigo-100">
            {business.businessName.charAt(0)}
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-800">{business.businessName}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-700">
                {business.category}
              </span>
              <span className="text-xs text-slate-400">
                Created: {new Date(business.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Target Audience
          </span>
          <p className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
            {business.targetAudience}
          </p>
        </div>

        {/* Marketing Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Brand Tone
            </span>
            <span className="text-base font-bold text-slate-800">{business.brandTone}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Language
            </span>
            <span className="text-base font-bold text-indigo-600">{business.preferredLanguage}</span>
          </div>
        </div>

        {/* Contact Details */}
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Contact & Operations
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>{business.contactDetails?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <Phone className="w-4 h-4 text-indigo-600" />
              <span>{business.contactDetails?.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>{business.contactDetails?.address || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>{business.contactDetails?.website || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Connected Social Pages */}
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Connected Social Accounts
          </span>
          {business.socialMediaPages && business.socialMediaPages.length > 0 ? (
            <div className="space-y-2">
              {business.socialMediaPages.map((soc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-indigo-600">{soc.platform}</span>
                    <span className="font-semibold text-slate-800">{soc.pageName}</span>
                    <span className="text-slate-400">{soc.pageUrl}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Connected
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No social accounts connected to this business.</p>
          )}
        </div>
      </div>
    </Modal>
  );
};
