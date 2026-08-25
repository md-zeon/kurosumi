'use client';

import { useState, useRef, useEffect } from 'react';
import { type Note, updateNote } from '@/lib/db';

interface NoteHeaderProps {
  note: Note | null;
  viewMode: 'editor' | 'split' | 'preview';
  onViewModeChange: (mode: 'editor' | 'split' | 'preview') => void;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  wordCount: number;
  lastSaved: Date | null;
}

export default function NoteHeader({
  note,
  viewMode,
  onViewModeChange,
  onTitleChange,
  onSave,
  wordCount,
  lastSaved,
}: NoteHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const formatLastSaved = (date: Date | null) => {
    if (!date) return 'Not saved';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 10) return 'Saved just now';
    if (seconds < 60) return `Saved ${seconds}s ago`;
    if (minutes < 60) return `Saved ${minutes}m ago`;
    if (hours < 24) return `Saved ${hours}h ago`;
    return `Saved ${date.toLocaleDateString()}`;
  };

  const handleExportMd = () => {
    if (!note) return;
    const blob = new Blob([note.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title || 'untitled'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    if (!note) return;
    const data = JSON.stringify(note, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title || 'untitled'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-12 border-b border-[#1E1E2A] bg-[#12121A] flex items-center justify-between px-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {note ? (
          isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={note.title}
              onChange={(e) => onTitleChange(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditingTitle(false);
              }}
              className="bg-transparent text-[#EFEFE6] font-medium focus:outline-none border-b border-[#5542FF]"
            />
          ) : (
            <h2
              onClick={() => setIsEditingTitle(true)}
              className="font-medium text-[#EFEFE6] truncate cursor-pointer hover:text-[#5542FF] transition-colors"
              title="Click to edit title"
            >
              {note.title || 'Untitled'}
            </h2>
          )
        ) : (
          <span className="text-[#9B9B9B]">No note selected</span>
        )}
      </div>

      {note && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9B9B9B] mr-2">
            {wordCount} words • {formatLastSaved(lastSaved)}
          </span>

          {/* View mode toggle */}
          <div className="flex items-center bg-[#1A1A1E] rounded-lg p-1 gap-1">
            <button
              onClick={() => onViewModeChange('editor')}
              className={`p-1.5 rounded ${
                viewMode === 'editor' ? 'bg-[#5542FF] text-white' : 'text-[#9B9B9B] hover:text-[#EFEFE6]'
              }`}
              title="Editor only"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 10H3M21 6H3M21 14H3M17 18H3" />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('split')}
              className={`p-1.5 rounded ${
                viewMode === 'split' ? 'bg-[#5542FF] text-white' : 'text-[#9B9B9B] hover:text-[#EFEFE6]'
              }`}
              title="Split view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M12 3v18" />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('preview')}
              className={`p-1.5 rounded ${
                viewMode === 'preview' ? 'bg-[#5542FF] text-white' : 'text-[#9B9B9B] hover:text-[#EFEFE6]'
              }`}
              title="Preview only"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>

          {/* Export dropdown */}
          <div className="relative group">
            <button className="p-1.5 rounded text-[#9B9B9B] hover:text-[#EFEFE6] hover:bg-[#1A1A1E]">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            </button>
            <div className="absolute right-0 top-full mt-1 w-36 bg-[#1A1A1E] border border-[#1E1E2A] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button
                onClick={handleExportMd}
                className="w-full px-3 py-2 text-left text-sm text-[#EFEFE6] hover:bg-[#2A2A3E] rounded-t-lg"
              >
                Export as .md
              </button>
              <button
                onClick={handleExportJson}
                className="w-full px-3 py-2 text-left text-sm text-[#EFEFE6] hover:bg-[#2A2A3E] rounded-b-lg"
              >
                Export as .json
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
