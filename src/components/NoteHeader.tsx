'use client';

import { useState, useRef, useEffect } from 'react';
import { type Note, updateNote, createNote, getAllNotes, db } from '@/lib/db';
import { renderMarkdown } from '@/lib/markdown';
import { useToast } from './Toast';
import { exportStyles, getExportHtmlContent, getPdfContainerHtml } from '@/lib/exportStyles';

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
    const fullHtml = getExportHtmlContent(note.title || 'Untitled', htmlContent);
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title || 'untitled'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Exported as HTML', 'success');
    setShowExportMenu(false);
  };

  const handleExportPdf = async () => {
    if (!note) return;
    setIsExporting(true);
    
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const htmlContent = renderMarkdown(note.content);
      
      const container = document.createElement('div');
      container.innerHTML = getPdfContainerHtml(note.title || 'Untitled', htmlContent);
      
      // Add styles for PDF
      const style = document.createElement('style');
      style.textContent = exportStyles;
      
      container.prepend(style);
      
      const opt = {
        margin: [15, 15, 15, 15] as [number, number, number, number],
        filename: `${note.title || 'untitled'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
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
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, WidthType, TabStopPosition, TabStopType, ExternalHyperlink } = await import('docx');
      const { saveAs } = await import('file-saver');
      
      // Parse markdown content into docx paragraphs
      const lines = note.content.split('\n');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children: any[] = [];
      
      // Color scheme matching the app
      const colors = {
        primary: '5542FF',
        text: '18181B',
        textMuted: '71717A',
        border: 'E4E4E7',
        background: 'FAFAFA',
      };
      
      for (const line of lines) {
        // Headers with matching styles
        if (line.startsWith('# ')) {
          children.push(new Paragraph({
            children: [new TextRun({ 
              text: line.slice(2), 
              bold: true, 
              size: 32,
              color: colors.text,
              font: 'Calibri',
            })],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 200 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: colors.border, space: 8 },
            },
          }));
        } else if (line.startsWith('## ')) {
          children.push(new Paragraph({
            children: [new TextRun({ 
              text: line.slice(3), 
              bold: true, 
              size: 28,
              color: colors.text,
              font: 'Calibri',
            })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 320, after: 160 },
          }));
        } else if (line.startsWith('### ')) {
          children.push(new Paragraph({
            children: [new TextRun({ 
              text: line.slice(4), 
              bold: true, 
              size: 24,
              color: colors.text,
              font: 'Calibri',
            })],
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 240, after: 120 },
          }));
        } else if (line.startsWith('#### ')) {
          children.push(new Paragraph({
            children: [new TextRun({ 
              text: line.slice(5), 
              bold: true, 
              size: 22,
              color: colors.text,
              font: 'Calibri',
            })],
            heading: HeadingLevel.HEADING_4,
            spacing: { before: 200, after: 100 },
          }));
        } else if (line.startsWith('> ')) {
          // Blockquote with left border styling
          children.push(new Paragraph({
            children: [new TextRun({ 
              text: line.slice(2), 
              italics: true, 
              color: colors.textMuted,
              font: 'Calibri',
            })],
            indent: { left: 720 },
            spacing: { before: 120, after: 120 },
            border: {
              left: { style: BorderStyle.SINGLE, size: 12, color: colors.primary, space: 8 },
            },
          }));
        } else if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
          // Task list
          const isChecked = line.startsWith('- [x] ');
          const text = line.slice(6);
          children.push(new Paragraph({
            children: [
              new TextRun({ 
                text: isChecked ? '☑ ' : '☐ ',
                color: colors.primary,
              }),
              new TextRun({ 
                text,
                font: 'Calibri',
                strike: isChecked,
              }),
            ],
            spacing: { before: 60, after: 60 },
          }));
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
          // Bullet list
          children.push(new Paragraph({
            children: [new TextRun({ 
              text: line.slice(2),
              font: 'Calibri',
            })],
            bullet: { level: 0 },
            spacing: { before: 60, after: 60 },
          }));
        } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || 
                   line.startsWith('4. ') || line.startsWith('5. ') || line.startsWith('6. ') || 
                   line.startsWith('7. ') || line.startsWith('8. ') || line.startsWith('9. ')) {
          // Numbered list
          const text = line.replace(/^\d+\.\s/, '');
          children.push(new Paragraph({
            children: [new TextRun({ 
              text,
              font: 'Calibri',
            })],
            numbering: { reference: 'numbered-list', level: 0 },
            spacing: { before: 60, after: 60 },
          }));
        } else if (line.startsWith('---') || line.startsWith('***') || line.startsWith('___')) {
          // Horizontal rule
          children.push(new Paragraph({
            children: [new TextRun({ text: '' })],
            spacing: { before: 200, after: 200 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: colors.border, space: 4 },
            },
          }));
        } else if (line.trim() === '') {
          // Empty line
          children.push(new Paragraph({ children: [] }));
        } else {
          // Regular paragraph - handle inline formatting
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const textRuns: any[] = [];
          let remaining = line;
          
          // Handle links first: [text](url)
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          let lastIndex = 0;
          let match;
          
          while ((match = linkRegex.exec(remaining)) !== null) {
            // Add text before link
            if (match.index > lastIndex) {
              const beforeText = remaining.slice(lastIndex, match.index);
              if (beforeText) {
                textRuns.push(new TextRun({ text: beforeText, font: 'Calibri', color: colors.text }));
              }
            }
            
            // Add link
            textRuns.push(new ExternalHyperlink({
              children: [
                new TextRun({
                  text: match[1],
                  style: 'Hyperlink',
                  font: 'Calibri',
                }),
              ],
              link: match[2],
            }));
            
            lastIndex = match.index + match[0].length;
          }
          
          // Add remaining text
          if (lastIndex < remaining.length) {
            remaining = remaining.slice(lastIndex);
          }
          
          // Handle other inline formatting (bold, italic, code, strikethrough)
          while (remaining.length > 0) {
            const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
            const italicMatch = remaining.match(/\*(.*?)\*/);
            const codeMatch = remaining.match(/`(.*?)`/);
            const strikeMatch = remaining.match(/~~(.*?)~~/);
            
            if (boldMatch && boldMatch.index !== undefined) {
              if (boldMatch.index > 0) {
                textRuns.push(new TextRun({ text: remaining.slice(0, boldMatch.index), font: 'Calibri', color: colors.text }));
              }
              textRuns.push(new TextRun({ text: boldMatch[1], bold: true, font: 'Calibri', color: colors.text }));
              remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
            } else if (italicMatch && italicMatch.index !== undefined) {
              if (italicMatch.index > 0) {
                textRuns.push(new TextRun({ text: remaining.slice(0, italicMatch.index), font: 'Calibri', color: colors.text }));
              }
              textRuns.push(new TextRun({ text: italicMatch[1], italics: true, font: 'Calibri', color: colors.text }));
              remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
            } else if (codeMatch && codeMatch.index !== undefined) {
              if (codeMatch.index > 0) {
                textRuns.push(new TextRun({ text: remaining.slice(0, codeMatch.index), font: 'Calibri', color: colors.text }));
              }
              textRuns.push(new TextRun({ 
                text: codeMatch[1], 
                font: 'Consolas',
                shading: { fill: colors.background },
              }));
              remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
            } else if (strikeMatch && strikeMatch.index !== undefined) {
              if (strikeMatch.index > 0) {
                textRuns.push(new TextRun({ text: remaining.slice(0, strikeMatch.index), font: 'Calibri', color: colors.text }));
              }
              textRuns.push(new TextRun({ text: strikeMatch[1], strike: true, font: 'Calibri', color: colors.textMuted }));
              remaining = remaining.slice(strikeMatch.index + strikeMatch[0].length);
            } else {
              textRuns.push(new TextRun({ text: remaining, font: 'Calibri', color: colors.text }));
              remaining = '';
            }
          }
          
          if (textRuns.length === 0) {
            textRuns.push(new TextRun({ text: line, font: 'Calibri', color: colors.text }));
          }
          
          children.push(new Paragraph({
            children: textRuns,
            spacing: { before: 80, after: 160 },
          }));
        }
      }
      
      const doc = new Document({
        numbering: {
          config: [
            {
              reference: 'numbered-list',
              levels: [
                {
                  level: 0,
                  format: 'decimal',
                  text: '%1.',
                  alignment: AlignmentType.LEFT,
                  style: { paragraph: { indent: { left: 720, hanging: 360 } } },
                },
              ],
            },
          ],
        },
        styles: {
          default: {
            document: {
              run: {
                font: 'Calibri',
                size: 24,
                color: colors.text,
              },
              paragraph: {
                spacing: { line: 360 },
              },
            },
            heading1: {
              run: {
                font: 'Calibri',
                size: 32,
                bold: true,
                color: colors.text,
              },
            },
            heading2: {
              run: {
                font: 'Calibri',
                size: 28,
                bold: true,
                color: colors.text,
              },
            },
            heading3: {
              run: {
                font: 'Calibri',
                size: 24,
                bold: true,
                color: colors.text,
              },
            },
          },
          paragraphStyles: [
            {
              id: 'Hyperlink',
              name: 'Hyperlink',
              run: {
                color: colors.primary,
                underline: { type: 'single' as any },
              },
            },
          ],
        },
        sections: [{
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: [
            new Paragraph({
              children: [new TextRun({ 
                text: note.title || 'Untitled', 
                bold: true, 
                size: 40,
                color: colors.text,
                font: 'Calibri',
              })],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.LEFT,
              spacing: { after: 120 },
              border: {
                bottom: { style: BorderStyle.SINGLE, size: 8, color: colors.primary, space: 12 },
              },
            }),
            new Paragraph({
              children: [new TextRun({ 
                text: new Date(note.updatedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }),
                font: 'Calibri',
                color: colors.textMuted,
                size: 20,
              })],
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
