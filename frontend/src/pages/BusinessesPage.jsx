import React, { useState, useEffect } from 'react';
import { businessService } from '../services/businessService';
import { BusinessCard } from '../components/business/BusinessCard';
import { BusinessTable } from '../components/business/BusinessTable';
import { BusinessForm } from '../components/business/BusinessForm';
import { BusinessDetailsModal } from '../components/business/BusinessDetailsModal';
import { DeleteModal } from '../components/business/DeleteModal';
import { Modal } from '../components/common/Modal';
import {
  Building2,
  Plus,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  Layers,
  Share2,
} from 'lucide-react';

export const BusinessesPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [viewingBusiness, setViewingBusiness] = useState(null);
  const [deletingBusiness, setDeletingBusiness] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState('');

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const res = await businessService.getAll();
      setBusinesses(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleSaveBusiness = async (formData) => {
    setActionLoading(true);
    try {
      const businessId = editingBusiness?._id || editingBusiness?.id;

      if (editingBusiness) {
        await businessService.update(businessId, formData);
        showNotification('Business profile updated successfully!');
      } else {
        await businessService.create(formData);
        showNotification('New business profile created successfully!');
      }
      setIsFormOpen(false);
      setEditingBusiness(null);
      await fetchBusinesses();
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBusiness) return;
    setActionLoading(true);
    try {
      const businessId = deletingBusiness._id || deletingBusiness.id;
      await businessService.delete(businessId);
      showNotification('Business profile deleted successfully!');
      setDeletingBusiness(null);
      await fetchBusinesses();
    } catch (err) {
      alert(err.message || 'Deletion failed');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(
    (b) =>
      b.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          {notification}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Business Profile Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Module 1 (M1-FR2): Multi-tenant brand profiles, target audiences, brand tone, and connected social channels.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBusiness(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-100 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Business
        </button>
      </div>

      {/* Filter and View Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search businesses by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-400 font-medium">
            {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'}
          </span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-400'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Business Content Area */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading business profiles...</div>
      ) : filteredBusinesses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">No Business Profiles Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {searchTerm
              ? 'No businesses matched your search criteria.'
              : 'Create your first business profile to establish brand tone and start generating AI content.'}
          </p>
          <button
            onClick={() => {
              setEditingBusiness(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" /> Create Business Profile
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((b) => (
            <BusinessCard
              key={b._id || b.id}
              business={b}
              onEdit={(bus) => {
                setEditingBusiness(bus);
                setIsFormOpen(true);
              }}
              onDelete={(bus) => setDeletingBusiness(bus)}
              onView={(bus) => setViewingBusiness(bus)}
            />
          ))}
        </div>
      ) : (
        <BusinessTable
          businesses={filteredBusinesses}
          onEdit={(bus) => {
            setEditingBusiness(bus);
            setIsFormOpen(true);
          }}
          onDelete={(bus) => setDeletingBusiness(bus)}
          onView={(bus) => setViewingBusiness(bus)}
        />
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBusiness(null);
        }}
        title={editingBusiness ? 'Edit Business Profile' : 'Create Business Profile'}
      >
        <BusinessForm
          initialData={editingBusiness}
          onSubmit={handleSaveBusiness}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingBusiness(null);
          }}
          loading={actionLoading}
        />
      </Modal>

      {/* Details Modal */}
      <BusinessDetailsModal
        isOpen={!!viewingBusiness}
        onClose={() => setViewingBusiness(null)}
        business={viewingBusiness}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deletingBusiness}
        onClose={() => setDeletingBusiness(null)}
        onConfirm={handleDelete}
        title="Delete Business Profile"
        message={`Are you sure you want to permanently delete "${deletingBusiness?.businessName}"? This action cannot be undone.`}
        loading={actionLoading}
      />
    </div>
  );
};
