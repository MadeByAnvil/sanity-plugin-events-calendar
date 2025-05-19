import {SanityDocument} from 'sanity'

export interface CalendarEvent extends SanityDocument {
  _id: string
  _createdAt: string
  _updatedAt: string
  _rev: string
  title: string
  startDateTime: string
  endDateTime?: string
  allDay?: boolean
  status?: 'scheduled' | 'cancelled' | 'postponed' | 'rescheduled'
  categories?: Array<{_ref: string}>
  featured?: boolean
  visibility?: 'public' | 'private' | 'draft'
  [key: string]: unknown
}

export interface EventCategory extends SanityDocument {
  _id: string
  title: string
  color?: string
  [key: string]: unknown
}

/**
 * Filter events by a specific category ID
 * @param events Array of events to filter
 * @param categoryId The category ID to filter by
 * @returns Filtered array of events
 */
export const filterEventsByCategory = (
  events: CalendarEvent[],
  categoryId: string | null,
): CalendarEvent[] => {
  if (!categoryId) return events

  return events.filter((event) => {
    if (!event.categories) return false
    return event.categories.some((category) => category._ref === categoryId)
  })
}

/**
 * Filter events by a date range
 * @param events Array of events to filter
 * @param startDate Start date of the range
 * @param endDate End date of the range
 * @returns Filtered array of events
 */
export const filterEventsByDateRange = (
  events: CalendarEvent[],
  startDate: Date,
  endDate: Date,
): CalendarEvent[] => {
  return events.filter((event) => {
    const eventStart = new Date(event.startDateTime)

    // If there's an end date, use it, otherwise assume it ends on the start date
    const eventEnd = event.endDateTime ? new Date(event.endDateTime) : new Date(event.startDateTime)

    // Check if the event overlaps with the range
    return (
      (eventStart >= startDate && eventStart <= endDate) || // Event starts in the range
      (eventEnd >= startDate && eventEnd <= endDate) || // Event ends in the range
      (eventStart <= startDate && eventEnd >= endDate) // Event spans the entire range
    )
  })
}

/**
 * Sort events by start date (ascending)
 * @param events Array of events to sort
 * @returns Sorted array of events
 */
export const sortEventsByDate = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort((a, b) => {
    return new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
  })
}

/**
 * Group events by day
 * @param events Array of events to group
 * @returns Object with dates as keys and arrays of events as values
 */
export const groupEventsByDay = (events: CalendarEvent[]): Record<string, CalendarEvent[]> => {
  const groupedEvents: Record<string, CalendarEvent[]> = {}

  events.forEach((event) => {
    const startDate = new Date(event.startDateTime)
    const dateKey = startDate.toISOString().split('T')[0] // YYYY-MM-DD

    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = []
    }

    groupedEvents[dateKey].push(event)
  })

  // Sort events within each day
  Object.keys(groupedEvents).forEach((day) => {
    groupedEvents[day] = sortEventsByDate(groupedEvents[day])
  })

  return groupedEvents
}

/**
 * Check if an event is featured
 * @param event The event to check
 * @returns True if the event is featured
 */
export const isEventFeatured = (event: CalendarEvent): boolean => {
  return !!event.featured
}

/**
 * Get CSS class modifier based on event status
 * @param event The event to check
 * @returns Class modifier string
 */
export const getEventStatusClass = (event: CalendarEvent): string => {
  switch (event.status) {
    case 'cancelled':
      return 'cancelled'
    case 'postponed':
      return 'postponed'
    case 'rescheduled':
      return 'rescheduled'
    default:
      return isEventFeatured(event) ? 'featured' : 'default'
  }
}
