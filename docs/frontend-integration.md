# Frontend Integration Guide

This guide provides examples of how to integrate the Sanity Calendar plugin with popular frontend frameworks and calendar libraries.

## Table of Contents

- [GROQ Queries](#groq-queries)
- [React Big Calendar](#react-big-calendar)
- [FullCalendar](#fullcalendar)
- [Next.js Integration](#nextjs-integration)
- [Gatsby Integration](#gatsby-integration)
- [Vue.js Integration](#vuejs-integration)

## GROQ Queries

Here are common GROQ queries for working with calendar events:

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
  location,
  virtualEvent,
  "slug": slug.current
}
```

## React Big Calendar

[React Big Calendar](https://github.com/jquense/react-big-calendar) is a popular calendar component for React applications.

### Installation

```bash
npm install react-big-calendar moment
# or
yarn add react-big-calendar moment
```

### Basic Integration

```jsx
import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import sanityClient from './sanityClient' // Your Sanity client setup

// Setup the localizer
const localizer = momentLocalizer(moment)

// Function to convert Sanity event data to React Big Calendar format
const convertSanityEvents = (events) => {
  return events.map(event => ({
    id: event._id,
    title: event.title,
    start: new Date(event.startDateTime),
    end: event.endDateTime ? new Date(event.endDateTime) : new Date(event.startDateTime),
    allDay: event.allDay || false,
    resource: event // Pass the entire event as a resource
  }))
}

// Custom event renderer to style events based on status
const EventComponent = ({ event }) => {
  const sanityEvent = event.resource
  let backgroundColor = '#93c5fd' // Default
  
  if (sanityEvent.status === 'cancelled') {
    backgroundColor = '#ef4444' // Red
  } else if (sanityEvent.status === 'postponed') {
    backgroundColor = '#f59e0b' // Orange
  } else if (sanityEvent.featured) {
    backgroundColor = '#4ade80' // Green
  }
  
  return (
    <div
      style={{
        backgroundColor,
        color: '#fff',
        borderRadius: '4px',
        padding: '2px 5px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        height: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {sanityEvent.featured && '★ '}
      {event.title}
      {sanityEvent.status === 'cancelled' && ' (Cancelled)'}
      {sanityEvent.status === 'postponed' && ' (Postponed)'}
    </div>
  )
}

function EventCalendar() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchEvents() {
      try {
        // Fetch events from Sanity
        const sanityEvents = await sanityClient.fetch(`
          *[_type == "calendarEvent" && startDateTime > dateTime(now() - 60*60*24*30) && startDateTime < dateTime(now() + 60*60*24*90)] | order(startDateTime asc) {
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
            }
          }
        `)
        
        setEvents(convertSanityEvents(sanityEvents))
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [])
  
  if (loading) {
    return <div>Loading events...</div>
  }
  
  return (
    <div style={{ height: 700 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        components={{
          event: EventComponent
        }}
        popup
        selectable
        onSelectEvent={(event) => {
          // Handle event click - e.g., navigate to event detail page
          console.log('Event clicked:', event.resource)
        }}
      />
    </div>
  )
}

export default EventCalendar
```

### Advanced Customization

For more advanced use cases:

- Filter events by category:

```jsx
function FilterableCalendar() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  
  // Fetch categories and events (implementation omitted)
  
  // Filter events when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setFilteredEvents(allEvents)
    } else {
      setFilteredEvents(
        allEvents.filter(event => 
          event.resource.categories?.some(cat => cat._id === selectedCategory)
        )
      )
    }
  }, [selectedCategory, allEvents])
  
  return (
    <>
      <div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.title}</option>
          ))}
        </select>
      </div>
      
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        /* other props */
      />
    </>
  )
}
```

## FullCalendar

[FullCalendar](https://fullcalendar.io/) offers more advanced features like timeline views.

### Installation

```bash
npm install @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```

### Basic Integration

```jsx
import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import sanityClient from './sanityClient'

// Function to convert Sanity event data to FullCalendar format
const convertSanityEvents = (events) => {
  return events.map(event => ({
    id: event._id,
    title: event.title,
    start: event.startDateTime,
    end: event.endDateTime || null,
    allDay: event.allDay || false,
    backgroundColor: getEventColor(event),
    borderColor: getEventBorderColor(event),
    textColor: '#ffffff',
    extendedProps: {
      ...event // Include all original data
    }
  }))
}

// Helper functions for styling
function getEventColor(event) {
  if (event.featured) return '#4ade80' // Green for featured
  return '#93c5fd' // Default blue
}

function getEventBorderColor(event) {
  if (event.status === 'cancelled') return '#ef4444' // Red for cancelled
  if (event.status === 'postponed') return '#f59e0b' // Orange for postponed
  return '#93c5fd' // Default blue
}

function EventCalendar() {
  const [events, setEvents] = useState([])
  
  useEffect(() => {
    // Fetch events from Sanity (implementation omitted)
  }, [])
  
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      events={events}
      eventClick={(info) => {
        const sanityEvent = info.event.extendedProps
        // Show event details in a modal or navigate to event page
      }}
      eventContent={(eventInfo) => {
        const sanityEvent = eventInfo.event.extendedProps
        return (
          <>
            <div className="fc-event-title">
              {sanityEvent.featured && '★ '}
              {eventInfo.event.title}
              {sanityEvent.status === 'cancelled' && ' (Cancelled)'}
              {sanityEvent.status === 'postponed' && ' (Postponed)'}
            </div>
            {!eventInfo.event.allDay && (
              <div className="fc-event-time">
                {eventInfo.timeText}
              </div>
            )}
          </>
        )
      }}
    />
  )
}

