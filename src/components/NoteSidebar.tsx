'use client';

import { useState, useEffect, type RefObject } from 'react';
import { type Note, getAllNotes, searchNotes, deleteNote, togglePin, duplicateNote } from '@/lib/db';
import NoteItem from './NoteItem';
import SearchBar from './SearchBar';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';

type SortOption = 'updated-desc' | 'updated-asc' | 'created-desc' | 'created-asc' | 'title-asc' | 'title-desc';

interface NoteSidebarProps {
  selectedNoteId: number | null;
  onSelectNote: (id: number) => void;
  onNewNote: () => void;
  refreshTrigger?: number;
  searchInputRef?: RefObject<HTMLInputElement | null>;
}

function sortNotes(notes: Note[], sortBy: SortOption): Note[] {
  const sorted = [...notes];
  
  switch (sortBy) {
    case 'updated-desc':
      return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    case 'updated-asc':
      return sorted.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    case 'created-desc':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'created-asc':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
}

export default function NoteSidebar({ selectedNoteId, onSelectNote, onNewNote, refreshTrigger, searchInputRef }: NoteSidebarProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated-desc');
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    loadNotes();
  }, [refreshTrigger]);

  useEffect(() => {
    if (searchQuery) {
      searchNotes(searchQuery).then((results) => {
        setNotes(sortNotes(results, sortBy));
      });
    } else {
      loadNotes();
    }
  }, [searchQuery, sortBy]);

  async function loadNotes() {
    setIsLoading(true);
    const allNotes = await getAllNotes();
    setNotes(sortNotes(allNotes, sortBy));
    setIsLoading(false);
  }

  async function handleDelete(id: number) {
    const confirmed = await confirm({
      title: 'Delete Note',
      message: 'Are you sure you want to delete this note? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger',
    });
    
    if (confirmed) {
      await deleteNote(id);
      if (selectedNoteId === id) {
        onSelectNote(0);
      }
      loadNotes();
      addToast('Note deleted', 'success');
    }
  }

  async function handleTogglePin(id: number) {
    await togglePin(id);
    loadNotes();
    addToast('Note pinned', 'success');
  }

  async function handleDuplicate(id: number) {
    const newId = await duplicateNote(id);
    if (newId) {
      loadNotes();
      onSelectNote(newId);
      addToast('Note duplicated', 'success');
    }
  }

  // Separate pinned and unpinned notes
  const pinnedNotes = notes.filter((n) => n.pinned);
  const unpinnedNotes = notes.filter((n) => !n.pinned);

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'updated-desc': return 'Last modified';
      case 'updated-asc': return 'Oldest modified';
      case 'created-desc': return 'Newest created';
      case 'created-asc': return 'Oldest created';
      case 'title-asc': return 'Title A-Z';
      case 'title-desc': return 'Title Z-A';
    }
  };

  return (
    <aside className="w-64 h-full bg-[#12121A] border-r border-[#1E1E2A] flex flex-col">
      <div className="p-4 border-b border-[#1E1E2A]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-[#EFEFE6]">Kurosumi</h1>
          <button
            onClick={onNewNote}
            className="p-2 rounded-lg bg-[#5542FF] hover:bg-[#7B6FFF] text-white transition-colors"
            title="New note (Ctrl+N)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        <SearchBar ref={searchInputRef} value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Sort dropdown */}
      {notes.length > 0 && (
        <div className="px-4 py-2 border-b border-[#1E1E2A]">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full text-xs bg-[#1A1A1E] text-[#9B9B9B] border border-[#1E1E2A] rounded px-2 py-1.5 focus:outline-none focus:border-[#5542FF]"
          >
            <option value="updated-desc">Last modified</option>
            <option value="updated-asc">Oldest modified</option>
            <option value="created-desc">Newest created</option>
            <option value="created-asc">Oldest created</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="text-center text-[#9B9B9B] py-8">Loading...</div>
        ) : notes.length === 0 ? (
          <div className="text-center text-[#9B9B9B] py-8">
            <p className="mb-2">No notes yet</p>
            <button onClick={onNewNote} className="text-[#5542FF] hover:underline">
              Create your first note
            </button>
          </div>
        ) : (
          <>
            {pinnedNotes.length > 0 && (
              <div className="mb-4">
                <div className="px-2 py-1 text-xs font-medium text-[#9B9B9B] uppercase">Pinned</div>
                {pinnedNotes.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    isSelected={note.id === selectedNoteId}
                    onSelect={() => note.id && onSelectNote(note.id)}
                    onDelete={() => note.id && handleDelete(note.id)}
                    onTogglePin={() => note.id && handleTogglePin(note.id)}
                    onDuplicate={() => note.id && handleDuplicate(note.id)}
                  />
                ))}
              </div>
            )}
            {unpinnedNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <div className="px-2 py-1 text-xs font-medium text-[#9B9B9B] uppercase">Notes</div>
                )}
                {unpinnedNotes.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    isSelected={note.id === selectedNoteId}
                    onSelect={() => note.id && onSelectNote(note.id)}
                    onDelete={() => note.id && handleDelete(note.id)}
                    onTogglePin={() => note.id && handleTogglePin(note.id)}
                    onDuplicate={() => note.id && handleDuplicate(note.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-3 border-t border-[#1E1E2A] text-xs text-[#9B9B9B] text-center">
        {notes.length} note{notes.length !== 1 ? 's' : ''} • Stored locally
      </div>
    </aside>
  );
}
