import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#D3D8E5]/70 backdrop-blur-[2px] transition-all duration-200">
      <div className={`w-full bg-paper-surface rounded-[10px] shadow-paper border border-paper-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${maxWidth}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/40">
          <h3 className="text-[16px] font-bold text-paper-text">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-paper-muted hover:text-paper-text hover:bg-paper-raised shadow-sm active:shadow-paper-inset transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end space-x-2 px-6 py-4 bg-paper-raised/30 border-t border-white/40">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
