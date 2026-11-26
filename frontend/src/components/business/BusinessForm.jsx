import React, { useState, useEffect } from 'react';
import { Building2, Globe, MessageSquare, Users, Phone, Mail, MapPin, Plus, Trash2 } from 'lucide-react';

const CATEGORIES = [
  'Fashion',
  'Electronics',
  'Food & Beverage',
  'Beauty & Personal Care',
  'Home & Living',
  'Health & Fitness',
  'Technology & Software',
  'Other',
];

const TONES = [
  'Professional',
  'Friendly',
  'Casual',
  'Humorous',
  'Urgent & Sales-driven',
  'Luxurious & Elegant',
];

export const BusinessForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    category: 'Fashion',
    targetAudience: '',
    brandTone: 'Professional',
    preferredLanguage: 'English',
    contactDetails: {
      email: '',
      phone: '',
      address: '',
      website: '',
    },
    socialMediaPages: [],
  });

  const [newSocial, setNewSocial] = useState({
    platform: 'Facebook',
    pageName: '',
    pageUrl: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        businessName: initialData.businessName || '',
        category: initialData.category || 'Fashion',
        targetAudience: initialData.targetAudience || '',
        brandTone: initialData.brandTone || 'Professional',
        preferredLanguage: initialData.preferredLanguage || 'English',
        contactDetails: {
          email: initialData.contactDetails?.email || '',
          phone: initialData.contactDetails?.phone || '',
          address: initialData.contactDetails?.address || '',
          website: initialData.contactDetails?.website || '',
        },
        socialMediaPages: initialData.socialMediaPages || [],
      });
    }
  }, [initialData]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith('contact.')) {
      const contactField = name.slice('contact.'.length);
      setFormData((currentData) => ({
        ...currentData,
        contactDetails: {
          ...currentData.contactDetails,
          [contactField]: value,
        },
      }));
      return;
    }

    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleAddSocialPage = () => {
    const pageName = newSocial.pageName.trim();
    const pageUrl = newSocial.pageUrl.trim();
    if (!pageName || !pageUrl) return;

    const socialPage = {
      ...newSocial,
      pageName,
      pageUrl,
      connected: true,
      connectedAt: new Date(),
    };

    setFormData((currentData) => ({
      ...currentData,
      socialMediaPages: [...currentData.socialMediaPages, socialPage],
    }));
    setNewSocial({ platform: 'Facebook', pageName: '', pageUrl: '' });
  };

  const handleRemoveSocialPage = (pageIndex) => {
    setFormData((currentData) => ({
      ...currentData,
      socialMediaPages: currentData.socialMediaPages.filter((_, index) => index !== pageIndex),
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Basic Profile Details */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          1. Brand Information
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              name="businessName"
              required
              value={formData.businessName}
              onChange={handleFieldChange}
              placeholder="e.g. Aura Lifestyle BD"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Industry Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleFieldChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Target Audience Profile *
          </label>
          <textarea
            name="targetAudience"
            required
            rows={2}
            value={formData.targetAudience}
            onChange={handleFieldChange}
            placeholder="e.g. University students, fashion enthusiasts, and young professionals aged 18-30 in Bangladesh"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Brand Tone *
            </label>
            <select
              name="brandTone"
              value={formData.brandTone}
              onChange={handleFieldChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
            >
              {TONES.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Preferred Marketing Language *
            </label>
            <div className="flex gap-4 pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="radio"
                  name="preferredLanguage"
                  value="English"
                  checked={formData.preferredLanguage === 'English'}
                  onChange={handleFieldChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                English
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="radio"
                  name="preferredLanguage"
                  value="Bangla"
                  checked={formData.preferredLanguage === 'Bangla'}
                  onChange={handleFieldChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                বাংলা (Bangla)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          2. Contact Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              name="contact.email"
              value={formData.contactDetails.email}
              onChange={handleFieldChange}
              placeholder="contact@brand.com"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
            <input
              type="text"
              name="contact.phone"
              value={formData.contactDetails.phone}
              onChange={handleFieldChange}
              placeholder="+8801700000000"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
            <input
              type="text"
              name="contact.address"
              value={formData.contactDetails.address}
              onChange={handleFieldChange}
              placeholder="Dhanmondi, Dhaka"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Website URL</label>
            <input
              type="url"
              name="contact.website"
              value={formData.contactDetails.website}
              onChange={handleFieldChange}
              placeholder="https://example.com"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Social Media Accounts */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          3. Connected Social Media Pages
        </h4>

        {/* Existing List */}
        {formData.socialMediaPages.length > 0 && (
          <div className="space-y-2">
            {formData.socialMediaPages.map((soc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
              >
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    {soc.platform}
                  </span>
                  <div className="text-sm font-semibold text-slate-800">{soc.pageName}</div>
                  <span className="text-xs text-slate-400">{soc.pageUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSocialPage(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Social Input */}
        <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <select
              value={newSocial.platform}
              onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
              className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
            >
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter / X</option>
            </select>
            <input
              type="text"
              placeholder="Page Name (e.g. Aura Official)"
              value={newSocial.pageName}
              onChange={(e) => setNewSocial({ ...newSocial, pageName: e.target.value })}
              className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
            />
            <input
              type="text"
              placeholder="URL (e.g. https://fb.com/aura)"
              value={newSocial.pageUrl}
              onChange={(e) => setNewSocial({ ...newSocial, pageUrl: e.target.value })}
              className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
            />
          </div>
          <button
            type="button"
            onClick={handleAddSocialPage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Bind Social Page
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-md shadow-indigo-100 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : initialData ? 'Update Profile' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
};
