'use client';

import { useEffect } from 'react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { category: 'General', items: [
    { keys: ['Ctrl', 'N'], description: 'New note' },
    { keys: ['Ctrl', 'S'], description: 'Save note' },
    { keys: ['F11'], description: 'Toggle fullscreen' },
    { keys: ['?'], description: 'Show shortcuts' },
  ]},
  { category: 'Navigation', items: [
    { keys: ['Ctrl', 'Shift', 'F'], description: 'Focus search' },
    { keys: ['↑', '↓'], description: 'Navigate notes' },
    { keys: ['Enter'], description: 'Open selected note' },
  ]},
  { category: 'Editor', items: [
    { keys: ['Tab'], description: 'Insert spaces' },
    { keys: ['Ctrl', 'B'], description: 'Bold' },
    { keys: ['Ctrl', 'I'], description: 'Italic' },
    { keys: ['Ctrl', 'K'], description: 'Insert link' },
  ]},
  { category: 'View', items: [
    { keys: ['1'], description: 'Editor only' },
    { keys: ['2'], description: 'Split view' },
    { keys: ['3'], description: 'Preview only' },
  ]},
];

export default function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#1A1A1E] border border-[#1E1E2A] rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1E1E2A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#5542FF]/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#5542FF]">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[#EFEFE6]">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#2A2A3E] text-[#9B9B9B] hover:text-[#EFEFE6] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((category) => (
            <div key={category.category} className="mb-6 last:mb-0">
              <h3 className="text-xs font-semibold text-[#9B9B9B] uppercase tracking-wider mb-3">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-[#EFEFE6]">{item.description}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key, j) => (
                        <span key={j}>
                          <kbd className="px-2 py-1 text-xs font-mono bg-[#12121A] border border-[#1E1E2A] rounded text-[#9B9B9B]">
                            {key}
                          </kbd>
                          {j < item.keys.length - 1 && (
                            <span className="text-[#9B9B9B] mx-1">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1E1E2A] bg-[#12121A]">
          <p className="text-xs text-[#9B9B9B] text-center">
            Press <kbd className="px-1.5 py-0.5 font-mono bg-[#1A1A1E] border border-[#1E1E2A] rounded">?</kbd> to toggle this dialog
          </p>
        </div>
      </div>
    </div>
  );
}
