# sanity-plugin-events-calendar

[![CI & Release](https://github.com/madebyanvil/sanity-plugin-events-calendar/actions/workflows/main.yml/badge.svg)](https://github.com/madebyanvil/sanity-plugin-events-calendar/actions/workflows/main.yml)
[![npm version](https://img.shields.io/npm/v/sanity-plugin-events-calendar.svg?style=flat)](https://www.npmjs.com/package/sanity-plugin-events-calendar)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/sanity-plugin-events-calendar?label=gzip%20size)](https://bundlephobia.com/package/sanity-plugin-events-calendar)
[![GitHub license](https://img.shields.io/github/license/madebyanvil/sanity-plugin-events-calendar)](https://github.com/madebyanvil/sanity-plugin-events-calendar/blob/main/LICENSE)

> This is a **Sanity Studio v3** plugin for creating and managing calendar events.

## Installation

```sh
npm install sanity-plugin-events-calendar
```

or

```sh
yarn add sanity-plugin-events-calendar
```

or

```sh
pnpm add sanity-plugin-events-calendar
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

View the [Usage Guide](./docs/usage-guide.md) documentation for more information on how to use the plugin.

## GROQ Query Examples

View the [GROQ Query Examples](./docs/groq-examples.md) documentation for more information on how to query calendar events.

### Get all upcoming events

```groq
*[_type == "calendarEvent" && startDateTime > now()] | order(startDateTime asc)
```

### Get events for a specific month

```groq
*[
  _type == "calendarEvent" &&
  startDateTime >= $startDate &&
  startDateTime <= $endDate
] | order(startDateTime asc)
```

### Get events for a specific category

```groq
*[
  _type == "calendarEvent" &&
  count(categories[references($categoryId)]) > 0
] | order(startDateTime asc)
```

### Get featured events

```groq
*[_type == "calendarEvent" && featured == true] | order(startDateTime asc)
```

### Get events with full references

```groq
*[_type == "calendarEvent"] {
  _id,
  title,
  startDateTime,
  endDateTime,
  allDay,
  status,
  featured,
  "categories": categories[]-> {
    _id,
    title,
    color
  },
  "organizers": organizers[]-> {
    _id,
    name,
    role,
    image
  },
  "slug": slug.current
}
```

## Integration with Frontend Libraries

View the [Frontend Integration](./docs/frontend-integration.md) documentation for more information on how to integrate calendar data with your frontend.

## License

[MIT](LICENSE) © Casey Zumwalt

## Documentation

For more detailed documentation:

- [Usage Guide](./docs/usage-guide.md) - How to use the calendar plugin
- [GROQ Query Examples](./docs/groq-examples.md) - Sample GROQ queries for calendar events
- [Frontend Integration](./docs/frontend-integration.md) - Using events with React Big Calendar, FullCalendar, and frameworks
- [Local Development](./docs/local-development.md) - Guide for local development
- [Contributing](./CONTRIBUTING.md) - Guidelines for contributing to the project

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
