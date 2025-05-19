/**
 * Utilities for working with dates in the calendar plugin
 */

/**
 * Format date in a consistent manner for display
 * @param date The date to format
 * @param options Options for formatting
 * @returns Formatted date string
 */
export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = {}): string => {
  // Use default formatting options if none provided
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }

  return date.toLocaleDateString('en-US', defaultOptions)
}

/**
 * Format time in a consistent manner for display
 * @param date The date to extract and format time from
 * @returns Formatted time string
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Get first day of the month
 * @param date A date within the month
 * @returns Date object representing the first day of the month
 */
export const getFirstDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/**
 * Get last day of the month
 * @param date A date within the month
 * @returns Date object representing the last day of the month
 */
export const getLastDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

/**
 * Get the days needed for a calendar month view
 * This returns an array of dates including padding days from adjacent months
 * @param date A date within the month to show
 * @returns Array of Date objects for the calendar
 */
export const getCalendarDays = (date: Date): Date[] => {
  const days: Date[] = []
  const firstDay = getFirstDayOfMonth(date)
  const lastDay = getLastDayOfMonth(date)

  // Add padding days from previous month to start from Sunday
  const startPadding = firstDay.getDay()
  for (let i = startPadding; i > 0; i--) {
    const paddingDate = new Date(firstDay)
    paddingDate.setDate(paddingDate.getDate() - i)
    days.push(paddingDate)
  }

  // Add all days of the current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), d))
  }

  // Add padding days for next month to complete the week
  const endPadding = 6 - lastDay.getDay()
  for (let i = 1; i <= endPadding; i++) {
    const paddingDate = new Date(lastDay)
    paddingDate.setDate(paddingDate.getDate() + i)
    days.push(paddingDate)
  }

  return days
}

/**
 * Check if a date is today
 * @param date The date to check
 * @returns True if the date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if a date is in the past
 * @param date The date to check
 * @returns True if the date is in the past
 */
export const isPast = (date: Date): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

/**
 * Check if a date is within a range
 * @param date The date to check
 * @param startDate The start of the range
 * @param endDate The end of the range
 * @returns True if the date is within the range (inclusive)
 */
export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  const normalizedDate = new Date(date)
  normalizedDate.setHours(0, 0, 0, 0)

  const normalizedStart = new Date(startDate)
  normalizedStart.setHours(0, 0, 0, 0)

  const normalizedEnd = new Date(endDate)
  normalizedEnd.setHours(0, 0, 0, 0)

  return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd
}
