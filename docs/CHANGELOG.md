# Changelog

All notable changes to Kurosumi will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-08-26

### Added
- Mobile responsive design with drawer sidebar
- localStorage persistence for selected note and view mode
- Code block copy button with visual feedback
- Toast notification system
- Custom confirmation dialogs
- Keyboard shortcuts modal (? to open)
- Markdown toolbar (bold, italic, strikethrough, code, link, image, headings, quote, lists, task list, horizontal rule, code block, table)
- Export as PDF (html2pdf.js)
- Export as DOCX (docx + file-saver)
- Export as HTML with styling
- Import .md files
- Backup/Restore (export/import all notes as JSON)
- Note duplication
- Note sorting (by date modified/created, title A-Z/Z-A)
- Word/character/line count in status bar
- Empty state with illustration
- Focus-visible indicators for accessibility
- CSS animations and transitions
- Shared export styles (exportStyles.ts)

### Fixed
- Code block copy button now works with React (event delegation)
- Sidebar closes on note selection (mobile)
- View mode persists across reloads

## [0.1.0] - 2026-08-26

### Added
- Initial project setup
- Next.js 16 with App Router
- TypeScript configuration
- Tailwind CSS with dark purple theme
- Dexie.js for IndexedDB storage
- NoteSidebar component with note list
- NoteItem component with actions
- MarkdownEditor with textarea
- MarkdownPreview with live rendering
- NoteHeader with title editing
- SearchBar for filtering notes
- markdown-it with GFM support
- highlight.js for syntax highlighting
- Auto-save with 500ms debounce
- Keyboard shortcuts (Ctrl+N, Ctrl+S, Ctrl+Shift+F, F11)
- View mode toggle (editor/split/preview)
- PWA support (manifest.json, service worker)
- ServiceWorkerRegistration component

## [Unreleased]

### Planned
- Folders/tags organization
- LaTeX/KaTeX math rendering
- Mermaid diagram support
- Virtual scrolling for large note lists
- Note templates
- Dark/light theme toggle
