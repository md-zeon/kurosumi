# Changelog

All notable changes to Kurosumi will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-08-26

### Added
- Undo/redo support with history (Ctrl+Z, Ctrl+Shift+Z)
- Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+K (Link) shortcuts in editor
- PWA icons (72, 96, 128, 144, 152, 192, 384, 512)
- SEO metadata (Open Graph, Twitter cards, keywords)
- robots.txt for search engines
- sitemap.xml for crawling
- Favicon (SVG)

### Fixed
- New note shortcut changed to Alt+N (avoided browser Ctrl+N conflict)
- Keyboard shortcuts now work while typing in editor
- Removed unimplemented shortcuts from modal
- Code block copy button works with React (event delegation)

### Changed
- Updated all documentation

## [0.2.0] - 2026-08-26

### Added
- Mobile responsive design with drawer sidebar
- localStorage persistence for selected note and view mode
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
