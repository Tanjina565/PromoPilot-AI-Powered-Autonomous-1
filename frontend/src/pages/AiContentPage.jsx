import React, { useState, useEffect } from 'react';
import { businessService } from '../services/businessService';
import { productService } from '../services/productService';
import { contentService } from '../services/contentService';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Save,
  Check,
  Building2,
  Boxes,
  Share2,
  Sliders,
  Target,
  Languages,
  Eye,
  Edit3,
  Clock,
  Heart,
  MessageCircle,
  Share,
} from 'lucide-react';

const PLATFORMS = ['Instagram', 'Facebook', 'LinkedIn', 'Twitter'];
const GOALS = [
  'Brand Awareness',
  'Lead Generation',
  'Sales Conversion',
  'Engagement',
  'Product Launch',
];
const TONES = [
  'Professional',
  'Friendly',
  'Casual',
  'Humorous',
  'Urgent & Sales-driven',
  'Luxurious & Elegant',
];

export const AiContentPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [products, setProducts] = useState([]);

  // Form options
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Friendly');
  const [goal, setGoal] = useState('Sales Conversion');
  const [language, setLanguage] = useState('Bangla');

  // Generation state
  const [loading, setLoading] = useState(false);
  const [activeContent, setActiveContent] = useState(null);
  const [editableCaption, setEditableCaption] = useState('');
  const [editableHashtags, setEditableHashtags] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedStatus, setSavedStatus] = useState('');

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        const bRes = await businessService.getAll();
        const bList = bRes.data || [];
        setBusinesses(bList);
        if (bList.length > 0) {
          const firstBId = bList[0]._id || bList[0].id;
          setSelectedBusinessId(firstBId);
          setTone(bList[0].brandTone || 'Friendly');
          setLanguage(bList[0].preferredLanguage || 'Bangla');
        }
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, []);

  // Fetch products when selected business changes
  useEffect(() => {
    if (!selectedBusinessId) return;
    const fetchProds = async () => {
      try {
        const pRes = await productService.getByBusiness(selectedBusinessId);
        const pList = pRes.data || [];
        setProducts(pList);
        if (pList.length > 0) {
          setSelectedProductId(pList[0]._id || pList[0].id);
        } else {
          setSelectedProductId('');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProds();
  }, [selectedBusinessId]);

  const handleGenerate = async () => {
    if (!selectedBusinessId || !selectedProductId) {
      alert('Please select both a business and a product.');
      return;
    }

    setLoading(true);
    setSavedStatus('');
    try {
      const res = await contentService.generate({
        businessId: selectedBusinessId,
        productId: selectedProductId,
        platform,
        tone,
        marketingGoal: goal,
        language,
      });

      const content = res.data;
      setActiveContent(content);
      setEditableCaption(content.generatedCaption || '');
      setEditableHashtags(content.hashtags ? content.hashtags.join(' ') : '');
    } catch (err) {
      alert(err.message || 'Content generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!activeContent) return;
    setLoading(true);
    try {
      const res = await contentService.regenerate(activeContent._id || activeContent.id, {
        platform,
        tone,
        marketingGoal: goal,
        language,
      });
      const updated = res.data;
      setActiveContent(updated);
      setEditableCaption(updated.generatedCaption || '');
      setEditableHashtags(updated.hashtags ? updated.hashtags.join(' ') : '');
    } catch (err) {
      alert(err.message || 'Regeneration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!activeContent) return;
    try {
      const hashtagsArr = editableHashtags.split(' ').map((t) => t.trim()).filter(Boolean);
      await contentService.update(activeContent._id || activeContent.id, {
        generatedCaption: editableCaption,
        hashtags: hashtagsArr,
        status: 'Draft',
      });
      setSavedStatus('Draft saved successfully!');
      setTimeout(() => setSavedStatus(''), 3000);
    } catch (err) {
      alert('Failed to save draft');
    }
  };

  const handleCopy = () => {
    const fullText = `${editableCaption}\n\n${editableHashtags}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedBusiness = businesses.find((b) => (b._id || b.id) === selectedBusinessId);
  const selectedProduct = products.find((p) => (p._id || p.id) === selectedProductId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          AI Marketing Content Studio
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Module 2 (M2-FR1): Autonomous caption generation anchored strictly to real product specifications and brand tones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Marketing Parameters
            </h3>
          </div>

          {/* 1. Select Business */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" /> 1. Select Business Profile
            </label>
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
            >
              {businesses.map((b) => (
                <option key={b._id || b.id} value={b._id || b.id}>
                  {b.businessName} ({b.category})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Select Product */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-indigo-600" /> 2. Select Product
            </label>
            {products.length > 0 ? (
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
              >
                {products.map((p) => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.title} — {p.price} {p.currency}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">
                No products found for this business. Please add a product in the "Products Foundation" tab first.
              </div>
            )}
          </div>

          {/* 3. Social Media Platform */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-indigo-600" /> 3. Target Social Platform
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map((plat) => (
                <button
                  type="button"
                  key={plat}
                  onClick={() => setPlatform(plat)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                    platform === plat
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Brand Tone & Goal */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Content Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 font-medium"
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Marketing Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 font-medium"
              >
                {GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Language */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-indigo-600" /> Output Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('Bangla')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                  language === 'Bangla'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                বাংলা (Bangla)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('English')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                  language === 'English'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Trigger Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !selectedProductId}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse" />
            {loading ? 'Synthesizing with Gemini...' : 'Generate High-Converting Post'}
          </button>
        </div>

        {/* Right Column: Interactive Live Post Mockup & In-Place Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeContent ? (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-600" /> Live {platform} Post Mockup
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRegenerate}
                    disabled={loading}
                    className="p-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>

                  <button
                    onClick={handleCopy}
                    className="p-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>

                  <button
                    onClick={handleSaveDraft}
                    className="p-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Draft
                  </button>
                </div>
              </div>

              {savedStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  {savedStatus}
                </div>
              )}

              {/* Social Media Card Mockup */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden max-w-lg mx-auto">
                {/* Mock Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold flex items-center justify-center text-sm">
                      {selectedBusiness?.businessName.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-none">
                        {selectedBusiness?.businessName || 'Business Profile'}
                      </h4>
                      <span className="text-[11px] text-slate-400">Sponsored • Just now</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {platform}
                  </span>
                </div>

                {/* In-Place Caption Editor */}
                <div className="p-4 space-y-3">
                  <div className="relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <Edit3 className="w-3 h-3 text-indigo-500" /> Editable Caption (Click to tweak)
                    </label>
                    <textarea
                      rows={7}
                      value={editableCaption}
                      onChange={(e) => setEditableCaption(e.target.value)}
                      className="w-full text-xs text-slate-800 leading-relaxed p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-sans resize-y"
                    />
                  </div>

                  {/* Hashtags editor */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Hashtags
                    </label>
                    <input
                      type="text"
                      value={editableHashtags}
                      onChange={(e) => setEditableHashtags(e.target.value)}
                      className="w-full text-xs text-indigo-600 font-medium p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Simulated Product Banner */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {selectedProduct?.title}
                      </span>
                      <span className="text-[11px] font-black text-indigo-600">
                        {selectedProduct?.price} {selectedProduct?.currency}
                      </span>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-bold">
                      {activeContent.callToAction || 'Shop Now'}
                    </button>
                  </div>
                </div>

                {/* Mock Engagement Footer */}
                <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-rose-500" /> Like
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" /> Comment
                    </span>
                    <span className="flex items-center gap-1">
                      <Share className="w-4 h-4" /> Share
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">
                    Version {activeContent.version || 1}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">AI Generator Ready</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
                Select your business profile, pick an authentic product, choose your preferred tone and platform, and click "Generate".
              </p>
              <div className="flex gap-2">
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                  Google Gemini API
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                  Bangla & English
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                  Anti-Hallucination
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
