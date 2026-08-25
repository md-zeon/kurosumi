# Changelog

All notable changes to Kurosumi will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with Next.js 14, TypeScript, and Tailwind CSS
- Dark theme with purple accent colors
- IndexedDB storage via Dexie.js
- GFM (GitHub Flavored Markdown) support
- Split-view editor with live preview
- Note CRUD operations (create, read, update, delete)
- Sidebar with note list

### Planned
- Split-view toggle (editor-only, preview-only, split)
- Search functionality
- Word/character count
- Export as .md file
- Import .md files
- Auto-save (debounced)
- Full-screen editor mode
- Keyboard shortcuts (Ctrl+N, Ctrl+S, Ctrl+Shift+F)
- Backup/Restore (export/import all notes as JSON)
- Note sorting (by date, alphabetical)
- Code block language detection + copy button
- PWA support (Service Worker, Web App Manifest)
- Folders/tags organization
- Markdown toolbar (bold, italic, link)
- Export as HTML
- LaTeX/KaTeX math rendering
- Mermaid diagram support
- Note timestamps in sidebar
- Duplicate note
- Accessibility (ARIA labels, keyboard navigation)

## [0.1.0] - 2026-08-26

### Added
- Initial project structure
- Next.js 14 with App Router
- TypeScript configuration
- Tailwind CSS setup
- Dexie.js for IndexedDB
