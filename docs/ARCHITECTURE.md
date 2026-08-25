# Architecture

This document describes the technical architecture of Kurosumi.

## Overview

Kurosumi is a local-first, offline-capable Markdown note-taking application built with Next.js. It stores all data in the browser's IndexedDB, requiring no backend or accounts.

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14 (App Router) | React framework with SSR/SSG |
| Language | TypeScript | Type safety and better DX |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Components | shadcn/ui | Accessible UI components |
| Markdown | markdown-it | GFM-compatible Markdown parsing |
| Syntax Highlight | highlight.js | Code block syntax highlighting |
| Storage | Dexie.js | IndexedDB wrapper for note storage |
| PWA | Service Worker | Offline support and installability |

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
│  │  • Auto-save logic                            │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │              Storage Layer                    │    │
│  │  • IndexedDB (notes, folders, settings)      │    │
│  │  • localStorage (UI preferences)              │    │
│  │  • Service Worker Cache (app shell)           │    │
│  └───────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Component Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main notes page
│   └── globals.css         # Global styles and CSS variables
├── components/
│   ├── NoteSidebar.tsx     # Sidebar with note list
│   ├── NoteItem.tsx        # Individual note in sidebar
│   ├── MarkdownEditor.tsx  # Textarea for editing notes
│   ├── MarkdownPreview.tsx # Rendered Markdown output
│   ├── NoteHeader.tsx      # Header with title and actions
│   ├── SearchBar.tsx       # Search/filter notes
│   ├── SplitViewToggle.tsx # Toggle editor/preview/split
│   ├── CodeBlock.tsx       # Enhanced code blocks
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── db.ts               # Dexie database setup
│   ├── types.ts            # TypeScript type definitions
│   └── markdown.ts         # markdown-it configuration
└── public/
    ├── manifest.json       # PWA manifest
    └── icons/              # App icons
```

## Data Flow

### Creating a Note

```
User clicks "New Note"
    ↓
React state updated with empty note
    ↓
Note saved to IndexedDB via Dexie.js
    ↓
UI updates to show new note in sidebar
    ↓
Editor focuses on new note
```

### Editing a Note

```
User types in editor
    ↓
Debounced save (500ms)
    ↓
Note updated in IndexedDB
    ↓
Preview updates in real-time
    ↓
"Last saved" timestamp updates
```

### Searching Notes

```
User types in search bar
    ↓
Dexie.js queries IndexedDB
    ↓
Results filtered by title and content
    ↓
Sidebar updates with matching notes
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

Kurosumi uses React's built-in state management:

- **Component State**: Local state for UI interactions
- **Context API**: For shared state (current note, theme)
- **Dexie.js**: For persistent storage and real-time queries

## Performance Considerations

1. **Debounced Saves**: Auto-save with 500ms debounce to prevent excessive writes
2. **Virtual Scrolling**: For large note lists (V2)
3. **Lazy Loading**: Components loaded on demand
4. **Service Worker**: Caches app shell for instant loads

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | Full    |
| Firefox | Full    |
| Safari  | Full*   |
| Edge    | Full    |

*Safari requires "Add to Home Screen" for persistent storage.

## Security Model

- **Local-first**: Data never leaves the device
- **No accounts**: No authentication required
- **Same-Origin Policy**: IndexedDB is origin-scoped
- **No tracking**: No analytics or telemetry
