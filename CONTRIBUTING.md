# Contributing to Sanity Calendar Plugin

Thank you for your interest in contributing to the Sanity Calendar Plugin! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Pull Request Process](#pull-request-process)
6. [Testing](#testing)
7. [Documentation](#documentation)
8. [Release Process](#release-process)

## Code of Conduct

This project adheres to a Code of Conduct that establishes expected behavior in our community. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm (pnpm is preferred)
- Git

### Issues

- Before creating a new issue, please check if a similar issue already exists.
- Use issue templates if available.
- Clearly describe the issue including steps to reproduce when it is a bug.
- For feature requests, clearly describe the desired functionality and the problem it solves.

## Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```
   git clone https://github.com/YOUR-USERNAME/sanity-plugin-events-calendar.git
   cd sanity-plugin-events-calendar
   ```

3. Install dependencies:
   ```
   npm install
   # or
   pnpm install
   ```

4. Create a branch for your changes:
   ```
   git checkout -b feature/your-feature-name
   ```

5. Setup local development:
   ```
   npm run link-watch
   ```
   This will build the plugin and watch for changes, allowing you to test it in a local Sanity Studio project.

6. In your Sanity Studio project, link the plugin:
   ```
   cd your-sanity-studio
   npm link sanity-plugin-events-calendar
   # or
   pnpm link --global sanity-plugin-events-calendar
   ```

7. Add the plugin to your Sanity Studio configuration:
   ```js
   // sanity.config.ts or sanity.config.js
   import {defineConfig} from 'sanity'
   import {calendarPlugin} from 'sanity-plugin-events-calendar'

   export default defineConfig({
     // ...your config
     plugins: [
       // ...other plugins
       calendarPlugin()
     ]
   })
   ```

8. Start your Sanity Studio:
   ```
   npm run dev
   ```

## Coding Standards

We use ESLint and Prettier to enforce coding standards. Before submitting your code, make sure it passes linting:

```
npm run lint
```

You can also automatically fix many linting issues with:

```
npm run format
```

### Key Coding Guidelines

1. Use TypeScript for all new code.
2. Follow the existing code style and patterns.
3. Use functional components and hooks for React components.
4. Use styled-components for styling as per the existing pattern.
5. Use the Sanity color system from `@sanity/color` for consistency.
6. Document your code with JSDoc comments.
7. Use meaningful variable and function names.
8. Write concise, focused components and functions.

## Pull Request Process

1. Ensure your code follows the coding standards.
2. Update documentation as needed.
3. Include tests when adding new features.
4. Ensure the test suite passes.
5. Make sure your commits are clear and descriptive.
6. Push your changes to your fork.
7. Submit a pull request to the main repository.
8. The PR should clearly describe the changes and reference any related issues.

### Commit Message Guidelines

We use conventional commits to standardize our commit messages:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor:` - A code change that neither fixes a bug nor adds a feature
- `perf:` - A code change that improves performance
- `test:` - Adding missing tests or correcting existing tests
- `chore:` - Changes to the build process or auxiliary tools

Example:
```
feat: add calendar month navigation feature
```

## Testing

While formal testing is not yet set up, please manually test your changes thoroughly:

1. Ensure the plugin builds without errors
2. Test the plugin in a Sanity Studio context
3. Verify the calendar displays events correctly
4. Test event creation, editing, and filters
5. Check for any console errors or warnings

We plan to add formal testing in the future. Contributions to set up testing are welcome!

## Documentation

Good documentation is crucial. When adding features or making changes:

1. Update the README.md if necessary
2. Add or update documentation in the docs/ folder
3. Include JSDoc comments for functions and components
4. Update or add usage examples when appropriate

## Release Process

The project maintainers will handle releases. The general process is:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create a git tag for the version
4. Build the project
5. Publish to npm

## Setting Up Pre-commit Hooks

We use Husky and lint-staged to run checks before each commit:

1. Install the hooks after cloning the repository:
   ```
   npm run prepare
   ```

This will set up pre-commit hooks to automatically lint and format your code before committing, ensuring all contributed code meets our standards.

## Questions?

If you have any questions or need help, please open an issue labeled "question" in the GitHub repository.

Thank you for contributing to make the Sanity Calendar Plugin better!