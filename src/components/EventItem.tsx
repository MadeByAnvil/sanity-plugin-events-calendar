import React, {useCallback} from 'react'

import {type Event} from './CalendarView'
import {
  CategoryBadge,
  CategoryMore,
  EventCategories,
  EventContainer,
  EventHeader,
  EventStatus,
  EventTime,
  EventTitle,
} from './EventItem.styles'

type EventItemProps = {
  event: Event
  onEventClick: (id: string) => void
}

// Format time display
const formatEventTime = (event: Event) => {
  if (event.allDay) {
    return 'All Day'
  }

  try {
    const startDate = new Date(event.startDateTime)
    return startDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
  } catch (error: unknown) {
    console.error('Error formatting event time:', error)
    return ''
  }
}

const EventItem = React.memo(({event, onEventClick}: EventItemProps) => {
  const handleClick = useCallback(() => {
    onEventClick(event._id)
  }, [event._id, onEventClick])

  // Get the first category's color if available
  const getCategoryColor = () => {
    if (event.categories && event.categories.length > 0 && event.categories[0].color) {
      return event.categories[0].color
    }
    return null
  }

  const timeString = formatEventTime(event)
  const categoryColor = getCategoryColor()

  // Determine if this is cancelled, featured, or postponed
  const isCancelled = event.status === 'cancelled'
  const isPostponed = event.status === 'postponed'
  const isFeatured = !!event.featured

  return (
    <EventContainer
      onClick={handleClick}
      $featured={isFeatured}
      $postponed={isPostponed}
      $cancelled={isCancelled}
      $categoryColor={categoryColor || undefined}
    >
      <EventHeader>
        <EventTitle $featured={isFeatured} $postponed={isPostponed} $cancelled={isCancelled}>
          {isFeatured && '★ '}
          {event.title}
        </EventTitle>

        {!event.allDay && <EventTime>{timeString}</EventTime>}
      </EventHeader>

      {/* Status indicator if cancelled or postponed */}
      {(isCancelled || isPostponed) && (
        <EventStatus $status={isCancelled ? 'cancelled' : 'postponed'}>
          {isCancelled ? 'Cancelled' : 'Postponed'}
        </EventStatus>
      )}

      {/* Category badges */}
      {event.categories?.length ? (
        <EventCategories>
          {event.categories.slice(0, 2).map((category) => (
            <CategoryBadge
              key={category._id}
              $backgroundColor={category.color}
              $textColor={category.color ? getContrastColor(category.color) : '#333'}
            >
              {category.title}
            </CategoryBadge>
          ))}
          {event.categories.length > 2 && (
            <CategoryMore>+{event.categories.length - 2} more</CategoryMore>
          )}
        </EventCategories>
      ) : null}
    </EventContainer>
  )
})

// Utility function to determine text color based on background color
function getContrastColor(hexColor: string): string {
  // If not a valid hex color, return black
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor)) {
    return '#000000'
  }

  // Convert hex to RGB
  let r
  let g
  let b

  if (hexColor.length === 4) {
    // For shorthand hex (#RGB)
    r = parseInt(hexColor[1] + hexColor[1], 16)
    g = parseInt(hexColor[2] + hexColor[2], 16)
    b = parseInt(hexColor[3] + hexColor[3], 16)
  } else {
    // For full hex (#RRGGBB)
    r = parseInt(hexColor.substring(1, 3), 16)
    g = parseInt(hexColor.substring(3, 5), 16)
    b = parseInt(hexColor.substring(5, 7), 16)
  }

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return black for bright colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

EventItem.displayName = 'EventItem'

export default EventItem
