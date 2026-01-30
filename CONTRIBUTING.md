# Contributing to PRCart

Thanks for your interest in contributing! This document provides guidelines for contributing to PRCart.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/prcart.git`
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`

## Development Workflow

1. Create a branch for your feature: `git checkout -b feature/your-feature`
2. Make your changes
3. Test locally with `npm run dev`
4. Run linter: `npm run lint`
5. Commit with a descriptive message
6. Push and open a PR

## Code Style

- Use TypeScript (no `any` types)
- Use Tailwind CSS for styling
- Keep components focused and under 200 lines
- Use meaningful variable and function names
- Add comments for complex logic

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add keyboard shortcuts for navigation
fix: handle empty PR edge case
docs: update README with new features
refactor: simplify cart state management
```

## Pull Requests

- Keep PRs focused on a single feature or fix
- Include a clear description of changes
- Link any related issues
- Ensure all checks pass

## Reporting Issues

When reporting bugs, please include:
- Browser and OS version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Feature Requests

We welcome feature requests! Please:
- Check existing issues first
- Describe the use case
- Explain why it would benefit users

## Questions?

Open an issue or reach out to [@anipotts](https://github.com/anipotts).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
