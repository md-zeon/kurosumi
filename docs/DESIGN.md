# Design System

This document describes the UI/UX design decisions for Kurosumi.

## Design Philosophy

Kurosumi follows a **minimalist, distraction-free** design philosophy:

- Content-first approach
- Dark theme for reduced eye strain
- Purple accent for personality
- Clean typography with monospace code
- Subtle animations for polish

## Color Palette

### Dark Theme

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#0A090F` | Main app background |
| Sidebar | `#12121A` | Sidebar background |
| Editor | `#1A1A1E` | Editor background |
| Preview | `#0F0F14` | Preview background |
| Accent | `#5542FF` | Primary accent (buttons, links) |
| Accent Hover | `#7B6FFF` | Hover state |
| Text | `#EFEFE6` | Primary text |
| Text Muted | `#9B9B9B` | Secondary text |
| Border | `#1E1E2A` | Subtle borders |
| Success | `#4ADE80` | Save confirmations |
| Warning | `#FBBF24` | Data persistence warnings |
| Error | `#EF4444` | Delete actions |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Body | Inter | 14px | 400 |
| Editor | JetBrains Mono | 14px | 400 |
| Heading 1 | Inter | 28px | 700 |
| Heading 2 | Inter | 22px | 600 |
| Heading 3 | Inter | 18px | 600 |
| Code | JetBrains Mono | 13px | 400 |
| Caption | Inter | 12px | 400 |

## Layout

### Desktop (1024px+)

```
┌─────────────────────────────────────────────────────────┐
│  Logo                    Search                    +    │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│  Notes   │  ┌─────────────────┐ ┌─────────────────┐   │
│  List    │  │                 │ │                 │   │
│          │  │    Editor       │ │    Preview      │   │
│  ──────  │  │    (left)       │ │    (right)      │   │
│  note 1  │  │                 │ │                 │   │
│  note 2  │  │                 │ │                 │   │
│  note 3  │  │                 │ │                 │   │
│          │  └─────────────────┘ └─────────────────┘   │
│          │                                              │
│          │  Word count: 142 | Last saved: 2m ago       │
├──────────┴──────────────────────────────────────────────┤
│  © 2026 Kurosumi                                        │
└─────────────────────────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌─────────────────────────┐
│  ☰  Kurosumi       +    │
├─────────────────────────┤
│                         │
│  ┌───────────────────┐ │
│  │                   │ │
│  │    Editor OR      │ │
│  │    Preview        │ │
│  │    (toggle)       │ │
│  │                   │ │
│  └───────────────────┘ │
│                         │
│  142 words | 2m ago     │
└─────────────────────────┘
```

## Components

### Sidebar

- **Width**: 280px (desktop), full-width drawer (mobile)
- **Note item height**: 64px
- **Hover state**: Subtle background change
- **Active state**: Left accent border
- **Empty state**: Illustration + "Create your first note"

### Editor

- **Font**: JetBrains Mono (monospace)
- **Line height**: 1.6
- **Placeholder**: "Start writing..."
- **Focus ring**: None (distraction-free)
- **Tab size**: 2 spaces

### Preview

- **Font**: Inter (sans-serif)
- **Max width**: 720px (centered)
- **Code blocks**: highlight.js with dark theme
- **Tables**: Striped rows with subtle borders
- **Images**: Max 100% width, rounded corners

### Buttons

| Type | Style |
|------|-------|
| Primary | Accent background, white text |
| Secondary | Transparent, accent border |
| Ghost | Transparent, text color |
| Danger | Red background, white text |

## Animations

| Element | Animation | Duration |
|---------|-----------|----------|
| Sidebar slide | `transform: translateX` | 200ms |
| Button hover | `background-color` | 150ms |
| Note active | `border-left` | 150ms |
| Toast notification | `transform: translateY` | 300ms |
| Modal backdrop | `opacity` | 200ms |

## Accessibility

- **Contrast ratio**: 4.5:1 minimum for text
- **Focus indicators**: Visible for keyboard navigation
- **Screen reader**: Proper ARIA labels
- **Keyboard shortcuts**: All actions accessible via keyboard
- **Reduced motion**: Respect `prefers-reduced-motion`

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Single column, drawer sidebar |
| Tablet | 768-1024px | Collapsible sidebar |
| Desktop | > 1024px | Three-column layout |
