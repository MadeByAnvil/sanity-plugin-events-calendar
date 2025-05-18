# Local Development Guide

This guide provides detailed instructions for setting up and working on the Sanity Calendar Plugin locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm**
- **Git**

## Setup Steps

### 1. Clone the Repository

First, fork the repository on GitHub, then clone your fork:

```bash
git clone https://github.com/MadeByAnvil/sanity-plugin-events-calendar.git
cd sanity-plugin-events-calendar
```

### 2. Install Dependencies

Install all required dependencies:

```bash
npm install
```

### 3. Set Up for Local Development

The plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit) which provides utilities for local development:

````bash
npm run link-watch
    ```

This command:

- Builds the plugin in development mode
- Watches for changes to rebuild automatically
- Creates a global link for the package

### 4. Link to a Test Sanity Studio

To test your development version of the plugin, you need a Sanity Studio project:

#### Option A: Use an Existing Sanity Studio Project

If you already have a Sanity Studio project:

```bash
cd path/to/your-sanity-studio
npm link sanity-plugin-events-calendar
````

#### Option B: Create a Test Sanity Studio Project

If you don't have a Sanity Studio project, create a new one:

```bash
npm create sanity@latest -- --template clean test-calendar-plugin
cd test-calendar-plugin
npm link sanity-plugin-events-calendar
```

### 5. Configure the Test Studio

Add the plugin to your Sanity Studio configuration:

```javascript
// sanity.config.ts or sanity.config.js
import {defineConfig} from 'sanity'
import {calendarPlugin} from 'sanity-plugin-events-calendar'

export default defineConfig({
  // Your other configuration
  plugins: [
    // Your other plugins
    calendarPlugin(),
  ],
})
```

### 6. Start the Test Studio

Run your Sanity Studio development server:

```bash
npm run dev
```

Now your Sanity Studio will be running with your development version of the calendar plugin.

## Development Workflow

### Making Changes

1. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to the plugin code
3. The `link-watch` command will automatically rebuild the plugin
4. Refresh your Sanity Studio to see the changes

### Code Formatting and Linting

Before committing, make sure your code follows the project's style guidelines:

```bash
# Check for linting issues
npm run lint

# Format your code
npm run format
```

### Pre-commit Hooks

The project is configured with pre-commit hooks that automatically lint and format your code before each commit. This ensures code quality and consistency.

To install the pre-commit hooks:

```bash
npm run prepare
```

## Project Structure

Here's an overview of the important directories and files:

```
sanity-plugin-events-calendar/
├── src/                 # Source code
│   ├── components/      # React components for the calendar
│   ├── schemas/         # Sanity schema definitions
│   ├── styles/          # Style definitions and theme
│   ├── tools/           # Sanity Studio tool components
│   └── index.ts         # Main entry point
├── docs/                # Documentation
├── .eslintrc            # ESLint configuration
├── .prettierrc          # Prettier configuration
├── package.json         # Project metadata and scripts
├── tsconfig.json        # TypeScript configuration
└── package.config.ts    # Build configuration
```

## Building the Plugin

To create a production build:

```bash
npm run build
```

This will:

1. Verify the package structure
2. Check types with TypeScript
3. Build the plugin with optimizations
4. Output to the `dist/` directory

## Troubleshooting

### Common Issues

#### Changes Not Showing in Studio

If you make changes to the plugin but don't see them reflected in your Sanity Studio:

1. Make sure the `link-watch` command is still running
2. Try refreshing the browser completely
3. Check the browser console for any errors
4. If necessary, restart both the `link-watch` process and your Sanity Studio

#### TypeScript Errors

If you encounter TypeScript errors:

1. Make sure you're using compatible types with Sanity v3
2. Check imports for correct paths
3. Verify that all required dependencies are installed

#### Link Issues

If the linking process isn't working:

1. Try removing the link and re-linking:
   ```bash
   npm unlink sanity-plugin-events-calendar
   npm link sanity-plugin-events-calendar
   ```
2. Make sure you don't have the package installed via npm in your Studio
3. Check node_modules for conflicting versions

### Getting Help

If you encounter issues that you can't resolve, please:

1. Check the project's GitHub issues to see if it's a known problem
2. Ask for help by creating a new issue with the "question" label

## Tips for Effective Development

1. **Use the Sanity UI components**: Leverage `@sanity/ui` for UI components to maintain consistency with the Sanity ecosystem.

2. **Follow the styled-components pattern**: Use styled-components consistent with the existing code.

3. **Test different scenarios**: Test your changes with different types of events, categories, and filter combinations.

4. **Documentation**: Update documentation for any features you add or change.

5. **Mobile testing**: Test the calendar on different screen sizes, as Sanity Studio is responsive.

6. **Check performance**: Be mindful of performance, especially with many events or complex queries.

7. **Use Sanity color system**: Leverage the `@sanity/color` package for consistent styling.

## Submitting Your Changes

Once you're satisfied with your changes:

1. Commit your changes with a descriptive message:

   ```bash
   git add .
   git commit -m "feat: add new calendar feature"
   ```

2. Push to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

3. Create a pull request from GitHub's interface

See the [CONTRIBUTING.md](../CONTRIBUTING.md) file for more details on the contribution process.
