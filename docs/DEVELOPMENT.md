# Development Guide

This guide covers the development workflow for Kurosumi.

## Prerequisites

- **Node.js**: 18.0+ (recommended: 20.x LTS)
- **npm**: 9.0+ or **yarn**: 1.22+
- **Git**: Latest version

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/zeonr/kurosumi.git
cd kurosumi
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
kurosumi/
├── src/                    # Source code
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   └── lib/               # Utilities and configuration
├── public/                # Static assets
├── docs/                  # Documentation
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── PLAN.md                # Project roadmap
```

## Development Workflow

### Creating a New Feature

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Create your component in `src/components/`

3. Add any necessary utilities in `src/lib/`

4. Test your changes:
   ```bash
   npm run dev
   npm run lint
   npm run type-check
   ```

5. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. Push and create a Pull Request

### Code Style

- Use TypeScript for all new files
- Follow the existing naming conventions:
  - Components: PascalCase (`NoteSidebar.tsx`)
  - Utilities: camelCase (`markdown.ts`)
  - Types: PascalCase with `I` prefix for interfaces (`INote`)
- Use Tailwind CSS for styling
- Keep components small and focused

### Testing

```bash
# Run ESLint
npm run lint

# Run TypeScript type checking
npm run type-check

# Build for production
npm run build
```

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## Database Schema

The app uses Dexie.js to manage IndexedDB. The schema is defined in `src/lib/db.ts`:

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

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Defined in `src/app/globals.css`
- **Dark Theme**: Default and only theme (for now)

## Performance Tips

1. **Debounce saves**: Auto-save with 500ms debounce
2. **Lazy load**: Use dynamic imports for heavy components
3. **Memoize**: Use `React.memo` for expensive renders
4. **Virtual scrolling**: For large note lists (V2)

## Troubleshooting

### Build Errors

If you encounter build errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

### IndexedDB Issues

If notes aren't persisting:

1. Open browser DevTools (F12)
2. Go to Application > Storage > IndexedDB
3. Check if `kurosumi` database exists
4. Clear storage if needed: Application > Storage > Clear site data

### Type Errors

```bash
npm run type-check
```

Fix any TypeScript errors before committing.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
