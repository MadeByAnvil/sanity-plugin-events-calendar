import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useClient} from 'sanity'

import {
  CalendarGrid,
  CategorySelector,
  Container,
  DateOptionButton,
  DatePicker,
  DatePickerGrid,
  DatePickerGroup,
  DatePickerRow,
  DatePickerTitle,
  DateSelector,
  DateToggleButton,
  DayCell,
  DayContent,
  DayName,
  DayNumber,
  DaysHeader,
  EmptyState,
  Header,
  LoadingIndicator,
  MonthYear,
  Navigation,
  NavigationButton,
} from './CalendarView.styles'
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
        <DayCell key={`empty-start-${i}`} $inactive>
          <span />
        </DayCell>,
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
        <DayCell key={`day-${day}`}>
          <DayContent>
            <DayNumber>{day}</DayNumber>

            {dayEvents.map((event) => (
              <EventItem key={event._id} event={event} onEventClick={handleEventClick} />
            ))}
          </DayContent>
        </DayCell>,
      )
    }

    // Add days from next month if needed (for UI grid alignment)
    const remainingCells = totalCells - (daysInMonth + startDay)
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <DayCell key={`empty-end-${i}`} $inactive>
          <span />
        </DayCell>,
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
    <Container>
      {/* Calendar Header with Controls */}
      <Header>
        {/* Month/Year Display and Picker Toggle */}
        <DateSelector>
          <MonthYear
            onClick={() => setShowDatePicker(!showDatePicker)}
            title="Click to open month/year picker"
          >
            {monthName} {year}
          </MonthYear>
          <DateToggleButton type="button" onClick={() => setShowDatePicker(!showDatePicker)}>
            {showDatePicker ? '▲' : '▼'}
          </DateToggleButton>
        </DateSelector>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div>
            <CategorySelector value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </CategorySelector>
          </div>
        )}

        {/* Navigation Buttons */}
        <Navigation>
          <NavigationButton
            onClick={handlePrevMonth}
            disabled={isLoading}
            type="button"
            title="Previous Month"
          >
            ← Previous
          </NavigationButton>
          <NavigationButton
            onClick={() => setCurrentDate(new Date())}
            disabled={isLoading}
            type="button"
            title="Today"
            $today
          >
            Today
          </NavigationButton>
          <NavigationButton
            onClick={handleNextMonth}
            disabled={isLoading}
            type="button"
            title="Next Month"
          >
            Next →
          </NavigationButton>
        </Navigation>
      </Header>

      {/* Month/Year Picker */}
      {showDatePicker && (
        <DatePicker>
          <DatePickerRow>
            <DatePickerGroup>
              <DatePickerTitle>Year</DatePickerTitle>
              <DatePickerGrid>
                {Array.from({length: 5}, (_, i) => {
                  const yearOption = new Date().getFullYear() - 2 + i
                  return (
                    <DateOptionButton
                      type="button"
                      key={yearOption}
                      $active={yearOption === year}
                      onClick={() => handleDateSelection(yearOption, currentDate.getMonth())}
                    >
                      {yearOption}
                    </DateOptionButton>
                  )
                })}
              </DatePickerGrid>
            </DatePickerGroup>
            <DatePickerGroup>
              <DatePickerTitle>Month</DatePickerTitle>
              <DatePickerGrid>
                {Array.from({length: 12}, (_, i) => {
                  const monthOption = new Date(2000, i, 1).toLocaleString('default', {
                    month: 'short',
                  })
                  return (
                    <DateOptionButton
                      type="button"
                      key={i}
                      $active={i === currentDate.getMonth()}
                      onClick={() => handleDateSelection(year, i)}
                    >
                      {monthOption}
                    </DateOptionButton>
                  )
                })}
              </DatePickerGrid>
            </DatePickerGroup>
          </DatePickerRow>
        </DatePicker>
      )}

      {/* Loading indicator */}
      {isLoading ? (
        <LoadingIndicator>Loading events... Please wait.</LoadingIndicator>
      ) : (
        <>
          {/* Day headers */}
          <DaysHeader>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <DayName key={day}>{day}</DayName>
            ))}
          </DaysHeader>

          {/* Calendar grid */}
          <CalendarGrid>{renderCalendarDays()}</CalendarGrid>

          {/* Empty state message when no events are found */}
          {events.length === 0 && !isLoading && (
            <EmptyState>
              {selectedCategory
                ? 'No events found for this category in the selected month.'
                : 'No events found for this month.'}
            </EmptyState>
          )}
        </>
      )}
    </Container>
  )
}
