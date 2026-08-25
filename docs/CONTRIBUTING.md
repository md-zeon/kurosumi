# Contributing to Kurosumi

Thank you for your interest in contributing to Kurosumi! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [GitHub Issues](https://github.com/zeonr/kurosumi/issues)
2. If not, create a new issue with:
   - A clear, descriptive title
   - Steps to reproduce the issue
   - Expected behavior
   - Actual behavior
   - Browser/device information
   - Screenshots if applicable

### Suggesting Features

1. Check existing [GitHub Issues](https://github.com/zeonr/kurosumi/issues) for similar suggestions
2. Create a new issue with the `feature-request` label
3. Describe the feature, its use case, and why it would benefit users

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Ensure your code follows the project's style guidelines
5. Test your changes thoroughly
6. Commit with a clear message following [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug in component"
   git commit -m "docs: update documentation"
   ```
7. Push to your fork and create a Pull Request

## Development Setup

### Prerequisites

- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn

### Getting Started

```bash
# Clone your fork
git clone https://github.com/your-username/kurosumi.git
cd kurosumi

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## Code Style

- Follow the existing code style and conventions
- Use TypeScript for all new components and utilities
- Use Tailwind CSS for styling
- Keep components modular and reusable
- Write meaningful variable and function names
- Add comments only when necessary to explain complex logic

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring without functionality changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

## Pull Request Guidelines

- Keep PRs focused on a single feature or bug fix
- Update documentation if needed
- Add screenshots for UI changes
- Ensure the build passes before submitting
- Reference related issues in your PR description

## Questions?

If you have questions about contributing, feel free to open a [GitHub Discussion](https://github.com/zeonr/kurosumi/discussions).

Thank you for contributing to Kurosumi!
