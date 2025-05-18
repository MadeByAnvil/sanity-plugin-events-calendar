import React, {useCallback} from 'react'

import {type Event} from './CalendarView'

type EventItemProps = {
  event: Event
  onEventClick: (id: string) => void
}

// Event styling constants
const COLORS = {
  default: {
    background: '#e6f7ff',
    text: 'inherit',
    border: '#bde3ff',
  },
  cancelled: {
    background: '#ffebe6',
    text: '#d73a49',
    border: '#ffccc2',
  },
  postponed: {
    background: '#fff5e6',
    text: '#b08800',
    border: '#ffeac2',
  },
  featured: {
    background: '#e6fff6',
    text: '#008000',
    border: '#c2ffe0',
  },
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

  // Determine event styles based on status and category
  const getEventStyles = () => {
    // Base container styles
    const containerStyle: React.CSSProperties = {
      fontSize: '0.75rem',
      padding: '8px',
      marginBottom: '4px',
      backgroundColor: COLORS.default.background,
      borderRadius: '3px',
      cursor: 'pointer',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s',
      border: `1px solid ${COLORS.default.border}`,
      position: 'relative',
      overflow: 'hidden',
    }

    // Base text styles
    const textStyle: React.CSSProperties = {
      fontWeight: 500,
    }

    // Category color stripe
    const categoryColor = getCategoryColor()
    if (categoryColor) {
      containerStyle.borderLeft = `3px solid ${categoryColor}`
      containerStyle.paddingLeft = '6px'
    }

    // Apply status-specific styles
    if (event.status === 'cancelled') {
      containerStyle.backgroundColor = COLORS.cancelled.background
      containerStyle.border = `1px solid ${COLORS.cancelled.border}`
      textStyle.textDecoration = 'line-through'
      textStyle.color = COLORS.cancelled.text
    } else if (event.status === 'postponed') {
      containerStyle.backgroundColor = COLORS.postponed.background
      containerStyle.border = `1px solid ${COLORS.postponed.border}`
      textStyle.fontStyle = 'italic'
      textStyle.color = COLORS.postponed.text
    } else if (event.featured) {
      containerStyle.backgroundColor = COLORS.featured.background
      containerStyle.border = `1px solid ${COLORS.featured.border}`
      textStyle.fontWeight = 'bold'
    }

    return {containerStyle, textStyle}
  }

  const {containerStyle, textStyle} = getEventStyles()
  const timeString = formatEventTime(event)

  // Build category badges
  const categoryBadges = event.categories?.length ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '4px',
        marginTop: '4px',
        fontSize: '0.75rem',
      }}
    >
      {event.categories.slice(0, 2).map((category) => (
        <span
          key={category._id}
          style={{
            display: 'inline-block',
            padding: '2px 6px',
            backgroundColor: category.color || '#eee',
            color: category.color ? getContrastColor(category.color) : '#333',
            borderRadius: '3px',
            fontWeight: 500,
            fontSize: '0.7rem',
          }}
        >
          {category.title}
        </span>
      ))}
      {event.categories.length > 2 && (
        <span
          style={{
            fontSize: '0.7rem',
            color: '#666',
          }}
        >
          +{event.categories.length - 2} more
        </span>
      )}
    </div>
  ) : null

  return (
    <div
      key={event._id}
      onClick={handleClick}
      style={containerStyle}
      onMouseOver={(e) => {
        const target = e.currentTarget
        target.style.opacity = '0.9'
        target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
        target.style.transform = 'translateY(-1px)'
      }}
      onMouseOut={(e) => {
        const target = e.currentTarget
        target.style.opacity = '1'
        target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)'
        target.style.transform = 'translateY(0)'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <span style={textStyle}>
          {event.featured && '★ '}
          {event.title}
        </span>
        {!event.allDay && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.65rem',
              color: '#666',
              whiteSpace: 'nowrap',
            }}
          >
            {timeString}
          </span>
        )}
      </div>

      {/* Status indicator if cancelled or postponed */}
      {(event.status === 'cancelled' || event.status === 'postponed') && (
        <div
          style={{
            marginTop: '2px',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: event.status === 'cancelled' ? COLORS.cancelled.text : COLORS.postponed.text,
          }}
        >
          {event.status === 'cancelled' ? 'Cancelled' : 'Postponed'}
        </div>
      )}

      {/* Category badges */}
      {categoryBadges}
    </div>
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
