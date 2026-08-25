'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { type Note, createNote, updateNote, getNote, getAllNotes } from '@/lib/db';
import NoteSidebar from '@/components/NoteSidebar';
import NoteHeader from '@/components/NoteHeader';
import MarkdownEditor from '@/components/MarkdownEditor';
import MarkdownPreview from '@/components/MarkdownPreview';

export default function Home() {
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'split' | 'preview'>('split');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load note when selected
  useEffect(() => {
    if (selectedNoteId) {
      getNote(selectedNoteId).then((note) => {
        if (note) {
          setCurrentNote(note);
          setLastSaved(note.updatedAt);
        }
      });
    } else {
      setCurrentNote(null);
    }
  }, [selectedNoteId]);

  // Create new note
  const handleNewNote = useCallback(async () => {
    const id = await createNote('Untitled', '');
    setSelectedNoteId(id);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Handle content change with debounced save
  const handleContentChange = useCallback(
    (content: string) => {
      if (!currentNote || !currentNote.id) return;

      setCurrentNote((prev) => (prev ? { ...prev, content } : null));

      // Clear existing timeout
      if (saveTimeout) clearTimeout(saveTimeout);

      // Set new timeout for auto-save
      const timeout = setTimeout(async () => {
        await updateNote(currentNote.id!, { content });
        setLastSaved(new Date());
        setRefreshTrigger((prev) => prev + 1);
      }, 500);

      setSaveTimeout(timeout);
    },
    [currentNote, saveTimeout]
  );

  // Handle title change with debounced save
  const handleTitleChange = useCallback(
    (title: string) => {
      if (!currentNote || !currentNote.id) return;

      setCurrentNote((prev) => (prev ? { ...prev, title } : null));

      // Clear existing timeout
      if (saveTimeout) clearTimeout(saveTimeout);

      // Set new timeout for auto-save
      const timeout = setTimeout(async () => {
        await updateNote(currentNote.id!, { title });
        setLastSaved(new Date());
        setRefreshTrigger((prev) => prev + 1);
      }, 500);

      setSaveTimeout(timeout);
    },
    [currentNote, saveTimeout]
  );

  // Manual save
  const handleSave = useCallback(async () => {
    if (!currentNote || !currentNote.id) return;
    await updateNote(currentNote.id, {
      title: currentNote.title,
      content: currentNote.content,
    });
    setLastSaved(new Date());
    setRefreshTrigger((prev) => prev + 1);
  }, [currentNote]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N: New note
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewNote();
      }

      // Ctrl+Shift+F: Focus search
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // F11: Toggle fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }

      // Escape: Exit fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewNote, isFullscreen]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Word count
  const wordCount = useMemo(() => {
    if (!currentNote?.content) return 0;
    return currentNote.content
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
  }, [currentNote?.content]);

  return (
    <div className="flex h-screen bg-[#0A090F] overflow-hidden">
      {/* Sidebar */}
      <NoteSidebar
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        onNewNote={handleNewNote}
        refreshTrigger={refreshTrigger}
        searchInputRef={searchInputRef}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <NoteHeader
          note={currentNote}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onTitleChange={handleTitleChange}
          onSave={handleSave}
          onNoteCreated={() => setRefreshTrigger((prev) => prev + 1)}
          wordCount={wordCount}
          lastSaved={lastSaved}
        />

        {/* Editor/Preview area */}
        <div className="flex-1 flex overflow-hidden">
          {!currentNote ? (
            <div className="flex-1 flex items-center justify-center text-[#9B9B9B]">
              <div className="text-center">
                <p className="text-lg mb-2">No note selected</p>
                <p className="text-sm">Select a note from the sidebar or create a new one</p>
              </div>
            </div>
          ) : (
            <>
              {(viewMode === 'editor' || viewMode === 'split') && (
                <MarkdownEditor
                  content={currentNote.content}
                  onChange={handleContentChange}
                  onSave={handleSave}
                />
              )}
              {viewMode === 'split' && (
                <div className="w-px bg-[#1E1E2A]" />
              )}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <MarkdownPreview content={currentNote.content} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
