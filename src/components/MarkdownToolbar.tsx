'use client';

interface MarkdownToolbarProps {
  onInsert: (before: string, after?: string) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export default function MarkdownToolbar({ onInsert, canUndo, canRedo, onUndo, onRedo }: MarkdownToolbarProps) {
  const buttons = [
    {
      label: 'Undo (Ctrl+Z)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6.69 3L3 13" />
        </svg>
      ),
      action: onUndo || (() => {}),
      disabled: !canUndo,
    },
    {
      label: 'Redo (Ctrl+Shift+Z)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 019-9 9 9 0 016.69 3L21 13" />
        </svg>
      ),
      action: onRedo || (() => {}),
      disabled: !canRedo,
    },
    {
      label: 'Divider',
      icon: <div className="w-px h-4 bg-[#1E1E2A]" />,
      action: () => {},
      disabled: false,
      isDivider: true,
    },
    {
      label: 'Bold',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
          <path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
        </svg>
      ),
      action: () => onInsert('**', '**'),
    },
    {
      label: 'Italic',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="4" x2="10" y2="4" />
          <line x1="14" y1="20" x2="5" y2="20" />
          <line x1="15" y1="4" x2="9" y2="20" />
        </svg>
      ),
      action: () => onInsert('*', '*'),
    },
    {
      label: 'Strikethrough',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 4H9a3 3 0 00-3 3v0a3 3 0 003 3h6a3 3 0 013 3v0a3 3 0 01-3 3H8" />
          <line x1="4" y1="12" x2="20" y2="12" />
        </svg>
      ),
      action: () => onInsert('~~', '~~'),
    },
    {
      label: 'Code',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16,18 22,12 16,6" />
          <polyline points="8,6 2,12 8,18" />
        </svg>
      ),
      action: () => onInsert('`', '`'),
    },
    {
      label: 'Link',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      ),
      action: () => onInsert('[', '](url)'),
    },
    {
      label: 'Image',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21,15 16,10 5,21" />
        </svg>
      ),
      action: () => onInsert('![alt](', ')'),
    },
    {
      label: 'Heading 1',
      icon: <span className="font-bold text-xs">H1</span>,
      action: () => onInsert('# '),
    },
    {
      label: 'Heading 2',
      icon: <span className="font-bold text-xs">H2</span>,
      action: () => onInsert('## '),
    },
    {
      label: 'Heading 3',
      icon: <span className="font-bold text-xs">H3</span>,
      action: () => onInsert('### '),
    },
    {
      label: 'Quote',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
        </svg>
      ),
      action: () => onInsert('> '),
    },
    {
      label: 'List',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
      action: () => onInsert('- '),
    },
    {
      label: 'Task List',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="6" height="6" rx="1" />
          <path d="M5 8l1.5 1.5L9 6" />
          <path d="M21 12H9" />
          <rect x="3" y="14" width="6" height="6" rx="1" />
          <path d="M21 17H9" />
        </svg>
      ),
      action: () => onInsert('- [ ] '),
    },
    {
      label: 'Horizontal Rule',
      icon: <span className="text-xs">---</span>,
      action: () => onInsert('\n---\n'),
    },
    {
      label: 'Code Block',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <polyline points="9,8 5,12 9,16" />
          <polyline points="15,8 19,12 15,16" />
        </svg>
      ),
      action: () => onInsert('\n```\n', '\n```\n'),
    },
    {
      label: 'Table',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      ),
      action: () => onInsert('\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n'),
    },
  ];

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-[#12121A] border-b border-[#1E1E2A] overflow-x-auto">
      {buttons.map((btn, i) => {
        if ('isDivider' in btn && btn.isDivider) {
          return <div key={i} className="w-px h-4 bg-[#1E1E2A] mx-1" />;
        }
        return (
          <button
            key={i}
            onClick={btn.action}
            disabled={'disabled' in btn ? btn.disabled : false}
            className={`p-1.5 rounded transition-colors flex-shrink-0 ${
              'disabled' in btn && btn.disabled
                ? 'text-[#4A4A5A] cursor-not-allowed'
                : 'hover:bg-[#2A2A3E] text-[#9B9B9B] hover:text-[#EFEFE6]'
            }`}
            title={btn.label}
          >
            {btn.icon}
          </button>
        );
      })}
    </div>
  );
}
