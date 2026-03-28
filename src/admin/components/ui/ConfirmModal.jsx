import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'danger',
  onConfirm,
  onClose,
  loading = false,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            aria-label="Fermer"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/30"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6 pt-8">
              <div
                className={cn(
                  'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full',
                  variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-[#1A3A5C]/10 text-[#1A3A5C]'
                )}
              >
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-center text-lg font-bold text-[#1A3A5C]">{title}</h3>
              {message && (
                <p className="mt-2 text-center text-sm text-slate-600 leading-relaxed">{message}</p>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={onConfirm}
                  className={cn(
                    'flex-1 rounded-xl py-2.5 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-50',
                    variant === 'danger'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-[#1A3A5C] hover:bg-[#152d46]'
                  )}
                >
                  {loading ? '…' : confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
