import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  // Prevent body scrolling when dialog is open
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      {/* Backdrop overlay trigger click away */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div
        className={`relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card-bg p-6 shadow-2xl backdrop-blur-xl animate-scale-up z-10 ${className}`}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md text-text-muted hover:text-foreground hover:bg-border/30 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {title && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
          </div>
        )}

        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
};
