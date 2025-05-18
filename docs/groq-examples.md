# GROQ Query Examples for Sanity Calendar

This document provides useful GROQ query examples for working with the Sanity Calendar plugin.

## Basic Queries

### Get all calendar events

```groq
*[_type == "calendarEvent"]
```

### Get upcoming events

```groq
*[_type == "calendarEvent" && startDateTime > now()] | order(startDateTime asc)
```

### Get past events

```groq
*[_type == "calendarEvent" && startDateTime < now()] | order(startDateTime desc)
```

### Get events for today

```groq
*[
  _type == "calendarEvent" && 
  startDateTime >= datetime(now().year, now().month, now().day, 0, 0, 0, 0) &&
  startDateTime <= datetime(now().year, now().month, now().day, 23, 59, 59, 0)
] | order(startDateTime asc)
```

## Date-Based Filtering

### Get events for a specific date range

```groq
*[
  _type == "calendarEvent" && 
  startDateTime >= $startDate && 
  startDateTime <= $endDate
] | order(startDateTime asc)
```

### Get events for current month

```groq
*[
  _type == "calendarEvent" && 
  startDateTime >= datetime(now().year, now().month, 1, 0, 0, 0, 0) &&
  startDateTime < datetime(now().year, now().month+1, 1, 0, 0, 0, 0)
] | order(startDateTime asc)
```

### Get events for next 7 days

```groq
*[
  _type == "calendarEvent" && 
  startDateTime >= now() &&
  startDateTime <= dateTime(now() + 60*60*24*7)
] | order(startDateTime asc)
```

## Category Filtering

### Get events for a specific category

```groq
*[
  _type == "calendarEvent" && 
  count(categories[references($categoryId)]) > 0
] | order(startDateTime asc)
```

### Get events for multiple categories (OR logic)

```groq
*[
  _type == "calendarEvent" && 
  count(categories[references([$category1, $category2])]) > 0
] | order(startDateTime asc)
```

### Get events that have ALL specified categories (AND logic)

```groq
*[
  _type == "calendarEvent" && 
  count(categories[references($category1)]) > 0 &&
  count(categories[references($category2)]) > 0
] | order(startDateTime asc)
```

## Status Filtering

### Get featured events

```groq
*[_type == "calendarEvent" && featured == true] | order(startDateTime asc)
```

### Get cancelled events

```groq
*[_type == "calendarEvent" && status == "cancelled"] | order(startDateTime asc)
```

### Get postponed events

```groq
*[_type == "calendarEvent" && status == "postponed"] | order(startDateTime asc)
```

### Get all non-cancelled events

```groq
*[_type == "calendarEvent" && status != "cancelled"] | order(startDateTime asc)
```

## Location-Based Filtering

### Get physical events

```groq
*[
  _type == "calendarEvent" && 
  locationType == "physical"
] | order(startDateTime asc)
```

### Get virtual events

```groq
*[
  _type == "calendarEvent" && 
  locationType == "virtual"
] | order(startDateTime asc)
```

### Get hybrid events

```groq
*[
  _type == "calendarEvent" && 
  locationType == "hybrid"
] | order(startDateTime asc)
```

## Projections and References

### Basic event projection with references

```groq
*[_type == "calendarEvent"] {
  _id,
  title,
  startDateTime,
  endDateTime,
  allDay,
  status,
  featured,
  "slug": slug.current,
  "categories": categories[]-> {
    _id,
    title,
    color
  }
}
```

### Complete event projection

```groq
*[_type == "calendarEvent"] {
  _id,
  _type,
  title,
  "slug": slug.current,
  description,
  startDateTime,
  endDateTime,
  allDay,
  status,
  featured,
  
  // Location information
  locationType,
  location {
    name,
    address,
    city,
    state,
    zipCode,
    country,
    coordinates,
    accessibilityInfo,
    parkingInfo
  },
  
  // Virtual event details
  virtualEvent {
    platform,
    platformOther,
    url,
    meetingId,
    password,
    joinInstructions
  },
  
  // Categories with references
  "categories": categories[]-> {
    _id,
    title,
    color,
    colorName,
    "slug": slug.current
  },
  
  // Tags
  tags,
  
  // Organizers with references
  "organizers": organizers[]-> {
    _id,
    name,
    role,
    organization,
    "image": image.asset->url
  },
  
  // Media
  "image": image.asset->url,
  "imageAlt": image.alt,
  "gallery": gallery[] {
    "url": asset->url,
    "alt": alt
  },
  
  // Recurrence information 
  isRecurring,
  recurrenceSettings,
  
  // Attendee settings
  requiresRegistration,
  attendeeSettings,
  
  // Event settings
  visibility
}
```

### Category projection

```groq
*[_type == "eventCategory"] {
  _id,
  title,
  "slug": slug.current,
  description,
  color,
  colorName,
  displayOrder,
  featured,
  "icon": icon.asset->url
}
```

### Person/Organizer projection

```groq
*[_type == "person"] {
  _id,
  name,
  "slug": slug.current,
  role,
  organization,
  "image": image.asset->url,
  email,
  phone,
  website,
  socialMedia,
  shortBio,
  fullBio,
  expertise,
  isOrganizer
}
```

## Advanced Queries

### Get events with specific tags

```groq
*[_type == "calendarEvent" && $tag in tags] | order(startDateTime asc)
```

### Get recurring events

```groq
*[_type == "calendarEvent" && isRecurring == true] | order(startDateTime asc)
```

### Get events with specific organizer

```groq
*[
  _type == "calendarEvent" && 
  count(organizers[references($organizerId)]) > 0
] | order(startDateTime asc)
```

### Find upcoming events by location

```groq
*[
  _type == "calendarEvent" && 
  startDateTime > now() &&
  locationType == "physical" &&
  location.city == $city
] | order(startDateTime asc)
```

### Count upcoming events by category

```groq
{
  "total": count(*[_type == "calendarEvent" && startDateTime > now()]),
  "byCategory": *[_type == "eventCategory"] {
    _id,
    title,
    "count": count(*[
      _type == "calendarEvent" && 
      startDateTime > now() && 
      count(categories[references(^._id)]) > 0
    ])
  }
}
```

### Get the next 3 upcoming events

```groq
*[_type == "calendarEvent" && startDateTime > now()] | order(startDateTime asc)[0...3]
```

### Get events for current and next month

```groq
*[
  _type == "calendarEvent" && 
  startDateTime >= datetime(now().year, now().month, 1, 0, 0, 0, 0) &&
  startDateTime < datetime(
    now().month == 12 ? now().year + 1 : now().year, 
    now().month == 12 ? 1 : now().month + 2, 
    1, 0, 0, 0, 0
  )
] | order(startDateTime asc)
```

### Get featured events that aren't cancelled

```groq
*[
  _type == "calendarEvent" && 
  featured == true && 
  status != "cancelled"
] | order(startDateTime asc)
```

## Parameter Examples

Here's an example of using parameters with the queries:

```js
// For date range queries
const startDate = new Date('2023-01-01').toISOString()
const endDate = new Date('2023-01-31').toISOString()

const events = await client.fetch(`
  *[
    _type == "calendarEvent" && 
    startDateTime >= $startDate && 
    startDateTime <= $endDate
  ] | order(startDateTime asc)
`, { startDate, endDate })

// For category filtering
const categoryId = "abc123"

const events = await client.fetch(`
  *[
    _type == "calendarEvent" && 
    count(categories[references($categoryId)]) > 0
  ] | order(startDateTime asc)
`, { categoryId })
```