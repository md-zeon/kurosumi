# Architecture

Technical architecture of Kurosumi.

## Overview

Kurosumi is a local-first, offline-capable Markdown note-taking application built with Next.js. All data is stored in the browser's IndexedDB — no backend or accounts required.

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 16 (App Router) | React framework with SSR/SSG |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first CSS |
| Markdown | markdown-it | GFM-compatible parsing |
| Syntax Highlight | highlight.js | Code block highlighting |
| Storage | Dexie.js | IndexedDB wrapper |
| PWA | Service Worker | Offline support |
| PDF Export | html2pdf.js | PDF generation |
| DOCX Export | docx + file-saver | Word document generation |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Browser                             │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   React UI  │  │  markdown-it│  │  Dexie.js   │    │
│  │  Components │  │   Parser    │  │  IndexedDB  │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                │            │
│         └────────────────┼────────────────┘            │
│                          │                             │
│  ┌───────────────────────┴───────────────────────┐    │
│  │              Application Layer                │    │
│  │  • Note CRUD operations                       │    │
│  │  • Markdown rendering                         │    │
│  │  • Search and filtering                       │    │
│  │  • Auto-save with debounce                    │    │
│  │  • Export/Import (MD, JSON, HTML, PDF, DOCX) │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │              Storage Layer                    │    │
│  │  • IndexedDB (notes)                          │    │
│  │  • localStorage (UI preferences, state)       │    │
│  │  • Service Worker Cache (app shell)           │    │
│  └───────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Component Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main app page
│   └── globals.css         # Theme and styles
├── components/
│   ├── NoteSidebar.tsx     # Sidebar with note list
│   ├── NoteItem.tsx        # Individual note item
│   ├── NoteHeader.tsx      # Header with title/actions
│   ├── MarkdownEditor.tsx  # Textarea editor
│   ├── MarkdownPreview.tsx # Rendered output
│   ├── MarkdownToolbar.tsx # Formatting toolbar
│   ├── SearchBar.tsx       # Search input
│   ├── Toast.tsx           # Toast notifications
│   ├── ConfirmDialog.tsx   # Confirmation dialogs
│   ├── ShortcutsModal.tsx  # Keyboard shortcuts help
│   ├── Providers.tsx       # Context providers
│   └── ServiceWorkerRegistration.tsx
├── lib/
│   ├── db.ts               # Dexie database
│   ├── markdown.ts         # markdown-it config
│   └── exportStyles.ts     # Export styling
└── public/
    ├── manifest.json       # PWA manifest
    └── sw.js              # Service worker
```

## Data Flow

### Note Selection & Persistence

```
User selects note
    ↓
State updated (selectedNoteId)
    ↓
localStorage updated
    ↓
Note loaded from IndexedDB
    ↓
Editor/Preview updated
```

### Auto-Save Flow

```
User types in editor
    ↓
Debounced save (500ms)
    ↓
Note updated in IndexedDB
    ↓
UI updates (last saved timestamp)
    ↓
Sidebar refresh triggers
```

### Search Flow

```
User types in search bar
    ↓
Dexie.js queries IndexedDB
    ↓
Results filtered by title/content
    ↓
Sidebar updates with matches
```

## Database Schema

```typescript
interface Note {
  id?: number;          // Auto-increment ID
  title: string;        // Note title
  content: string;      // Markdown content
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
  pinned?: boolean;     // Pin to top
  folderId?: number;    // Future: folder organization
}
```

## State Management

### Local State (React)
- `selectedNoteId` — Currently selected note
- `currentNote` — Loaded note data
- `viewMode` — Editor/split/preview mode
- `lastSaved` — Last save timestamp
- `showShortcuts` — Shortcuts modal visibility

### Persisted State (localStorage)
- `kurosumi_selected_note` — Last selected note ID
- `kurosumi_view_mode` — Last view mode

### Persistent Storage (IndexedDB via Dexie)
- Notes with full CRUD operations
- Real-time search queries
- Sorting and filtering

## Responsive Design

### Breakpoints
- `sm:` (640px) — Hide some status info
- `md:` (768px) — Full desktop layout
- Mobile-first approach

### Mobile Features
- Sidebar as drawer with backdrop
- Hamburger menu to open sidebar
- Single-view mode (no split)
- Compact status bar

## Performance

1. **Debounced Saves** — 500ms debounce prevents excessive writes
2. **Memoized Calculations** — Word/char counts memoized
3. **Lazy Loading** — Components load on demand
4. **Service Worker** — Caches app shell for instant loads
5. **Optimized Builds** — Next.js tree-shaking and code splitting

## Security

- **Local-first** — Data never leaves the device
- **No accounts** — No authentication required
- **Same-Origin Policy** — IndexedDB is origin-scoped
- **No tracking** — No analytics or telemetry
- **XSS Protection** — markdown-it escapes HTML by default
