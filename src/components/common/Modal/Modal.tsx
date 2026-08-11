import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
}) => {
  // Prevent scrolling when modal is open
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

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
      <div 
        className={clsx("bg-cards rounded-2xl shadow-lg w-full max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden animate-slideIn", className)} 
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 id="modal-title" className="m-0 text-xl font-semibold text-text-main">{title}</h2>
          <button className="bg-transparent border-none text-text-muted cursor-pointer p-1 rounded-md flex items-center justify-center transition-colors hover:bg-background hover:text-text-main" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="px-6 pb-6 overflow-y-auto flex-1">
          {children}
        </div>

        {footer && (
          <div className="p-4 px-6 border-t border-border bg-background flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
