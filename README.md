# Kurosumi

A local-first, offline-capable Markdown note-taking web app with a dark purple theme. No accounts required — all data stays in your browser.

![Kurosumi](https://via.placeholder.com/800x400/0A090F/5542FF?text=Kurosumi)

## Features

- **Markdown Editor** — Full GFM support with live preview
- **Split View** — Edit and preview side-by-side
- **Syntax Highlighting** — Code blocks with 190+ language support
- **Auto-Save** — Debounced saves to IndexedDB (500ms)
- **Offline First** — Works without internet (PWA)
- **Export Options** — Markdown, JSON, HTML, PDF, DOCX
- **Backup/Restore** — Export/import all notes as JSON
- **Keyboard Shortcuts** — Quick actions for power users
- **Mobile Responsive** — Works on phones, tablets, and desktops
- **Dark Theme** — Easy on the eyes with purple accents

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+N` | New note |
| `Ctrl+S` | Save note |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+Shift+F` | Focus search |
| `F11` | Toggle fullscreen |
| `?` | Show shortcuts |
| `1` | Editor view |
| `2` | Split view |
| `3` | Preview view |
| `Esc` | Close modal/sidebar |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Markdown | markdown-it (GFM) |
| Syntax Highlight | highlight.js |
| Storage | Dexie.js (IndexedDB) |
| PWA | Service Worker + Web App Manifest |

## Project Structure

```
kurosumi/
├── src/
│   ├── app/              # Next.js pages
│   │   ├── page.tsx      # Main app
│   │   └── globals.css   # Theme styles
│   ├── components/       # React components
│   │   ├── NoteSidebar.tsx
│   │   ├── NoteHeader.tsx
│   │   ├── MarkdownEditor.tsx
│   │   ├── MarkdownPreview.tsx
│   │   ├── MarkdownToolbar.tsx
│   │   ├── Toast.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── ShortcutsModal.tsx
│   └── lib/              # Utilities
│       ├── db.ts         # Dexie database
│       ├── markdown.ts   # markdown-it config
│       └── exportStyles.ts
├── public/               # Static assets
│   ├── manifest.json     # PWA manifest
│   └── sw.js            # Service worker
└── docs/                 # Documentation
```

## Features in Detail

### Note Management
- Create, edit, delete notes
- Pin important notes to top
- Duplicate notes
- Sort by date modified, created, or title

### Editor
- Markdown toolbar for quick formatting
- Tab to insert spaces
- Auto-save with debouncing
- Word/character/line count

### Export
- **Markdown** — Plain .md file
- **JSON** — Full note data
- **HTML** — Styled HTML document
- **PDF** — Print-ready document
- **DOCX** — Microsoft Word format

### PWA
- Installable on desktop and mobile
- Offline support via service worker
- App-like experience

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | Full |
| Firefox | Full |
| Safari | Full |
| Edge | Full |

## Privacy

- **Local-first** — Data never leaves your device
- **No accounts** — No sign-up required
- **No tracking** — No analytics or telemetry
- **Open source** — MIT License

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## License

MIT License — see [LICENSE](LICENSE) for details.
