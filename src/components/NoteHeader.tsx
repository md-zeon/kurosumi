'use client';

import { useState, useRef, useEffect } from 'react';
import { type Note, updateNote, createNote, getAllNotes, db } from '@/lib/db';
import { renderMarkdown } from '@/lib/markdown';
import { useToast } from './Toast';

interface NoteHeaderProps {
  note: Note | null;
  viewMode: 'editor' | 'split' | 'preview';
  onViewModeChange: (mode: 'editor' | 'split' | 'preview') => void;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onNoteCreated?: () => void;
  wordCount: number;
  lastSaved: Date | null;
}

export default function NoteHeader({
  note,
  viewMode,
  onViewModeChange,
  onTitleChange,
  onSave,
  onNoteCreated,
  wordCount,
  lastSaved,
}: NoteHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

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
    setShowExportMenu(false);
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
    setShowExportMenu(false);
  };

  const handleExportHtml = () => {
    if (!note) return;
    const htmlContent = renderMarkdown(note.content);
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${note.title || 'Untitled'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; color: #333; }
    h1, h2, h3, h4, h5, h6 { margin-top: 1.5rem; margin-bottom: 0.5rem; }
    code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; font-family: 'Monaco', 'Menlo', monospace; font-size: 0.9em; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 5px; overflow-x: auto; }
    pre code { background: transparent; padding: 0; }
    blockquote { border-left: 4px solid #5542FF; margin: 0; padding-left: 1rem; color: #666; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
    th { background: #f4f4f4; }
    img { max-width: 100%; }
    a { color: #5542FF; }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title || 'untitled'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportPdf = async () => {
    if (!note) return;
    setIsExporting(true);
    
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const htmlContent = renderMarkdown(note.content);
      
      const container = document.createElement('div');
      container.innerHTML = `
        <h1 style="font-size: 24px; margin-bottom: 16px; color: #1a1a1a;">${note.title || 'Untitled'}</h1>
        <div style="font-size: 14px; line-height: 1.6; color: #333;">
          ${htmlContent}
        </div>
      `;
      
      // Add styles for PDF
      const style = document.createElement('style');
      style.textContent = `
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        h1, h2, h3, h4, h5, h6 { margin-top: 16px; margin-bottom: 8px; }
        p { margin-bottom: 12px; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
        pre { background: #f4f4f4; padding: 12px; border-radius: 4px; overflow-x: auto; }
        pre code { background: transparent; padding: 0; }
        blockquote { border-left: 4px solid #5542FF; margin: 0; padding-left: 12px; color: #666; }
        table { border-collapse: collapse; width: 100%; margin: 12px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f4f4f4; }
        img { max-width: 100%; }
        a { color: #5542FF; }
      `;
      
      container.prepend(style);
      
      const opt = {
        margin: 1,
        filename: `${note.title || 'untitled'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
      };
      
      await html2pdf().from(container).set(opt).save();
      addToast('Exported as PDF', 'success');
    } catch (error) {
      console.error('PDF export failed:', error);
      addToast('Failed to export PDF', 'error');
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleExportDocx = async () => {
    if (!note) return;
    setIsExporting(true);
    
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TableRow, TableCell, Table, WidthType, BorderStyle } = await import('docx');
      const { saveAs } = await import('file-saver');
      
      // Parse markdown content into docx paragraphs
      const lines = note.content.split('\n');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children: any[] = [];
      
      for (const line of lines) {
        // Headers
        if (line.startsWith('# ')) {
          children.push(new Paragraph({
            children: [new TextRun({ text: line.slice(2), bold: true, size: 32 })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }));
        } else if (line.startsWith('## ')) {
          children.push(new Paragraph({
            children: [new TextRun({ text: line.slice(3), bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }));
        } else if (line.startsWith('### ')) {
          children.push(new Paragraph({
            children: [new TextRun({ text: line.slice(4), bold: true, size: 24 })],
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 },
          }));
        } else if (line.startsWith('> ')) {
          // Blockquote
          children.push(new Paragraph({
            children: [new TextRun({ text: line.slice(2), italics: true, color: '666666' })],
            indent: { left: 720 },
            spacing: { after: 200 },
          }));
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
          // List item
          children.push(new Paragraph({
            children: [new TextRun({ text: line.slice(2) })],
            bullet: { level: 0 },
            spacing: { after: 100 },
          }));
        } else if (line.startsWith('---')) {
          // Horizontal rule
          children.push(new Paragraph({
            children: [new TextRun({ text: '' })],
            spacing: { after: 200 },
          }));
        } else if (line.trim() === '') {
          // Empty line
          children.push(new Paragraph({ children: [] }));
        } else {
          // Regular paragraph - handle inline formatting
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const textRuns: any[] = [];
          let remaining = line;
          
          // Simple inline formatting (bold, italic, code)
          while (remaining.length > 0) {
            const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
            const italicMatch = remaining.match(/\*(.*?)\*/);
            const codeMatch = remaining.match(/`(.*?)`/);
            
            if (boldMatch && boldMatch.index !== undefined) {
              if (boldMatch.index > 0) {
                textRuns.push(new TextRun({ text: remaining.slice(0, boldMatch.index) }));
              }
              textRuns.push(new TextRun({ text: boldMatch[1], bold: true }));
              remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
            } else if (italicMatch && italicMatch.index !== undefined) {
              if (italicMatch.index > 0) {
                textRuns.push(new TextRun({ text: remaining.slice(0, italicMatch.index) }));
              }
              textRuns.push(new TextRun({ text: italicMatch[1], italics: true }));
              remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
            } else if (codeMatch && codeMatch.index !== undefined) {
              if (codeMatch.index > 0) {
                textRuns.push(new TextRun({ text: remaining.slice(0, codeMatch.index) }));
              }
              textRuns.push(new TextRun({ text: codeMatch[1], font: 'Courier New' }));
              remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
            } else {
              textRuns.push(new TextRun({ text: remaining }));
              remaining = '';
            }
          }
          
          children.push(new Paragraph({
            children: textRuns,
            spacing: { after: 200 },
          }));
        }
      }
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: note.title || 'Untitled', bold: true, size: 36 })],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            ...children,
          ],
        }],
      });
      
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${note.title || 'untitled'}.docx`);
      addToast('Exported as DOCX', 'success');
    } catch (error) {
      console.error('DOCX export failed:', error);
      addToast('Failed to export DOCX', 'error');
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleImportMd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const content = await file.text();
    const title = file.name.replace(/\.md$/, '') || 'Imported Note';

    const id = await createNote(title, content);
    onNoteCreated?.();
    setShowExportMenu(false);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBackupExport = async () => {
    const allNotes = await getAllNotes();
    const data = JSON.stringify(allNotes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kurosumi-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleBackupImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const notes: Note[] = JSON.parse(content);
      
      if (!Array.isArray(notes)) {
        alert('Invalid backup file format');
        return;
      }

      let imported = 0;
      for (const note of notes) {
        // Skip if note with same title and content already exists
        const existing = await db.notes
          .where('title')
          .equals(note.title)
          .first();
        
        if (existing && existing.content === note.content) {
          continue;
        }

        await db.notes.add({
          title: note.title || 'Imported Note',
          content: note.content || '',
          createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
          updatedAt: note.updatedAt ? new Date(note.updatedAt) : new Date(),
          pinned: note.pinned || false,
        });
        imported++;
      }

      alert(`Imported ${imported} notes`);
      onNoteCreated?.();
      setShowExportMenu(false);
    } catch (error) {
      alert('Failed to import backup file');
    }

    // Reset input
    if (backupInputRef.current) {
      backupInputRef.current.value = '';
    }
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

          {/* Export/Import dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-1.5 rounded text-[#9B9B9B] hover:text-[#EFEFE6] hover:bg-[#1A1A1E]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            </button>
            
            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-[#1A1A1E] border border-[#1E1E2A] rounded-lg shadow-lg z-50">
                  <div className="p-1">
                    <div className="px-2 py-1 text-xs font-medium text-[#9B9B9B]">Export</div>
                    <button
                      onClick={handleExportMd}
                      className="w-full px-3 py-2 text-left text-sm text-[#EFEFE6] hover:bg-[#2A2A3E] rounded"
                    >
                      Export as .md
                    </button>
                    <button
                      onClick={handleExportJson}
                      className="w-full px-3 py-2 text-left text-sm text-[#EFEFE6] hover:bg-[#2A2A3E] rounded"
                    >
                      Export as .json
                    </button>
                    <button
                      onClick={handleExportHtml}
                      className="w-full px-3 py-2 text-left text-sm text-[#EFEFE6] hover:bg-[#2A2A3E] rounded"
                    >
                      Export as .html
                    </button>
                    <button
                      onClick={handleExportPdf}
                      disabled={isExporting}
                      className="w-full px-3 py-2 text-left text-sm text-[#EFEFE6] hover:bg-[#2A2A3E] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExporting ? 'Exporting...' : 'Export as .pdf'}
                    </button>
                    <button
                      onClick={handleExportDocx}
                      disabled={isExporting}
                      className="w-full px-3 py-2 text-left text-sm text-[#EFEFE6] hover:bg-[#2A2A3E] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExporting ? 'Exporting...' : 'Export as .docx'}
                    </button>
                    
                    <div className="border-t border-[#1E1E2A] my-1" />
                    <div className="px-2 py-1 text-xs font-medium text-[#9B9B9B]">Import</div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-3 py-2 text-left text-sm text-[#EFEFE6] hover:bg-[#2A2A3E] rounded"
                    >
                      Import .md file
                    </button>
                    
                    <div className="border-t border-[#1E1E2A] my-1" />
                    <div className="px-2 py-1 text-xs font-medium text-[#9B9B9B]">Backup</div>
                    <button
                      onClick={handleBackupExport}
                      className="w-full px-3 py-2 text-left text-sm text-[#EFEFE6] hover:bg-[#2A2A3E] rounded"
                    >
                      Export all notes
                    </button>
                    <button
                      onClick={() => backupInputRef.current?.click()}
                      className="w-full px-3 py-2 text-left text-sm text-[#EFEFE6] hover:bg-[#2A2A3E] rounded"
                    >
                      Import backup
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown"
            onChange={handleImportMd}
            className="hidden"
          />
          <input
            ref={backupInputRef}
            type="file"
            accept=".json"
            onChange={handleBackupImport}
            className="hidden"
          />
        </div>
      )}
    </header>
  );
}
