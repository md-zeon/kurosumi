'use client';

import { type Note } from '@/lib/db';

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

export default function NoteItem({ note, isSelected, onSelect, onDelete, onTogglePin }: NoteItemProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getPreview = (content: string) => {
    // Remove markdown syntax for preview
    return content
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\n/g, ' ')
      .trim()
      .slice(0, 100);
  };

  return (
    <div
      onClick={onSelect}
      className={`group p-3 rounded-lg cursor-pointer mb-1 transition-all ${
        isSelected
          ? 'bg-[#1A1A1E] border-l-2 border-[#5542FF]'
          : 'hover:bg-[#1A1A1E] border-l-2 border-transparent'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {note.pinned && (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#5542FF] flex-shrink-0">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            )}
            <h3 className="font-medium text-[#EFEFE6] truncate">{note.title}</h3>
          </div>
          <p className="text-sm text-[#9B9B9B] mt-1 truncate">
            {note.content ? getPreview(note.content) : 'Empty note'}
          </p>
          <p className="text-xs text-[#9B9B9B] mt-1">{formatDate(note.updatedAt)}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className="p-1 rounded hover:bg-[#2A2A3E] text-[#9B9B9B] hover:text-[#EFEFE6]"
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={note.pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded hover:bg-[#2A2A3E] text-[#9B9B9B] hover:text-red-400"
            title="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
