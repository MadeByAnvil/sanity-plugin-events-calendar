# Sanity Calendar Plugin Usage Guide

## Introduction

This plugin provides a comprehensive calendar system for Sanity Studio. It adds:

1. A calendar tool interface in Sanity Studio
2. Document schemas for events, categories, and people
3. A visual monthly calendar to manage events

## Getting Started

### Installation

Add the plugin to your Sanity Studio project:

```bash
npm install sanity-plugin-events-calendar
```

### Configuration

Add the plugin to your `sanity.config.ts` (or `.js`):

```ts
import {defineConfig} from 'sanity'
import {calendarPlugin} from 'sanity-plugin-events-calendar'

export default defineConfig({
  // ...your other config
  plugins: [
    // ...your other plugins
    calendarPlugin()
  ],
})
```

## Using the Calendar

Once installed, you'll see a new "Calendar" tool in your Sanity Studio sidebar. Clicking it will open the calendar interface.

### Calendar Interface

The calendar provides the following features:

- Monthly view with navigation controls
- Day cells showing events for each day
- Color-coded event indicators based on status (normal, featured, cancelled, postponed)
- Category filtering via dropdown
- Quick date selection via month/year picker
- Create buttons for events and categories

### Working with Events

#### Creating Events

1. Click the "+ Create New Event" button in the calendar interface
2. Fill in the event details in the form:
   - Basic Information: title, slug, description, organizers
   - Event Date & Time: start/end date, all-day setting, status
   - Event Location: physical or virtual location details
   - Categories & Tags: assign event to categories and add tags
   - Media & Content: add images for the event
   - Recurrence Settings: set up repeating events
   - Attendees & Registration: configure registration options
   - Event Settings: visibility and featured status

#### Editing Events

1. Click on any event in the calendar to open it for editing
2. Make your changes in the event form
3. Save the document when finished

#### Event Status

Events can have different status settings that affect their appearance:

- **Normal**: Default blue styling
- **Featured**: Green styling with a star icon
- **Cancelled**: Red styling with strikethrough text and "Cancelled" label
- **Postponed**: Orange styling with italic text and "Postponed" label

### Working with Categories

Categories allow you to organize events by type and add visual indicators.

#### Creating Categories

1. Click the "Create Category" button in the calendar interface
2. Fill in the category details:
   - Category Name: the display name
   - Slug: URL-friendly identifier (auto-generated)
   - Description: brief explanation of the category
   - Color: hex color code for visual indicators (#RRGGBB format)
   - Color Name: user-friendly name for the color
   - Icon: optional image for the category
   - Display Order: control the sort order in lists
   - Featured Category: toggle to mark as featured

#### Using Categories with Events

1. When creating or editing an event, scroll to the "Categories & Tags" section
2. Select one or more categories from the dropdown
3. Events will display color indicators based on their assigned categories
4. Use the category filter in the calendar to show only events from a specific category

### Working with People

The plugin includes a "Person" schema for organizing event participants.

#### Creating People Entries

1. Go to the Content section in Sanity Studio
2. Create a new "Person" document
3. Fill in the person's details:
   - Full Name, Role, Organization
   - Contact information
   - Biography and expertise
   - Mark as "Event Organizer" if they'll be organizing events

#### Assigning People to Events

When creating or editing an event, you can assign organizers from the "Organizers" field in the Basic Information section.

## Developer Reference

### Schema Types

The plugin provides three main schema types:

1. `calendarEvent`: The main event document type
2. `eventCategory`: Categories for organizing events
3. `person`: People associated with events

These schemas are automatically added to your Sanity Studio when you install the plugin.

### Querying Events

See the [GROQ Examples](./groq-examples.md) documentation for detailed query examples.

Basic query for upcoming events:

```groq
*[_type == "calendarEvent" && startDateTime > now()] | order(startDateTime asc)
```

### Frontend Integration

See the [Frontend Integration Guide](./frontend-integration.md) for examples of using these calendar events in your frontend applications with popular calendar libraries like React Big Calendar and FullCalendar.

## Customization

### Styling Your Calendar Frontend

While the plugin handles the Sanity Studio interface, you'll need to style your frontend calendar presentation. The plugin is designed to work well with:

- React Big Calendar
- FullCalendar
- Custom calendar implementations

See the frontend integration guide for detailed examples.

### Using Event Data

Events include fields for:

- Basic metadata (title, description)
- Date and time information
- Location (physical or virtual)
- Status indicators (featured, cancelled, postponed)
- Categories and tags
- Images and media
- Recurrence patterns
- Registration settings

These can all be queried and used in your frontend application as needed.

## Troubleshooting

### Events Not Showing in Calendar

If events aren't appearing in the calendar view:

1. Verify the event's start date is correct
2. Check that the event's status isn't set to "Draft" in visibility settings
3. If filtering by category, ensure the event has the correct category assigned
4. Confirm the event is published (not a draft)

### Category Colors Not Working

If category colors aren't showing correctly:

1. Ensure the color is a valid hex code (e.g., #FF0000 for red)
2. Check that the event is properly assigned to the category
3. Make sure the category document is published

For more help, see the [Sanity Documentation](https://www.sanity.io/docs) or file an issue on the plugin GitHub repository.