export default EventCalendar
```

### Category Filtering with FullCalendar

```jsx
function FilterableFullCalendar() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [calendarRef, setCalendarRef] = useState(null)
  
  // Fetch categories from Sanity (implementation omitted)
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    
    if (calendarRef) {
      const calendarApi = calendarRef.getApi()
      calendarApi.removeAllEventSources()
      
      // Construct GROQ query with category filter if needed
      const query = categoryId ? 
        `*[_type == "calendarEvent" && count(categories[references("${categoryId}")]) > 0]` :
        `*[_type == "calendarEvent"]`
      
      // Add the complete query with projections (implementation omitted)
      
      // Fetch and render new events (implementation omitted)
    }
  }
  
  return (
    <>
      <div>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.title}</option>
          ))}
        </select>
      </div>
      
      <FullCalendar
        ref={setCalendarRef}
        /* other props */
      />
    </>
  )
}
```

## Next.js Integration

Here's how to use the calendar events in a Next.js application:

### Basic Integration

```jsx
// pages/events.js
import { createClient } from 'next-sanity'
import { Calendar } from 'react-big-calendar' // Or your chosen calendar library

// Setup Sanity client
const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true
})

export async function getStaticProps() {
  const events = await client.fetch(`
    *[_type == "calendarEvent" && startDateTime > now()] | order(startDateTime asc) {
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
  `)
  
  return {
    props: {
      events
    },
    revalidate: 60 // ISR: update every minute
  }
}

// Then use with your preferred calendar component
function EventsPage({ events }) {
  // Convert events for your chosen calendar library
  return (
    <Layout>
      <h1>Events Calendar</h1>
      {/* Your calendar component using the events data */}
    </Layout>
  )
}

export default EventsPage
```

### Dynamic Event Pages

```jsx
// pages/events/[slug].js
import { createClient } from 'next-sanity'
import { PortableText } from '@portabletext/react'

// Setup Sanity client (implementation omitted)

