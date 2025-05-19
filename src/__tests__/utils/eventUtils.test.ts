import {describe, expect, it} from '@jest/globals'

import {
  CalendarEvent,
  filterEventsByCategory,
  filterEventsByDateRange,
  getEventStatusClass,
  groupEventsByDay,
  isEventFeatured,
  sortEventsByDate,
} from '../../utils/eventUtils'

describe('eventUtils', () => {
  // Mock calendar events for testing
  const mockEvents: CalendarEvent[] = [
    {
      _id: 'event1',
      _type: 'calendarEvent',
      title: 'Event 1',
      startDateTime: '2023-06-15T10:00:00Z',
      endDateTime: '2023-06-15T12:00:00Z',
      categories: [{_ref: 'cat1'}, {_ref: 'cat2'}],
      featured: true,
      status: 'scheduled',
      _createdAt: new Date('2023-06-15T10:00:00Z').toISOString(),
      _updatedAt: new Date('2023-06-15T10:00:00Z').toISOString(),
      _rev: '123',
    },
    {
      _id: 'event2',
      _type: 'calendarEvent',
      title: 'Event 2',
      startDateTime: '2023-06-16T14:00:00Z',
      endDateTime: '2023-06-16T16:00:00Z',
      categories: [{_ref: 'cat1'}],
      featured: false,
      status: 'cancelled',
      _createdAt: new Date('2023-06-16T14:00:00Z').toISOString(),
      _updatedAt: new Date('2023-06-16T14:00:00Z').toISOString(),
      _rev: '123',
    },
    {
      _id: 'event3',
      _type: 'calendarEvent',
      title: 'Event 3',
      startDateTime: '2023-06-17T09:00:00Z',
      endDateTime: '2023-06-17T17:00:00Z',
      categories: [{_ref: 'cat3'}],
      featured: false,
      status: 'postponed',
      _createdAt: new Date('2023-06-17T09:00:00Z').toISOString(),
      _updatedAt: new Date('2023-06-17T09:00:00Z').toISOString(),
      _rev: '123',
    },
    {
      _id: 'event4',
      _type: 'calendarEvent',
      title: 'Event 4',
      startDateTime: '2023-06-15T15:00:00Z',
      endDateTime: '2023-06-15T17:00:00Z',
      featured: false,
      status: 'scheduled',
      _createdAt: new Date('2023-06-15T15:00:00Z').toISOString(),
      _updatedAt: new Date('2023-06-15T15:00:00Z').toISOString(),
      _rev: '123',
    },
  ]

  describe('filterEventsByCategory', () => {
    it('returns all events when categoryId is null', () => {
      const filtered = filterEventsByCategory(mockEvents, null)
      expect(filtered).toEqual(mockEvents)
    })

    it('filters events by category correctly', () => {
      const cat1Events = filterEventsByCategory(mockEvents, 'cat1')
      expect(cat1Events).toHaveLength(2)
      expect(cat1Events[0]._id).toBe('event1')
      expect(cat1Events[1]._id).toBe('event2')

      const cat3Events = filterEventsByCategory(mockEvents, 'cat3')
      expect(cat3Events).toHaveLength(1)
      expect(cat3Events[0]._id).toBe('event3')

      // Non-existent category
      const cat4Events = filterEventsByCategory(mockEvents, 'cat4')
      expect(cat4Events).toHaveLength(0)
    })

    it('handles events without categories', () => {
      const result = filterEventsByCategory(mockEvents, 'cat1')
      expect(result).not.toContain(mockEvents[3]) // event4 has no categories
    })
  })

  describe('filterEventsByDateRange', () => {
    it('filters events within date range', () => {
      const startDate = new Date('2023-06-15T00:00:00Z')
      const endDate = new Date('2023-06-15T23:59:59Z')

      const filtered = filterEventsByDateRange(mockEvents, startDate, endDate)
      expect(filtered).toHaveLength(2)
      expect(filtered[0]._id).toBe('event1')
      expect(filtered[1]._id).toBe('event4')
    })

    it('includes events that span across the range', () => {
      const startDate = new Date('2023-06-16T00:00:00Z')
      const endDate = new Date('2023-06-16T23:59:59Z')

      const filtered = filterEventsByDateRange(mockEvents, startDate, endDate)
      expect(filtered).toHaveLength(1)
      expect(filtered[0]._id).toBe('event2')
    })

    it('returns empty array when no events in range', () => {
      const startDate = new Date('2023-07-01T00:00:00Z')
      const endDate = new Date('2023-07-02T23:59:59Z')

      const filtered = filterEventsByDateRange(mockEvents, startDate, endDate)
      expect(filtered).toHaveLength(0)
    })
  })

  describe('sortEventsByDate', () => {
    it('sorts events by start date in ascending order', () => {
      // Create events in random order
      const unsortedEvents = [
        mockEvents[2], // event3 - June 17
        mockEvents[0], // event1 - June 15 (morning)
        mockEvents[3], // event4 - June 15 (afternoon)
        mockEvents[1], // event2 - June 16
      ]

      const sorted = sortEventsByDate(unsortedEvents)

      expect(sorted[0]._id).toBe('event1') // Earliest - June 15 morning
      expect(sorted[1]._id).toBe('event4') // June 15 afternoon
      expect(sorted[2]._id).toBe('event2') // June 16
      expect(sorted[3]._id).toBe('event3') // Latest - June 17
    })

    it('does not modify the original array', () => {
      const original = [...mockEvents]
      sortEventsByDate(mockEvents)
      expect(mockEvents).toEqual(original)
    })
  })

  describe('groupEventsByDay', () => {
    it('groups events by day correctly', () => {
      const grouped = groupEventsByDay(mockEvents)

      // Should have 3 days
      expect(Object.keys(grouped)).toHaveLength(3)

      // Check specific dates
      expect(grouped['2023-06-15']).toBeDefined()
      expect(grouped['2023-06-16']).toBeDefined()
      expect(grouped['2023-06-17']).toBeDefined()

      // Check event counts per day
      expect(grouped['2023-06-15']).toHaveLength(2) // event1 and event4
      expect(grouped['2023-06-16']).toHaveLength(1) // event2
      expect(grouped['2023-06-17']).toHaveLength(1) // event3
    })

    it('sorts events within each day', () => {
      const grouped = groupEventsByDay(mockEvents)

      // Check that events on June 15 are sorted by time
      const june15Events = grouped['2023-06-15']
      expect(june15Events[0]._id).toBe('event1') // 10:00 AM
      expect(june15Events[1]._id).toBe('event4') // 3:00 PM
    })
  })

  describe('isEventFeatured', () => {
    it('returns true for featured events', () => {
      expect(isEventFeatured(mockEvents[0])).toBe(true) // event1
    })

    it('returns false for non-featured events', () => {
      expect(isEventFeatured(mockEvents[1])).toBe(false) // event2
      expect(isEventFeatured(mockEvents[2])).toBe(false) // event3
    })

    it('handles events without featured property', () => {
      const eventWithoutFeatured = {
        _id: 'test',
        _type: 'calendarEvent',
        title: 'Test',
        startDateTime: '2023-06-15T10:00:00Z',
        _createdAt: new Date('2023-06-15T10:00:00Z').toISOString(),
        _updatedAt: new Date('2023-06-15T10:00:00Z').toISOString(),
        _rev: '123',
      }
      expect(isEventFeatured(eventWithoutFeatured)).toBe(false)
    })
  })

  describe('getEventStatusClass', () => {
    it('returns correct class for cancelled events', () => {
      expect(getEventStatusClass(mockEvents[1])).toBe('cancelled')
    })

    it('returns correct class for postponed events', () => {
      expect(getEventStatusClass(mockEvents[2])).toBe('postponed')
    })

    it('returns featured class for featured events', () => {
      expect(getEventStatusClass(mockEvents[0])).toBe('featured')
    })

    it('returns default class for normal events', () => {
      expect(getEventStatusClass(mockEvents[3])).toBe('default')
    })

    it('handles events with rescheduled status', () => {
      const rescheduledEvent = {
        ...mockEvents[3],
        status: 'rescheduled' as 'scheduled' | 'cancelled' | 'postponed' | 'rescheduled',
      }
      expect(getEventStatusClass(rescheduledEvent)).toBe('rescheduled')
    })
  })
})
