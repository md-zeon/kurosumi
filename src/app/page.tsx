'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { type Note, createNote, updateNote, getNote, getAllNotes } from '@/lib/db';
import NoteSidebar from '@/components/NoteSidebar';
import NoteHeader from '@/components/NoteHeader';
import MarkdownEditor from '@/components/MarkdownEditor';
import MarkdownPreview from '@/components/MarkdownPreview';
import ShortcutsModal from '@/components/ShortcutsModal';
import { useToast } from '@/components/Toast';

export default function Home() {
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'split' | 'preview'>('split');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-switch to editor view on mobile
  useEffect(() => {
    if (isMobile && viewMode === 'split') {
      setViewMode('editor');
    }
  }, [isMobile, viewMode]);

  // Load note when selected
  useEffect(() => {
    if (selectedNoteId) {
      getNote(selectedNoteId).then((note) => {
        if (note) {
          setCurrentNote(note);
          setLastSaved(note.updatedAt);
          // Close sidebar on mobile after selection
          if (isMobile) {
            setSidebarOpen(false);
          }
        }
      });
    } else {
      setCurrentNote(null);
    }
  }, [selectedNoteId, isMobile]);

  // Create new note
  const handleNewNote = useCallback(async () => {
    const id = await createNote('Untitled', '');
    setSelectedNoteId(id);
    setRefreshTrigger((prev) => prev + 1);
    addToast('Note created', 'success');
  }, [addToast]);

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
    addToast('Note saved', 'success');
  }, [currentNote, addToast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl+N: New note
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewNote();
      }

      // Ctrl+Shift+F: Focus search
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        if (isMobile) {
          setSidebarOpen(true);
        }
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }

      // F11: Toggle fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }

      // ?: Show shortcuts
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(true);
      }

      // Escape: Close modals, sidebar, or exit fullscreen
      if (e.key === 'Escape') {
        if (showShortcuts) {
          setShowShortcuts(false);
        } else if (sidebarOpen) {
          setSidebarOpen(false);
        } else if (isFullscreen) {
          setIsFullscreen(false);
        }
      }

      // 1, 2, 3: View modes (only on desktop)
      if (!isMobile) {
        if (e.key === '1') setViewMode('editor');
        if (e.key === '2') setViewMode('split');
        if (e.key === '3') setViewMode('preview');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewNote, isFullscreen, showShortcuts, sidebarOpen, isMobile]);

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

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Word count and character count
  const wordCount = useMemo(() => {
    if (!currentNote?.content) return 0;
    return currentNote.content
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
  }, [currentNote?.content]);

  const charCount = useMemo(() => {
    if (!currentNote?.content) return 0;
    return currentNote.content.length;
  }, [currentNote?.content]);

  const lineCount = useMemo(() => {
    if (!currentNote?.content) return 0;
    return currentNote.content.split('\n').length;
  }, [currentNote?.content]);

  return (
    <div className="flex h-screen bg-[#0A090F] overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300' : 'relative'}
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
      `}>
        <NoteSidebar
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onNewNote={handleNewNote}
          refreshTrigger={refreshTrigger}
          searchInputRef={searchInputRef}
          isMobile={isMobile}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

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
          isMobile={isMobile}
          onToggleSidebar={toggleSidebar}
        />

        {/* Editor/Preview area */}
        <div className="flex-1 flex overflow-hidden">
          {!currentNote ? (
            <div className="flex-1 flex items-center justify-center text-[#9B9B9B]">
              <div className="text-center max-w-md mx-auto px-4">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#12121A] border border-[#1E1E2A] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#5542FF]">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-[#EFEFE6] mb-2">No note selected</h2>
                <p className="text-[#9B9B9B] mb-6">
                  Select a note from the sidebar or create a new one to get started
                </p>
                <button
                  onClick={handleNewNote}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#5542FF] hover:bg-[#7B6FFF] text-white rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  New Note
                </button>
                <p className="text-xs text-[#9B9B9B] mt-4 hidden md:block">
                  Press <kbd className="px-1.5 py-0.5 font-mono bg-[#12121A] border border-[#1E1E2A] rounded">Ctrl+N</kbd> to create a note
                </p>
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
                <div className="w-px bg-[#1E1E2A] hidden md:block" />
              )}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <MarkdownPreview content={currentNote.content} />
              )}
            </>
          )}
        </div>

        {/* Status bar */}
        {currentNote && (
          <div className="h-6 border-t border-[#1E1E2A] bg-[#12121A] flex items-center justify-between px-2 md:px-4 text-xs text-[#9B9B9B]">
            <div className="flex items-center gap-2 md:gap-4">
              <span className="hidden sm:inline">{lineCount} lines</span>
              <span>{wordCount} words</span>
              <span className="hidden sm:inline">{charCount} chars</span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => setShowShortcuts(true)}
                className="hover:text-[#EFEFE6] transition-colors hidden md:block"
                title="Keyboard shortcuts"
              >
                <kbd className="px-1 py-0.5 font-mono bg-[#1A1A1E] border border-[#1E1E2A] rounded">?</kbd>
              </button>
              <span className="hidden sm:inline">Markdown</span>
              <span>GFM</span>
            </div>
          </div>
        )}
      </div>

      {/* Shortcuts modal */}
      <ShortcutsModal 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </div>
  );
}
