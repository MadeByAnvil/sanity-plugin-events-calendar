# sanity-plugin-events-calendar

> This is a **Sanity Studio v3** plugin for creating and managing calendar events.

## Installation

```sh
npm install sanity-plugin-events-calendar
```

## Usage

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import {defineConfig} from 'sanity'
import {calendarPlugin} from 'sanity-plugin-events-calendar'

export default defineConfig({
  //...
  plugins: [calendarPlugin()],
})
```

## Features

This plugin provides a comprehensive event management system with the following:

- **Calendar View**: A visual monthly calendar that displays all scheduled events
  - Navigate between months
  - View events by day
  - Click events to edit details

- **Calendar Events**: Create and manage events with support for:
  - Basic event details (title, description, dates)
  - Location information (physical or virtual)
  - Categorization (categories, tags)
  - Recurrence patterns
  - Event status and visibility controls

- **Event Categories**: Organize events by category with customizable colors and icons

- **People**: Associate organizers and participants with events

## Schema Structure

### Calendar Event

The main document type for events includes:

- Title and description
- Start and end date/time
- Location (physical address or virtual meeting link)
- Categories and tags
- Event image
- Organizers (references to people)
- Recurrence settings for repeating events
- Event status (scheduled, cancelled, postponed, etc.)
- Visibility settings
- Attendee management

## License

[MIT](LICENSE) © Casey Zumwalt

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
