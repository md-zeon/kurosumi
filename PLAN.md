# Kurosumi — Implementation Plan

## Overview
A beautiful, local-first Markdown note-taking app. Write in Markdown with live preview, and everything stays in your browser (IndexedDB). No account needed. No cloud. Just your notes.

**Name:** Kurosumi (black + ink)
**Repo:** [github.com/zeonr/kurosumi](https://github.com/zeonr/kurosumi)

---

## Market Research

### Competitors
| Tool | Strengths | Weaknesses |
|------|-----------|------------|
| Notion | Rich features, collaboration | Requires account, cloud-only |
| Obsidian | Local files, plugins | Desktop app, not web-based |
| HackMD | Real-time collab | Cloud-only, requires login |
| Dillinger | Clean, simple | Limited features, dated UI |
| StackEdit | Good preview | No folder organization |

### Opportunity
- No modern web-based Markdown app with local storage
- Existing tools require accounts or are desktop-only
- Clean, fast, offline-capable Markdown editor is missing

### Target Users
- Developers writing documentation
- Students taking notes
- Anyone who prefers Markdown over rich text

---

## UI/UX Design

### Design Principles
1. **Content-first**: Editor and preview take center stage
2. **Distraction-free**: Minimal chrome, focus on writing
3. **Dark theme**: Reduced eye strain, modern aesthetic
4. **Keyboard-first**: All actions accessible via shortcuts
5. **Instant feedback**: Real-time preview, immediate saves

### Layout
```
┌──────────────────────────────────────────────────┐
│  Kurosumi                    Search        [+]   │
├──────────┬───────────────────────────────────────┤
│          │                                       │
│  Notes   │  ┌─────────────┐ ┌─────────────────┐ │
│  List    │  │             │ │                 │ │
│          │  │   Editor    │ │   Preview       │ │
│  ──────  │  │   (left)    │ │   (right)       │ │
│  note 1  │  │             │ │                 │ │
│  note 2  │  │             │ │                 │ │
│  note 3  │  │             │ │                 │ │
│          │  └─────────────┘ └─────────────────┘ │
│          │                                       │
│          │  142 words | Saved just now           │
├──────────┴───────────────────────────────────────┤
│  Data stored locally. Export regularly.           │
└──────────────────────────────────────────────────┘
```

### Color Palette
- Background: `#0A090F`
- Sidebar: `#12121A`
- Editor: `#1A1A1E`
- Preview: `#0F0F14`
- Accent: `#5542FF`
- Text: `#EFEFE6`

### Key Components
- `NoteSidebar` — list of notes with search
- `MarkdownEditor` — textarea with monospace font
- `MarkdownPreview` — rendered HTML output
- `NoteHeader` — title, save status, export
- `SearchBar` — filter notes
- `SplitViewToggle` — editor/preview/split modes
- `CodeBlock` — enhanced code blocks with copy

### Unique UI Features (Kurosumi Differentiators)
1. **Ink Flow Animation**: Subtle writing animation on note creation
2. **Focus Mode**: Fade sidebar and header, maximize editor space
3. **Smart Empty States**: Helpful prompts when no notes exist
4. **Gesture Support**: Swipe to delete on mobile
5. **Micro-interactions**: Subtle feedback on every action

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Markdown | `markdown-it` (GFM support) |
| Syntax Highlight | `highlight.js` |
| Storage | IndexedDB via `Dexie.js` |
| PWA | Service Worker + Web App Manifest |
| Deployment | Vercel |

## PWA & Offline Support
- Service Worker for caching app shell + static assets
- `manifest.json` for installability
- `navigator.storage.persist()` to request persistent storage
- UI warning: "Notes live in this browser only — export regularly to avoid data loss"

---

## Markdown Dialect
**GitHub Flavored Markdown (GFM)** — tables, task lists, strikethrough, autolinks.

## Features

### MVP
- [x] Create/edit/delete notes
- [x] Live Markdown preview (split view)
- [x] Save to IndexedDB
- [x] Note list sidebar
- [x] Dark theme
- [ ] Split-view toggle (editor-only, preview-only, split)
- [ ] GFM support (tables, task lists, strikethrough)

### V1
- [ ] Search notes
- [ ] Word/character count
- [ ] Export as .md file
- [ ] Import .md files
- [ ] Auto-save (debounced)
- [ ] Full-screen editor mode
- [ ] Keyboard shortcuts (Ctrl+N, Ctrl+S, Ctrl+Shift+F)
- [ ] Backup / Restore (export/import all notes as JSON)
- [ ] Note sorting (by date, alphabetical)
- [ ] Code block language detection + copy button

### V2 (Optional)
- [ ] Folders/tags
- [ ] Markdown toolbar (bold, italic, link)
- [ ] Export as HTML
- [ ] LaTeX/KaTeX math rendering
- [ ] Mermaid diagram support
- [ ] Note timestamps in sidebar ("edited 2h ago")
- [ ] Duplicate note
- [ ] Accessibility (ARIA labels, keyboard navigation)

---

## File Structure

```
kurosumi/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── NoteSidebar.tsx
│   ├── NoteItem.tsx
│   ├── MarkdownEditor.tsx
│   ├── MarkdownPreview.tsx
│   ├── NoteHeader.tsx
│   ├── SearchBar.tsx
│   ├── SplitViewToggle.tsx
│   ├── CodeBlock.tsx
│   └── ui/
├── lib/
│   ├── db.ts              # Dexie IndexedDB setup
│   ├── types.ts           # Note type definitions
│   └── markdown.ts        # markdown-it config
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service worker
│   └── icons/             # App icons
├── docs/                  # Project documentation
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── PLAN.md
```

---

## Database Schema (IndexedDB)

```typescript
interface Note {
  id?: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  pinned?: boolean;
  folderId?: number;
}
```

---

## API Routes
None — pure client-side with IndexedDB.

---

## Deployment
1. Push to GitHub
2. Connect to Vercel
3. Auto-deploy
4. Environment variables: None

---

## Success Metrics
- Notes load in < 50ms
- Works offline (PWA installable)
- Auto-save without user action
- Clean split-view layout
- Lighthouse PWA score > 90
- GFM rendering (tables, task lists, strikethrough)
