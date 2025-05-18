import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useClient} from 'sanity'

import EventItem from './EventItem'

export type Event = {
  _id: string
  _type: string
  title: string
  startDateTime: string
  endDateTime?: string
  allDay: boolean
  status?: string
  featured?: boolean
  categories?: {_id: string; title: string; color?: string}[]
}

export type Category = {
  _id: string
  title: string
  color?: string
}

type CalendarViewProps = {
  onEventClick?: (id: string) => void
}

export function CalendarView(props: CalendarViewProps): React.ReactElement {
  const {onEventClick} = props
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const client = useClient({apiVersion: '2023-01-01'})
  // No structure API used directly in this component

  // Get the first day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  // Get day of week (0 = Sunday, 6 = Saturday)
  const startDay = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  // Debounce function to limit API calls
  const useDebouncedEffect = (effect: () => void, deps: readonly unknown[], delay = 300) => {
    const callback = useCallback(() => {
      effect()
    }, [effect])

    useEffect(() => {
      const handler = setTimeout(() => {
        callback()
      }, delay)

      return () => {
        clearTimeout(handler)
      }
    }, [callback, delay])
  }

  // Cache previous month's events to prevent unnecessary requests
  const eventsCache = useRef(new Map())
  const cacheKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`

  // Fetch categories once when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const query = `*[_type == "eventCategory" && !(_id in path('drafts.**'))] | order(displayOrder asc, title asc) {
          _id,
          title,
          color
        }`

        const result = await client.fetch(query)
        setCategories(result)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [client])

  useDebouncedEffect(
    () => {
      const fetchEvents = async () => {
        // Generate unique cache key that includes category filter
        const categoryFilterKey = selectedCategory ? `-cat-${selectedCategory}` : ''
        const fullCacheKey = `${cacheKey}${categoryFilterKey}`

        // Check if we already have data for this month with this filter in the cache
        if (eventsCache.current.has(fullCacheKey)) {
          setEvents(eventsCache.current.get(fullCacheKey))
          return
        }

        setIsLoading(true)
        try {
          // Format the date range for GROQ query
          const startOfMonth = firstDayOfMonth.toISOString()
          const endOfMonth = lastDayOfMonth.toISOString()

          // Build category filter if needed
          const categoryFilter = selectedCategory
            ? `&& count(categories[references("${selectedCategory}")]) > 0`
            : ''

          // Fetch events for the current month with a reasonable limit
          // Only include published documents (not drafts) by filtering !(_id in path('drafts.**'))
          const query = `*[
            _type == "calendarEvent" &&
            !(_id in path('drafts.**')) &&
            startDateTime >= $startDate &&
            startDateTime <= $endDate
            ${categoryFilter}
          ] | order(startDateTime asc)[0...100] {
            _id,
            _type,
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
          }`

          const result = await client.fetch(query, {
            startDate: startOfMonth,
            endDate: endOfMonth,
          })

          // Store in cache and update state
          eventsCache.current.set(fullCacheKey, result)
          setEvents(result)
        } catch (error) {
          console.error('Error fetching events:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchEvents()
    },
    [currentDate, client, firstDayOfMonth, lastDayOfMonth, cacheKey, selectedCategory],
    500,
  )

  // Add throttling to prevent rapid clicks causing multiple requests
  const isNavigating = useRef(false)

  const handlePrevMonth = useCallback(() => {
    if (isNavigating.current) return

    isNavigating.current = true
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))

    // Reset after a short delay
    setTimeout(() => {
      isNavigating.current = false
    }, 300)
  }, [currentDate])

  const handleNextMonth = useCallback(() => {
    if (isNavigating.current) return

    isNavigating.current = true
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

    // Reset after a short delay
    setTimeout(() => {
      isNavigating.current = false
    }, 300)
  }, [currentDate])

  const handleEventClick = useCallback(
    (eventId: string) => {
      if (onEventClick) {
        onEventClick(eventId)
      }
    },
    [onEventClick],
  )

  // Generate day cells for the calendar grid
  const renderCalendarDays = () => {
    const days = []
    const totalCells = Math.ceil((daysInMonth + startDay) / 7) * 7

    // Add days from previous month if needed (for UI grid alignment)
    for (let i = 0; i < startDay; i++) {
      days.push(
        <div
          key={`empty-start-${i}`}
          style={{
            padding: '12px',
            opacity: 0.3,
            width: 'calc(100% / 7 - 1px)',
            boxSizing: 'border-box',
          }}
        >
          <span />
        </div>,
      )
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const formattedDate = date.toISOString().split('T')[0] // YYYY-MM-DD

      // Find events for this day
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.startDateTime).toISOString().split('T')[0]
        return eventDate === formattedDate
      })

      days.push(
        <div
          key={`day-${day}`}
          // Style handled inline
          style={{
            padding: '12px',
            minHeight: '100px',
            width: 'calc(100% / 7 - 1px)',
            boxSizing: 'border-box',
          }}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <div style={{fontWeight: 600}}>{day}</div>

            {dayEvents.map((event) => (
              <EventItem key={event._id} event={event} onEventClick={handleEventClick} />
            ))}
          </div>
        </div>,
      )
    }

    // Add days from next month if needed (for UI grid alignment)
    const remainingCells = totalCells - (daysInMonth + startDay)
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <div
          key={`empty-end-${i}`}
          style={{
            padding: '12px',
            opacity: 0.3,
            width: 'calc(100% / 7 - 1px)',
            boxSizing: 'border-box',
          }}
        >
          <span />
        </div>,
      )
    }

    return days
  }

  // Handle month/year picker selection
  const handleDateSelection = useCallback((year: number, month: number) => {
    setCurrentDate(new Date(year, month, 1))
    setShowDatePicker(false)
  }, [])

  // Handle category selection
  const handleCategoryChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value)
  }, [])

  // Get date information for rendering
  const monthName = currentDate.toLocaleString('default', {month: 'long'})
  const year = currentDate.getFullYear()

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
      {/* Calendar Header with Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Month/Year Display and Picker Toggle */}
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <h2
            style={{
              fontWeight: 600,
              fontSize: '1.2rem',
              margin: 0,
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid transparent',
              transition: 'all 0.2s',
              textDecoration: 'underline',
            }}
            onClick={() => setShowDatePicker(!showDatePicker)}
            title="Click to open month/year picker"
          >
            {monthName} {year}
          </h2>
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: '4px 8px',
            }}
          >
            {showDatePicker ? '▲' : '▼'}
          </button>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '0.9rem',
                backgroundColor: 'white',
              }}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{display: 'flex', gap: '8px'}}>
          <button
            onClick={handlePrevMonth}
            disabled={isLoading}
            type="button"
            title="Previous Month"
            style={{
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            disabled={isLoading}
            type="button"
            title="Today"
            style={{
              padding: '6px 12px',
              background: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              fontWeight: 'bold',
            }}
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            disabled={isLoading}
            type="button"
            title="Next Month"
            style={{
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Month/Year Picker */}
      {showDatePicker && (
        <div
          style={{
            borderRadius: '4px',
            padding: '12px',
            marginTop: '8px',
            backgroundColor: '#f9f9f9',
            border: '1px solid #eee',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
            <div>
              <div style={{fontWeight: 600, marginBottom: '8px'}}>Year</div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '6px',
                }}
              >
                {Array.from({length: 5}, (_, i) => {
                  const yearOption = new Date().getFullYear() - 2 + i
                  return (
                    <button
                      type="button"
                      key={yearOption}
                      style={{
                        padding: '6px',
                        backgroundColor: yearOption === year ? '#e6f7ff' : 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleDateSelection(yearOption, currentDate.getMonth())}
                    >
                      {yearOption}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <div style={{fontWeight: 600, marginBottom: '8px'}}>Month</div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '6px',
                }}
              >
                {Array.from({length: 12}, (_, i) => {
                  const monthOption = new Date(2000, i, 1).toLocaleString('default', {
                    month: 'short',
                  })
                  return (
                    <button
                      type="button"
                      key={i}
                      style={{
                        padding: '6px',
                        backgroundColor: i === currentDate.getMonth() ? '#e6f7ff' : 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleDateSelection(year, i)}
                    >
                      {monthOption}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading ? (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
          }}
        >
          Loading events... Please wait.
        </div>
      ) : (
        <>
          {/* Day headers */}
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} style={{flex: 1, padding: '8px'}}>
                <div style={{textAlign: 'center', fontWeight: 600}}>{day}</div>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{display: 'flex', flexWrap: 'wrap'}}>{renderCalendarDays()}</div>

          {/* Empty state message when no events are found */}
          {events.length === 0 && !isLoading && (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                backgroundColor: '#fafafa',
                borderRadius: '4px',
                marginTop: '16px',
                color: '#666',
              }}
            >
              {selectedCategory
                ? 'No events found for this category in the selected month.'
                : 'No events found for this month.'}
            </div>
          )}
        </>
      )}
    </div>
  )
}