export async function getStaticPaths() {
  const events = await client.fetch(`
    *[_type == "calendarEvent" && defined(slug.current)][].slug.current
  `)
  
  return {
    paths: events.map(slug => ({ params: { slug } })),
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params
  
  const event = await client.fetch(`
    *[_type == "calendarEvent" && slug.current == $slug][0] {
      _id,
      title,
      description,
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
      },
      "organizers": organizers[]-> {
        _id,
        name,
        role,
        image
      },
      location,
      virtualEvent
    }
  `, { slug })
  
  if (!event) {
    return { notFound: true }
  }
  
  return {
    props: {
      event
    },
    revalidate: 60
  }
}

function EventPage({ event }) {
  // Format dates for display
  const formattedStartDate = new Date(event.startDateTime).toLocaleDateString()
  const formattedStartTime = event.allDay ? 'All Day' : new Date(event.startDateTime).toLocaleTimeString()
  
  return (
    <div>
      <h1>{event.title}</h1>
      
      {/* Event status badge */}
      {event.status === 'cancelled' && <span className="badge cancelled">Cancelled</span>}
      {event.status === 'postponed' && <span className="badge postponed">Postponed</span>}
      {event.featured && <span className="badge featured">Featured Event</span>}
      
      <div className="event-meta">
        <div className="date-time">
          <h3>When</h3>
          <p>{formattedStartDate} at {formattedStartTime}</p>
        </div>
        
        {/* Location information - physical or virtual */}
        <div className="location">
          <h3>Where</h3>
          {event.location && (
            <p>{event.location.name}, {event.location.address}</p>
          )}
          {event.virtualEvent && (
            <p>Virtual Event on {event.virtualEvent.platform}</p>
          )}
        </div>
      </div>
      
      {/* Event description */}
      <div className="description">
        <h3>About this event</h3>
        <p>{event.description}</p>
      </div>
      
      {/* Categories */}
      {event.categories && event.categories.length > 0 && (
        <div className="categories">
          <h3>Categories</h3>
          <div className="category-list">
            {event.categories.map(category => (
              <span 
                key={category._id} 
                className="category"
                style={{
                  backgroundColor: category.color || '#ddd'
                }}
              >
                {category.title}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Organizers */}
      {event.organizers && event.organizers.length > 0 && (
        <div className="organizers">
          <h3>Organizers</h3>
          <div className="organizer-list">
            {event.organizers.map(person => (
              <div key={person._id} className="organizer">
                {person.image && (
                  <img 
                    src={/* Image URL transform */} 
                    alt={person.name} 
                    className="organizer-image" 
                  />
                )}
                <div className="organizer-info">
                  <strong>{person.name}</strong>
                  {person.role && <span>{person.role}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EventPage
```

## Gatsby Integration

Here's how to use calendar events in a Gatsby site:

```jsx
// In gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-sanity',
      options: {
        projectId: 'your-project-id',
        dataset: 'production',
        token: process.env.SANITY_TOKEN, // Optional
        watchMode: process.env.NODE_ENV === 'development',
        overlayDrafts: process.env.NODE_ENV === 'development'
      }
    }
  ]
}

// In gatsby-node.js
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  
  const result = await graphql(`
    {
      allSanityCalendarEvent {
        nodes {
          slug {
            current
          }
        }
      }
    }
  `)
  
  result.data.allSanityCalendarEvent.nodes.forEach(node => {
    createPage({
      path: `/events/${node.slug.current}`,
      component: require.resolve('./src/templates/event.js'),
      context: {
        slug: node.slug.current
      }
    })
  })
}

// In src/pages/events.js
import React from 'react'
import { graphql } from 'gatsby'
import Calendar from 'react-big-calendar' // Or your chosen calendar library

export const query = graphql`
  query EventsQuery {
    allSanityCalendarEvent(
      sort: {startDateTime: ASC}
      filter: {startDateTime: {gt: "now"}}
    ) {
      nodes {
        _id
        title
        startDateTime
        endDateTime
        allDay
        status
        featured
        slug {
          current
        }
        categories {
          _id
          title
          color
        }
      }
    }
  }
`

function EventsPage({ data }) {
  const events = data.allSanityCalendarEvent.nodes.map(event => ({
    id: event._id,
    title: event.title,
    start: new Date(event.startDateTime),
    end: event.endDateTime ? new Date(event.endDateTime) : new Date(event.startDateTime),
    allDay: event.allDay || false,
    slug: event.slug.current,
    status: event.status,
    featured: event.featured,
    categories: event.categories
  }))
  
  return (
    <Layout>
      <h1>Events Calendar</h1>
      {/* Your calendar component using the events data */}
    </Layout>
  )
}

export default EventsPage
```

## Vue.js Integration

Here's how to use calendar events in a Vue.js application:

### With Vue Calendar

Using the Vue FullCalendar wrapper:

```vue
<template>
  <div>
    <h1>Events Calendar</h1>
    <full-calendar 
      :options="calendarOptions"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import sanityClient from '../sanityClient'

export default {
  components: {
    FullCalendar
  },
  setup() {
    const events = ref([])
    
    // Calendar options
    const calendarOptions = ref({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [],
      eventClick: handleEventClick
    })
    
    // Handle event click
    function handleEventClick(info) {
      const sanityEvent = info.event.extendedProps
      // Show event details or navigate to event page
    }
    
    // Function to convert Sanity event data to FullCalendar format
    function convertSanityEvents(sanityEvents) {
      return sanityEvents.map(event => ({
        id: event._id,
        title: event.title,
        start: event.startDateTime,
        end: event.endDateTime || null,
        allDay: event.allDay || false,
        backgroundColor: event.featured ? '#4ade80' : '#93c5fd',
        borderColor: event.status === 'cancelled' ? '#ef4444' : 
                   event.status === 'postponed' ? '#f59e0b' : 
                   '#93c5fd',
        textColor: '#ffffff',
        extendedProps: {
          ...event
        }
      }))
    }
    
    // Fetch events from Sanity
    onMounted(async () => {
      try {
        const sanityEvents = await sanityClient.fetch(`
          *[_type == "calendarEvent" && startDateTime > now()] | order(startDateTime asc) {
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
        `)
        
        const formattedEvents = convertSanityEvents(sanityEvents)
        events.value = formattedEvents
        
        // Update calendar options with events
        calendarOptions.value.events = formattedEvents
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    })
    
    return {
      calendarOptions
    }
  }
}
</script>
```

## Additional Resources

- [GROQ Cheat Sheet](https://www.sanity.io/docs/query-cheat-sheet)
- [React Big Calendar Documentation](https://github.com/jquense/react-big-calendar)
- [FullCalendar Documentation](https://fullcalendar.io/docs)
- [Sanity Client Libraries](https://www.sanity.io/docs/client-libraries)