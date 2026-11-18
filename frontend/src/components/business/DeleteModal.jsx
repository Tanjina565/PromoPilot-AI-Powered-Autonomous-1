import React from 'react';
import { Modal } from '../common/Modal';
import { AlertTriangle } from 'lucide-react';

export const DeleteModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <AlertTriangle className="w-6 h-6 flex-shrink-0 text-red-600" />
          <div>
            <h5 className="font-bold text-sm">Warning: Irreversible Action</h5>
            <p className="text-xs text-red-600 mt-0.5">
              {message || 'Are you sure you want to delete this resource? All associated marketing content will be removed.'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-md shadow-red-100 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
