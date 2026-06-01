import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = 'max-h-[85vh]'
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className={`bottom-sheet-overlay absolute inset-0 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sheet Content Drawer */}
      <div
        className={`bottom-sheet-content relative w-full ${maxHeight} bg-surface border-t border-surface-outline rounded-t-m3-xl shadow-elevation-3 flex flex-col z-10 transform transition-transform duration-300 ease-out max-w-[480px] ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag Handle & Close Button Header */}
        <div className="flex flex-col items-center pt-3 pb-2 border-b border-surface-outline/50 shrink-0">
          <div className="w-12 h-1 bg-surface-outline rounded-full mb-3" />
          
          <div className="w-full px-4 flex items-center justify-between">
            {title ? (
              <h3 className="text-lg font-bold text-textColor-primary">{title}</h3>
            ) : <div />}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-surface-variant text-textColor-secondary hover:text-textColor-primary hover:bg-surface-outline/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar pb-8">
          {children}
        </div>
      </div>
    </div>
  );
};
