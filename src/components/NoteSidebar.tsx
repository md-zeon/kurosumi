'use client';

import { useState, useEffect, type RefObject } from 'react';
import { type Note, getAllNotes, searchNotes, deleteNote, togglePin } from '@/lib/db';
import NoteItem from './NoteItem';
import SearchBar from './SearchBar';

interface NoteSidebarProps {
  selectedNoteId: number | null;
  onSelectNote: (id: number) => void;
  onNewNote: () => void;
  refreshTrigger?: number;
  searchInputRef?: RefObject<HTMLInputElement | null>;
}

export default function NoteSidebar({ selectedNoteId, onSelectNote, onNewNote, refreshTrigger, searchInputRef }: NoteSidebarProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, [refreshTrigger]);

  useEffect(() => {
    if (searchQuery) {
      searchNotes(searchQuery).then(setNotes);
    } else {
      loadNotes();
    }
  }, [searchQuery]);

  async function loadNotes() {
    setIsLoading(true);
    const allNotes = await getAllNotes();
    setNotes(allNotes);
    setIsLoading(false);
  }

  async function handleDelete(id: number) {
    if (confirm('Delete this note?')) {
      await deleteNote(id);
      loadNotes();
    }
  }

  async function handleTogglePin(id: number) {
    await togglePin(id);
    loadNotes();
  }

  // Separate pinned and unpinned notes
  const pinnedNotes = notes.filter((n) => n.pinned);
  const unpinnedNotes = notes.filter((n) => !n.pinned);

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
